# XML

1. XML http://aosabook.org/en/posa/parsing-xml-at-the-speed-of-light.html

[MDN](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)
[XML](https://web.archive.org/web/20151016053704/http://wam.inrialpes.fr/courses/PG-MoSIG12/xml.pdf)

1. [Annotated XML Specification](https://www.xml.com/axml/axml.html)
1. [Extensible Markup Language (XML) 1.0 (Fifth Edition)](https://www.w3.org/TR/REC-xml/)
1. [XML 1.1 Second Edition](https://www.w3.org/TR/xml11/)

1. [Using XML](https://alistapart.com/article/usingxml/)
1. [Test Suite](https://www.w3.org/XML/Test/)

1. 数据交换
1. Meta Language

1. XML 文档结构

## 文档结构

1. 结构上正 [well-formed](https://www.w3.org/TR/xml11/#dt-wellformed)
1. 语意上正确 syntactically [valid](https://www.w3.org/TR/xml11/#dt-valid)

Logical Structure declarations, elements, comments, character references, and processing instructions
Physical Structure entities document entity

1. Markup vs Content
1. Tag Start-Tag/End-Tag/Empty Element Tag
1. Element start-tag content end-tag / child element

## Well-formed

1. 文档结构符合 document 展开
1. 结构约束 well-formedness constraints
1. 使用的 parsed entity 也是 well-formed

1. 开始标签和闭合标签成对出现，
   1. 名称一致
   1. 正确嵌套
      The start-tag, end-tag, and empty-element tag that delimit elements are correctly nested, with none missing and none overlapping.
      Tag names are case-sensitive; the start-tag and end-tag must match exactly.

只有一个根元素 （root element）

## namespace

[Namespace](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course)

## Physical Structure

1. Entity 包含 name 和 content

   1. parsed entity replacement text 就是 content
   1. unparsed entity

1. general parsed Entity Reference `&quot;`
1. parameter entity reference `%quot;`

## 字符

合法字符，Unicode 中除去代理对的其他字符
控制字符如何处理？

换行符如何处理？ https://www.w3.org/TR/xml11/#sec-line-ends

[Character Data](https://www.w3.org/TR/xml11/#dt-chardata)

[Valid Characters](https://en.wikipedia.org/wiki/Valid_characters_in_XML)

## 注释

Comments cannot appear before the XML declaration.

```xml
<!-- comment -->
<?xml version="1.1" encoding="UTF-8"?>
<root>
fuck
</root>
```

comment 中由于与 SGML 兼容的原因，不允许包含"--"，语法设计如下

Comment ::= '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'

不允许以`--->`结尾。

```
<!-- B+, B, or B--->
```

```xml
<!--no need to escape <code> & such in comments-->
```

## 名称

xml 开头的名称被标准保留，名称字符允许一些标点`:-_.`，也允许其他未禁止的 Unicode 字符。

('X'|'x') ('M'|'m') ('L'|'l'))

## 编码

UTF-8/UTF-16

https://www.w3.org/TR/xml11/#charencoding

[Encoding](https://www.w3.org/TR/xml11/#sec-guessing)

## Parser 的两种类型

1. DOM Parser 对应结构，需要建立完整的 DOM 树，在内存中存储完整的文档内容，内存要求与文档长度相关
1. **S**imple **A**PI for **X**ML 事件式的 API，内存使用为常数

## 文档转换

1. [XLST](https://developer.mozilla.org/en-US/docs/Web/XSLT)
1. [XPath](https://developer.mozilla.org/en-US/docs/Web/XPath)

1. [xml.com](https://www.xml.com/)
1. Pugxixml
1. [Designing XML API for Modern C++](https://www.youtube.com/watch?v=AuamDUrG5ZU)
1. [What XML parser should I use in C++?](https://stackoverflow.com/questions/9387610/what-xml-parser-should-i-use-in-c/9387612#9387612)
1. https://www.npmjs.com/package/sax
