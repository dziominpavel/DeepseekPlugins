# Spec Delta

## Purpose

Gives DSH agents durable, bounded, portable memory of stable facts and user
preferences, written autonomously and injected as frozen background context.

## ADDED Requirements

### Requirement: Durable memory stores are bounded and inspectable

The system SHALL keep agent memory and the user profile as plain-text stores in
a configurable memory directory. Each store SHALL enforce a configured character
limit, and a write that would exceed the limit SHALL be rejected with current
usage rather than silently evicting an entry. A user SHALL be able to inspect
and edit the stores directly; an external edit becomes effective in the next
session.

#### Scenario: Write within the limit
- **WHEN** the agent adds an entry that keeps the store within its limit
- **THEN** the entry is stored and the tool reports current usage

#### Scenario: Overflow is rejected
- **WHEN** a write would exceed the store's character limit
- **THEN** the write is rejected with current and maximum usage, and the store is unchanged

#### Scenario: External edit is picked up next session
- **WHEN** a user edits a memory file directly and starts a new session
- **THEN** the new session uses the edited content

### Requirement: The agent writes memory autonomously

The system SHALL expose a memory tool that adds, replaces, and removes entries
without a user approval prompt. Replacement and removal SHALL identify exactly
one existing entry; an ambiguous or missing target SHALL fail without changing
the store. An exact duplicate addition SHALL be rejected as a duplicate.

#### Scenario: Add without approval
- **WHEN** the agent calls the memory tool to add a fact
- **THEN** the entry is written immediately and no approval prompt is shown

#### Scenario: Replace one entry
- **WHEN** the agent replaces exactly one existing entry
- **THEN** only that entry changes and the tool reports the new state

#### Scenario: Ambiguous target fails
- **WHEN** a replace or remove target matches zero or several entries
- **THEN** the operation fails with a clear error and the store is unchanged

#### Scenario: Duplicate is rejected
- **WHEN** the agent adds text that already exists in the same store
- **THEN** the tool reports a duplicate and does not create a second entry

### Requirement: Memory is injected as frozen background context

At session start the system SHALL inject the current stores as background
context marked as recalled memory, not as user input. A write made during a
session SHALL be visible in tool responses but SHALL NOT change that session's
injected snapshot; the next session SHALL use the updated content. Empty stores
SHALL add no context.

#### Scenario: New session sees saved memory
- **WHEN** a fact was saved in an earlier session and a new session starts
- **THEN** the new session's context contains that fact

#### Scenario: Mid-session writes stay out of the prompt
- **WHEN** the agent saves a fact during a session
- **THEN** the tool response reflects it, but the current session's injected memory does not change

#### Scenario: Next session sees the update
- **WHEN** the session that saved the fact ends and another session starts
- **THEN** the new session's context contains the saved fact

#### Scenario: Empty memory adds nothing
- **WHEN** both stores are empty
- **THEN** no memory block is added to the prompt

### Requirement: Unsafe memory content is rejected

The system SHALL reject a write that contains prompt-injection or role-hijack
text, credential material, invisible or bidirectional control characters, or a
sequence that could escape the memory context fence. A rejected write SHALL
leave the store unchanged and SHALL be reported with a reason.

#### Scenario: Injection is blocked
- **WHEN** a write contains instructions that attempt to override prior instructions
- **THEN** the write is rejected with a prompt-injection reason and the store is unchanged

#### Scenario: Secret is blocked
- **WHEN** a write contains credential material such as an API key or private key
- **THEN** the write is rejected and the material is not stored

#### Scenario: Invisible characters are blocked
- **WHEN** a write contains zero-width or bidirectional control characters
- **THEN** the write is rejected and the store is unchanged

#### Scenario: Safe fact is accepted
- **WHEN** a write contains a stable, declarative fact with no unsafe content
- **THEN** the write is accepted and audited

#### Scenario: Unsafe external edit is not injected
- **WHEN** a memory file is edited directly to contain unsafe content and a new session starts
- **THEN** the unsafe store is not injected, the session continues, and the condition is logged

### Requirement: Memory changes are auditable and reversible

The system SHALL record every accepted and rejected write attempt in an audit
log with time, session, target, action, and outcome. It SHALL retain a bounded
history of prior store versions and SHALL let the user list the log and undo the
most recent accepted change.

#### Scenario: Accepted write is audited
- **WHEN** a write is accepted
- **THEN** the audit log gains an entry with the write metadata

#### Scenario: Rejected write is audited
- **WHEN** a write is rejected
- **THEN** the audit log gains an entry with the rejection reason

#### Scenario: Undo restores the previous version
- **WHEN** the user runs the memory undo command after an accepted change
- **THEN** the affected store is restored to its previous version

#### Scenario: History is bounded
- **WHEN** the number of retained versions reaches the configured limit
- **THEN** the oldest version is discarded while the newest versions remain

### Requirement: Memory is portable via export and import

The system SHALL export both stores to one versioned file and import such a file
on another installation. Import SHALL validate the payload and apply either
merge or replace as chosen; an invalid payload or unsafe entry SHALL fail
without partial changes.

#### Scenario: Export produces a versioned file
- **WHEN** the user exports memory
- **THEN** one file contains both stores and a format version

#### Scenario: Import merges entries
- **WHEN** the user imports a valid file in merge mode
- **THEN** new entries are added and exact duplicates are not duplicated

#### Scenario: Import replaces stores
- **WHEN** the user imports a valid file in replace mode
- **THEN** both stores match the file content

#### Scenario: Invalid import is atomic
- **WHEN** an import file is malformed or contains an unsafe entry
- **THEN** the import fails and neither store changes

### Requirement: Memory is shared across sessions and configurable per profile

The system SHALL make memory available to every session that loads the plugin,
regardless of agent preset, and SHALL allow the memory directory to be
overridden per profile. Memory SHALL NOT depend on a particular model or preset.

#### Scenario: Two presets share memory
- **WHEN** two sessions with different agent presets load the plugin
- **THEN** both see the same memory content

#### Scenario: Profile override isolates memory
- **WHEN** a profile configures a different memory directory
- **THEN** sessions in that profile read and write only that directory

#### Scenario: Plugin absent means no memory behavior
- **WHEN** the plugin is not installed
- **THEN** no memory tool, command, or injected context is present

### Requirement: Memory guidance ships with the plugin

The plugin package SHALL include a memory skill that describes what to save, how
to curate, and what not to save. The skill SHALL be registered when the skills
service is available and SHALL follow the host's skill precedence rules.

#### Scenario: Fresh install exposes the skill
- **WHEN** the plugin is installed in a session with skills support
- **THEN** the memory skill appears in the skill catalog

#### Scenario: Project skill overrides the packaged skill
- **WHEN** a project provides a skill with the same name
- **THEN** the project skill is the one the model can load

#### Scenario: Missing skills service does not break memory
- **WHEN** the composition has no skills service
- **THEN** the memory tool and injected context still work, and no skill is registered
