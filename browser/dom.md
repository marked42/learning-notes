# DOM

## HTML

html parsing model https://html.spec.whatwg.org/multipage/parsing.html#overview-of-the-parsing-model

HTML 语法相比 XML 更宽容，允许省略的标签头部和尾部

https://html.spec.whatwg.org/multipage/parsing.html#an-introduction-to-error-handling-and-strange-cases-in-the-parser

The difference is that the HTML approach is more "forgiving": it lets you omit certain tags (which are then added implicitly), or sometimes omit start or end tags, and so on. On the whole it's a "soft" syntax, as opposed to XML's stiff and demanding syntax.

[HTML DTD](https://www.w3.org/TR/html4/strict.dtd)

HTML 不是上下文无关的，所以需要不能用传统的方法解析。

The reasons are:

1. The forgiving nature of the language.
1. The fact that browsers have traditional error tolerance to support well known cases of invalid HTML.
1. The parsing process is reentrant. For other languages, the source doesn't change during parsing, but in HTML, dynamic code (such as script elements containing document.write() calls) can add extra tokens, so the parsing process actually modifies the input.

HTML 规范中的[解析算法](https://html.spec.whatwg.org/multipage/parsing.html)

HTML 解析库

1. 分词 Data State -> Tag Open State -> Tag Name State
1. 树的构建

大部分代码是进行容错处理（Error Tolerance）https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#HTML_Parser

1.  posthtml

HTML 特性

Everything else is unsupported, including:

Comments
Doctype declarations
Escaped characters (like &amp;) and CDATA sections
Self-closing tags: <br/> or <br> with no closing tag
Error handling (e.g. unbalanced or improperly nested tags)
Namespaces and other XHTML syntax: <html:body>
Character encoding detection

HTML 的节点类型有多种，暂时只解析 Element 和 Text 节点。

递归下降分析法，HTML 节点的嵌套结构

Nodes ->
| Element -> Tag -> `<TagName Attributes> Nodes </TagName>`
| Text

支持的特性

1. 根节点有多个的情况，构建的 DOM Tree 应该是 HTML 节点作为根节点
1. 支持文字节点和 Element 节点
1. Element 节点必须配对出现，暂时不支持空标签或者自闭合标签。

[Parsing HTML](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
[html5 parsing test](https://github.com/html5lib/html5lib-tests)
