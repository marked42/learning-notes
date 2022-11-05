# DOM

js-dom
[DOM Level 2 Core](https://www.w3.org/TR/DOM-Level-2-Core/introduction.html)
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
