---
title: Javascript中字符串与编码问题
date: 2022-02-24 21:19:04
category:
  - 深入理解Javascript
tags:
  - 编码
  - Unicode
  - 字符串
  - 正则表达式
---

# 编码问题

为了搞清楚 Javascript 中字符串与编码相关的问题和解决方案，我们首先需要了解字符编码的基本概念。[这篇文章](/2022/03/06/misc/encoding/)介绍了字符集（Character Set）、字符编码（Character Encoding）、码点（Code Point)、编码单元（Code Unit）等概念，以及 UCS2 和 UTF16 两种编码方案的内容与区别，最好先了解这些概念后再继续阅读本文。

Javascript 编码问题都要考虑以下这些情况的处理。

1. 中文、日文、英文等多语言支持问题
1. 字符的规范化问题，同一个字符可以单个码点表示，也可以使用单个码点加组合形式。
1. 有些字符只有码点组合形式，没有对应的规范化复合形式（Normalization Form Composition）。
1. 有些字符可以使用多个组合符号（Combining Mark）
1. 字符边界问题（Grapheme Cluster Boundaries）

# 源码的编码形式

[ECMAScript 规范](https://262.ecma-international.org/6.0/#sec-source-text)规定源码可以使用任何合法的码点（Code Point）序列，以码点序列作为输入进行处理，对于实际存储使用的编码方案无要求，只要能转换得到对应码点序列即可。

源码的 Unicode 码点序列中如果包括组合字符序列（combining character sequence），不会对其进行组合当成一个字符而是对每个码点当成一个字符处理。

Java 和 Javascript 对于源码中出现的 Unicode 转义序列处理方式不同，Java 会把转义序列替换为对应字符，然后做解析处理。因此换行符（LINE FEED）转义序列\u000A 会中断注释行和字符串。

```java
// 下面的代码相当于两行单行注释
// comment line \u000A // new line

// 字符串被换行符断开，这种写法语法错误，需要使用\n的形式在字符串中表示换行符
private String a = "before \u000A new line";
```

Javascript 不对 Unicode 转义序列进行预处理，转义序列是语法结构的一部分。字符串、正则表达式、模板字符串、标识符等语法结构中，可以使用 Unicode 转义序列（Unicode escape sequence）。

```
// 一行单行注释
// comment line \u000A // new line
// 合法字符串
const str = 'before \u000A new line'

// 变量名称是 sta
const st\u0061 = 'identifier name sta'
```

# 字符串

## 内部格式

规范 [The String Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type)规定了 Javascript 中的字符串的内部存储格式是顺序的 16 位编码单元序列，最多可以包含 2^53 - 1 个编码单元。

> The String type is the set of all ordered sequences of zero or more 16-bit unsigned integer values (“elements”) up to a maximum length of 2^53 - 1 elements.

编码单元序列可以表示整个 Unicode 的编码范围（0x0000 ~ 0x10FFFF），但是对代理对的处理跟 UCS2 和 UCS16 有区别。

UCS2 是 16 位定长编码，只能表示基本平面（0x0000 ~ 0xFFFF）内的字符，不能表示补充平面的字符。UTF16 是变长编码，使用一个编码单元表示基本平面内的字符，使用两个编码单元的代理对（Surrogate Pair）表示补充平面字符，但是不允许非法的代理对。

Javascript 中的编码相比于 UCS2 多了**代理对**的支持，相比于 UTF16 又允许**非法的代理对**，码点编码分为三种情况。

1. 不属于代理对的单个编码单元代表具有相同数值的码点，单个编码单元`\u0061`代表了英文字母`"a"`。
1. 合法的两个连续的编码单元，第一个是高代理对，第二个是低代理对，这两个合起来被认为是相应的码点。`'\uD83D\uDE00'`代表了字符`'😀'`（U+1F600 GRINNING FACE）。
1. 不在合法代理对形式中的单个代理对代表具有相同数值的码点，编码单元`'\uD800'`就代表码点`\u{D800}`，只不过这个码点在 Unicode 中没有对应的文字。

## 字符串字面量

[String Literal](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-literals-string-literals)规定了 Javascript 字符串字面量书写的语法形式。Javascript 中的字符串可以使用单引号或者双引号对，区别在于使用单引号时，字符串内部的单引号需要用转义形式`\'`，双引号同理需要使用`\"`。

Unicode 中基本平面内的字符或者`'😀'`等补充平面中的字符都可以直接书写，因为字符串内可以使用符合源码字符（[SourceCharacter](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#prod-SourceCharacter)）形式的任意字符，也就是除了单双引号、反斜杠、换行符之外的所有 Unicode 字符。

```js
let chinese = '中文'
let grinningFace = '😀'
```

另外可以使用多种形式的转义序列（EscapeSequence）来表示任意 Unicode 字符，关于 Javascript 中转义序列的细节可以参考[文章](https://mathiasbynens.be/notes/javascript-escapes)。

```js
// 单字符转义序列
let singleCharacterEscapeSequence = "'"
console.log(singleCharacterEscapeSequence) // => "'"

// 16进制转义序列
let hexadecimalEscapeSequence = '\x61'
console.log(hexadecimalEscapeSequence) // => "a"

// unicode转义序列
const unicodeEscapeSequence = 'My face \uD83D\uDE00'
console.log(str) // => 'My face 😀'

// ES6新增的unicode码点转义序列
const unicodeCodePointEscapeSequence = 'Funny cat \u{1F639}'
console.log(str) // => 'Funny cat 😹'
```

补充平面中的字符可以使用 Unicode 转义序列代理对的形式书写，也可以使用 Unicode 码点转义序列形式。

```js
const spNiceEmoticon = '\uD83D\uDE07'
console.log(spNiceEmoticon) // => '😇'

const niceEmoticon = '\u{1F607}'
console.log(niceEmoticon) // => '😇'

console.log(niceEmoticon === spNiceEmoticon) // => true
```

这两种形式表示的字符串是相同的，字面量会使用 [MV/SV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-sv) 的语意转换为**相同的**内部 16 位编码单元序列`'\uD83D\uDE07'`。

> When generating these String values Unicode code points are UTF-16 encoded as defined in 11.1.1.

## 相等性

由于 Javascript 内部使用 16 位编码单元序列表示字符串，所以两个字符串相等的含义是代表字符串的两个编码[单元序列完全一致](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluenonnumeric)，长度相同而且在相同下标的编码单元数值相同。

对于普通字符串来说这个含义符合我们的预期`'a' === '\u0061'`。

但是对于组合字符来说，同一个字符可以表为不同的码点序列。下面的例子中`str1`使用了规范化的组合形式（Normalization Form Composition）表示[单个字符](https://codepoints.net/U+00E7)`'ç'`，被保存为`'\u00E7'`；`str2`使用了组合的形式`'c\u0327'`，被保存为`\u0063\u0327`。字符相同，但是使用的编码单元序列不同，因此这两个字符不相等。

```js
const str1 = 'ça va bien'
console.log(str1) // => 'ça va bien'

const str2 = 'c\u0327a va bien'
console.log(str2) // => 'ça va bien'

console.log(str1 === str2) // => false
```

## 字符串长度

字符串的长度（[length](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-string-instances-length)）是 16 位编码单元的个数，但是有些额外情况导致长度返回值和直观预期可能并不一致，参考文章[1](https://mathiasbynens.be/notes/javascript-unicode#counting-symbols), [2](https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#33-string-length)。

### 基本情况

对于基本平面中的字符，编码单元的个数就是字符的个数。

```js
'abc'.length // => 3

// U+554A
'啊'.length // => 1
```

### 补充平面字符

对于补充平面中的字符来说，一个字符需要两个编码单元表示，为了获得预期的字符个数，需要将表示一个代理对的两个编码单元当成一个字符处理。可以使用[string's iterator](https://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols)来获得字符串的码点序列，然后返回码点序列的码点个数。

```js
function countSymbols(string) {
  return Array.from(string).length
}

function countSymbols(string) {
  return [...string].length
}
```

为了获得码点序列长度遍历了字符串的所有码点会造成浪费，只需要字符串长度的话，可以使用 [punycode](https://github.com/mathiasbynens/punycode.js) 库。

```js
function countSymbols(string) {
  return punycode.ucs2.decode(string).length
}
```

```js
function countSymbols(string) {
  return punycode.ucs2.decode(string).length
}
```

当然也可以选择自行实现代理对处理的逻辑来获得正确的码点个数。

### 组合字符

对于组合字符不同编码形式使用的编码单元个数不同，因此字符串长度也不相同。

```js
const str1 = 'ça va bien'
console.log(str1) // => 'ça va bien'
console.log(str1.length) // => 10

const str2 = 'c\u0327a va bien'
console.log(str2) // => 'ça va bien'
console.log(str2.length) // => 11
```

如果想获得码点的个数，可以将字符串进行规范化（Normalization Form Composition），使用统一的编码形式。

```js
const str1 = 'ça va bien'
console.log(str1) // => 'ça va bien'
console.log(str1.normalize().length) // => 10

const str2 = 'c\u0327a va bien'
console.log(str2) // => 'ça va bien'
console.log(str2.normalize().length) // => 10
```

但不是所有的组合字符序列代表的单个字符都有对应的经典形式（Canonical Form），例如字符`'ȩ́'`包含了一个基础字符`'e'`和两个组合字符（Combining Mark）`\u0327\u0301`，规范化的结果只能表示为`'ȩ\u0301'`，所以规范化后的字符串长度是 5。

```js
// 包含4个字符
const drink = 'cafe\u0327\u0301'
console.log(drink) // => 'cafȩ́'
console.log(drink.length) // => 6
console.log(drink.normalize()) // => 'cafȩ́'
console.log(drink.normalize().length) // => 5
```

考虑补充平面字符和组合字符同时存在的情况，可以先进行规范化，然后获取码点个数作为字符串长度。

```js
function countSymbolsPedantically(string) {
  // Unicode Normalization, NFC form, to account for lookalikes:
  var normalized = string.normalize('NFC')
  // Account for astral symbols / surrogates, just like we did before:
  return punycode.ucs2.decode(normalized).length
}
```

更夸张的情况是泰文中可以使用任意个数的组合字符，出现比较奇葩的效果。

```js
// 看着是6个字符，但是每个字符都包含很多个组合字符。



>> countSymbolsPedantically('Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞')
74 // not 6
```

这种情况可以通过利用正则表达式将组合字符去掉，只保留基础字符来获取正确的字符个数。

```js
// Note: replace the following regular expression with its transpiled equivalent
// to make it work in old environments. https://mths.be/bwm
var regexSymbolWithCombiningMarks = /(\P{Mark})(\p{Mark}+)/gu

function countSymbolsIgnoringCombiningMarks(string) {
  // Remove any combining marks, leaving only the symbols they belong to:
  var stripped = string.replace(
    regexSymbolWithCombiningMarks,
    function ($0, symbol, combiningMarks) {
      return symbol
    }
  )
  // Account for astral symbols / surrogates, just like we did before:
  return punycode.ucs2.decode(stripped).length
}
```

### 字符边界

Unicode 中除了上面的组合字符的情况，还有多个独立字符可以共同合成一个字符的情况。

韩文 நி (ந + ி)和 깍 (ᄁ + ᅡ + ᆨ)。

颜文字 👨‍👩‍👧‍👦 (👨 + U+200D ZERO WIDTH JOINER + 👩 + U+200D ZERO WIDTH JOINER + 👧 + U+200D ZERO WIDTH JOINER + 👦)。

可以参考 UAX 中关于[字符边界的算法](http://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries)，规定了码点序列中到底哪些字符合起来构成一个字形（Grapheme），这个概念才真正对应常规意义上的单个字符。

## String.prototype 对象方法

### charAt & charCodeAt & fromCharCode

`chartCodeAt`方法获取字符串指定下标的编码单元，返回结果是数字；`charAt`方法获取字符串在指定下标的编码单元对应的字符，返回结果是字符串。这两个方法查询的下标对应基本平面内字符时结果正确，对应代理对时结果将代理对拆分，单个处理。

```js
'💩'.charCodeAt(0) // \uD83D
'💩'.charAt(0) // \uD83D 没有对应字符渲染为 '�'

'💩'.charCodeAt(1) // \uDCA9
'💩'.charAt(1) // \uDCA9 \uD83D 没有对应字符渲染为 '�'
```

[`fromCharCode`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.fromcharcode)从给定编码单元数值创建对应字符，超过 0xFFFF 的数值会被截断。

```js
>> String.fromCharCode(0x0041) // U+0041
'A' // U+0041

>> String.fromCharCode(0x1F4A9) // U+1F4A9
'' // U+F4A9, not U+1F4A9
```

### at & codePointAt & fromCodePoint

[`codePointAt`](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-codepointat)获取字符串指定下标位置的码点，如果下标位置开始是个合法代理对，返回代理对代表的码点，否则返回下标所在单个编码单元值对应的码点，返回结果是数字类型；`at`处理相同，返回结果是字符串类型（ES7 规范内容）。

```js
'💩'.at(0) // U+1F4A9
'💩'.codePointAt(0) // U+1F4A9
```

[`String.fromCodePoint`](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.fromcodepoint)从给点的码点序列创建字符串，如果码点序列不是整数或者超出了 Unicode 码点范围 0x10FFFF 会抛出`RangeError`。

```js
String.fromCodePoint(0x1f4a9) // '💩'
```

### normalize

使用`normalize`[方法](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.normalize)对字符串进行规范化，有四个选项。

'NFC' as Normalization Form Canonical Composition
'NFD' as Normalization Form Canonical Decomposition
'NFKC' as Normalization Form Compatibility Composition
'NFKD' as Normalization Form Compatibility Decomposition

```js
const str1 = 'ça va bien'
const str2 = 'c\u0327a va bien'
console.log(str1.normalize() === str2.normalize()) // => true
console.log(str1 === str2)
```

规范化的过程参考[Unicode® Standard Annex #15 UNICODE NORMALIZATION FORMS](https://unicode.org/reports/tr15/)

### 遍历字符串码点

字符串存储为 16 位编码单元，所以遍历字符串编码单元非常简单。遍历字符串内的**码点序列**需要处理代理对，可以手动实现这个逻辑。

```js
function getSymbols(string) {
  var index = 0
  var length = string.length
  var output = []
  for (; index < length; ++index) {
    var charCode = string.charCodeAt(index)
    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      charCode = string.charCodeAt(index + 1)
      if (charCode >= 0xdc00 && charCode <= 0xdfff) {
        output.push(string.slice(index, index + 2))
        ++index
        continue
      }
    }
    output.push(string.charAt(index))
  }
  return output
}

var symbols = getSymbols('💩')
symbols.forEach(function (symbol) {
  assert(symbol == '💩')
})
```

也可以利用 String 类型的[迭代器协议](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype-@@iterator)，[字符串迭代器对象](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-iterator-objects)返回字符串的码点序列，每个码点以**字符串**形式返回。

```js
let string = '\ud83d\udc0e\ud83d\udc71\u2764'

// for-of循环利用了迭代器协议
for (let codePoint of string) {
  console.log(codePoint.codePointAt(0).toString(16))
}
// '1f40e', '1f471', '2764'

Array.from(string)

// 内部使用了迭代器协议
Array.prototype.forEach.call((codePoint) => {
  console.log(codePoint)
})

Array.prototype.map.call((codePoint) => {
  console.log(codePoint)
})
```

### 大小写处理

locale 相关操作 localeCompare/toLocaleLowerCase/toLocaleUpperCase

大小写转换处理 toLowerCase / toUpperCase

### String.prototype 的其他 API

全局字符串对象原型`String.prototype`上的[其他操作](https://tc39.es/ecma262/multipage/text-processing.html#sec-properties-of-the-string-prototype-object)也都是对 16 位编码单元序列进行处理的，也会因为补充平面字符、组合字符、字符边界等情况出现与预期不一致的结果，在使用时需要注意。

## 形式转换

字符串的处理需要在 16 位编码单元序列和码点序列两个形式之间进行转换，[规范](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-source-text)中使用了以下抽象操作描述正反向的转换过程。

码点序列转换为 16 位编码单元序列，`CodePointsToString(codePoints)`将的码点序列`codePoints`转换为 16 位编码单元序列，内部调用`UTF16EncodeCodePoint(cp)`将单个码点`cp`转换为 16 位编码单元代表的字符串。

16 位编码单元序列转换为码点序列，`StringToCodePoints(string)`将`string`转换为对应的码点序列，内部调用`CodePointAt(string, position)`获取位置`position`对应的码点，再嵌套调用 `UTF16SurrogatePairToCodePoint(lead, trail)`将内部的 16 位编码单元序列中代理对转换为对应码点，返回数字类型。

## 反转字符串

基本平面中的非组合字符反转字符串非常简单。

```js
function reverseString(str) {
  return str.split('').reverse().join('')
}
```

补充平面中的字符需要先获得码点序列再进行反转操作。

```js
function reverseString(str) {
  return [...str].reverse().join('')
}
```

但是对于组合字符的情况，位置反转会造成组合字符对应的基础字符不同，所以反转结果与预期不一致。

```js
// 反转前修饰字符n，反转后修饰字符a
;[...'mañana'].reverse().join('') // "anãnam"
```

[综合考虑以上情况](https://mathiasbynens.be/notes/javascript-unicode#counting-symbols#reversing-strings)，可以使用[esrever](https://github.com/mathiasbynens/esrever)库来处理代理对、组合字符串等问题。

```js
esrever.reverse('mañana') // 'anañam'

esrever.reverse('💩') // '💩' U+1F4A9
```

## String.raw

[String.raw](https://mothereff.in/js-escapes#1%F0%9D%8C%86)是模板字符串标签函数，用来保留模板字符串中的转义序列。

```js
// \n 表示换行符
;`Hi\n${2 + 3}!`

// \n 表示反斜杠\和字符n，而不是换行符
String.raw`Hi\n${2 + 3}!`
```

## 子串匹配操作

抽象操作[StringIndexOf](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-stringindexof)定义了子串匹配的过程。

## 静态语义 MV / SV

字符串的 [MV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-string-literals-static-semantics-mv) 语义从字符串字面量获得对应 16 位编码序列代表的整数值。

字符串的 [SV](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-static-semantics-sv) 语义从字符串字面量获得对应的 16 位编码序列。

# 正则表达式

正则表达式也默认使用 16 位编码单元处理字符匹配，因此在处理补充平面字符时可能出现与预期不一致的情况。

## 字符个数匹配

点号（.）在正则表达式中匹配单个字符，但是对于表示成代理对的补充平面字符无法匹配。

```js
const smile = '😀'
const regex = /^.$/
console.log(regex.test(smile)) // => false
```

为了匹配 16 位编码单元序列代表的所有合法 Unicode 字符串序列，可以编写特定模式进行匹配，将 Unicode 码点分为四类。

1. 基本平面中不属于代理对的字符 `/[\0-\uD7FF\uE000-\uFFFF]`
1. 两个 16 位编码单元的代理对 `/[\uD800-\uDBFF][\uDC00-\uDFFF]/`
1. 不属于代理对的单个高代理（lead surrogate）编码单元 `/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/`
1. 不属于代理对的单个低代理（trail surrogate）编码单元 `/(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/`

将这四种情况组合起来就能匹配所有 Unicode 字符。

```js
;/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/.test(
  '💩'
) // wtf
```

使用[regenerate](https://mths.be/regenerate)库可以方便的生成匹配指定 Unicode 码点范围的正则表达式。

```js
regenerate().addRange(0x0, 0x10ffff).toString()
```

使用 ES6 新增的正则表达式标志 u 开启 Unicode 支持，也可以解决点号匹配的问题。

```js
const smile = '😀'
const regex = /^.$/u
console.log(regex.test(smile)) // => true
```

## 字符范围匹配

在正则表达式范围匹配形式中直接使用补充平面字符会报错。

```js
;/[💩-💫]/
// => SyntaxError: Invalid regular expression: /[💩-💫]/:
// Range out of order in character class
```

因为上面的形式相当于

```js
;/[\uD83D\uDCA9-\uD83D\uDCAB]/
```

中间的范围是一个开始值比结束值大的非法范围。同样可以使用 u 标志开启对 Unicode 字符的支持。

```js
>> /[\uD83D\uDCA9-\uD83D\uDCAB]/u.test('\uD83D\uDCA9') // match U+1F4A9

>> /[\u{1F4A9}-\u{1F4AB}]/u.test('\u{1F4AA}') // match U+1F4AA
true

>> /[💩-💫]/u.test('💪') // match U+1F4AA
```

如果需要在 ES5 等环境中进行兼容处理，同样可以使用 regenerate 库生成相应 Unicode 字符匹配形式。

## 组合字符

正则表达式的 Unicode 支持标志 u 无法处理组合字符（Combining Mark），因为即使开启了 Unicode 支持，也是以单个码点作为字符进行匹配，组合字符的形式是由多个码点组成的，这种情况下只能通过将基础字符（base character）和组合字符（Combining Mark）分开书写为模式进行匹配。

```js
const drink = 'cafe\u0301'
const regex1 = /^.{4}$/
const regex2 = /^.{5}$/
console.log(drink) // => 'café'
console.log(regex1.test(drink)) // => false
console.log(regex2.test(drink)) // => true
```

上面例子中`drink`代表的字符包含五个码点。

# 参考资料

对 Javascript 中字符串与编码问题可以阅读以下内容。

1. [What every JavaScript developer should know about Unicode](https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/)
1. [JavaScript 与 Unicode](https://cjting.me/2018/07/22/js-and-unicode/)
1. 《Effective Javascript》 Item 7 Think of Strings As Sequences of 16-bit Code Units
1. 《Understanding ECMAScript 6》Chapter 2 String and Regular Expressions
   ECMAScript 规范中与字符串相关的内容。

更深入细致的介绍可以参考 Mathias Bynens 的系列博客。

字符串编码系列

1. [JavaScript has a Unicode problem](https://mathiasbynens.be/notes/javascript-unicode)
1. [JavaScript character escape sequences](https://mathiasbynens.be/notes/javascript-escapes)
1. [JavaScript’s internal character encoding: UCS-2 or UTF-16? ](https://mathiasbynens.be/notes/javascript-encoding)

正则表达式系列

1. [ECMAScript regular expressions are getting better!](https://mathiasbynens.be/notes/es-regexp-proposals)
1. [Unicode property escapes in JavaScript regular expressions](https://mathiasbynens.be/notes/es-unicode-property-escapes)
1. [Unicode-aware regular expressions in ES2015](https://mathiasbynens.be/notes/es6-unicode-regex)

最后对于具体的细节可以参考 ECMAScript 规范中涉及到字符串与编码的相关内容。

1. [Source Text](https://262.ecma-international.org/6.0/#sec-source-text) [ES2022](https://tc39.es/ecma262/multipage/ecmascript-language-source-code.html#sec-ecmascript-language-source-code)
1. [ECMAScript Language: Lexical Grammar String Literals](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-ecmascript-language-lexical-grammar-literals)
1. [ECMAScript Data Types and Values The String Type](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-string-type)
1. [Text Process String Objects](https://tc39.es/ecma262/multipage/text-processing.html#sec-string-objects)
