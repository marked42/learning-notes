# HTML

## 解析模型

https://html.spec.whatwg.org/multipage/parsing.html#overview-of-the-parsing-model

HTML 语法相比 XML 更宽容，允许省略的标签头部和尾部

https://html.spec.whatwg.org/multipage/parsing.html#an-introduction-to-error-handling-and-strange-cases-in-the-parser

The difference is that the HTML approach is more "forgiving": it lets you omit certain tags (which are then added implicitly), or sometimes omit start or end tags, and so on. On the whole it's a "soft" syntax, as opposed to XML's stiff and demanding syntax.

HTML 不是上下文无关的，所以需要不能用传统的方法解析。

The reasons are:

1. The forgiving nature of the language.
1. The fact that browsers have traditional error tolerance to support well known cases of invalid HTML.
1. The parsing process is reentrant. For other languages, the source doesn't change during parsing, but in HTML, dynamic code (such as script elements containing document.write() calls) can add extra tokens, so the parsing process actually modifies the input.

HTML 规范中的[解析算法](https://html.spec.whatwg.org/multipage/parsing.html)

大部分代码是进行容错处理（Error Tolerance） https://web.dev/howbrowserswork/#html-parser

1. 整个解析过程就是树的构造过程

## 动态 HTML

byte input stream -> character input stream -> tokenization -> parsing -> tree construction

script 标签可以使用 dynamic markup insertion api 在 character input stream 中动态插入字符，也就是说 parsing 阶段可能
会影响 tokenization 阶段，tree construction 阶段可以重入（re-entrant）

[Overview of the parsing model](https://html.spec.whatwg.org/multipage/parsing.html#overview-of-the-parsing-model)

## 编码识别

1. [Detecting character encoding & Preprocessing the input stream](https://htmlparser.info/parser/)

```ts
/**
 * consumed 指已经从字符流中取出
 */
class InputStream {
  currentInputCharacter
  nextInputCharacter
  // 插入字符
  insertionPoint

  // 处理换行符 CR/LF/CR-LF
  normalizingNewLines

  //
  EOF

  // errors
  /**
   * surrogate-in-input-stream
   * non-character-in-input-stream
   * control-character-in-input-stream
   */
}
```

## Tokenization

状态机

```ts
/**
 * state and input
 * 1. state发生变化，消耗一个字符
 * 2. reconsume state变化，不消耗字符
 * 3. state不变，消耗一个字符
 * 4. 消耗多个字符
 */
class Tokenization {
  /**
   * 用来处理属性值中的 character reference
   *  关键字 consumed as part of an attribute
   *  flush code points consumed as a character reference
   */
  temporaryBuffer
  /**
   * 用来记录是在 attribute value中还是在text中
   */
  returnState
}

interface TokenDoctype {
  type: 'DOCTYPE'
  /**
   * name/public/system默认没有，表示missing
   */
  name?: string
  public?: string
  system?: string
  /**
   * @default 'off'
   */
  forceQuirks: 'off' | 'on'
}

interface TokenStartTag {
  type: 'StartTag'
  name: string
  /**
   * @default unset
   */
  selfClosing: 'unset' | 'set'
  /**
   * @default []
   */
  attributes: Attribute
}

interface TokenEndTag {
  type: 'EndTag'
  name: string
  /**
   * @default unset
   */
  selfClosing: 'unset' | 'set'
  /**
   * @default []
   */
  attributes: Attribute
}

interface Attribute {
  name: string
  value: string
}

interface TokenComment {
  type: 'Comment'
  data: string
}

interface TokenCharacter {
  type: 'Character'
  data: string
}

interface TokenEOF {}
```

Tokenization 的状态转换定义

1. DOCTYPE
1. Data
1. Tag Open `</>` 这种情况是合法的，JSX 使用了这个语法
1. Tag Name `<name></name>` 其中`<`和 name 之间不能有空格
1. Attribute
   1. Before Attribute Name
   1. Attribute Name
   1. After Attribute Name
   1. Before Attribute Value
   1. Attribute Value (double-quoted/single-quoted/unquoted)
   1. After Attribute Value (quoted)
1. Self-closing start tag
1. End Tag Open
1. Character Reference
1. Markup Declaration Open `<!- / <!DOCTYPE / <![CDATA[ `三种情况
1. RCData 相关 对应 title/textarea 两个标签 R 代表 reference，C 代表 Character
1. RAWTEXT 相关 style/xmp/iframe/noembed/noframes/noscript 不支持 Reference，支持'<'
1. PLAINTEXT < 也是字符 从`<plaintext>`标签进入，无法退出这个状态
1. CDATA 只在 foreign element 中 `<![CDATA[section]]>`
1. Comment
1. Script data 相关

问题

1. Token 解析接受流式输入如何保证结果一致。
   <<<<<<< HEAD
   <<<<<<< HEAD
   =======
1. 使用 sectionStart 标记已经从字符流中取出，但是还没解析为 Token 的位置，在字符流结束时需要处理可能的内容。
   > > > > > > > # e32d25652be489628f429e9ad96a8dc2a2b4c0a9
1. 使用 sectionStart 标记已经从字符流中取出，但是还没解析为 Token 的位置，在字符流结束时需要处理可能的内容。
   > > > > > > > 304c4b93bf7fefb238822f7891ebae810abc410e

```ts
// 第一段  第二段
ab&quto;  ef

// 第一段  第二段
ab&qu     to;ef
```

1. 解析过程需要保存局部状态，可能需要一直往后识别字符，才能确认之前的字符构成了 token

```ts
// 一直到分号才能确认不是合法的字符引用，因此ab&quo;都是Text，需要继续往后看直到完结，整个作为一个CharacterToken
ab & quo
ef
```

1. reconsume 的行为使用不回退的方式如何实现，回退有性能损失，保存一个 buffer，或者 reconsume label
1. https://www.npmjs.com/package/entities

## Tree Construction

Parse State

```ts
class ParseState {
  insertionMode
  originalInsertionMode
  insertionModes
  currentTemplateInsertionMode

  /**
   * grow downwards
   *
   * html         <--- top-most
   * ...
   * currentNode  <--- bottom-most
   */
  stackOfOpenElements: Element[]

  currentNode
  /**
   * 针对Fragment Case
   */
  adjustedCurrentNode

  activeFormattingElements

  headElement
  lastFormElement
}
```

```ts
//  state变化和 insertionMode和stackOfOpenElements有关系
class Parser {
  // 处理嵌套的script
  scriptNestingLevel: number
  // 表示Parser处于终止状态
  paused: boolean
}
```

### Misnested Tags

nesting mismatches and unclosed tags

1. adoption agency algorithm
1. https://ln.hixie.ch/?start=1037910467&count=1

错误处理

The HTML5 specification does define some of these requirements. (WebKit summarizes this nicely in the comment at the beginning of the HTML parser class.)

We want to add a block element inside an inline element. Close all inline elements up to the next higher block element.
If this doesn't help, close elements until we are allowed to add the element - or ignore the tag.

#### 不允许的嵌套标签

The element being added is explicitly forbidden inside some outer tag. In this case we should close all tags up to the one which forbids the element, and add it afterwards.

#### 2

We are not allowed to add the element directly. It could be that the person writing the document forgot some tag in between (or that the tag in between is optional). This could be the case with the following tags: HTML HEAD BODY TBODY TR TD LI (did I forget any?).

#### 3

We want to add a block element inside an inline element. Close all inline elements up to the next higher block element.

#### </br>

`<br>`用法是为了 IE/Firefox 的历史写法兼容， Webkit 将`</br>`当做`<br>`

```cpp
if (t->isCloseTag(brTag) && m_document->inCompatMode()) {
     reportError(MalformedBRError);
     t->beginTag = true;
}
```

#### A stray table

A stray table is a table inside another table, but not inside a table cell.

```html
<table>
  <table>
    <tr>
      <td>inner table</td>
    </tr>
  </table>
  <tr>
    <td>outer table</td>
  </tr>
</table>
```

修改为同层的两个 table

```html
<table>
  <tr>
    <td>outer table</td>
  </tr>
</table>
<table>
  <tr>
    <td>inner table</td>
  </tr>
</table>
```

代码

```cpp
if (m_inStrayTableContent && localName == tableTag)
        popBlock(tableTag);
```

#### 嵌套表格

In case the user puts a form inside another form, the second form is ignored.

```cpp
if (!m_currentFormElement) {
        m_currentFormElement = new HTMLFormElement(formTag,    m_document);
}
```

#### 嵌套层数过深

www.liceo.edu.mx is an example of a site that achieves a level of nesting of about 1500 tags, all from a bunch of <b>s. We will only allow at most 20 nested tags of the same type before just ignoring them all together.

```cpp
bool HTMLParser::allowNestedRedundantTag(const AtomicString& tagName)
{

unsigned i = 0;
for (HTMLStackElem* curr = m_blockStack;
         i < cMaxRedundantTagDepth && curr && curr->tagName == tagName;
     curr = curr->next, i++) { }
return i != cMaxRedundantTagDepth;
}
```

#### html/body 结束标签

Support for really broken HTML. We never close the body tag, since some stupid web pages close it before the actual end of the doc. Let's rely on the end() call to close things.

```cpp
if (t->tagName == htmlTag || t->tagName == bodyTag )
        return;
```

## fragment parsing

adjusted current node
context node

## 解析完成

文档状态修改为 complete，发出 load 事件，deferred 的 script 开始执行

https://html.spec.whatwg.org/multipage/parsing.html#the-end

## Attribute & DOM Properties

1.  https://github.com/justjavac/the-front-end-knowledge-you-may-not-know/blob/master/archives/015-dom-attributes-and-properties.md
1.  https://juejin.cn/post/6844903874143191047
1.  https://joji.me/zh-cn/blog/html-attribute-vs-dom-property/
1.  https://dotnettutorials.net/lesson/html-attribute-vs-dom-property/
1.  https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html
1.  https://www.geeksforgeeks.org/html-dom-attributes-property/
1.  https://reactjs.org/docs/dom-elements.html

1.  [13.2 Parsing HTML documents](https://html.spec.whatwg.org/multipage/parsing.html#parsing)
1.  [Idiosyncrasies of the HTML parser](https://htmlparser.info/)
1.  [Browser Hacking](https://www.youtube.com/playlist?list=PLMOpZvQB55be0Nfytz9q2KC_drvoKtkpS)
1.  [Magic tricks with the HTML parser | HTTP 203](https://www.youtube.com/watch?v=LLRig4s1_yA)
1.  [Browser hacking: Let's build a spec-compliant HTML parser!](https://www.youtube.com/watch?v=7ZdKlyXV2vw)

1.  [html5 parsing test](https://github.com/html5lib/html5lib-tests)
1.  [parse5](https://github.com/inikulin/parse5)
1.  [JSDOM](https://github.com/jsdom/jsdom)
1.  [htmlparser2](https://github.com/fb55/htmlparser2)
1.  [rehype](https://github.com/rehypejs/rehype)

1.  [HTML Tree Building | Rubber Duck Engineering | Episode #2](https://www.youtube.com/watch?v=YH0yDdQY6-A)
1.  [HTML 6 | Rubber Duck Engineering | Episode #89](https://www.youtube.com/watch?v=sWZ9HooKwjI)
1.  [HTML 6.2 | Rubber Duck Engineering | Episode #90](https://www.youtube.com/watch?v=7RWbAZcXSIg)
1.  [HTML 2π | Rubber Duck Engineering | Episode #91](https://www.youtube.com/watch?v=EgSi2e-NhXc&t=3129s)
