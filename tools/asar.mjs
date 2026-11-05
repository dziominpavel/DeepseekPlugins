// Минимальный читатель app.asar: список записей и извлечение файла.
// Нужен, чтобы смотреть исходники DSH, упакованные в resources/app.asar.
//   node tools/asar.mjs list  "<regex>"      — пути записей
//   node tools/asar.mjs cat   "<path>"       — содержимое записи в stdout
import fs from 'node:fs';
import path from 'node:path';

const asarPath = process.argv[2];
const command = process.argv[3];
const arg = process.argv[4];

if (!asarPath || !command) {
  console.error('usage: node tools/asar.mjs <asar> <list|cat> <pattern|path>');
  process.exit(2);
}

const fd = fs.openSync(asarPath, 'r');
const sizeBuf = Buffer.alloc(8);
fs.readSync(fd, sizeBuf, 0, 8, 0);
const headerPickleSize = sizeBuf.readUInt32LE(4);
const headerBuf = Buffer.alloc(headerPickleSize);
fs.readSync(fd, headerBuf, 0, headerPickleSize, 8);
// Pickle: [uint32 payloadLen][uint32 stringLen][string]. Смещение 4 — длина строки.
const jsonLength = headerBuf.readUInt32LE(4);
const header = JSON.parse(headerBuf.subarray(8, 8 + jsonLength).toString('utf8'));
const dataStart = 8 + headerPickleSize;

function walk(node, prefix, out) {
  for (const [name, value] of Object.entries(node.files || {})) {
    const path = prefix ? prefix + '/' + name : name;
    if (value.files) walk(value, path, out);
    else out.push({ path, size: value.size, offset: Number(value.offset), unpacked: value.unpacked === true });
  }
}

const entries = [];
walk(header, '', entries);

if (command === 'list') {
  const re = arg ? new RegExp(arg, 'i') : /.*/;
  const matched = entries.filter((entry) => re.test(entry.path));
  matched.forEach((entry) => console.log(`${entry.unpacked ? 'U' : ' '} ${entry.size}\t${entry.path}`));
  console.error(`# ${matched.length} of ${entries.length} entries`);
} else if (command === 'xall') {
  // xall <regex> <destDir> — извлечь все совпавшие записи, сохранив пути.
  const destDir = process.argv[5];
  const re = new RegExp(arg, 'i');
  let count = 0;
  for (const entry of entries) {
    if (entry.unpacked || !re.test(entry.path)) continue;
    const target = path.join(destDir, entry.path.replace(/[\\/]/g, '__').replace(/^dsh__node_modules__@deepseek-ai__/, ''));
    const buffer = Buffer.alloc(entry.size);
    fs.readSync(fd, buffer, 0, entry.size, dataStart + entry.offset);
    fs.writeFileSync(target, buffer);
    count += 1;
  }
  console.error(`# extracted ${count}`);
} else if (command === 'cat') {
  const entry = entries.find((candidate) => candidate.path === arg);
  if (!entry) {
    console.error('not found: ' + arg);
    process.exit(1);
  }
  const buffer = Buffer.alloc(entry.size);
  fs.readSync(fd, buffer, 0, entry.size, dataStart + entry.offset);
  process.stdout.write(buffer);
} else {
  console.error('unknown command: ' + command);
  process.exit(2);
}
fs.closeSync(fd);
