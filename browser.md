# 浏览器

## HTML

HTML 语法相比 XML 更宽容，允许省略的标签头部和尾部

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

## CSS

https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#CSS_parsing

CSS 是上下文无关文法， [规范](https://www.w3.org/TR/CSS2/grammar.html)

1.  [Let's Build A Browser Engine](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)

1.  https://zhuanlan.zhihu.com/p/267488164

1.  [How Browsers Work: Behind the scenes of modern web browsers](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)
1.  [Tali Garsiel's Site](http://taligarsiel.com/Projects/howbrowserswork1.htm)
1.  [Client Side Performance](http://taligarsiel.com/ClientSidePerformance.html)
