# Encoding

## [Base64](https://en.wikipedia.org/wiki/Base64)

> **Base64** is a group of similar binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation

**Base64** encode binary data in a unit of 3 bytes, also 24 bits. If number of bytes is indivisible by 3, add extra bytes with value zero so there're 3 bytes.

Encoding 3 bytes "Man".

<table style='border: 1px solid;'>
    <tr>
        <td style='border: 1px solid;'>source ASCII</td>
        <td style='border: 1px solid;' colspan='8' align='center'>M</td>
        <td style='border: 1px solid;' colspan='8' align='center'>a</td>
        <td style='border: 1px solid;' colspan='8' align='center'>n</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>source octets</td>
        <td style='border: 1px solid;' colspan='8' align='center'>77 (0x4d)</td>
        <td style='border: 1px solid;' colspan='8' align='center'>97 (0x61)</td>
        <td style='border: 1px solid;' colspan='8' align='center'>110 (0x6e)</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Bit pattern</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Table Index</td>
        <td style='border: 1px solid;' colspan='6' align='center'>19</td>
        <td style='border: 1px solid;' colspan='6' align='center'>22</td>
        <td style='border: 1px solid;' colspan='6' align='center'>5</td>
        <td style='border: 1px solid;' colspan='6' align='center'>46</td>
    </tr>
    <tr>
        <td>Encoded Char</td>
        <td style='border: 1px solid;' colspan='6' align='center'>T</td>
        <td style='border: 1px solid;' colspan='6' align='center'>W</td>
        <td style='border: 1px solid;' colspan='6' align='center'>F</td>
        <td style='border: 1px solid;' colspan='6' align='center'>u</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Encoded octets</td>
        <td style='border: 1px solid;' colspan='6' align='center'>84 (0x54)</td>
        <td colspan='6' align='center'>87 (0x57)</td>
        <td style='border: 1px solid;' colspan='6' align='center'>70 (0x46)</td>
        <td colspan='6' align='center'>117 (0x75)</td>
    </tr>
</table>

Encoding 2 bytes "Ma", last 6 bits are padding bits, encoded as "=".

<table style='border: 1px solid;'>
    <tr>
        <td style='border: 1px solid;'>source ASCII</td>
        <td style='border: 1px solid;' colspan='8' align='center'>M</td>
        <td style='border: 1px solid;' colspan='8' align='center'>a</td>
        <td style='border: 1px solid;' colspan='8' align='center'></td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>source octets</td>
        <td style='border: 1px solid;' colspan='8' align='center'>77 (0x4d)</td>
        <td style='border: 1px solid;' colspan='8' align='center'>97 (0x61)</td>
        <td style='border: 1px solid;' colspan='8' align='center'>0 (0x00)</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Bit pattern</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Table Index</td>
        <td style='border: 1px solid;' colspan='6' align='center'>19</td>
        <td style='border: 1px solid;' colspan='6' align='center'>22</td>
        <td style='border: 1px solid;' colspan='6' align='center'>4</td>
        <td style='border: 1px solid;' colspan='6' align='center'>0</td>
    </tr>
    <tr>
        <td>Encoded Char</td>
        <td style='border: 1px solid;' colspan='6' align='center'>T</td>
        <td style='border: 1px solid;' colspan='6' align='center'>W</td>
        <td style='border: 1px solid;' colspan='6' align='center'>E</td>
        <td style='border: 1px solid;' colspan='6' align='center'>=</td>
    </tr>
</table>

Encoding 1 byte "M", last 12 bits are padding bits, encoded as "==".

<table style='border: 1px solid;'>
    <tr>
        <td style='border: 1px solid;'>source ASCII</td>
        <td style='border: 1px solid;' colspan='8' align='center'>M</td>
        <td style='border: 1px solid;' colspan='8' align='center'></td>
        <td style='border: 1px solid;' colspan='8' align='center'></td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>source octets</td>
        <td style='border: 1px solid;' colspan='8' align='center'>77 (0x4d)</td>
        <td style='border: 1px solid;' colspan='8' align='center'>0 (0x00)</td>
        <td style='border: 1px solid;' colspan='8' align='center'>0 (0x00)</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Bit pattern</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>1</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
        <td style='border: 1px solid;'>0</td>
    </tr>
    <tr>
        <td style='border: 1px solid;'>Table Index</td>
        <td style='border: 1px solid;' colspan='6' align='center'>19</td>
        <td style='border: 1px solid;' colspan='6' align='center'>16</td>
        <td style='border: 1px solid;' colspan='6' align='center'>0</td>
        <td style='border: 1px solid;' colspan='6' align='center'>0</td>
    </tr>
    <tr>
        <td>Encoded Char</td>
        <td style='border: 1px solid;' colspan='6' align='center'>T</td>
        <td style='border: 1px solid;' colspan='6' align='center'>Q</td>
        <td style='border: 1px solid;' colspan='6' align='center'>=</td>
        <td style='border: 1px solid;' colspan='6' align='center'>=</td>
    </tr>
</table>

Base64 index table is used to encode 6 bits as ASCII character.

| Value | Char | Value | Char | Value | Char | Value | Char
| - | - | - | - | - | - | - | - |
| 0 | A | 16 | Q | 32 | g | 48 | w |
| 1 | B | 17 | R | 33 | h | 49 | x |
| 2 | C | 18 | S | 34 | i | 50 | y |
| 3 | D | 19 | T | 35 | j | 51 | z |
| 4 | E | 20 | U | 36 | k | 52 | 0 |
| 5 | F | 21 | V | 37 | l | 53 | 1 |
| 6 | G | 22 | W | 38 | m | 54 | 2 |
| 7 | H | 23 | X | 39 | n | 55 | 3 |
| 8 | I | 24 | Y | 40 | o | 56 | 4 |
| 9 | J | 25 | Z | 41 | p | 57 | 5 |
| 10 | K | 26 | a | 42 | q | 58 | 6 |
| 11 | L | 27 | b | 43 | r | 59 | 7 |
| 12 | M | 28 | c | 44 | s | 60 | 8 |
| 13 | N | 29 | d | 45 | t | 61 | 9 |
| 14 | O | 30 | e | 46 | u | 62 | + |
| 15 | P | 31 | f | 47 | v | 63 | / |

Algorithm for Encoding and Decoding