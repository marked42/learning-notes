# Javascript 中什么是合法变量名？

### 标识符名称（IdentifierName）

[名称与关键字](https://262.ecma-international.org/6.0/#sec-names-and-keywords)

1. 标识符名称 IdentifierName 形式包含 标识符（Identifier）和 保留字（ReservedWord）

Javascript 中合法的变量名称，分词被称为标识符（Identifier），标识符由数字、字母、下划线等组成。

合法标识符的形式

1. 标识符名称合法形式
   1. 开头的字符允许是 UnicodeIDStart/'$'/'\_'/\UnicodeEscapeSequence
   1. 后续字符允许是 UnicodeIDContinue/'$'/'\_'/\UnicodeEscapeSequence/ZWNJ/ZWJ

```ts
var a = 1
var $a = 1
// UnicodeIDStart
var 啊 = 1;
var \
```

[UnicodeEscapeSequence](https://262.ecma-international.org/6.0/#sec-literals-string-literals)

@babel/helper-validator-identifier

```ts
export function isIdentifierName(name: string): boolean {
  let isFirst = true
  // iterable protocol返回的是code point序列
  for (const char of Array.from(name)) {
    const cp = char.codePointAt(0)
    if (isFirst) {
      if (!isIdentifierStart(cp)) {
        return false
      }
      isFirst = false
    } else if (!isIdentifierChar(cp)) {
      return false
    }
  }
  // isFirst理解为状态机，包含了空串、单个字符、多个字符情况
  return !isFirst
}
```

#### StringValue 语意

Javascript 中对于标识符名称的处理都是基于 StringValue 语意，也就是码点序列。

> All interpretations of IdentifierName within this specification are based upon their actual code points regardless of whether or not an escape sequence was used to contribute any particular code point.

Unicode 中代表相同字符（canonically equivalent）的标识符名称并不一定等价，除非其使用的码点序列相同。

> Two IdentifierName that are canonically equivalent according to the Unicode standard are not equal unless, after replacement of each UnicodeEscapeSequence, they are represented by the exact same sequence of code points.

[查询字符 Unicode 码点](https://unicode-table.com/cn/search)
[Unicode ](https://home.unicode.org/)转义字符代表的码点必须是对应形式中合法的字符，否则属于语法错误。

静态语意 StringValue 等于标识符名称表示的码点序列，所以多个不同的标识符名称可以有相同的 StringValue

1. Javascript 源码可以是任何编码
1. Javascript 中字符串使用的是 UTF16 编码

#### 错误形式

### 标识符与保留字（Identifier & ReservedWord）

[保留字](https://262.ecma-international.org/6.0/#sec-reserved-words)

1. identifier
1. reserved word

保留字包括

1. 关键字（Keyword）
1. 未来保留字（FutureReservedWord） enum/await

await 关键字模块下激活

严格模式下激活

```ts
public
private
protected
interface
package
implements

let static

// TODO: 什么时候激活为关键字
yield

// TODO: 什么是strictBinding
eval / arguments
```

NullLiteral/BooleanLiteral 在规范中也属于保留字，但是分词阶段单独处理，直接解析为 NullLiteral 和 BooleanLiteral 类型的单词（Token），不会跟标识符类型（Identifier）冲突。

这里 NaN/Infinity/undefined 是 identifier，

#### ES3

相比于 ES6 有更多的保留字
