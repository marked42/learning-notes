# jsjs

a javascript compiler in javascript

[test262 parser test](https://github.com/tc39/test262-parser-tests)

## 源代码

Javascript 代码是 Unicode Point 的字符流 U+0000 ~ U+10FFFF，底层用什么编码储存字符是实现细节，规范并不关心。

对于多个连续 Code Point 结合在一起表示的组合字符（combining character），处理源码时接受到的输入时单个的 Code Point，而不是一个结合字符。

在字符串字面量、正则表达式字面量、模板字符串字面量和标识符中，可以包含任何使用 Unicode 转义字符串表示的 Code Point

注释中 Unicode 转义字符串被忽略，不认为其代表了对应的 Code Point，而是

```js
// 下面注释的内容是字符串 'test \\n'
// 不是 'test \n'
// test \n
```

换行符 Line Terminator

### 源码类型

1. global code
1. eval code
1. function code
1. module code

### 严格模式

这是个递归的定义

1. 全局代码包含 'use strict'
1. 模块代码
1. ClassDeclaration/Class Expression
1. eval 处于严格模式中或者执行语句包含'use strict' eval('use strict; ...') `use strict; eval('...')`
1. 函数代码处于严格模式中，如果对应的 FunctionDeclaration/FunctionExpression/GeneratorDeclaration/GeneratorExpression/MethodDefinition/ArrowFunction 在严格模式中或者其代码包含了`use strict';
1. new Function('a', 'b', 'use strict;a + b;')
   new GeneratorFunction('a', 'b', 'use strict;yield a + b;')

## 词法

goal symbol

1. InputElementRegExpOrTemplateTail 接受 RegularExpressionLiteral/TemplateMiddle/TemplateTail
1. InputElementRegExp 接受 RegularExpressionLiteral
1. InputElementTemplateTail 接受 TemplateMiddle/TemplateTail
1. InputElementDiv

InputElementDiv :: WhiteSpace
LineTerminator Comment CommonToken DivPunctuator RightBracePunctuator

InputElementRegExp :: WhiteSpace
LineTerminator Comment
CommonToken RightBracePunctuator RegularExpressionLiteral

InputElementRegExpOrTemplateTail :: WhiteSpace
LineTerminator Comment
CommonToken RegularExpressionLiteral TemplateSubstitutionTail

InputElementTemplateTail :: WhiteSpace

11.1
LineTerminator Comment CommonToken DivPunctuator TemplateSubstitutionTail

### 空白 WhiteSpace

U+0009 Tab
U+000B Vertical Tab
U+000C Form Feed
U+0020 Space
U+00A0 No Break Space
U+FEFF Zero Width No Break Space
Other Category Z's Unicode Separator Space Code Point

Unicode 中有 White_Space 属性但是不在 Category Z 中字符被认为不属于 WhiteSpace 分类

### 换行符 Line Terminator

U+000A Line Separator
U+000D Carriage Return
U+2028 Line Separator
U+2029 Paragraph Separator

其他的 Unicode 换行（New Line）或者断行（Line Breaking）符被当做空白符而不是 Line Terminator

其他语言中的换行符划分到空白符中，不做区分，但是 Javascript 中由于可以省略分号，Auto Semi Colon Insertion 会根据两个 Token 之间有没有换行符考虑应该在哪里插入，所以换行符单独划分出来。多行文本注释中如果包含换行符，具有同样的效果。

### Comment 注释

Single Line Comment

单行注释可以在'//'之后可以包含除了 Line Terminator 之外的任何字符，而且 Line Terminator 本身不属于单行注释的内容，这样
单行注释添加或者移除时不影响 Automatic Semicolon Insertion。

注释中 Unicode 转义字符串被忽略，不认为其代表了对应的 Code Point，而是

```js
// 下面注释的内容是字符串 'test \\n'
// 不是 'test \n'
// test \n
```

Single Line Comment，'//'之后跟零个或者多个非 Line Terminator 的任意 Unicode 字符

多行注释 Multi Line Comment

多行注释不能嵌套，所以一旦出现连续的'\*/'多行注释就结束了。多行注释可以中间可以包含任意的 Unicode 字符，如果多行注释中包含
Line Terminator，那个多行注释 Token 本身在语法解析时被认为起到 Line Terminator 换行的作用

### 标识符 Identifier

标识符中允许的字符包括 Unicode 标准 Annex #31 项 Identifier and Pattern Syntax 中规定的 Default Identifier Syntax Code Point。

另外支持的四个字符

```
// $ _ 任意位置
$
_

// U+200C Zero Width Joiner U+200D Zero Width Non-Joiner 可出现在第一个字符之后的位置
a<zwj>
a<zwnj>
```

Unicode 标识符名称字符属性 ID_Start ID_Continue

标识符名称支持 unicode 转义序列，可以在任意位置使用转移序列标识 Unicode 字符

```
\u{000a}$test
中文$test
```

Early Error 转义序列代表的字符必须满足要求，否则报错

1. 在第一个字符的转义序列，Code Point 要对应 $ \_ 或者 Unicode ID_Start
1. 其他位置的转义序列，Code Point 要对应 $ \_ <zwnj> <zwj> 或者 Unicode ID_Continue

标识符名称的字符串

### 保留字 Reserved Keyword

具体列表参考规范

1. yield 在某些情况下被认为是标识符
1. 严格模式下 let/static 被认为是保留字
1. goal symbol 是 module 时 await 被认为是保留字
1. 严格模式下 implements package protected interface private public 是保留字

### 标点符号 Punctuator

1. 普通符号 ...
1. 除号 DivPunctuator / /=
1. RightBracePunctuator }

### 字面量

#### 布尔字面量

true false

#### null 字面量 null

undefined 不是字面量，而是标识符

```js
undefined = 1
```

#### 数字字面量

整数

```js
// 二进制，0b或者0B开头，后面跟至少一位二进制字符[0|1]
0b10
0b01
// 八进制，0o或者0O开头，后面至少跟一位八进制字符[0-7]
0[o|O][OctalDigit]+
// 十六进制
0x[HexDigit]+
0X[HexDigit]+
```

注意整数只有非负数的形式，所以`1`是个 Numeric Literal，`-1`是 Unary Expression。

浮点数

画出状态机

```
// 整数部分和小数部分（点号加后面数字部分）至少有一个
.2
1e10
1.
1.00
1.2

0
10

0.0;
00.0; // 非法，0只能有1个
10.0;

// e/E后面至少一个
1.e1
1.E1
1.e-10
1.E-10
1.e+10
1.E+10
```

数字字面量结尾不能跟 IdentifierStart or DecimalDigit.

```js
// 错误例子，因为0-9 a-fA-F可能出现在合法数字中，为了防止误写，所以要求非数字、字符的字符做数字与其他token的分隔
3in // Identifier directly after number (1:4)
0b012 // 2不能出现二进制整数中
0b01a // Identifier directly after number (1:4)
0o078  // 8不能出现在八进制整数中
0o07a // Identifier directly after number (1:4)
0x0fg // Identifier directly after number (1:4)
```

#### 字符串字面量

```js
'\''
'\\'
'\b'
'\f'
'\n'
'\r'
'\t'
'\v'
'\"' // 正确

// 数字转义字符 '\[0-9]+' 数字形式转义，只有\0允许
'\0' // 正确 唯一允许的 numeric escape sequence
'\1' // 错误
'\01' // 错误
'\0a' // 正确

// 十六进制 '\x[hex][hex] 必须两位16进制
'\x00'

// 十六进制 unicode \u[hex]{4} 必须4位16进制
'\u0000'

// 十六进制 unicode \u{hex}+ 必须满足unicode
'\u{0000}'


'\u{aaaaaa}' // // code point out of bound
'\u{gggg}' // Bad character escape sequence (1:12)
```

字符串中换行符的两个效果

1. 包含换行字符本身，使用`\n`转义
1. 换行效果 使用'\<换行符>'转义

```cpp
'\g' === 'g' // 非转义  0-9 x u " ' \ b f n r t v

'\<lf>' // 转义 line continuation
'\<cr>' // 转义 line continuation
'\<ls>' // 转义 line continuation
'\<ps>' // 转义 line continuation

'"' // 正确
```

对比

```cpp
'\a' === 'a' // a在''中不需要转义，所以前边的转义字符被忽略
'\"' === '"' // 同上，"在''不需要转义
"\'" === ''' // 同上，'在""不需要转义

'\'' === '\'' // '在''中需要转义，转义成功
"\'" === '\"' // "在""中需要转义，转义成功
```

为什么'\a' === 'a' 而 '\"' === '

#### 正则表达式字面量

运行时每个正则表达式字面量相当于一个独立的 RegExp 对象，两个一模一样的正则字面量对应的 RegExp 不是同一个实例

```text
/ RegularExpressionBody / RegularExpressionFlags
```

1. RegularExpressionBody 正则表达式可能与与单行或者多行注释冲突问题 '//' '/\*'
1. RegularExpressionBody 正则表达式不能包含换行符
1. 对于() [] {} 的处理
1. 转义序列的处理 '\'

```txt
\L是无效的转义序列，相当于/L/
/\L/
```

1. RegularExpressionBody 结束符号的处理 /
1. RegularExpressionBody 支持 []
1. '//' 被认为是单行注释，空正则表达式使用 /(?:)/

https://zhuanlan.zhihu.com/p/138919691
https://www.zhihu.com/column/chendabing
https://stackoverflow.com/questions/45722082/what-does-inputelementdiv-stand-for-in-ecmascript-lexical-grammar#:~:text=The%20InputElementRegExpOrTemplateTail%20goal%20is%20used%20in%20syntactic%20grammar,neither%20a%20TemplateMiddle%2C%20nor%20a%20TemplateTail%20is%20permitted.

```
/[/]/.test("/")
```

https://esprima.readthedocs.io/en/latest/lexical-analysis.html

1. Jest Config Test Typescript VSCode
   Token 体系的设计，

类继承体系能

够表达树形的类型关系，
构造方便

序列化时需要转换为 type 字段标识节点类型。

识别 Token

注意可能存在接受空字符进行状态转换，例如空字符串。

Token 有 raw 原始字符串，rawValue 原始值，value 在解析的过程中需要计算。

两种状态转换的操作

1. match 下一个字符必须等于指定字符，否则抛错
1. 有些匹配模式要求下一个字符满足要求，不满足直接抛错。
1. 多条并列的规则最好设计成匹配不同模式的字符串，互相之间能够区分。
1. peek 首先检查下一个字符是否满足条件，不满足的话尝试其他可能性。
1. 考虑非法状态，接受了不允许的输入结束，直接抛出给出合适的错误信息。解析 token 时首先考虑画出状态机。
1. 尽量匹配最长的输入，所以当前规则不满足的时候应该回溯到上一个最长的匹配。
1. 输入耗尽 EOF 的处理

1. 几种匹配模式对应不同的代码
   1. 顺序 If 嵌套 if
   1. 选择 if else if
   1. 零个或者多个 while 循环
   1. 一个或者多个 '+' 保证至少有一个
   1. 是否存在 '?' if 判断
   1. 取反 if 加 条件取反

从 text 计算 Token 的值

1. number 类型处理 0x 0o 0b 等不同进制
1. string 类型处理自定义转义字符串。

Regular Expression

1. unicode property name
   https://tc39.es/ecma262/#table-binary-unicode-properties
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes

JSON compatible string
jsesc
punycode

https://mothereff.in/js-escapes#1%F0%9D%8C%86
