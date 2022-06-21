# 资料索引

[33-js-concepts](https://github.com/leonardomso/33-js-concepts)

## HTML

1. [Introduction to HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML)
1. HTML 标签分类 空标签、自闭合、标签的嵌套关系、标签语法容错
1. [a11y](https://scottaohara.github.io/accessibility_interview_questions/)

### DOM

[MDN Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
[Understanding The DOM](https://www.digitalocean.com/community/tutorials/introduction-to-the-dom)
[DOM Tree](https://javascript.info/dom-nodes)
[Render-tree Construction, Layout, and Paint](https://web.dev/critical-rendering-path-render-tree-construction/)
[What, exactly, is the DOM?](https://bitsofco.de/what-exactly-is-the-dom/)

https://www.youtube.com/watch?v=FIORjGvT0kk&list=PL4cUxeGkcC9gfoKa5la9dsdCNpuey2s-V
https://www.youtube.com/watch?v=0ik6X4DJKCc&list=RDCMUC29ju8bIPH5as8OGnQzwJyA&start_radio=1&rv=0ik6X4DJKCc&t=2181

#### DOM 基本概念

DOM 节点类型
全局变量

```js
document.children

document.childNodes

document.documentElement
document.head
document.body
```

结构

lib dom

```js
nodeName
nodeType
nodeValue

childNodes
children
previousSibling
nextSibling
parentNode

// live Collection
// 查询操作
getElementById
getElementsByName
getElementsByNameNS
getElementsByTagName
getElementsByClassName

querySelectorAll
querySelector

// 修改操作
insertBefore
insertAfter
prepend
append

remove

replaceChild
replaceChildren

getAttribute('class')
setAttribute('class')

// property
a.style
```

[element](https://dom.spec.whatwg.org/#interface-element)

```
element.className
element.classList.add
element.classList.remove
element.classList.item
element.classList.replace
element.classList.contains
element.classList.toggle
```

https://eloquentjavascript.net/14_dom.html

```js
const img = new Image(100, 100)
img.src = ''
// 等同于
const img = document.createElement('img')
img.src = ''
```

### NodeType

https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType

EventTarget/Node/CharacterData/Text
Element HTMLElement HTMLImageElement Image

### 遍历操作

Property Node Node Type
document #document DOCUMENT_NODE
document.documentElement html ELEMENT_NODE
document.head head ELEMENT_NODE
document.body body ELEMENT_NODE

parentNode/childNodes/parentElement/children/
firstChild/lastChild/childNodes firstElementChild/lastElementChild/children

previousSibling Previous Sibling Node
nextSibling Next Sibling Node
previousElementSibling Previous Sibling Element Node
nextElementSibling Next Sibling Element Node

const closestAncestor = Element.closest(selector)

### 新增

### 删除

### 替换

### 修改属性

```js
attribute

className
classList

// Apply style to div
div.setAttribute('style', 'text-align: center')
// property
div.style.height = '100px'
div.style.width = '100px'
div.style.border = '2px solid black'
```

### DocumentFragment

批量 DOM 操作

### Layout

布局 https://eloquentjavascript.net/14_dom.html#h_lyrY2KUDl7

### Spec

https://www.w3.org/TR/DOM-Level-2-Core/introduction.html
js-dom

#### DOM Events

1. Capturing/Target/Bubble 三阶段
1. 事件 dispatchEvent/stopImmediatePropagation/stopPropagation
1. addEventListener/removeEventListener
1. 事件代理 eventDelegation
1. preventDefault 默认行为
1. 合成事件 Synthetic Event
1. 自定义事件 CustomEvent
1. 事件队列 /事件回调函数中触发事件
1. 具体事件分类

#### Mutation Observer

#### Intersection Observer

## JS

1. [Javascript Info](https://javascript.info/event-details)

## CSS

1. https://web.dev/learn/css
1. https://kittygiraudel.github.io/selectors-explained
1. [Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

### Box Sizing

1. [Box Sizing Module Level 3](https://drafts.csswg.org/css-sizing-3/#valdef-width-max-content)

## HTTP

1. [Transfer-encoding](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding)
1. [X-Frame-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options)

## Performance

1. Web Worker

## Security

## Browser

1. [Layout Thrashing](https://devhints.io/layout-thrashing)
