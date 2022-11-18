# HTML

## quirks mode

1. https://hsivonen.fi/doctype/
1. [HTML Syntax](https://htmlparser.info/syntax/)
1. [Web Browser Engineering](https://browser.engineering/index.html)

[Parsing HTML](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
[html5 parsing test](https://github.com/html5lib/html5lib-tests)

1. HTML 标签分类 空标签、自闭合、标签的嵌套关系、标签语法容错

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

1. [HTML Syntax](https://html.spec.whatwg.org/#syntax)

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
[Constructing the Object Model](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=en#document-object-model-dom)

[speculative parsing](https://developer.mozilla.org/en-US/docs/Glossary/speculative_parsing)

## Attribute & DOM Properties

1.  https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/blob/master/archives/015-dom-attributes-and-properties.md
1.  https://juejin.cn/post/6844903874143191047
1.  https://joji.me/zh-cn/blog/html-attribute-vs-dom-property/
1.  https://dotnettutorials.net/lesson/html-attribute-vs-dom-property/
1.  https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html
1.  https://www.geeksforgeeks.org/html-dom-attributes-property/
1.  https://reactjs.org/docs/dom-elements.html

Web 参考资料

1. [Constructing a Document Tree](https://browser.engineering/html.html)
1. [HTML 6 | Rubber Duck Engineering](https://www.youtube.com/watch?v=sWZ9HooKwjI)
1. https://htmlparser.info/bibliography/
1. https://browser.engineering/bibliography.html
