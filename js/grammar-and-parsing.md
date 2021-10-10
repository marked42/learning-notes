# 语法与解析

ECMAScript 源码的形式是 Unicode 码点流，对程序文本具体编码没有固定。

规范描述了四种语法

1. 词法（Lexical Grammar）描述了 Unicode 码点流如何组成单词（Token）。
1. 语法（syntactic grammar）描述了结构正确的程序由单词组成的形式。
1. 正则表达式语法（RegExp grammar）描述了 Unicode 码点如何转换成正咋表达式。
1. 表示数字的字符串语法（numeric grammar）描述了字符串如何转换成数字值。

## 词法解析

goal symbol 用来区分存在歧义的词法。

1. InputElementDiv '/' 是 DivPunctuator
1. InputElementRegExp '/' 是 RegularExpressionLiteral
1. InputElementRegExprOrTemplateTail TemplateMiddle TemplateTail RegularExpressionLiteral
1. InputElementTemplateTail TemplateMiddle TemplateTail

## 语法解析

使用了上下文无关文法

### 兼容性处理

```js
function old() {
    var await;
}

async function modern() {
    var await; // syntax error
}
```

语法表示形式下标表示对关键字的支持，

1. - 表示支持使用 In 作为关键字
1. ? 表示根据产生式左侧决定是否支持 In 作为关键字
1. ~ 表示不支持 In 作为关键字

```txt
VariableStatement[Yield, Await] :
  var VariableDeclarationList[+In, ?Yield, ?Await] ;
```

VariableStatement[Yield, Await] 组合展开。

在产生式中将 Yield, Await 参数最终传递给 BindingIdentifier 产生式。

在 BindingIdentifier 中需要区分是否支持 await 作为关键字的话需要两种形式。

```txt
BindingIdentifier_Await:
    Identifier
    yield
```

`_Await`后缀表示支持`await`做关键字，不能作为标识符，所以右侧不出现`await`。下面是不支持`await`作为关键字的形式。

```txt
BindingIdentifier:
    Identifier
    yield
    await
```

但是规范中的定义是这样的。

```txt
BindingIdentifier[Yield, Await] :
  Identifier
  yield
  await
```

这个定义展开后不管支持不支持`await/yield`作为关键字，右侧都出现了`yield/await`。规范通过静态语义（static semantic）规则将不支持的形式定义为语法错误，来达到相同的效果。

```
BindingIdentifier[Yield, Await]: await
```

左侧有`await`参数时右侧出现`await`的话是静态语法错误，编译时报错。这么做的原因和自动分号插入机制（Automatic Semicolon Insertion）有关系。

```txt
async function too_few_semicolons() {
  let
  await 0;
}
```

这个例子中如果在语法层面禁止了`await`作为标识符出现，那么语法解析出错从而触发自动分号插入会改变程序的语义，等价于下面的形式。

```txt
async function too_few_semicolons() {
  let;
  await 0;
}
```

由于源码输入是 Unicode 码点形式，所以可能出现转义的 Unicode 字符序列其字符串值是禁用的标识符名称。

```js
function old() {
  var \u0061wait; // ok
}

async function modern() {
  var \u0061wait; // Syntax error
}
```

### 左值表达式

LeftHandSideExpression

### Cover Grammar

任意长度向前看符号无法区分的语法形式

AssignmentExpression -> PrimaryExpression -> ... -> CoverParenthesizedExpressionAndArrowParameterList

使用 Cover Grammar 进行解析将一些具有非法形式的语法成功解析，同样需要通过静态语义错误进行排除。

```txt
// 只能是 ArrowFormalParameters
ArrowParameters : CPEAAPL

// 只能是 ParenthesizedExpression
PrimaryExpression : CPEAAPL
```

另外的 Cover Grammar

ObjectLiteral ObjectAssignmentPattern

```txt
let o = { a = 1 }; // syntax error

// Arrow function with a destructuring parameter with a default
// value:
let f = ({ a = 1 }) => { return a; };
f({}); // returns 1
f({a : 6}); // returns 6
```

CoverCallExpressionAndAsyncArrowHead

```txt
let x1 = async(a, b);
let x2 = async();
function async() { }

let x3 = async(a, b) => {};
let x4 = async();
```

### 表达式解析

规范使用了递归下降的方式定义运算符的优先级。

## 参考

1. Spec Chapter 10 Source Code
1. Spec Chapter 11 Lexical Grammar
1. Javascript The Good Parts Grammar
1. Automatic Semicolon Insertion
1. [Understanding the ECMAScript spec, part 3](https://v8.dev/blog/understanding-ecmascript-part-3)
1. [JS syntactic quirks](https://github.com/mozilla-spidermonkey/jsparagus/blob/master/js-quirks.md#readme)
