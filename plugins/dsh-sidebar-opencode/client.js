/* dsh-sidebar-opencode — список сессий в стиле opencode для DeepSeek Harness. */
window.__ModuleLoader__.load({
  id: '@local/dsh-sidebar-opencode',
  factory: function (require) {
    'use strict';

    var React = require('react');
    var h = React.createElement;

    var NS = 'sidebar-opencode';
    var ORDER_KEY = 'dsh.opencode.order.v1';
    var EXPAND_KEY = 'dsh.opencode.expanded.v1';
    var SOUND_KEY = 'dsh.opencode.sound.v1';
    var ARCHIVED_KEY = 'dsh.opencode.showArchived.v1';
    var MOVED_KEY = 'dsh.opencode.moved.v1';
    var STYLE_ID = 'dsh-opencode-style';
    var SOUND_SRC = 'data:audio/wav;base64,UklGRppBAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YXZBAAAAACIAgQANAasBPQKhArsCdgLIAbYAUv+6/Rn8n/p8+dz44vig+Rf7M/3O/68ClAUyCEIKhAvIC/QKCgkkBnkCVf4V+h/21vKU8J7vHPAX8nT18/k5/9IEPQr4DowSlxTZFDgTxw/ECpUEv/3b9ovwZevu54XmXed26pvvZfZE/osGfA5dFYYadB3RHYIbqRalDwgHjv0L9FzrTeSN35fdqt7B4pDpjPLy/NwHUhJhGzEiGCatJs8jrR3DFM4Jv/2k8ZPmj91x19PUBNb62lfja+5F+8gIwRUFIYspgy5qLxws0CQbGuUMUP6k7y/iKteczz7Mb80n0/PcBupA+VAJyhhJJpMwsTYHOGU0DSyqH0kQP/8J7i/eINEQyNrD78RJy2jWYOXn9ncJbRssK0g3oT5/QKg8YTNsJfgTiADR7JPaccvNwKi7hbxkw7nPfOA79D8JrB2vL6k9UUbRSOFEyTo3K7YXIgJi7GLY5cdevNK2u7cFvwnMoN088goIHx2dL+Q9skZBSVlFVDsULPUYpQMI7gXaYMmRvaC3E7jfvmnLlNzb8HQGdxsJLog8rEWoSDtFszvoLCoaIQWp76bb3MrGvnS4dLjDvtLKkduC7+QE0xl3LCo7okQJSBVFCTyzLVcblgZF8UXdWcwAwE6527ivvkXKl9oy7lsDMxjlKso5k0NjR+ZEVTx0LnwcBAjc8uHe1s08wS66S7mlvsLJptnp7NcBlxZVKWk4gEK3Rq9EmTwrL5cdawlt9HrgU896whO7wbmjvkfJvtio61oA/xTGJwc3aUEERnBE0zzaL6oeygr69RDiz9C8w/y7P7qpvtbI39dw6uP+axM5JqM1TkBLRSpEBT1/MLUfIgyB96TjTNIAxeu8w7q4vm7ICtc/6XP93BGtJD80MD+NRNtDLj0bMbYgcg0C+TTlyNNGxt+9T7vPvg/IPdYX6An8URAkI9kyDz7IQ4VDTj2uMbAhuw5++sHmQ9WOx9a+4bvuvrnHedX35qb6yw6dIXMx6jz+QihDZT05MqAi/Q/0+0vovdbXyNK/ebwVv2vHvtTf5Ur5SQ0XIA0wwzsvQsRCdD26MogjNhFk/dHpN9gjytPAF71EvyfHDNTP5PT3zAuVHqcumDpbQVlCez0yM2ckaRLO/lPrr9lvy9fBvL17v+rGYtPH46b2VAoVHUEtazmCQOdBej2iMz4lkxMzANHsJdu9zN7CZr65v7fGwdLH4l714QiXG9srPDilP25BcT0JNAwmtxSRAUvumtwMzunDFr/+v4vGKdLQ4R30cwcdGnUqCzfCPu9AYD1oNNIm0hXpAsLvDd5cz/jEy79KwGjGmtHh4OTyCwamGBAp1zXcPWlASD2+NI8n5hY7BDTxf9+s0AnGhsCewE3GEtH537HxqAQyF6wnojTxPN4/Jz0MNUUo8heGBaHy7uD90R7HRsH4wDrGlNAa34XwSgPBFUgmazMDPEw/AD1SNfEo9hjLBgr0W+JO0zXICsJZwS7GHdBD3mHv8gFTFOYkMzIQO7U+0TyQNZYp8xkKCG/1xuOf1E7J1MLAwSvGr8903UPunwDpEoQj+jAaOhg+mzzFNTIq6BpCCc72LuXw1WrKocMuwi/GSc+t3C3tUv+DESUiwC8hOXY9XjzzNcYq1ht0Cin4lOZA14jLdMSiwjrG687u2x7sC/4hEMYghC4lOM88GjwZNlIrvByfC4D59+eQ2KjMSsUbw03Glc432xbryvzCDmofSC0lNyI80Ds3NtYrmh3EDNH6V+ng2crNJMabw2fGR86I2hXqjvtoDQ8eDCwjNnE7fztONlMscB7iDR38tOov2+3OAschxIjGAM7h2RzpWfoSDLYczyoeNbs6KDtdNscsPx/5DmT9Dex93BLQ5MesxLDGws1B2SroKfnACmAbkikWNAA6yjplNjMtByAKEKb+ZO3K3TjRysg8xd7Gi82q2D/nAPhyCQsaVSgNM0E5ZzplNpgtxyAUEeL/t+4W31/SssnRxRPHW80Z2Fvm3PYpCLoYGCcBMn44/jlfNvUtfyEXEhkBBvBg4IfTnspsxk/HM82R137lv/XkBmoX3CXzMLc3jjlSNksuMCITE0sCUvGp4bDUjMsLx5HHEs0Q16nkqPSkBR0WoCTkL+w2Gjk9Npku2SIJFHcDm/Lw4tnVfsyvx9rH+MyX1trjl/NpBNMUZCPSLh02nzgjNt8ueyP4FJ4E3/M25APXcc1YyCjI5swl1hPjjPIyA4wTKSLALUs1IDgBNh8vFiTgFb8FH/V55S3YaM4FyXzI2sy61VPiiPEBAkgS8CCsLHU0mzfZNVcvqSTBFtoGXPa75ljZYM+2ydbI1cxX1ZvhivDUAAcRtx+XK5wzEjerNYgvNSWcF/AHlPf654LaW9BryjbJ18z71Ongku+s/8oPfx6BKsAygzZ2NbIvuiVvGAAJyPg36azbWNEky5vJ4Mym1D7goe6J/o8OSR1qKeIx8DU8NdUvNyY8GQoK+Plx6tXcVtLhywbK78xY1Jvftu1s/VgNFBxTKAAxWTX8NPIvriYCGg4LI/up6/7dVtOhzHbKBM0S1P7e0exT/CUM4Ro7JxwwvTS1NAcwHSfCGgwMSvzf7CffWNRlzevKIM3S02je8+tA+/UKsBkjJjYvHTRpNBYwhid7GwUNbP0R7k7gWtUszmTLQs2Z09ndG+sy+skJgBgKJU0ueTMYNB8w5ycsHPgNiv5B73XhXtb2zuPLac1m01HdSuoq+aEIUxfyI2Mt0DLBMyEwQijYHOQOo/9u8JviY9fDz2bMl80709Dcf+kn+H0HJxbaInYsJTJlMx0wlih8HcsPuACX8cDjadiT0O7My80W01bcuugp910G/hTBIYgrdTEEMxIw4ygaHqwQxwG+8uPkb9ll0XrNBM730uLb/Ocx9kEF1xOqIJgqwjCeMgIwKimyHocR0gLh8wXmdto60grOQ87f0nXbROc+9SkEshKSH6cpDDAzMuwvailDH1sS2AMB9SXnftsR057Oh87N0g/bkuZR9BUDkBF8HrQoUy/DMc8vpCnNHyoT2QQd9kTohdzr0zbP0M7B0q/a5+Vp8wUCcRBmHcAnly5PMa0v1ylRIPMT1QU292Hpjd3G1NLPHs+70lbaQuWH8voAVA9RHMsm1y3WMIYvBCrOILYUzAZL+Hzqld6k1XHQcs+80gPao+Sr8fT/Ow49G9YlFS1ZMFkvKypFIXIVvQdc+ZXrnd+D1hTRys/C0rbZCuTU8PH+JA0qGt8kUSzYLyYvSyq2ISkWqghq+qvspOBk17rRKNDO0nDZeOMD8PT9EAwZGegjiitTL+4uZiogItoWkgl0+8Dtq+FG2GTSidDf0jDZ7OI37/r8/woJGPEiwSrKLrEueiqEIoUXdAp6/NLusuIp2RDT8ND20vbYZuJx7gb88gn6Fvkh9ik9LnAuiSriIikYUQt8/eLvt+MO2sDTWtET08LY5uGx7Rb76AjtFQEhKCmtLSkukio6I8gYKQx5/u/wvOT02nLUydE105TYbeH27Cv64QfiFAggWSgZLd0tlSqMI2EZ/Axz//rxweXa2yfVPNJc02zY+eBB7EX53QbYExAfiCeCLI0tkyrYI/QZyQ1pAALzxObC3N7Vs9KJ00rYi+CS62P43gXREhgetibnKzgtiyodJIIakQ5aAQf0xueq3ZjWLtO60y7YJODo6ob34QTLESEd4iVKK94sfSpdJAkbVA9HAgr1xuiS3lTXrdPw0xfYwt9E6q726QPIECocDSWpKoEsayqXJIobERAwAwn2xul73xLYL9Qr1AbYZt+l6dv19ALHDzMbNiQGKh8sUyrMJAYcyhAUBAX3xOpl4NLYtdRr1PrXEN8M6Q31AwLIDj0aXyNgKbkrNir6JHwcfBH0BP73wOtO4ZPZPtWw1PTXv9556ET0FQHMDUgZhiK3KE8rFCojJewcKhLPBfT4u+w34lfay9X51PPXdd7r54DzLADSDFMYrSEMKOIq7ilHJVcd0hKmBuf5tO0h4xzbWtZG1ffXMN5j58DyR//bC2AX0yBfJ3AqwillJbwddRN5B9b6q+4K5OLb7NaX1QDY8N3g5gbyZf7mCm4W+R+wJvspkil+JRweExRHCML7oO/z5Krcgtft1Q/Ytt1j5lHxiP30CX0VHh/+JYMpXSmRJXUeqxQQCav8k/Db5XPdGthG1iLYgt3r5aDwrvwFCY0UQx5LJQcpJCmfJcoePhXVCZD9hfHD5j3etNik1jrYUt155fXv2fsZCJ8TZx2WJIgo5iioJRkfzBWVCnH+c/Kq5wjfUdkF11fYKd0M5U/vCPsvB7ISjBzfIwYopCisJWIfVRZRC0//YPOQ6NTf8dlq13nYBN2k5K3uO/pJBscRsBsmI4EnXiisJacf2BYHDCkASvR26aHgktrT15/Y5NxC5BHuc/lmBd0Q1RpsIvkmFCimJeYfVhe6DAABMvVa6m7hNts/2MnYytzl43rtrviGBPUP+hmxIW4mxiebJR8gzxdnDdIBF/Y+6zzi3Nuu2PnYtdyN4+fs7vepAw8PHxn1IOEldCeMJVQgQxgQDqEC+fYg7ArjhNwg2SzZpNw741rsM/fQAisORBg3IFElHid4JYMgshi0DmwD2fcB7djjLd2W2WPZmdzt4tHre/b6AUkNaxd5H74kxSZfJa4gGxlTDzMEtvjh7abk2N0P2p/Zktyl4k7ryPUnAWoMkha5HiokaCZCJdMggBnuD/YEkfm/7nXlhd6K2t7ZkNxi4s/qGfVYAIwLuRX5HZMjCCYhJfQg3xmEELUFaPqb70PmM98I2yLak9wj4lXqb/SM/7EK4hQ5HfoipCX8JBAhOhoVEXEGPft38BLn4t+J22namtzq4eHpyfPE/tgJCxR4HF8iPiXSJCchkBqiESgHDvxQ8eDnk+AN3LTapty24XHpKPP//QEJNhO2G8Mh1CSkJDkh4BoqEtsH3fwn8q3oROGT3ALbttyG4Qbpi/I+/S0IYRL0GiQhZyRyJEchLButEooIqP398nvp9+Eb3VTbytxb4Z/o8vGA/FsHjhEyGoQg9yM9JFAhcxssEzUJcP7R80fqquKl3anb49w14T7oXvHG+4wGvBBwGeMfhSMDJFQhtRumE9wJNf+j9BPrXuMy3gLc/9wT4eHnzvAQ+8AF7A+tGEAfECPGI1Uh8xsbFH4K9/9y9d7rE+TA3l7cIN324InnQ/Be+vYEHQ/rF5wemCKFI1EhLByMFB0LtQBA9qnsyeRR37zcRd3e4DbnvO+v+TAETw4pF/cdHiJBI0ghYBz4FLcLcAEL93Ltf+Xj3x7dbt3K4OfmOe8E+WwDgw1oFlAdoSH5IjwhjxxfFU4MKALU9zvuNeZ34IPdmt274J3mu+5d+KsCuQymFakcIiGuIishuxzCFeAM3QKb+ALv6+YN4erdyt2v4FfmQe669+wB8QvmFAAcoSBgIhYh4RwhFm4NjgNf+cjvouek4VTe/t2o4BbmzO0b9zEBKgslFFcbHiAPIv4gAx17FvgNOwQh+o3wWeg84sHeNt6m4NnlW+1/9nkAZgpmE64amR+6IeEgIR3QFn0O5QTg+lHxD+nW4jDfcN6n4KHl7uzo9cT/owmnEgMaEx9jIcEgOx0iF/8OiwWd+xPyxulx46Lfr96s4G3lhuxU9RL/4wjpEVgZih4JIZ0gUB1uF3wPLgZX/NTyfOoM5BXg8N624D7lIezE9GP+JAgsEa0YAB6sIHUgYR23F/YPzgYO/ZPzMuup5IvgNd/D4BPlwus49Lj9aAdwEAIYdB1MIEogbh37F2sQaQfC/VD06OtH5QPhfd/U4OzkZuuw8w/9rga0D1YX5xzqHxsgdx07GNwQAQh0/gz1nezm5X3hx9/p4MnkD+ss82r89wX6DqoWWByFH+kffR12GEkRlggj/8b1Uu2F5vnhFeAC4arkvOqs8sj7QQVCDv4VyRseH7Qffh2uGLERJwnP/372Bu4l53fiZeAe4ZDkbeow8in7jgSKDVMVOBu1Hnsfex3hGBYStAl5ADT3ue7F5/fiueA+4XnkIuq48Y763gPUDKcUpRpJHkAfdB0QGXcSPgofAen3a+9m6HjjD+Fh4Wfk2+lD8fb5MAMfDPsTEhrbHQEfah07GdMSwwrCAZv4HfAH6frjZ+GH4VjkmenT8GL5hAJsC1ATfxlsHb8eXB1iGSwTRgtiAkv5zvCp6X7kwuGx4U3kWulm8ND42wG7CqYS6hj6HHseSx2FGYATxAsAA/n5ffFK6gPlH+Le4UbkIOn970P4NQELCvsRVBiGHDMeNh2lGdETPwyaA6X6LPLs6orlf+IP4kPk6eiY77j3kgBcCVIRvhcRHOkdHR3AGR4UtgwxBE/72fKO6xLm4eJC4kPkt+g37zH38f+wCKkQKBeaG50dAh3XGWYUKg3FBPf7hfMv7JrmReN44kfkiOja7q72U/8FCAAQkRYiG00d4hzrGasUmQ1WBZz8MPTR7CTnq+Oy4k/kXeiA7i72t/5cB1kP+RWoGvwcwBz7GewUBg7kBT792fRy7a/nEuTu4lrkNugr7rH1H/61BrIOYhUtGqgcmxwIGikVbg5uBt/9gfUS7jrofOQs42jkE+jZ7Tj1if0QBgwOyhSwGVEcchwRGmMV0w72Bn3+KPaz7sbo6ORu43rk8+eL7cL09vxtBWgNMhQyGfkbRxwWGpgVNA96Bxj/zfZT71PpVeWy44/k1+dA7VD0ZvzMBMQMmhOzGJ4bGBwYGsoVkg/7B7H/cPfy7+HpxOX546fkv+f67OHz2fstBCEMAhMzGEEb5xsWGvgV7A94CEcAEviR8G7qNOZC5MLkque37HbzT/uRA4ALahKyF+IasxsRGiMWQhDzCNsAsvgv8f3qpuaN5OHkmed37A7zyPr2AuAK0hEwF4IafBsJGkoWlRBqCWwBUPnM8YvrGefb5ALli+c87KryRPpeAkEKOxGuFh8aQhv9GW0W5BDeCfsB7Plp8hrsjucr5SblgOcD7Enyw/nIAaMJoxAqFrsZBhvuGY0WMBFPCoYCh/oE86nsA+h95U7leefP6+vxRfk0AQcJDRCmFVUZyBrdGaoWeBG8Cg8DH/uf8zjteujR5Xjlduee65HxyfijAG0Idg8hFe4YhxrIGcMWvBEmC5YDtvs59Mft8ugn5qTldedw6zrxUfgUANQH4Q6cFIUYQxqwGdgW/RGNCxkES/zR9Fbua+l/5tTleOdG6+fw3PeI/zwHTA4XFBsY/hmVGesWOxLxC5oE3fxo9eXu5enZ5gbmfucf65fwavf+/qYGtw2RE68Xthl3GfoWdhJRDBgFbv3/9XPvX+o05zrmh+f86kvw+/Z2/hIGJA0LE0MXbBlXGQUXrBKvDJQF/P2U9gLw2uqS53Hmk+fc6gHwj/bx/YAFkQyEEtUWIBk0GQ4X4BIJDQwGiP4n95DwVuvw56vmoue/6rzvJ/Zv/e8E/wv+EWUW0hgOGRMXEBNfDYIGEv+59x3x0+tR6OfmtOel6nnvwfXv/GAEbgt3EfUVghjlGBYXPROzDfQGmv9K+KrxT+yy6CXnyOeP6jrvXvVx/NMD3grxEIQVMRi6GBUXZxMDDmQHIADa+DfyzewW6WXn4Od86v7u/vT2+0gDWgrLEPsVRxkyGnkYKxSvDbkFN/0s9YruDuog6Mnot+tN8M31cvucAOgEMgiWClUMuQ3xDv8PqBCBEAkPyQuFBlj/zvbb7cDl3d9s3ULfnOX+7zn9jgvxGF8jNCl7KRwk5BlrDMn9PvDO5eLfEt8N46/qRPTc/bYFkQrvCyMKNgarAR3+4Pyt/m0DNwp3EUEXvxmaF1YQhQS89VvmJdm40AvP/9Ql4rz09gluHsAuKjgJOS8x8SHnDXr4ROVm1/fQqdKp29XpLPpmCaEU7BmsGLARAgdy+/vxGO0/7n/1ewGjD7wciyWEJ2IhfhPU/7TpKdU3xhHAbcQj0x/qsQU4IfE33UWASF0/DiwCEtT1dtxAyibCKsU30l3maf2/EkMiKCl7Jkwbcwrw9xrorN4D3o/mufYqC3cfBC/6NSEyYSPeC6Xv69MRvpqyPrRRw6jd6P5RIcs+CVKMV0xO9TeTGNj1QtZev+y0QLgQyMPgMf2vFysrKDRoMR0kmw+m+GvkdNew1NzcWe58BU4dkDDLOkY5mSvXEyz2Hth3vyqxVLCbvQPXQfiIG5c66E+3V7ZQSTw/Hhn8+9uGw862mrcfxTLc+ffgErgnuTI3MuwmxBM6/Wro+tkq1STbv+q3AFcYcixrODY5+C1IGOj7Ft6KxFy0ALGTu5nSO/L4FKw0sUvyVa1Rwz+OIzoCy+H4xxy5bbebwu/X3vL6DQEk5zCYMlkpqhe7AYbsytwM1tzZhucv/G4TLSi3NbQ43S9PHF4B++PDyea3JbIPuqXOh+yJDqguLke8UyNSxUKEKDMIqeepzNC7t7eHwP7T6+0JCRAgty6MMmArRxseBrfw3d9Q1wLZseTt95wOyyO3MsU3STHoH4cGxOkVz7y7vLMLuSrLLOdCCJYoZ0IbURpSTUUcLfkNiu2S0eG+c7jkvmbQJ+kWBOsbLywWMgEtlx5bCvP0KOPv2JTYQeL18+kJVx91L3A2PjISI14LaO941Na/vbWGuCjIMOItAn8iZz0WTpdRW0dQMYYTZPOn1knCnbmxvSvNmuQq/54XWCk6MTsulCFsDjD5o+bj2o/YOeBN8F4F2hr6K700wjLMJd0P3vTh2SjEILh5uKDFmN1S/G8cODi3Sp9Q7kgdNdAYLvnf2wDGMrvvvFHKS+BO+jITOCb7Lw8vOiRIEmX9Reol3e3Yl9757AMBXhZQKLMy1zIVKAAUHvpG36rI3briuJLDZtm59m4W5DIFRzZPCUp+ONId3v4w4f7JLL2cvNrHQtyM9a4O1yJgLnwvhyboFYoBBO6s36vZW9386d787BGAJFowgzLwKcMXIv+d5FLN7b26ufvBn9Vo8YYQdS0IQ2JNrUpzO4UibASS5jnOhr+3vMrFg9jr8B0KPh9uLIUvdyhIGZYF2fFy4sTahNxZ5/b4jA2TILotyjFcKyQb4wPe6RXSRcH7utvARdJn7MAK9SfLPipL20r5PeMmzwn566rSOMI8vSDEFNVz7IgFdBsqKi0vCyphHIEJufVt5TLcD9wS5VH1RwmTHNsqtDBcLCEeWggA7+rW3sSgvC/AWM+55yUFbSJWOpRImUoOQOgq/w5e8UfXPMUpvt/C+dEt6PcAgxeaJ3YuPyswH0UNnPmW6O/d+tsp4/LxJAWIGMYnRS/0LLgghAz888nbr8ihvvK/28xk47v/5hyyNahF6Um0QY8u9hO39gjci8h4vwXCNs8d5HP8chPGJGQtFSywIdsQe/3k6/PfQdyd4d/uKgF7FIMkhi0nLeoiXBDK+Kbgrsz3wCHAzMpr34r6axfoMG1C0EjrQtYxrRj8++PgHswmwZHBzsxL4AP4SQ+1IfsrjizfIzsUTAFQ7zni4dxu4BvsX/11EBshfCv4LLck3hNj/Xvl0tCaw7fAK8nS25n1AhIDLOw+U0e0Q7k0HR0kAdDl7M8uw4PBw8q83LDzEgttHkEqqiy6JWIXCAXQ8rrk1N2a36fpy/l9DJcdMCltLB8mCBfBAT/qE9WDxrDB9seb2O3wtgwJJyw7eUURRDg3QiEoBsbq7tOJxdjBFsl12YHv1Qb3GjoobCw/J0kaqQhd9m3nFt8h34fncfabCP4ZqCaMKyUn2BnfBeruaNmpyQTDKsfI1YvsjAcFIjU3RkMGRFA5FyUBC73vHNgxyIzCycd61nzrmQJaF+0l1ytuKO0cJwzv+UzqoeAA37vlV/PWBFoW7SNYKswnTBy4CXTzyN0Fza/ExsZZ03nojQL/HBAzwkCUQwI7lyinD6v0btwhy57D28bP06nnZv6eE18j7SpHKUkfew9+/U/tcOI030XkgPA0AbESByHZKBUoZB5IDdf3K+KO0KrGxsZP0bnkwP0AGMYu8z3CQk88wSsVFIv52+BSzgfFTMZ30QzkRfrLD5cgsynJKVwhoRIDAW7we+S53yPj8O29/QwP/B0VJwYoICCLEA38iOY81O3IJcepz0/hKvkOE14q4DqSQTY9kC5EGFP+W+W80cTGGsZzz6zgO/bnC5sdLCj2KSIjkhV3BKLzvuaM4FXiqet1+nIL1RoTJaEngiGAEw8A2eoI2HPL3sdmzj7e0PQzDuElkTcKQLo9BDEwHPwC5+lY1dDIRMbGzYzdUPL8B3IaXibQKZskSxjSB+P2MOmn4dnhrelh9+sHmhfYIuwmiSIjFtkDFu/o2zPO7siDzYbbufB1CVchDjQwPt09GjPVH4AHdu4f2SXLx8ZwzLHai+4QBCQXTSRZKcQlxxoQCyv6zOsG46/h/ueF9HwEURRtIOslOSN0GGYHOPPV3ybRTsoAzSrZ6OzbBMccXTAIPKE90zQtI9kLAfMJ3b7NoMdzyx7Y8eoqALcT/yGTKJ4mAx0pDnL9iu6k5NLhnObm8SsBAxHYHaQklCNxGrIKOPfH40bU+MvYzCnXYelsADsYhiyaOQw9LzY3JgAQgPcP4ZTQzMjMytfViOdR/DIQex+DJygn+x4YEbEAZfF75kDih+WG7//9tw0hGx0jnSMbHLkNEfu454nX580IzYPVJuYs/LkTkijsNh88LjfwKPAT7fsq5aLTRsp8ytzTVOSN+J0MxRwrJmUnriDZE+IDU/SG6Pbiv+Rp7f36cgpOGFshWCNzHXoQvf6f6+raFNCMzTfUO+Mi+EgPhyQENOE60TdVK6QXQABT6eDWCsyAyjHSW+Hk9P4I5BmRJFQnGiJmFv4GUPe+6u/jQ+SQ6yn4PAdmFWUfySJ4HvISOAJ372DeetJgzkTTouBS9O8KbiDoMFU5HDhmLRgbdASB7UfaE87XytbQn95a8VwF3ha4IvgmPSO9GAAKVPod7SflEeT86Yf1GwRwEkAd8yEuHx8VfQU48+XhENV/z6jSWt7B8LQGTRyhLYA3DzgiL0geggiu8dLdXNB+y8zPJdz37b8BuxOmIFQmFyTaGuIMWf2e75rmJuSu6BzzFQF0D/Qa3SCWHwEXiQjd9nLl0Nfk0GDSZtxx7Z0CKxg1Kmk1rjeIMDIhZAzT9Xnh4NJzzBLP8Nm/6iv+fxBfHmklqSS5HJ8PWAA58kLogOSm5+rwLv53DIYYih+zH5gYVwtg+v7otNqI0mnSxNpm6rD+EBSqJhQz/DaYMdIjFhDp+TblmdWwzafOANi356n6Mw3qGz0k8iRaHjMSTAPp9BrqHeXl5vPua/t/Cf4VAR6HH+QZ5w29/YXstd1o1MDSddmi5/L6AhAJI4kw/jVVMiYmlBPr/QHpgNgzz4vOWdbj5D333AlLGdIi9SS5H5kULgan9x7s9+Vp5jnt0viUBmETRxwYH+UaNBDuAADwzOB81mHTdtgo5Wf3BwxWH8wttzTAMi4o2BbSAdXskNv40LzO/NRH4uzzgAaKFiwhsiTWIM0W+Qht+kbuDecw5r/rZva5A7YQYRpnHp0bPxLwA2nz8uO/2EjUyNf34hL0JgibG+UqLDPaMucp3xmYBarww9740jfP6NPm377wJgOqE1EfKySwIcwYqAs1/Y7wWeg65oTqKvT2AAMOVRh7HQ4cBhS/Brr2Iucr23DVZtcS4fnwYwTcF9knYzGnMlMrpxw5CXr0EuIx1fnPHtPD3bXt1P+zEEMdZCNIIpQaNw76//Dy1+mD5orpIfJO/k4LKhZWHDociBVXCe75VOq53dPWUNd43x3uxAAhFK8kXy8oMnEsLR+wDD/4d+Wb1wHRndLg29fqj/yrDQobXyKdIiMcoBC1Amb1gusJ58/oTvDG+5wI5BP/GiQcxha3CwH9g+1k4G7Ygdcp3oDrTf1vEG4hJy1iMUItbiH3D/P76+gz2knSZdI/2ijoXfmXCqkYHyGwInYd4RJhBev3Ve3J51Tos+5j+fQFihF5Gc4bwRfcDe7/qfAl4zva99cl3SbpBPrMDBsevypYMMctaiMME5H/auzy3M/TdNLh2KvlRPZ9ByYWqB+DIo0e9BT6B3j6TO+/6BfoUe0n91oDIg/KFz4beRjFD7ECwPP25TTcrdho3A7n6/Y+CbwaLygPLwIuHyXrFRMD7O/T347VyNLH12TjR/NiBIYT/x0YImcf2RZ7Cgn9YfHo6RfoKOwX9dMAsQz4FXUa7xhxEUYFxPbR6FXeoNnz2zvlBvTKBVkXeyWKLfUtjCaRGHUGbfPR4oHXXtPw1lThbPBNAc8QJxxwIQMgixjeDJj/j/NA61HoOus182X+PAoHFHgZJxnfEqwHr/mx65bgy9rD26vjV/F0AvYTqSLPK6Itsyf7GrIJ5fbk5aXZNdRd1n7ft+1D/gYOJBqPIGIgCBogDx8C0PXC7MPoh+qD8RL8ygf9EUwYIhkOFN8JffyQ7vPiKdzV22Di4u5C/5kQvx/hKQ0tkygnHcUMUPoJ6fTbSdUN1uXdLOtI+zAL/Bd3H4QgUBs+EZoEIPhq7mvpDeoE8OD5XgXfD/UW4xgBFd0LK/9o8Wflt90m3FjhqOw3/EgNwxzHJzksLSkUH6wPqf057Gneltb/1Ynczehi+FMIsxUsHmsgYBwzEwUHevo08EXqzOm47tH3/wKzDXcVbRi2FaUNswE19Ovnb9+y3JPgqupW+QgKuxmFJSkrgynBIGIS6gBu7//gGdgw1mrbn+aW9XUFThOwHBkgOR3+FFkJ2Pwa8k/rw+mh7en1sAB9C9cTwxcwFjYPFATy9nrqTOF43Q/g6uik9t4GqxYhI+EplikuIuYUEASj8rHjz9mg1orao+Tn8pkC0hAJG44f2R2bFpULNf8Y9ITs8Om/7Cv0df5DCRsS6RZxFo8QSQaa+Q/tSeNx3srfZ+ci9M4DmhOfIGYoaSlZIzMXFQfU9XnmsdtM1+jZ3OJZ8Mb/RA45Gc0eQB4JGLMNjAEq9uHtUeoS7JjyVPwKB0YQ4xV5FrARUggp/KXvYOWb38LfI+bU8dwAjRAFHrwm/ihDJEoZ9gn6+FPpvd0w2ITZTOHw7QD9qQtGF9kdcB5FGbAP2gNK+GLv5Oqb6zLxT/rVBF4OtBRMFpkSKwqb/jbyjufx4PTfHOW67wz+iA1ZG+ckWSjuJCcbrwwR/Dns7t9L2VzZ89+w60v6BgkzFbYcaR5PGokRGQZ0+gLxpetX6/vvafirAmcMYRPtFUoT1AvtAL/0zelv4l7gUeTX7WL7kAqfGOwifCdaJckcPg8V/yfvP+KY2nDZ096b6az3YAYFE2UbLB4lGzsTRQii/L7yk+xH6/XupvaOAGcK7xFdFcYTSw0cAzv3F+wQ5PzgwuMr7OD4qwfcFc8gaiaIJTEenxEAAhbyq+QU3L7Z7N205yf1uwPAEOoZux3IG8QUWwrS/pH0qe1p6x7uCPWD/mIIYRChFAwUjw4lBaX5ae7Q5cvhbeO36or23AQXE5YeKCV7JV4f0BPQBAP1Lue83UPaPt385cDyHAFpDkkYGB02HCIWVwz9AHb25O6663jtkfOO/FsGvA68Ex8UoQ8GB/r7vPCq58fiUON76WH0JgJSEEUcuiM1JU8gzxWBB+j3w+mL3/3aydx25Hnwh/4FDIcWRhxyHFMXNg4gA2r4QfA67APtRPKy+lkEBA2xEgIUfxC8CDb+DvOZ6ezjaeN36Gjyj/+UDeEZIyK4JAYhmhcOCsH6Zex+4erbjNwj41buAfyXCaUURht6HFYY9A83BWj6u/Hl7L7sIfHy+F4CPQuFEbUTLBFHClYAWfWa6zflteOr55/wGP3gCm8XZyAHJIMhMBl2DIv9EO+P4wfdhtwD4lrsjvklB6oSHBpRHCoZjxE+B2v8UPO47afsKfBR928AbQk6EDwTphGlC1cCmfem7aPmMeQV5wjvxfo7CPQUjB4lI8ghkhq0DkAAvvG85VDettwY4YjqMfezBJkQyxj4G88ZBhMyCXH++/Sy7r/sXe/R9ZD+lwfVDpoS8RHVDDYEy/m67y3o2+Sz5qTtmPioBXMSlBwWItYhvRvIEN0Ca/T/58LfGd1h4ODo7vRGAnUOVRdwG0QaVBQOC3MAuPbO7wPtvu509MP8vwVaDdIRDBLXDfEF6vvS8c/pr+WG5nPslPYrA/IPhRrdIK8hshyvEl4FE/dU6lrhrt3e32XnyPLg/0QMvxW8GokaexXQDG8ChPgL8XHtTO498w376gPOC+cQ+xGrDoYH9P3p84frquaJ5nTruvTJAHUNZBh9H1UhcR1oFMEHs/m27BPjct6P3xnmwvCG/QkKDBTdGaAadxZ1DmEEWfpj8gjuBe4s8m/5GwIzCtwPvhFRD/UI5f/89U/tx+e85qjqDPOD/v8KMxb7Hcog/B3xFQIKRfwi7+vkY99z3/vk3+49+8gHQBLXGIgaSBf6D0UGNfzU88Tu6e1D8e33VQCOCLQOWRHKDzoKuwEG+CPvBekc5w7qi/Fc/JYI+BNZHBMgUx5JFx8Mxf6U8dzmfuCI3w7kIe0G+YYFXhCrF0Qa7RdeERgIE/5b9aTv+O2C8In2nf7iBnQNzRAXEFcLcwME+gDxXuqm56TpN/BX+jwGtxGdGjAfdx5wGBYOMgEG9OTowOHO31Djiuvn9kcDag5eFtUZZxifEtYJ7//z9qXwMO7p70X19vw1BR8MHhA5EEoMDAXy++Ly0OtX6GnpEu92+PUDdA/KGCYeah5mGeUPhwN19v7qJeNB4MPiHOrh9A0BaQzxFDwZtRi6E30LxwGY+MPxju557yL0YfuIA7kKTw8xEBMNggbO/cT0Ve0t6VvpG+679sMBMw3kFvccLh4rGooRwAXd+Cbtq+Th4GXi1+j38t7+XQppE3sY2BivFAsNlgNJ+vzyE+8x7yLz4/ngAUUJYQ4CELIN1QeU/6P26+4j6nrpUe0o9av/9wrwFKgbxR3AGgQT3Qc7+1nvTear4Tbivuct8bz8SwjIEZUX0Bh9FXsOWgX/+030uu8R70byfvhBAMcHWQ2tDygOBAlDAXz4jfA368Hptey886/9xQjwEjsaMh0lG1IU2QmL/ZHxCeic4jXi0OaE76v6NgYSEIwWnxgjFs4PDge5/bH1g/AY747xM/es/kIGOgw1D3YODgrXAkv6OfJm7DDqRex68tD7oAbpELUYdxxbG3MVswvJ/83z2+my42DiDub+7a34IgRLDmQVRhigFgARsQhz/yf3avFF7/zwBfYn/boEBwucDp0O8gpOBAz86fOr7cPqAOxh8RH6igTfDhgXlhtkG2gWaQ3zAQb2vuvq5LfieOWc7Mb2EwJ2DB0UxRf2FhESPgopAav4bfKV74/w9fSy+zMDwwnkDZ0OsAuoBb79nPUE73jr5ety8HT4hwLVDGgVkxpCGzAX+g4FBDz4se1B5jbjDuVh6/j0CwCWCrwSIBcjF/8StQvYAjj6ifMJ8EbwBfRQ+q8BcggRDXkOSAziBl3/TPdt8Ezs8uut7/r2mwDOCqkTchn2GssXZBD+BWj6ru+z593jz+RN6kbzD/6vCEQRWBYpF8kTEg19BM37vPSe8CLwNfMF+TIAFwclDDMOuwz7B+cA+Pjj8TztJewR76T1xv7PCN8RNBiCGjsYphHaB4n8svE+6anku+Rg6bHxIfzFBrcPbxUJF24UVA4VBmb9AvZR8SLwh/LS977+tQUjC8sNCA3yCFkCnPph80Xufeyd7nT0C/3bBg4Q3RbpGYAYwBKYCZz+uvPe6pjl0OSc6D3wRPraBBkOaBTDFu8UeQ+dB//+WPch8kXw+vG49lf9UAQOCkUNMg3ICbIDNPzm9GPv9uxR7mjzbfv0BDcOcRUuGZsYsRM2C50AwvWP7KbmDeUA6OnuevjyAm0MRRNaFkoVfxATCZUAvPgL84nwkPG69f776gLqCKMMOQ17CvEEv/1t9pXwj+0s7oPy7fkcA2AM8hNSGI8YehSyDIoCx/dQ7tLncOWM57ftx/YQAbcKCBLNFYEVZhF0CiYCKvoN9O7wR/HY9Lj6hgG4B+cLHg0MCxMGOv/z99XxRe4r7sPxjPhYAYsKZRJZF1sYGhUMDmAExfkb8Bnp+OVA56nsLfU4//gItRAgFZMVKxK+C64Dn/sk9XHxIPEU9IT5KAB8BhQL5Ax6CxgHogB2+SPzFe9N7inxS/eo/7sIzBBFFgMYkhVBDx0Gu/vv8Xbqo+Yc58DrrfNr/TUHTg9UFIIV0BLwDCsFGP1N9hHyGvFu82b40v46BSwKiwzHC/4H9gHy+nn0/O+R7rTwLPYQ/vQGKg8ZFYgX4hVSEL8HpP3H8+nrbucd5/vqSfKt+3EF1w1sE04VUhMIDpsGk/6G98zyNPHn8mD3h/3zAzIJFgzzC8YIMwNm/Nb1+PD07mPwLvWR/DgFhA3YE+0WDBY+EUUJfv+h9W3tWOhE51vqBPEB+q8DUQxpEvgUshMED/oHDADN+J/zbfGA8nL2SfysAikIhwv/C24JWATN/Tb3BvJ17zXwU/Qs+4kD2wuGEjMWEhYFEq0KRwF59wDvXemO5+Dp3e9o+PEBwQpOEYMU8RPjD0cJgAEd+on0xPE38p31GvtmARQH3wrsC/gJZAUn/5b4I/MQ8CnwmvPj+eoBMwolEV0V8xWnEvUL/AJN+Z7we+r754np1u7l9joAKAkdEO4TDhSkEIAK7gJ1+4b1N/IN8uT0/fkkAPUFIgq8C2IKVgZwAPT5TfTE8D3wA/O3+F4Ajwi4D28UshUlEx0NmwQZ+0TysOuI6Ffp8e159Y3+igfZDj0TChRGEaILUgTR/Jb2xfIB8kf08/jp/s8EUQlwC60KLAenAU37f/WO8XDwjvKq9+b+8QZDDmoTURV+EyQOIwbb/PHz+ewz6UjpLe0n9O786wWFDXAS5hPKEa0MqgUw/rT3bfMU8sXz/fe4/aQDcAgJC9oK5gfLAp78uPZs8sHwOvK69oT9XQXIDFAS0hS0EwoPkQeR/p/1VO786Vvpi+zv8l37SwQkDIsRohMuEp4N9AaN/9/4K/RC8mDzHveS/HgCgAeKCuoKhQjZA+X99fdb8yzxBvLq9Tn80wNJCyYRNxTIE84P5Ag3AE73vO/e6pDpCuzU8d35rwK3Co8QQRNzEnYOLgjoABT6/vSN8hfzV/Z5+00BhAb1Cd4KBgnQBCD/MvlY9LHx8fE49Qj7WALLCe0PgRO8E3AQGwrNAfn4MfHY6+Tpq+vW8HD4GAFCCX4PwxKaEjIPVQk8AlH75fXy8uvyqPVw+iUAfgVMCbYKbAmvBU0Ab/ph9Uzy+vGm9PD57QBPCKkOsxKPE/EQNQtPA5/6rvLp7Ffqbuv17xn3iv/HB1oOKRKhEtIPaQqJA5L83PZw89vyEvV4+QP/cgSQCHUKtQl3BmoBp/tz9v3yH/Iy9PP4k//XBlsN0BFFE1ERMgy9BDz8MfQM7ufqUes079j1B/5JBicNdxGLElYQZwvLBNb94fcF9ObylfST+On9YQPEBxsK4wkkB3UC2fyM98DzYPLc8xL4TP5oBQcM2hDeEpEREA0UBs/9uPVA75HrVOuR7q/0kPzKBOcLrBBYEr0QTwwBBhr/8/iw9AvzM/TC99n8TgLqBqsJ9gm5B24DA/6p+JL0ufKk80z3G/0BBLAK1A9cErERzw1TB1X/P/eC8FTsdesM7p/zKftOA5sKzA8JEggRHg0oB1wAD/pv9Uvz6vMG99T7OwEFBiYJ7wkzCFIEI//H+XP1KvOI86P2//unAlcJvw7DEbIRcA55CM0AxfjQ8S7tteun7ary0vnWAUcJ2Q6fETYR1Q0/CJkBMvtA9qPzvPNg9t76KwAXBY4IzwmUCCEFNgDl+l/2sPOI8xb2+/paAf8Hnw0SEZcR8w6FCTQCR/on8x3uEOxh7c/xjvhlAOwH0w0bEUgRcw5ECc8CW/wh9xL0qPPR9ff5H/8iBOUHlwnbCNoFOwEA/FX3SvSh86T1D/ocAKsGdQxOEGARVw92CogDwvuF9B7vh+w47RHxXvf8/o4GvgyAED4R9g42Cv0Dhv0Q+Jf0rPNZ9SD5Gv4oAywHSAkJCXwGMAIX/VH49fTU8071O/nw/l0FRQt3Dw4Rng9LC8kENP3n9S/wFu0t7W7wRPaf/S8FnAvODxkRYA8UCx8Fs/4K+TD1yvP69Fz4Hv0sAmcG5QgeCQYHFQMm/lH5r/Ue9BP1gfjW/RcEEQqRDqQQyA8FDPQFnP5K907xve0+7ejvQPVP/NADbwoID9oQrw/cCzUG3f8O+tz1//Oy9Kv3LfwvAZcFbggbCXoH5wMs/1T6d/Z+9PL04PfQ/NsC2gicDSIQ1Q+kDAkH9/+t+Hnyeu5r7X7vVPQN+3UCOgkvDoMQ4w+NDDwHBAEa+5n2S/SC9A73R/s0AL0E5gcBCdYHpgQnAFb7Sffx9Or0Wffe+6sBpQedDIwPyA8mDQYIRAEN+q3zSu+y7THvgfPd+R8B/gdFDRMQ/g8oDTQIJgIs/Gb3rPRq9Ib2cPo9/90DTQfSCBoIUgUWAVf8Jfh39fv06vYC+4gAcQaUC+MOoQ+NDewIgAJo++j0LPAT7v7ux/K9+NH/vQZMDI0P/w+qDRoJPwNA/T/4I/Vp9BP2p/lM/vgCpwaNCEgI6AX3AVT9B/kN9iL1lfY8+nT/QgWECigOYg/ZDbgJqwO8/Cj2HvGL7ufuJvKy94z+ewVHC/IO5w8VDu4JTwRW/iT5rPV/9Lb17/hj/REC8wU1CF4IagbJAkr+7vmy9l/1WPaN+XD+GgRwCV4NDA8KDmwKwwQH/mr3HfIZ7+vun/G69lL9OAQ2CkMOtw9nDq4KVQVr/xP6Rvaq9G71SPiC/CkBNgXMB18I1waLAzn/1/pj96/1NPb0+H79+gJZCIcMoA4iDgcLxwVH/6z4KPO77wjvMvHY9SX8+AIdCYINbw+hDloLTQZ9AAn78fbs9D31s/et+0IAcARRB0sILgc8BB8Awfsf+BP2JvZz+J785AFCB6QLIA4hDogLtgZ6AO35PPRw8D3v3/AM9Qb7vAH9B7IMEQ/DDvELNweLAQT8q/dB9SL1Mffj+l3/owPHBiMIcAfbBPoAqfzj+If2LvYI+NH72gAsBrkKjg0IDvALkAegASr7V/U28YrvpfBX9Pj5hgDYBtMLng7ODnIMEgiSAgP9cfip9Rz1wvYn+n7+0QIwBucHnAdnBcgBj/2u+Qv3TPa19xj73P8aBccJ7AzYDT8MUwi2AmH8d/YL8u3vhPC58/r4WP+xBecKGA7BDt0M3AiRAwT+Qfkj9iv1aPZ6+ab9/AGOBZkHtQfhBYoCb/5++p33ffZ493T67f4NBM8IPAyTDXYMAAm7A5H9m/ft8mXwfPAz8w/4NP6JBPEJfw2eDjENlAmGBAX/HPqu9k71Ifbc+NX8JgHhBDsHuQdHBj0DSf9R+zr4wvZQ9+T5Dv4HA9UHfws6DZYMlQmvBLj+v/jb8/Dwi/DE8jf3G/1jA/II1AxlDnANOgpwBQQA/fpI94b17/VP+A78UQAsBM0GqQeZBuADGwAk/OH4F/c+92n5P/0JAtoGtwrODJ4MFAqQBdP/4/nR9I3xsfBt8nP2Dvw/Au0HGwwXDpgNzQpNBv4A5fvw99D10fXT91L7f/9xA1EGhwfYBnME5AD3/JH5fPdA9wP5gfwWAd8F5glRDJEMfApdBuMABPvP9Tny7fAt8sT1EPsgAeIGVAu1DasNTAsdB/QB0Pyk+Cv2xvVp96L6sP6wAsgFUwcEB/YEogHI/Uf68PdW97L41PsuAOcEDgnFC28MzgoXB+UBIfzT9vTyPvEE8ir1IfoIANQFgApBDagNtwvdB+MCvf1i+Zj2z/UR9//55/3tATQFDgcdB2cFUwKU/gP7cfh+93X4O/tS//MDMQgsCzgMCQu8B9gCN/3a97zzovHy8aX0Qvn4/sUEowm8DJANDQyOCMkDq/4q+hT36/XM9mr5Jf0oAZcEugYkB8cF+AJb/8H7/Pi390z4s/qE/gUDUQeGCu8LLwtMCLwDRv7j+I/0GPL28TX0dPjy/bYDvAgmDGQNTwwuCaUEl//4+p/3GvaZ9uT4a/xjAPIDVwYYBxUGjwMbAID8kvkA+Db4P/rF/R4CbwbVCZULPwvICI8ES//s+Wv1nvIO8tzzuff3/KoCzweCCyUNfQy8CXYFgADN+zb4WfZ49m74u/uh/0YD5wX7BlIGGATTAED9L/pY+DP43vkV/UABjQUcCSsLOwsvCVEFRgDz+k72NPM78pfzD/cI/KEB3AbQCtMMlgw4CjoGZQGl/Nn4qvZq9gj4Fvvh/pUCawXOBnwGkgSBAf390/q++EL4j/l1/GsArQRcCLIKJAuBCQAGNQH2+zf32PN88mjzefYn+54A5gUTCm8MnAyjCvEGRAKA/Yf5Cvdt9rL3ffon/uIB5QSRBpYG+wQlArf+e/sv+WL4U/nl+6L/0AOXBy0K+gq/CZ4GFwL1/CT4iPTO8k7z9/VU+qH/7gRMCfwLjgz6CpoHHANc/j36efeC9m738Ply/S0BVQRGBp4GVQW9Am3/J/ys+ZL4Kfln++X+9wLOBpsJwArqCSgH6wLt/RT5Q/Ux80fziPWR+a3+9gN8CHkLbgw/CzQI6wM3//r69feo9jr3cfnF/HcAvgPuBZYGnwVIAx0A1fwx+tH4Efn5+jT+JQIDBgAJdQoACqAHsQPe/gT6Bval81XzLfXe+MP9/wKlB+gKOwxxC74IsAQQAL37ffjf9hf3Afkg/MP/IQOJBX4G2QXHA8UAgv2++h35C/mc+pH9WwE4BVwIGwoECgUIZgTF//P60fYm9HXz5fQ8+OT8CwLJBkoK9wuQCzcJagXlAIT8Efkl9wX3nviF+xL/fwIYBVcGAwY4BGUBL/5R+3b5FPlR+v38mQBtBLIHswn3CVcIDAWiAN/7ove19KfzsfSq9xD8GwHpBaEJowudC6AJGAa1AU39rvl59wT3S/j1+mT+2gGeBCIGHAabBPwB2f7p+9v5LfkW+nf84P+lAwIHPwnYCZcIogVzAcj8d/hP9erzkPQr90n7MgAGBe8IPwuYC/gJuQZ/Ahj+VPrc9xP3CPhw+rz9MwEcBN8FJgbvBIgCfv+E/En6Vfnt+QH8Mv/hAk4GwAipCcQIJgY5Aqv9T/n09T30gfS99pD6T/8jBDQIzQqCCz4KTAdBA+P+AftL+DL31Pf4+Rr9jACSA48FIQY1BQkDHwAi/cD6i/nT+Zr7kP4iApgFOAhrCeAImQbxAof+KPqi9p/0hfRi9ub5df5BA3IHTgpaC3QK0Qf7A6z/s/vF+GD3r/eM+YD85f8CAzQFDgZsBX8DuQC//T/7zfnJ+UL7+v1pAeEEpwcfCesI/AabA1z/AftX9w71mvQY9kr5pP1gAqoGwgkjC5gKSAiqBHMAavxL+Zz3m/cu+e/7Qf9tAs4E7AWVBegDTAFc/sP7HPrO+fr6cP24ACoEEAfHCOUITQc3BCgA2PsR+Ir1wPTg9b743fyDAd8FLAncCqsKrwhPBTUBJP3Z+eb3lffd+Gf7n/7VAWAEvQWvBUQE1wH3/kz8dPrh+cH69PwPAHYDcwZiCM8IjQfEBOoArPzR+BH29fS59UP4IvyrABAFjQiHCq4KBgnpBfEB3/1w+j34nveb+Or6A/48AekDgQW6BZQEWQKP/9n81/oD+pj6hfxw/8QC0gX0B6sIvQdCBaEBfP2T+aL2OvWk9df3dPvZ/0EE5QckCqAKTgl2BqcCm/4O+6D4t/dn+Hf6bP2hAGsDOgW4BdYE0AIiAGf9Qfsx+n36Jfzb/hYCLwV8B3gI3AexBUwCRv5X+jz3jPWg9Xz30voO/3EDNge1CYMKhgn2BlYDVf+x+w753fdB+BD63PwHAOcC6ASoBQoFPQOvAPf9svtq+nH60vtQ/m4BiwT9BjkI7AcQBuwCCf8b+9336/Wr9TH3PvpL/qMCggY6CVcKrglpB/wDDQBY/Ib5EPgp+Lb5U/xu/14CjASLBTEFnwM3AYX+Kvyv+nL6jfvR/c0A5gN2Bu0H7QdgBn4Dxf/e+4P4V/bG9fb2t/mR/dcByQW1CBwKxgnOB5gEwgAD/Qf6Ufgg+Gj50/vY/tMBJwRhBUsF9gO2ARP/pfz++oH6V/te/TIAQwPrBZcH3wegBgMEeACf/C/5zPbw9cz2QPni/BABDQUnCNQJ0AkkCCoFcgGw/ZD6nvgl+Cf5XftG/kUBuwMsBVgFQAQuAp3/JP1V+536Lvv3/KD/ogJcBTYHwwfRBnoEIQFd/d35S/co9rH21/g9/E0AUASRB38JygltCLAFHQJd/iD79vg3+PP48Po=';
    var PALETTE = ['#e5484d', '#f76b15', '#f5b800', '#46a758', '#12a594', '#0091ff', '#6e56cf', '#d6409f', '#8e4ec6', '#3e63dd'];

    function readJson(key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        var value = JSON.parse(raw);
        return value === null || value === undefined ? fallback : value;
      } catch (error) {
        return fallback;
      }
    }

    function writeJson(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {}
    }

    function colorFor(name) {
      var hash = 0;
      var text = String(name || '');
      for (var i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
      return PALETTE[hash % PALETTE.length];
    }

    function initialFor(name) {
      var match = /[0-9A-Za-z\u0410-\u044f]/.exec(String(name || ''));
      return match ? match[0].toUpperCase() : '?';
    }

    function orderedIds(allIds, saved) {
      var seen = Object.create(null);
      var result = [];
      (saved || []).forEach(function (id) {
        if (allIds.indexOf(id) >= 0 && !seen[id]) { seen[id] = true; result.push(id); }
      });
      allIds.forEach(function (id) {
        if (!seen[id]) { seen[id] = true; result.push(id); }
      });
      return result;
    }

    function relativeTime(value, now) {
      if (!value) return '';
      var diff = Math.max(0, now - value);
      var minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'сейчас';
      if (minutes < 60) return minutes + ' мин';
      var hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + ' ч';
      var days = Math.floor(hours / 24);
      if (days === 1) return 'вчера';
      if (days < 30) return days + ' дн';
      return new Date(value).toLocaleDateString('ru-RU');
    }

    var audioContext = null;

    function ensureAudioContext() {
      try {
        var Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        if (!audioContext) audioContext = new Ctor();
        if (audioContext.state === 'suspended' && audioContext.resume) {
          audioContext.resume().catch(function () {});
        }
        return audioContext;
      } catch (error) {
        console.warn('sidebar-opencode: AudioContext недоступен:', error);
        return null;
      }
    }

    function playChime(box, src) {
      var context = ensureAudioContext();
      if (context) {
        try {
          var start = context.currentTime + 0.02;
          var notes = [{ at: 0, freq: 1046.5, gain: 0.9 }, { at: 0.13, freq: 1568.0, gain: 0.8 }];
          notes.forEach(function (note) {
            var oscillator = context.createOscillator();
            var gain = context.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.value = note.freq;
            var begin = start + note.at;
            gain.gain.setValueAtTime(0.0001, begin);
            gain.gain.exponentialRampToValueAtTime(note.gain, begin + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.0001, begin + 0.34);
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(begin);
            oscillator.stop(begin + 0.36);
          });
          return;
        } catch (error) {
          console.warn('sidebar-opencode: WebAudio не сработал:', error);
        }
      }
      try {
        if (!box.current) {
          box.current = new Audio(src);
          box.current.preload = 'auto';
          box.current.volume = 1;
        }
        box.current.currentTime = 0;
        var played = box.current.play();
        if (played && played.catch) played.catch(function () {});
      } catch (error) {
        console.warn('sidebar-opencode: аудио недоступно:', error);
      }
    }

    function svg(children) {
      return h.apply(null, ['svg', {
        viewBox: '0 0 24 24',
        width: 16,
        height: 16,
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true'
      }].concat(children));
    }

    function iconGear() {
      return svg([
        h('circle', { key: 'c', cx: 12, cy: 12, r: 3 }),
        h('path', { key: 'p', d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8.9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8.9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' })
      ]);
    }

    function iconArchive() {
      return svg([
        h('rect', { key: 'lid', x: 3, y: 4, width: 18, height: 5, rx: 1.5 }),
        h('path', { key: 'body', d: 'M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9' }),
        h('path', { key: 'slot', d: 'M10 13h4' })
      ]);
    }

    function iconRestore() {
      return svg([
        h('rect', { key: 'lid', x: 3, y: 4, width: 18, height: 5, rx: 1.5 }),
        h('path', { key: 'left', d: 'M5 9v9.5A1.5 1.5 0 0 0 6.5 20h3' }),
        h('path', { key: 'right', d: 'M19 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-3' }),
        h('path', { key: 'arrow', d: 'M12 20v-7' }),
        h('path', { key: 'head', d: 'm9 16 3-3 3 3' })
      ]);
    }

    function iconFolderPlus() {
      return svg([
        h('path', { key: 'folder', d: 'M4 20h16a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 20 7.5h-7.3a1.5 1.5 0 0 1-1.2-.6l-.9-1.2a1.5 1.5 0 0 0-1.2-.6H4.5A1.5 1.5 0 0 0 3 6.6v11.9A1.5 1.5 0 0 0 4.5 20z' }),
        h('path', { key: 'v', d: 'M12 11v5' }),
        h('path', { key: 'h', d: 'M9.5 13.5h5' })
      ]);
    }

    function ensureStyles() {
      if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = [
        '@keyframes dshoc-spin { to { transform: rotate(360deg); } }',
        '.dshoc-root { position: relative; display: flex; flex-direction: column; gap: 1px; padding: 2px 6px 8px; min-height: 0; overflow: auto; }',
        '.dshoc-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 6px 4px; font-size: 11px; letter-spacing: .04em; text-transform: uppercase; opacity: .55; }',
        '.dshoc-headactions { display: flex; align-items: center; gap: 2px; }',
        '.dshoc-iconbtn { border: 0; background: transparent; color: inherit; cursor: pointer; padding: 2px; border-radius: 4px; line-height: 0; flex: 0 0 auto; opacity: .62; }',
        '.dshoc-iconbtn:hover { opacity: 1; background: rgba(127,127,127,.12); }',
        '.dshoc-head .dshoc-iconbtn { opacity: .55; }',
        '.dshoc-head .dshoc-iconbtn:hover { opacity: 1; }',
        '.dshoc-row .dshoc-iconbtn { visibility: hidden; }',
        '.dshoc-row:hover .dshoc-iconbtn { visibility: visible; }',
        '.dshoc-row .dshoc-iconbtn.dshoc-always { visibility: visible; }',
        '.dshoc-ws { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 6px; cursor: pointer; }',
        '.dshoc-ws:hover { background: rgba(127,127,127,.13); }',
        '.dshoc-chip { width: 18px; height: 18px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; line-height: 1; color: #fff; flex: 0 0 auto; }',
        '.dshoc-title { flex: 1 1 auto; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
        '.dshoc-add { opacity: 0; border: 0; background: transparent; color: inherit; cursor: pointer; font-size: 15px; line-height: 1; padding: 1px 5px; border-radius: 4px; }',
        '.dshoc-ws:hover .dshoc-add { opacity: .65; }',
        '.dshoc-add:hover { opacity: 1; background: rgba(127,127,127,.22); }',
        '.dshoc-sessions { display: flex; flex-direction: column; gap: 1px; padding: 1px 0 3px 4px; }',
        '.dshoc-row { display: flex; align-items: center; gap: 6px; padding: 5px 6px 5px 22px; border-radius: 6px; cursor: pointer; font-size: 13px; }',
        '.dshoc-row:hover { background: rgba(127,127,127,.13); }',
        '.dshoc-row.dshoc-current { background: rgba(74,163,255,.16); box-shadow: inset 2px 0 0 #4aa3ff; }',
        '.dshoc-row.dshoc-current:hover { background: rgba(74,163,255,.24); }',
        '.dshoc-row.dshoc-current .dshoc-name { font-weight: 600; }',
        '.dshoc-row.dshoc-archived .dshoc-name { opacity: .8; }',
        '.dshoc-name { flex: 1 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',

        '.dshoc-time { font-size: 11px; opacity: .5; flex: 0 0 auto; }',
        '.dshoc-dot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }',
        '.dshoc-spin { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid rgba(127,127,127,.3); border-top-color: #6aa9ff; animation: dshoc-spin .8s linear infinite; flex: 0 0 auto; }',
        '.dshoc-empty { padding: 8px 10px; font-size: 12px; opacity: .55; }',
        '.dshoc-moved { font-size: 11px; opacity: .5; flex: 0 0 auto; }',
        '.dshoc-ws.dshoc-drop { background: rgba(74,163,255,.2); outline: 1px dashed rgba(74,163,255,.7); outline-offset: -1px; }',
        '.dshoc-sessions.dshoc-drop-area { background: rgba(74,163,255,.08); border-radius: 6px; }',
        '.dshoc-panel { position: absolute; right: 6px; top: 24px; z-index: 30; min-width: 190px; background: #1b1b20; color: #e7e7ea; border: 1px solid rgba(127,127,127,.3); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 7px; font-size: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.45); }',
        '.dshoc-check { display: flex; align-items: center; gap: 7px; cursor: pointer; user-select: none; }',
        '.dshoc-check input { margin: 0; cursor: pointer; }',
        '.dshoc-test { margin-top: 2px; border: 1px solid rgba(127,127,127,.35); background: rgba(127,127,127,.12); color: inherit; border-radius: 6px; padding: 4px 8px; font-size: 11.5px; cursor: pointer; }',
        '.dshoc-test:hover { background: rgba(127,127,127,.22); }',
        '.dshoc-diag { font-size: 10.5px; opacity: .5; }',

      ].join('\n');
      document.head.appendChild(style);
    }

    function SidebarOpencode(props) {
      ensureStyles();

      var useSessions = props.useSessions;
      var useWorkspaces = props.useWorkspaces;
      var useSessionStatus = props.useSessionStatus;
      var open = props.open;
      var startSession = props.startSession;
      var archiveSession = props.archiveSession;
      var unarchiveSession = props.unarchiveSession;

      var list = useSessions ? useSessions(function (state) { return state; }) : null;
      var workspaceState = useWorkspaces ? useWorkspaces(function (state) { return state; }) : null;
      var statuses = useSessionStatus ? useSessionStatus(function (state) { return state; }) : null;

      var tick = React.useState(0);
      var version = tick[0];
      var bump = tick[1];

      var panelState = React.useState(false);
      var panelOpen = panelState[0];
      var setPanelOpen = panelState[1];

      var orderBox = React.useRef(null);
      if (orderBox.current === null) orderBox.current = readJson(ORDER_KEY, {});
      var expandBox = React.useRef(null);
      if (expandBox.current === null) expandBox.current = readJson(EXPAND_KEY, {});
      var soundBox = React.useRef(null);
      if (soundBox.current === null) soundBox.current = readJson(SOUND_KEY, true);
      var archivedBox = React.useRef(null);
      if (archivedBox.current === null) archivedBox.current = readJson(ARCHIVED_KEY, false);
      var movedBox = React.useRef(null);
      if (movedBox.current === null) movedBox.current = readJson(MOVED_KEY, {});

      var panelRef = React.useRef(null);
      var gearRef = React.useRef(null);
      var audioBox = React.useRef(null);
      var previousStatus = React.useRef(null);
      var dragId = React.useRef(null);
      var dragWorkspace = React.useRef(null);
      var dropState = React.useState(null);
      var dropTarget = dropState[0];
      var setDropTarget = dropState[1];

      React.useEffect(function () {
        if (!panelOpen) return;
        function onDown(event) {
          var panel = panelRef.current;
          var gear = gearRef.current;
          if (panel && panel.contains(event.target)) return;
          if (gear && gear.contains(event.target)) return;
          setPanelOpen(false);
        }
        document.addEventListener('mousedown', onDown);
        return function () { document.removeEventListener('mousedown', onDown); };
      }, [panelOpen]);

      React.useEffect(function () {
        var map = statuses || new Map();
        var previous = previousStatus.current;
        var next = new Map();
        map.forEach(function (status, id) {
          next.set(id, { done: !!(status && status.completionUnread), running: !!(status && status.running) });
        });
        if (previous !== null && soundBox.current) {
          var play = false;
          next.forEach(function (value, id) {
            var before = previous.get(id);
            if (!before) return;
            if (value.done && !before.done) play = true;
            if (before.running && !value.running) play = true;
          });
          if (play) playChime(audioBox, SOUND_SRC);
        }
        previousStatus.current = next;
      }, [statuses]);

      var now = Date.now();
      var byId = (list && list.byId) || {};
      var items = (workspaceState && workspaceState.items) || [];
      var archivedIds = (workspaceState && workspaceState.archivedSessionIds) || [];
      var showArchived = archivedBox.current === true;
      var phase = (list && list.phase) || 'loading';

      var movedMap = movedBox.current;
      var owners = {};
      var displayMembers = {};
      items.forEach(function (workspaceItem) {
        (workspaceItem.sessionIds || []).forEach(function (sessionId) { owners[sessionId] = workspaceItem.workspaceId; });
      });
      Object.keys(owners).forEach(function (sessionId) {
        var target = movedMap[sessionId];
        if (!target || !items.some(function (candidate) { return candidate.workspaceId === target; })) target = owners[sessionId];
        if (!displayMembers[target]) displayMembers[target] = [];
        displayMembers[target].push(sessionId);
      });

      function addWorkspace() {
        var pick = props.pickDirectory;
        var create = props.createWorkspace;
        if (!pick || !create) return;
        Promise.resolve().then(pick).then(function (path) {
          if (!path) return undefined;
          return create(path);
        }).catch(function (reason) {
          console.warn('sidebar-opencode: не удалось добавить проект:', reason);
        });
      }

      var children = [];

      children.push(h('div', { className: 'dshoc-head', key: 'head' },
        h('span', null, 'Проекты'),
        h('span', { className: 'dshoc-headactions', ref: gearRef },
          h('button', {
            key: 'addws',
            className: 'dshoc-iconbtn',
            title: 'Добавить проект',
            onClick: function () { addWorkspace(); }
          }, iconFolderPlus()),
          h('button', {
            key: 'gear',
            className: 'dshoc-iconbtn',
            title: 'Настройки списка',
            onClick: function () { setPanelOpen(!panelOpen); }
          }, iconGear())
        )
      ));

      if (panelOpen) {
        children.push(h('div', { className: 'dshoc-panel', key: 'panel', ref: panelRef },
          h('label', { className: 'dshoc-check', key: 'sound' },
            h('input', {
              type: 'checkbox',
              checked: soundBox.current,
              onChange: function () {
                soundBox.current = !soundBox.current;
                writeJson(SOUND_KEY, soundBox.current);
                bump(version + 1);
              }
            }),
            h('span', null, 'Звук готовности')
          ),
          h('label', { className: 'dshoc-check', key: 'arch' },
            h('input', {
              type: 'checkbox',
              checked: showArchived,
              onChange: function () {
                archivedBox.current = !archivedBox.current;
                writeJson(ARCHIVED_KEY, archivedBox.current);
                bump(version + 1);
              }
            }),
            h('span', null, 'Показывать архивные')
          ),
          h('button', {
            className: 'dshoc-test',
            key: 'test',
            onClick: function () { playChime(audioBox, SOUND_SRC); bump(version + 1); }
          }, 'Проверить звук'),
          h('div', { className: 'dshoc-diag', key: 'diag' }, 'AudioContext: ' + (audioContext ? audioContext.state : 'не создан'))
        ));
      }

      if (!items.length) {
        children.push(h('div', { className: 'dshoc-empty', key: 'empty' }, phase === 'ready' ? 'Нет проектов' : 'Загрузка…'));
      }

      items.forEach(function (workspace) {
        var key = workspace.workspaceId;
        var name = workspace.title || workspace.path || 'Проект';
        var expanded = expandBox.current[key] !== false;

        children.push(h('div', {
          key: 'ws:' + key,
          className: 'dshoc-ws' + (dropTarget === key ? ' dshoc-drop' : ''),
          title: workspace.path || name,
          onDragOver: function (event) {
            if (!dragId.current) return;
            event.preventDefault();
            if (dropTarget !== key) setDropTarget(key);
          },
          onDragLeave: function (event) {
            if (event.currentTarget.contains(event.relatedTarget)) return;
            if (dropTarget === key) setDropTarget(null);
          },
          onDrop: function (event) {
            event.preventDefault();
            var sessionId = dragId.current;
            var fromWorkspace = dragWorkspace.current;
            dragId.current = null;
            dragWorkspace.current = null;
            setDropTarget(null);
            if (!sessionId || fromWorkspace === key) return;
            if (owners[sessionId] === key) delete movedBox.current[sessionId];
            else movedBox.current[sessionId] = key;
            writeJson(MOVED_KEY, movedBox.current);
            bump(version + 1);
          },
          onClick: function () {
            expandBox.current[key] = !expanded;
            writeJson(EXPAND_KEY, expandBox.current);
            bump(version + 1);
          }
        },
          h('span', { className: 'dshoc-chip', style: { background: colorFor(name) } }, initialFor(name)),
          h('span', { className: 'dshoc-title' }, name),
          h('button', {
            className: 'dshoc-add',
            title: 'Новая сессия в этом проекте',
            onClick: function (event) {
              event.stopPropagation();
              if (startSession) startSession(key);
            }
          }, '+')
        ));

        if (!expanded) return;

        var memberIds = (displayMembers[key] || []).slice();
        var rows = [];
        orderedIds(memberIds, orderBox.current[key]).forEach(function (id) {
          var session = byId[id];
          if (!session || session.blank) return;
          var isArchived = archivedIds.indexOf(id) >= 0;
          var isCurrent = !!(session.retainedBy && session.retainedBy.mainView > 0);
          var isMoved = movedMap[id] === key && owners[id] !== key;
          if (isArchived && !showArchived) return;

          var status = statuses ? statuses.get(id) : null;
          var running = status ? status.running === true : session.running === true;
          var done = status ? status.completionUnread === true : false;
          var pending = status && status.pendingInteraction && status.pendingInteraction.kind ? true : false;

          var indicator;
          if (running) indicator = h('span', { className: 'dshoc-spin' });
          else if (pending) indicator = h('span', { className: 'dshoc-dot', style: { background: '#f5b800' } });
          else if (done) indicator = h('span', { className: 'dshoc-dot', style: { background: '#46a758' } });
          else indicator = h('span', { className: 'dshoc-dot', style: { background: 'transparent' } });

          rows.push(h('div', {
            key: id,
            className: 'dshoc-row' + (isArchived ? ' dshoc-archived' : '') + (isCurrent ? ' dshoc-current' : ''),
            draggable: !isArchived,
            onDragStart: function (event) {
              if (isArchived) return;
              dragId.current = id;
              dragWorkspace.current = key;
              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                try { event.dataTransfer.setData('text/plain', id); } catch (error) {}
              }
            },
            onDragOver: function (event) {
              if (!isArchived && dragId.current) event.preventDefault();
            },
            onDragEnd: function () {
              dragId.current = null;
              dragWorkspace.current = null;
              setDropTarget(null);
            },
            onDrop: function (event) {
              event.preventDefault();
              if (isArchived) return;
              var from = dragId.current;
              var to = id;
              var fromWorkspace = dragWorkspace.current;
              if (!from) return;
              if (fromWorkspace !== key) {
                dragId.current = null;
                dragWorkspace.current = null;
                setDropTarget(null);
                if (owners[from] === key) delete movedBox.current[from];
                else movedBox.current[from] = key;
                writeJson(MOVED_KEY, movedBox.current);
                bump(version + 1);
                return;
              }
              if (from === to) return;
              var currentOrder = orderedIds(memberIds, orderBox.current[key]).filter(function (candidate) {
                var s = byId[candidate];
                return s && !s.blank && archivedIds.indexOf(candidate) < 0;
              });
              var fromIndex = currentOrder.indexOf(from);
              var toIndex = currentOrder.indexOf(to);
              if (fromIndex < 0 || toIndex < 0) return;
              currentOrder.splice(fromIndex, 1);
              currentOrder.splice(toIndex, 0, from);
              orderBox.current[key] = currentOrder;
              writeJson(ORDER_KEY, orderBox.current);
              dragId.current = null;
              bump(version + 1);
            },
            onClick: function () {
              if (isArchived) { if (unarchiveSession) unarchiveSession(id); return; }
              if (open) open(id);
            },
            title: session.title || ''
          },
            indicator,
            h('span', { className: 'dshoc-name' }, session.title || 'Без названия'),
            isMoved ? h('span', {
              key: 'mv',
              className: 'dshoc-moved',
              title: 'Строка показана здесь вручную; рабочий каталог сессии не менялся'
            }, '⇢') : null,
            h('span', { className: 'dshoc-time' }, relativeTime(session.updatedAt, now)),
            h('button', {
              className: 'dshoc-iconbtn' + (isArchived ? ' dshoc-always' : ''),
              title: isArchived ? 'Вернуть из архива' : 'В архив',
              onClick: function (event) {
                event.stopPropagation();
                if (isArchived) { if (unarchiveSession) unarchiveSession(id); return; }
                if (running && !window.confirm('Сессия ещё выполняется. Остановить и отправить в архив?')) return;
                if (archiveSession) archiveSession(id, running ? { stopActivity: true } : {});
              }
            }, isArchived ? iconRestore() : iconArchive())
          ));
        });

        children.push(h('div', {
          key: 'ss:' + key,
          className: 'dshoc-sessions' + (dropTarget === key ? ' dshoc-drop-area' : ''),
          onDragOver: function (event) {
            if (!dragId.current) return;
            event.preventDefault();
            if (dropTarget !== key) setDropTarget(key);
          },
          onDrop: function (event) {
            event.preventDefault();
            var sessionId = dragId.current;
            var fromWorkspace = dragWorkspace.current;
            dragId.current = null;
            dragWorkspace.current = null;
            setDropTarget(null);
            if (!sessionId || fromWorkspace === key) return;
            if (owners[sessionId] === key) delete movedBox.current[sessionId];
            else movedBox.current[sessionId] = key;
            writeJson(MOVED_KEY, movedBox.current);
            bump(version + 1);
          }
        }, rows));
      });

      return h('div', { className: 'dshoc-root' }, children);
    }

    var inject = ['slots', 'locale', 'sessions', 'workspaces', 'uiSession'];

    function apply(ctx) {
      var sessions = ctx.get('sessions');
      var workspaces = ctx.get('workspaces');
      var uiSession = ctx.get('uiSession');

      ctx.slots.inject('sidebar.workspaces', function () {
        return ctx.slots.register({
          name: 'sidebar.workspaces',
          order: -1000,
          locale: NS,
          inject: function () {
            return {
              hooks: {
                sessions: sessions.list,
                workspaces: workspaces.list,
                sessionStatus: uiSession.sessionStatus
              },
              open: function (sessionId) {
                var service = ctx.get('uiWorkspace');
                if (service) service.openSession(sessionId);
              },
              startSession: function (workspaceId) {
                var service = ctx.get('uiWorkspace');
                if (service) service.startSession(workspaceId, {});
              },
              archiveSession: function (sessionId, options) {
                var service = ctx.get('uiWorkspace');
                if (!service) return;
                service.archiveSession(sessionId, options || {}).catch(function (reason) {
                  console.warn('session archive rejected:', reason);
                });
              },
              pickDirectory: function () {
                var service = ctx.get('uiWorkspace');
                return service ? service.pickDirectory() : Promise.resolve(null);
              },
              createWorkspace: function (path) {
                return workspaces.create({ path: path });
              },
              unarchiveSession: function (sessionId) {
                var service = ctx.get('uiWorkspace');
                if (!service) return;
                service.unarchiveSession(sessionId).catch(function (reason) {
                  console.warn('session unarchive rejected:', reason);
                });
              }
            };
          }
        }, SidebarOpencode);
      });
    }

    return { inject: inject, apply: apply };
  }
});
