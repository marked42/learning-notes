# HTML 语法

## 文档结构

[Writing HTML Document](https://html.spec.whatwg.org/multipage/syntax.html#writing)

```html
<!-- a comment -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Key to success</title>
  </head>
  <body>
    <p>Such like these, unless combined, are inane.</p>
  </body>
</html>
```

### DOCTYPE

1. https://hsivonen.fi/doctype/
1. https://quirks.spec.whatwg.org/
1. https://htmlparser.info/parser/#doctypes

quirks mode,

limited-quirks mode,

no-quirks mode.

作用是为了向后兼容（backward compatibility）

[HTML DTD](https://www.w3.org/TR/html4/strict.dtd)

## Elements

分类

1. void elements 空元素
1. template DocumentFragment
1. raw text element script/style 允许字符引用
1. escapable raw 不允许字符引用
1. foreign element MathML/SVG self-closing 标签
1. normal element 其他元素

标签 pre/textarea 特殊规则，开头的换行符被忽略

The pre and textarea elements have a special rule: they may begin with a newline that will be ignored by the HTML parser. To have content that actually starts with a newline, two newlines thus have to be used. (A newline in HTML is a line feed, a carriage return, or a CRLF pair.) For example, the following is equivalent to <pre>Use the force</pre> (without a newline):

特殊标签`<title>/<script>/<style>`处理，内部不能包含子节点，只能是文本

### 开始标签

标签名称大小写不敏感 case-insensitive 会统一转换成小写

```html
<div attr=""></div>
<img src="" />
```

标签的错误情况

1. StartTag 的 self-closing 为 set 的时候，元素不能有子节点 non-void-html-element-start-tag-with-trailing-solidus
1. EndTag 有属性，end-tag-with-attributes
1. EndTag self-closing set 时，end-tag-with-trailing-solidus
1. appropriate end tag token 结束标签必须与开始标签名称配对，case-insensitive ?

### 属性

四种形式

1. 空属性，值是空字符
1. 双引号属性，属性值中不能包含双引号，不支持转义形式`\"`可以使用字符引用`&quot;`。
1. 单引号属性，属性值中不能包含单引号
1. 无引号属性 unquoted

   1. 值不能为空
   1. 不能包含空白、双引号（"）、单引号(')、小于号（<）、大于号（>）、反撇号（`）、等号（=）等特殊字符，unexpected-character-in-unquoted-attribute-value
   1. 如果属性是最后一个，且后面是自闭合标签，`/`前面必须有空格，否则会被当做属性值的一部分

   ```html
   <source src="bbb_sunflower_2160p_60fps_normal.mp4" />
   ```

1. 属性名称也是大小写不敏感的
1. 属性名称 包含 `"/'/<` 特殊字符 unexpected-character-in-attribute-name
1. 属性不能重复

foreign element 支持几个带有命名空间的属性 xlink:actuate, xlink:arcrole, xlink:href, xlink:role, xlink:show, xlink:title, xlink:type, xml:lang, xml:space, xmlns (without prefix but is a namespaced attribute), xmlns:xlink.

```
<svg xmlns="http://www.w3.org/2000/svg">
```

### 结束标签

结束标签不能包含属性

```
</, the tag name (case-insensitive), optionally whitespace, >
```

### 可选标签

标签忽略后不改变 DOM 结构的情况下允许

```html
<p>Can a paragraph be one word long?</p>
<p>Yes.</p>
```

区别在于第一个 p 标签包含了后面的换行符

```html
<p>Can a paragraph be one word long?</p>
<p>Yes.</p>
```

https://html.spec.whatwg.org/multipage/syntax.html#optional-tags

一个表格统计标签是否可选

## 字符引用

三种字符引用

### 命名字符引用

1. named character reference `&quot;`

可能存在多个可能的引用字符序列，匹配最长的（需要 trie 树）

有一个表格，以分号结尾的是标准形式，也有不以分号结尾的历史形式（legacy）

字符引用可以使用在属性值和文字（text）两个环境中，属性值中允许支持历史形式

什么情况允许不加分号的形式?数字形式的也允许？

```ts
return (
  !this.xmlMode &&
  // script/style
  (this.baseState === State.Text || this.baseState === State.InSpecialTag)
)
```

#### ambguious ampersand

不构成合发形式的字符引用，代表本身包含的字符。

```
// 不允许
I've sent a support request to AT&T; no reply, yet.
// 允许
Ind. Unrealisk & Ind. Brunn
```

### numeric character reference

1. decimal `&#019;`
1. hex `&#x019;`

1. named-character reference
1. 在属性值中末尾无';'的形式当成是字符串本身`&not`四个字符，历史原因支持，不在属性之中属于错误 missing-semicolon-after-character-reference
1. 错误形式

reference code

1. 引用的数字值不是合法的 Unicode 码点
1. 引用了 null 等控制字符

## Comments

注释，格式`<!-- followed by any text (with some restrictions, detailed below), then -->`

```
// 最小注释
<!-->
<<<<<<< HEAD
<!-- ->
<!-- - -->
=======
>>>>>>> 304c4b93bf7fefb238822f7891ebae810abc410e
```

注释的内容不能以`>` or `->` or contain `--!>`开头，这时候认为注释结束

注释可以包含`--`，xml 的语法中不允许

```html
<!-- Hello -- there -->
```

注释不能嵌套，

```html
<!-- <!-- this is an error -->
-->
```

commentLike

<? processing-instruction >
<<<<<<< HEAD
<? >
bogus-comment
unexpected-question-mark-instead-of-tag-name
=======
>>>>>>> 304c4b93bf7fefb238822f7891ebae810abc410e

<! declaration >

### Processing Instruction

Bogus Comment

在HTML中不支持，只在XML中支持，出现的话会被当做注释。

https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction
https://developer.mozilla.org/en-US/docs/Web/API/Document/createProcessingInstruction
https://www.w3.org/TR/xml/#sec-pi


## CDATA Sections

只能用在 foreign element 中，格式如下

```
<![CDATA[ (case-sensitive), text not containing ]]>, then ]]>.
```

<<<<<<< HEAD
## Character References

=======
>>>>>>> 304c4b93bf7fefb238822f7891ebae810abc410e
1. [The HTML Syntax](https://htmlparser.info/syntax/)
1. [WHATWG The HTML Syntax](https://html.spec.whatwg.org/multipage/syntax.html)
