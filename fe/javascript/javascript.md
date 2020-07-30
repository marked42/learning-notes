# Javascript

## Host Environment

### **D**ocument **O**bject **M**odel

[W3C DOM4 Standard](https://www.w3.org/TR/dom/) and [WhatWG DOM Standard](https://dom.spec.whatwg.org/)

![Browser Host Environment](./window_object.png)

#### DOM Node

![DOM Node Class Hierarchy](./dom_node_class_hierarchy.png)

1. `EventTarget` is an root abstract class for event support.
1. `Node` is an abstract class serving as base of all nodes.
1. `Element` is an abstract class serving as base of all element nodes.
1. `HTMLElement` is base class of all types of html element.

Form normal javascript object, `console.log` and `console.dir` are no different. But for DOM element object, they are different.

1. `console.log(elem)` shows the element DOM tree.
1. `console.dir(elem)` shows the element as a DOM object, good to explore its properties.

There're 12 [node types](https://dom.spec.whatwg.org/#node), primary ones are as below.

1. document – the “entry point” into DOM.
1. element nodes – HTML-tags, the tree building blocks.
1. text nodes – contain text.
1. comments – sometimes we can put the information there, it won’t be shown, but JS can read it from DOM.

Attributes is what's written in HTML, it's of `DOMString` type and name is case insensitive.

1. `elem.hasAttribute(name)` – checks for existence.
1. `elem.getAttribute(name)` – gets the value.
1. `elem.setAttribute(name, value)` – sets the value.
1. `elem.removeAttribute(name)` – removes the attribute.
1. `elem.attributes` is a collection of all attributes.

DOM properties are property of DOM object, it's name is case sensitive and not always strings, `input.checked` is boolean.

All attributes starting with "data-" are reserved for programmers' use. They are available in dataset property.

Creation

1. `document.createElement('div)`
1. `document.createTextNode('Here I am')`
1. `document.createDocumentFragment()`

Clone

1. `elem.cloneNode(true)` creates a deep clone with all child elements
1. `elem.cloneNode(false)` creates a shallow clone without children.

Insertion

1. `element.appendChild(node)`
1. `element.insertBefore(node, nextSibling)`
1. `element.replaceChild(node, oldChild)`

* `node.append(...nodes or strings)` – append nodes or strings at the end of node,
* `node.prepend(...nodes or strings)` – insert nodes or strings into the beginning of node,
* `node.before(...nodes or strings)` –- insert nodes or strings before the node,
* `node.after(...nodes or strings)` –- insert nodes or strings after the node,
* `node.replaceWith(...nodes or strings)` –- replaces node with the given nodes or strings.

![Node Insertion](./node_insert.png)

`elem.insertAdjacentHTML(where, html)`, `elem.insertAdjacentText(where, html)`, `elem.insertAdjacentElement(where, html)`

* "beforebegin" – insert html before elem,
* "afterbegin" – insert html into elem, at the beginning,
* "beforeend" – insert html into elem, at the end,
* "afterend" – insert html after elem.

![`insertAdjacentHTML`](./insert_adjacent_html.png)

`document.write(<b>Hello</b>)` only works when page is loading. If it's called afterwards, existing document content is erased.

Removal

1. `element.removeChild(node)`
1. `node.remove()`

#### Traverse DOM

![Traverse DOM Nodes](./traverse_dom_nodes.png)

`document.body` refers to `<body></body>` element of an html page, but that's valid only when inside `<body></body>` element, for scripts inside `<head></head>` element, `document.body` is `null`.

![Traverse DOM Element Nodes](./traverse_dom_element_nodes.png)

`document` is the root node of DOM, but it's not an element node. `document.documentElement` is the root element node.

```javascript
document.documentElement.parentNode === document;
document.documentElement.parentElement === null;
```

#### Search DOM

| Method                         | Returns                                     | Context               | Live? |
|:------------------------------ |:------------------------------------------- |:--------------------- | ----- |
| `getElementById(id)`           | single element with `id`                    | `document`            | No    |
| `getElementsByName(name)`      | mutiple elements with `name`                | `document`            | Yes   |
| `getElementsByTagName(name)`   | mutiple elements with `name`                | `document`, `element` | Yes   |
| `getElementsByClassName(name)` | mutiple elements with `name`                | `document`, `element` | Yes   |
| `querySelector(selector)`      | first element matches `selector`            | `document`, `element` | No    |
| `querySelectorAll(selector)`   | mutiple elements matches `selector`         | `document`, `element` | No    |
| `closest(selector)`            | closest ancestor element matches `selector` | `document`, `element` | No    |

Multiple elements is of type `HTMLCollection`.

Query relationship

1. `element.matches(css)` returns boolean value indicating whether `element` matches CSS selector.
1. `elementA.contains(elementB)` returns boolean value indicating whether `elementB` is a descendant of `elementA`.

#### Table DOM

`<table>` element supports (in addition to the given above) these properties:

1. `table.rows` – the collection of `<tr>` elements of the table.
1. `table.caption/tHead/tFoot` – references to elements `<caption>`, `<thead>`, `<tfoot>`.
1. `table.tBodies` – the collection of `<tbody>` elements (can be many according to the standard).

`<thead>`, `<tfoot>`, `<tbody>` elements provide the rows property:

1. `tbody.rows` – the collection of `<tr>` inside.

`<tr>`:

1. `tr.cells` – the collection of `<td>` and `<th>` cells inside the given `<tr>`.
1. `tr.sectionRowIndex` – the number of the given `<tr>` inside the enclosing `<thead>`/`<tbody>`.
1. `tr.rowIndex` – the number of the `<tr>` in the table.

`<td>` and `<th>`:

1. `td.cellIndex` – the number of the cell inside the enclosing `<tr>`.

### HTML Attributes and DOM Properties

#### Standard and Custom HTML Attributes

HTML attributes are defined by HTML source, all definitions inside HTML tag are atrributes. Each type of HTML tag has a set of built-in attributes, which is called standard attributes. Different type of HTML element has different standard attributes. All other attributes are custom attributes.

When html source is parsed, corresponding DOM object properties are created for standard attributes. And HTML attributes can be manipulated with a set of functions.

```javascript
// manipuate single attribute by name
element.hasAttribute(name)
element.getAttribute(name)
element.setAttribute(name)
element.removeAttribute(name)
```

HTML attributes inside DOM object has two features:

1. Attribute name is case-insensitive.
    ```javascript
    // equivalent forms
    element.getAttribute('id')
    element.getAttribute('iD')
    element.getAttribute('Id')
    element.getAttribute('ID')
    ```
1. Attribute value is always string. `getAttribute(name)` returns a string, `setAttribute(name, value)` converts value to string first and then store it as attribute value.

`element.attributes` is used to access all attributes on a element, it returns a live collection of all attributes of element. Returned value is of an iterable type `NamedNodeMap` that contains a collection of key/value pair of strings.

#### Property-attribute Synchronization

When a standard HTML attribute changes, the coressponding DOM property is auto-updated, and (with some exceptions) vice versa.

```html
<input>

<script>
  let input = document.querySelector('input');

  // attribute => property
  input.setAttribute('id', 'id');
  alert(input.id); // id (updated)

  // property => attribute
  input.id = 'newId';
  alert(input.getAttribute('id')); // newId (updated)
</script>
```

But there're some exclusions when attribute doesn't follow when property changes.

```html
<input>

<script>
  let input = document.querySelector('input');

  // attribute => property
  input.setAttribute('value', 'text');
  alert(input.value); // text

  // NOT property => attribute
  input.value = 'newValue';
  alert(input.getAttribute('value')); // text (not updated!)
</script>
```

#### DOM Properties

When DOM objects are created, only standard attributes like _id_, _class_ are mapped to corresponding properties of DOM objects, custom attributes ignored.

```javascript
// corresponding to standard attributes
document.getElementById('test').id        // test
document.getElementById('test').className // button
document.getElementById('test').foo       // undefined

// custom properties
document.getElementById('test').foo
$('#test').prop('foo')
document.getElementById('test').foo = 1
$('#test').prop('foo', 1)
```

Prefer to use property `element.name` instead of `element.getAttribute(name)` to get value of attribute `name` because property values are typed.

```javascript
// input.checked is boolean value
document.getElementById('test').checked
document.getElementById('test').checked = true

// input.style is an object
document.getElementById('test').style

// avoid using attribute
document.getElementById('test').getAtribute('checked')
document.getElementById('test').setAtribute('checked') = 'false'
```

Event if a DOM property is a string, it may differ from attribute value. For instance, the `href` DOM property is always a _full_ URL, even if the attribute contains a relative URL or just a hash.

```html
<a id="a" href="#hello">link</a>
<script>
  // attribute
  alert(a.getAttribute('href')); // #hello

  // property
  alert(a.href ); // full URL in the form http://site.com/page#hello
</script>
```

#### Custom Attributes and `dataset`

Custom attributes are used to pass custom data from HTML to JavaScript.

```html
<!-- mark the div to show "name" here -->
<div show-info="name"></div>
<!-- and age here -->
<div show-info="age"></div>

<script>
  // the code finds an element with the mark and shows what's requested
  let user = {
    name: "Pete",
    age: 25
  };

  for(let div of document.querySelectorAll('[show-info]')) {
    // insert the corresponding info into the field
    let field = div.getAttribute('show-info');
    div.innerHTML = user[field]; // Pete, then age
  }
</script>
```

And they are used to style elements in CSS.

```html
<style>
  /* styles rely on the custom attribute "order-state" */
  .order[order-state="new"] {
    color: green;
  }

  .order[order-state="pending"] {
    color: blue;
  }

  .order[order-state="canceled"] {
    color: red;
  }
</style>

<div class="order" order-state="new">
  A new order.
</div>

<div class="order" order-state="pending">
  A pending order.
</div>

<div class="order" order-state="canceled">
  A canceled order.
</div>
```

To avoid potential conflicts when using custom attributes to pass around data, all attributes starting with `data-` are reserved and can be accessed in `dataset` property. Notice that `data-` attribute are converted to `camelCase` in DOM property.

```html
<body data-about="Elephants" data-order-state='new'>
<script>
  alert(document.body.dataset.about); // Elephants
  alert(document.body.dataset.orderState); // new
</script>
```

#### Reference

1. [DOM Element Attributes Standard](https://dom.spec.whatwg.org/#dom-element-attributes)

### DOM Size and Positions

#### [Element Size and Scrolling](http://javascript.info/size-and-scroll)

1. `offsetParent` - containing block element(positioned element/th,td,table/body.) for current element,  maybe  `null` in some cases.
    1. element is not show (`display: none`).
    1. element is `<body>` and `<html>`
    1. element is positioned relatively to window viewport rather than containing element `position: fixed`.
1. `offsetLeft/offsetTop` - coordinate of left upper outer corner (border included) of inner element relative to left upper inner corner (padding included) of outer element.
1. `offsetWidth/offsetHeight` - outer width/height of inner element with borders included.
1. `clientWidth/clientHeight` - width/height of element content including paddings but not scrollbar if present.
    1. In left to right OS, `clientWidth` equals to left border width.
    1. In right to left OS, `clientWidth = leftBorderWith + scrollBarWidth` since scroll bar appears on left side.
1. `clientLeft/clientTop` - distance from element left upper outer corner to its left upper inner corner.

![Element Size All](element_size_all.png)

![Element Size clientLeft](element_size_client_left.png)

1. `scrollWidth/scrollHeight` - minimum width/height that can contains all child elements without scrolling (scroll bar not included)
1. `scrollLeft/scrollTop` - distance between left upper corner of scrolled content (including invisible area) to left upper corner of visible area.

![Element Size Scroll](element_size_scroll.png)

All properties above are `0` or `null` if element is not shown (`display: none`), aka, not in document flow.

All properties above are read only except for `scrollTop`/`scrollLeft` and all Set `scrollTop` to `0` to scroll it to top, set it to `Infinity` to scroll it to bottom.

Calculate `scrollBottom` value

```js
ele.scrollBottom = ele.scrollHeight - ele.scrollTop - ele.clientHeight
```

Use `ele.style` to change read only geometries above.

```js
// centering inner element horizontally and vertically
child.style.left = Math.round(parent.clientWidth / 2 - child.offsetWidth / 2) + 'px'
child.style.top = Math.round(parent.clientHeight / 2 - child.offsetHeight / 2) + 'px'
```

Notice difference between geomerties properties above and geometry values from element style, eg. `getComputedStyle(ele).width` and `ele.clientWidth`.

1. Geometry property values from DOM API are integer value without unit, and only `scrollTop`/`scrollLeft` are writable. Geometry value from styles returns string with unit `px`.
1. `getComputedStyle(ele).width` may return `auto`.
1. `clientWidth` is inner content width including paddings, while `getComputedStyle(ele).width` varies according to box model value used (`box-sizing`).
1. If a scroll bar appears, `clientWidth` doesn't include it, but `getComputedStyle(ele).wdith` returns different values on different browsers (Chrome includes scroll bar width, Firefox not).

#### [Window Size and Scrolling](http://javascript.info/size-and-scroll-window)

`window.document.documentElement` is the root element of document, it's geometry properties can be used to get width/height of whole window.

1. `window.document.documentElement.clientWidth` - Width of visible part of document not including vertical scroll bar.
1. `window.document.documentElement.clientHeight` - Height of visible part of document not including honrizontal scroll bar.

There's some properties on `window` that gives us inner and outer size of browser window.

1. `window.innerWidth/window.innerHeight` - Width and height of browser window viewport, including scroll bar and debug console if present.
1. `window.outerWidth/window.outerHeight` - Width and height of whole browser window.

![Browser Window Size](browser_window_size.png)

To get width and height of whole document including scrolled out part, use code below.

```js
function getWindowScrollHeight() {
  const body = document.body
  const documentElement = document.documentElement

  return Math.max(
    body.scrollHeight, documentElement.scrollHeight,
    body.offsetHeight, documentElement.offsetHeight,
    body.clientHeight, documentElement.clientHeight
  )
}
```

Theoretically, root element `scrollHeight/scrollWidth` can be used to get full size of window and these properties work fine for non root elements. But for historical reasons, inconsistenscies exist betweeen different browsers, thus this trick is used.

To get scolled position of window, `documentElement.scrollTop/documentElement.scrollLeft` can be used. But Chrome/Safari/Opera have bugs and we should use `document.body.scrollLeft/document.body.scrollTop` instead.

Fortunately, we have a simpler and universal solution, `window.pageXOffset/window.pageYOffset` works consistently between different browsers. They're read only properties, use `scrollTo`, `scrollBy`, `scrollIntoView` to scroll whole window.

1. `scrollTo(x,y)` - scrolls point (x,y) on root element to top left corner of window viewport.
1. `scrollBy(x,y)` - scrolls page relative to its current position to right and bottom direction.
1. `element.scrollIntoView(top=true)` - scrolls an element into view. If parameter `top` is `true`, align element upper edge with window top, otherwise, align element bottom edge with window bottom.

Set `overflow` css property to forbid scrolling of element or window.

1. `document.body.style.overflow = 'hiddent'` - disable window scrolling
1. `document.body.style.overflow = ''` - enable window scrolling

#### [Coordinates](http://javascript.info/coordinates)

To get **window** related coordinates, use method `element.getBoundingClientRect()` returns an `DOMRect` object with geometry properties.

![Window Relative Coordinate](window_relative_coordinate.png)

1. `left` / `x` - X Coordinate for left element edge
1. `right` - X coordinate for right element edge
1. `top` / `y` - Y coordinate for top element edge
1. `bottom` - Y coordinate for bottom element edge
1. `height` - height of bounding rectangle `height = bottom - top`
1. `width` - width of bounding rectangle `width = right - left`

`left`, `right`, `top`, `bottom` are relative to viewport top left corner, and could be negative values since bounding client rect encloses scrolled part of element.

`document.elementFromPoint(x, y)` returns most nested element at window coordinate `(x, y)`. When coordinate is out of window region, it returns `null`.

To get **document** related coordinates, we have to calculate it.

```js
function getDocumentCoords(element) {
  const box = element.getBoundingClientRect()
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
  }
}
```

Notice that positive direction for scoll coordinates and bounding rectangle coordinates are opposite, so that they should be added together to get coordinate relative to document top left corner.

![Document Relative Coordinate](document_relative_coordinate.png)

A case of placing notes at different positions relative to another element.

![Place Notes At Different Positions](./place_note_at_positions.png)

```js
// anchorElement is the element to refer to
// anchorCoords is coordinate relative to document
let anchorCoords = getDocumentCoords(anchorElement)

// top-out
elem.style.left = anchorCooords.left + 'px'
elem.style.top = anchorCoords.top - elem.offsetHeight + 'px'

// "top-in":
elem.style.left = anchorCoords.left + "px";
elem.style.top = anchorCoords.top + "px";

// "right-out":
elem.style.left = anchorCoords.left + anchor.offsetWidth + "px";
elem.style.top = anchorCoords.top + "px";

// "bottom-in":
elem.style.left = anchorCoords.left + "px";
elem.style.top = anchorCoords.top + anchor.offsetHeight - elem.offsetHeight + "px";

// "bottom-out":
elem.style.left = anchorCoords.left + "px";
elem.style.top = anchorCoords.top + anchor.offsetHeight + "px";
```

### **B**rowser **O**bject **M**odel

BOM is part of [HTML Specification](https://html.spec.whatwg.org/)

Some object on root object `window`

1. navigator
1. location
1. screen
1. history

Some global functions

1. setTimeout/clearTimeout, setInterval/clearInterval, setImmediate
1. alert, confirm, console,

1. [CSSOM Specification](https://www.w3.org/TR/cssom-1/)

### Focus

#### focusable element

`focus` is used to indicate that an element is active now and is ready to accept user input. HTML elements with a content area is generally **focusable**. Only **focusable** element can accept focus and is said to be focused. An element is focusable if all of the following conditions are met.

1. The element's `tabindex` focus flag is set.
2. The element is either being rendered or is a descendant of a [canvas](https://www.w3.org/TR/html5/scripting-1.html#the-canvas-element) element that represents embedded content.
3. The element is not [inert](https://www.w3.org/TR/html5/editing.html#inert-subtrees).
4. The element is not [disabled](https://www.w3.org/TR/html5/disabled-elements.html#concept-element-disabled).

By default, elements like `<input>`, `textarea`, `button` are focusable and they've a default `tabindex` of `0` which indicates that they should be navigated in document order. `tabindex` attribute can be added to make other elements focusable. List of default focusable elements depend on browser, refer to [this](https://allyjs.io/data-tables/focusable.html) a completed list of focusable elements by test.


Reference

1. [CSS `:focus` selector](https://gist.github.com/jamiewilson/c3043f8c818b6b0ccffd)
1. [W3 ORG the `tabindex` attribute](https://www.w3.org/TR/html5/editing.html#the-tabindex-attribute)
1. [W3 ORG focusable area](https://www.w3.org/TR/html5/editing.html#focusable)
1. [WHATWG focusable area](https://html.spec.whatwg.org/multipage/interaction.html#focusable-area)

#### focus mechanism

There three levels of _focus context_.

1. operating system level - focus can be on any currently running application.
1. browser level - when browser is current application running with focus, any of its tabs can receive focus.
1. document level - On document corresponding to active browser tab, zero or one focusable element in the document can receive focus.

Document level focus context are what we talked about when we refer to focus in html document. When switching between different focus context, focus on document level remains unchanged and no related elements will be dispatched because of context switching.

Focusable element can receive and lose focus in different ways.

1. `autofocus`() attribute - introduce in HTML5, boolean value indicating that a form control should have focus automatically when page loads. At most one element can have this attribute in a document.
1. change focus on user interaction.
  1. keyboard navigation (usually `tab` key or `shift+tab` key).
  1. mouse click - when clicking on an element, currently focused element loses focus and clicked element receives focus.
  1. alert box receivs focus and returns it back when disappears.
  1. other ways supported by browser.
1. DOM API - use `element.focus()` or `element.blur()` to receive focus or lose focus. Notice that it only works focusable element, calling it on unfocusable element may have no effect or raise an error.

Document may have one or more [focus ring](https://www.w3.org/TR/DOM-Level-3-Events/#focus-ring), which refers to an order list of elements that can be navigated sequantially through keyboard event. When last element in focus ring is reached, it wraps back to first one.

1. [HTML5 `autofocus` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-autofocus)

#### focus DOM API

Focus related DOM API

1. `element.focus()` - focus current element
1. `element.blur()` - blur current element
1. `element.activeElement` - currently focused element
1. `HTMLSelectElement.autofocus` - corresponding to HTML5 `autofocus` attribute.
1. `element.tabindex` - change element to be focusable.

#### Focus Events

There are four types of focus events 'focus', 'blur', 'focusin', 'focusout', which all implements same  `FocusEvent` interface.

```javascript
[Constructor(DOMString type, optional FocusEventInit eventInitDict)]
interface FocusEvent : UIEvent {
  readonly attribute EventTarget? relatedTarget;
};

dictionary FocusEventInit : UIEventInit {
  EventTarget? relatedTarget = null;
};
```

There're usually two elements involving a foucs event, one that receives focus and one loses focus. `relatedTarget` property refers to the other element except the event target. In 'focus' and 'focusin', it refers to element that loses focus. In 'blur' and 'focusout', it refers to element that receives focus.
If there's no defautlly focused element, it's `null`.

All four types of focus event can be capture, but only 'focusin', 'focusout' event _bubbles_. Focus related event happens in order as listed below when sser shifts focus (no element is initially focuse).

1. focusin - Sent before first target element receives focus
2. focus - Sent after first target element receives focus
3. focusout	- Sent before first target element loses focus
4. focusin - Sent before second target element receives focus
5. blur	- Sent after first target element loses focus
6. focus - Sent after second target element receives focus

Repeated in sequantial order `focusout` -> `foucsin` -> `blur` -> `focus`.

1. [W3C Focus Events](https://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent)
1. [focus/blur](http://javascript.info/focus-blur)

### Touch Events

[Touch Events - Level 2 Draft Community Group Report 27 April](https://w3c.github.io/touch-events/#list-of-touchevent-types)

### Reference

1. [W3C DOM4 Standard](https://www.w3.org/TR/dom/)
1. [WhatWG DOM Standard](https://dom.spec.whatwg.org/)
1. [HTML Specification](https://html.spec.whatwg.org/)
1. [CSSOM Specification](https://www.w3.org/TR/cssom-1/)
1. [Browser: Document, Event, Interfaces](https://javascript.info/ui)
1. [UI Events Specification](https://www.w3.org/TR/uievents/)
1. [Event Object API](https://developer.mozilla.org/en-US/docs/Web/API/Event)
1. [Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)
1. [Event Interface](https://dom.spec.whatwg.org/#interface-event)
1. [Custom Event Interface](https://dom.spec.whatwg.org/#customevent)

## ES6 Class

`super` keyworkd in class constructor is statically bound, so when class(which is actually a function) prototype changes later, `super` remains the same value.

```javascript
// r1 r2 is executed sequentially
function* foo() {
  var r1 = yield request("http://some.url.1");
  var r2 = yield request("http://some.url.2");

  var r3 = yield request(`http://some.url.3/?v="${r1},${r2}`);

  console.log(r3);
}

// p1 p2 is executed in parallel
function* foo() {
  var p1 = yield request("http://some.url.1");
  var p2 = yield request("http://some.url.2");

  var r1 = yield p1;
  var r2 = yield p2;

  var r3 = yield request(`http://some.url.3/?v="${r1},${r2}`);

  console.log(r3);
}

// p1 p2 is executed in parallel
function* foo() {
  var [r1, r2] = yield Promise.all([
    request("http://some.url.1"),
    request("http://some.url.2")
  ]);

  var r3 = yield request(`http://some.url.3/?v="${r1},${r2}`);

  console.log(r3);
}

// better to hide it in another fuction
function bar(url1, url2) {
  return Promise.all([request(url1), request(url2)]);
}

// p1 p2 is executed in parallel
function* foo() {
  var [r1, r2] = yield bar("http://some.url.1", "http://some.url.2");

  var r3 = yield request(`http://some.url.3/?v="${r1},${r2}`);

  console.log(r3);
}
```

`super` keyworkd in class constructor is statically bound, so when class(which
is actually a function) prototype changes later, `super` remains the same value.

### Operator Precedence

[Operator Precedence MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

```javascript
function Foo() {
    getName = function () { console.log(1); }
    return this;
}

Foo.getName = function () { console.log(2); }
Foo.prototype.getName = function () { console.log(3); }

var getName = function () { console.log(4); }
function getName () { console.log(5); }

Foo.getName();              // 2
getName();                  // 4
Foo().getName();            // Foo() returns global object, returns 4 in chrome, raise error in node cause global.getName === getName is not false.
getName();                  // 4
new Foo.getName();          // 2, new (Foo.getName)();
new Foo().getName();        // 3, (new Foo()).getName();
new new Foo().getName();    // 3. new ((new Foo()).getName)();
```

## Javascript Async

```javascript
// Make an async HTTP request
var async = true;
var xhr = new XMLHttpRequest();
xhr.open("get", "data.json", async);
xhr.send();
// Create a three second delay (don't do this in real life)
var timestamp = Date.now() + 3000;
while (Date.now() < timestamp);
// Now that three seconds have passed,
// add a listener to the xhr.load and xhr.error events
function listener() {
  console.log("greetings from listener");
}
xhr.addEventListener("load", listener);
xhr.addEventListener("error", listener);
```

不管`xhr.send()`在 listener 注册之前还是之后完成，`load`和`error`回调函数都会被调用 . `Run-to-completion`和`EventLoop`, 必须先运行完注册代码，然后才会处理`xhr.send()`完成所添加到事件队列中的事件 (event).

```javascript
var async = true;
var xhr = new XMLHttpRequest();
xhr.open("get", "data.json", async);
xhr.send();

setTimeout(function delayed() {
  function listener() {
    console.log("greetings from listener");
  }
  xhr.addEventListener("load", listener);
  xhr.addEventListener("error", listener);
}, 1000);
```

`xhr`添加 listener 函数在回调中，这种情况下是 racing condition. 只有注册
listener 先被调用，才能正常触发回调函数。

## Generator & Iterator

We don't pass a value to the first `next()` call. Only a paused `yield` could
accept value passed by a `next(...)`.

### Iterator & Iterable

Interface definitions with typescript.

```typescript
interface IteratorResult<T> {
  done: boolean;
  value: T;
}

interface Iterator<T> {
  next(value?: any): IteratorResult<T>;
  return?(value?: any): IteratorResult<T>;
  throw?(e?: any): IteratorResult<T>;
}

interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}
```

Usage of iterable interface

```javascript
let [x, y] = [1, 2]       // destructuring

let chars = [...'hello']  // spread operator, ['h', 'e', 'l', 'l', 'o']

function* () {
  yield* [1, 2, 3]        //  yield*
}

for (let i of [1, 2, 3])  // for ... of loop

Array.from('hello')       // Array.from(Iterable)

new Map([['a', 1], ['b', 2]]) // Map(), Set(), WeakMap(), WeakSet()

Promise.all([1, 2, 3])
Promise.race([1, 2, 3])
```

### yield

1. `yield` cannot be used in normal inside normal function like `Array.ForEach()`, use for loop instead.
1. `yield` must be inside parens to be used as expression, but can be used as function parameter directly.

```javascript
console.log('hello' + yield 'world')  // SyntaxError
console.log('hello', yield 'world')   // OK
```

Generator function returns an iterator object `Iter`, it's property `Iter[Symbol.iterator]` point to itself. So `Iter` is both an `iterator` and an `iterable` object.

1. `n` `yield` keyword divide a generator function into `n+1` sub function sharing same generator function context.
1. `n`th call of `next()` runs the `n`th sub function and execute the expression after the `n`th `yield` keyword, result of expression is used as return value of `next()` call. Yield expression is lazy evaluated, only when corresponding `next()` is then it get evaluated.
1. `n`th call of `next(param)` passes its parameter `param` to `n-1`th `yield` expression as its result, and start execution of `n`th sub function. So the first `next()` has no corresponding `yield` to received passed parameter, and parameters are ignored if there's any.
1. `yield` used by itself returns `undefined` to corresponding `next()`. `next()` with no parameter passes `undefined` to corresponding `yield` expression.

`Generator` function returns a `Generator` object, which implements both `iterable` and `iterator` protocol. It has three methods.

```javascript
Generator.prototype.next();
Generator.prototype.return();
Generator.prototype.throw();
```

`for..of` loop, spread operator `...` and destrcture and `Array.from` all accept object with `iterable` protocol.

```javascript
function* numbers() {
  yield 1;
  yield 2;
  return 3;
  yield 4;
}

[...numbers()]; // [1, 2]

Array.from(numbers()); // [1, 2]

let [x, y] = numbers(); // x = 1, y = 2

// 1
// 2
for (let n of numbers()) {
  console.log(n);
}
```

1. An `iterator` has a `throw()` method, which accepts a parameter as error to throw. It throws an error inside generator function at corresponding `yield` position. Thrown error will first be caught by `try...catch` statement inside generator function wrapping that `yield` keyword, otherwise error will be propagated to outer scope to handle.
1. Note that `throw new Error('error')` statement works as normal, differnt from `iterator.throw()` method.
1. If an error thrown inside generator function not caught by itself, iterators are considered done after error propagated outside of generator. Subseqent `it.next()` calls will always return `{value: undefined, done: true}`.
1. Generator function can handle errors thrown by asynchronous step and synchronous step in same synchronous way.

```javascript
var gen = function* gen() {
  try {
    yield console.log("a"); // exception thrown here
    console.log("not executed");
  } catch (e) {
    console.log("caught: ", e);
  }

  yield console.log("b");
  yield console.log("c");
};

var g = gen();
g.next(); // a
g.throw("error"); // b
g.next(); // c
```

1. `Generator.prototype.return(param)` ends `iterator` and returns passed in parameter `{done: param, done: true}`. It will return `undefined` when called with zero arguments.
1. If `yield` expression corrosponding with `Generator.prototype.return()` is wrapped inside a `try...finally` block, generator will return after `finally` block is executed.

### Generator Delegation

Use `yield*` to nest multiple generators

```javascript
function* inner() {
  yield "hello";
}

function* outer1() {
  yield "open";
  yield inner();
  yield "close";
}

var gen = outer1();
gen.next().value; // 'open'
gen.next().value; // an iterator
gen.next().value; // 'close'

function* outer2() {
  yield "open";
  yield* inner();
  yield "close";
}

gen = outer2();
gen.next().value; // 'open'
gen.next().value; // 'hello'
gen.next().value; // 'close'
```

1. `yield*` can accept any object with `iterator` interface.
1. Generator delegation can delegate message, errors, and asynchrounous operation.

```javascript
function* mixGenerator() {
  yield* ["a", "b", "c"];
  yield "hello";
  yield* "hello";
}

var it1 = mixGenerator();
it1.next(); // 'a'
it1.next(); // 'b'
it1.next(); // 'c'
it1.next(); // 'hello'
it1.next(); // 'h'
it1.next(); // 'e'
it1.next(); // 'l'
it1.next(); // 'l'
it1.next(); // 'o'
```

```javascript
function* flattenArray(array) {
  for (let item of array) {
    if (Array.isArray(item)) {
      yield* flattenArray(item);
    } else {
      yield item;
    }
  }
}
const nested = ["a", ["b", ["c", ["d", "e"]]]];
console.log([...flattenArray(nested)]);
// ['a', 'b', 'c', 'd', 'e']
```

New syntax for declaring object function property.

```javascript
let person = {
  name() {
    return "Jane";
  }, // required in object, may omit in class syntax

  *nameCharaters() {
    yield* "Jane";
  },

  // same as above
  lastNameCharacters: function*() {
    yield* "Osteen";
  }
};
console.log(person.name());
let it = person.nameCharacters();
console.log(it.next()); // 'J'
console.log(it.next()); // 'a'
console.log(it.next()); // 'n'
console.log(it.next()); // 'e'
```

A more complicated example on delegation iterator and message passing.

### Yield and Promise

Generators can yield promise or thunk to represent ansynchronous operation. After asynchronous operation is finished, resume execution of generator to continue and complete generator function. We need a utility function called generator runner to help us automize the process of resuming and completing generators with asynchronous operations.

Asychronous flow control by genrators gives us two main advantages.

1. Asynchronous flow control code is almost the same as synchronous counterparts with `yield` keyworkd indicating asynchronous steps. Almost no noise code, very high signal to noise ratio.
1. Both asynchronous and synchronous errors can be handle synchronously inside generator.

One little imperfection.

#### Promise in Concurrency

Pay a little attention to the subtle difference between sequential and concurrent promise.

```javascript
const asyncStep = numberOfSeconds =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${numberOfSeconds} seconds later`);
    }, numberOfSeconds * 1000);
  });

// r1, r2 runs sequentially
function* foo() {
  var r1 = yield asyncStep(1);
  var r2 = yield asyncStep(1);

  var r3 = yield asyncStep(r1 + r2);
}

// r1, r2 runs concurrently
function* foo() {
  var p1 = asyncStep(1);
  var p2 = asyncStep(2);

  var r1 = yield p1;
  var r2 = yield p2;

  var r3 = yield asyncStep(Math.max(r1, r2));
}

// r1, r2 runs concurrently, use Promise.all
function* foo() {
  var [r1, r2] = yield Promise.all([asyncStep(1), asyncStep(2)]);

  var r3 = yield asyncStep(Math.max(r1, r2));
}

// r1, r2 runs concurrently, wraps concurrent steps in bar()
function bar() {
  return Promise.all([asyncStep(1), asyncStep(2)]);
}

function* foo() {
  var [r1, r2] = yield bar();

  var r3 = yield asyncStep(Math.max(r1, r2));
}
```

1. We still need a utility generator runner function to start and complete generator function.

#### Thunk

A thunk is a function that wraps another function inside. When a thunk is called, it forward paramters to wrapped function and call it.

```javascript
function foo(x, y, cb) {
  setTimeout(() => {
    cb(x + y);
  }, 1000);
}

function fooThunk(cb) {
  foo(3, 4, cb);
}

// call thunk
fooThunk(sum => console.log(`sum ${sum}`));

// thunkify below creates a thunk
const thunkify = (fn, ...args1) => {
  return function(...args2) {
    return fn.call(null, ...args1, ...args2);
  };
};

var fooThunk = thunkify(foo, 3, 4);

// thunkify below returns a thunkory (thunk factory)
const thunkify = fn => {
  return (...args1) => {
    return (...args2) => {
      return fn.call(null, ...args1, ...args2);
    };
  };
};

// thunkory below creates thunk
const fooThunkory = thunkify(foo);

var fooThunk = fooThunkory(3, 4);
```

### Generator and this

Generator function always returns an `ItrableIterator` object, it cannot be used as constructor.

```javascript
function F() {
    yield 'a'
}

var f = new F() // TypeError: F is not a constructor
```

### Generator and State Machine

//TODO: refere to YDKJS Async & Performance Page 116.

## Async Function

Async function has multiple forms.

1. function: `async function() {}`
1. function expression: 'const foo = async function() {}`
1. object's function property: `let obj = { async foo() {} }`
1. arrow function: `const foo = async () => {}`

Async function returns a resolved `Promise` if it runs successfully. If a normal object returned, it will be wrapped as a resolved `Promise` as return value.

Async function returns a rejected `Promise` if error thrown and not handled inside async function. Use `try...catch` to handle errors inside async function.

### await

1. `await` can be followed by a `Promise` object or a normal object. Normal object will also be wrapped as a resolved `Promise` object.
1. If following `Promise` is rejected, async function stops execution and return the rejected `Promise` object.
1. Use `try...catch` or `.catch()` to handle rejected promise and catch error object.

   ```javascript
   async function foo() {
     try {
       await Promise.reject("error");
     } catch (err) {
       console.log("catch: ", err);
     }
   }

   async function foo() {
     await Promise.reject("error").catch(err => {
       console.log("error: ", err);
     });
   }
   ```

1. `await` can only be used in async function. `await` is a keyword in ES6, cannot be used as identifier.

```javascript
const asyncStep = (number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(`${number} seconds later`)
    }, number * 1000)
})

async function foo() {
    let numbers = [1, 2, 3]
    // error, await cannot be used in normal function forEach
    numbers.forEach(number => await asyncStep(number))
}

// sequential execution
async function foo() {
    let numbers = [1, 2, 3]
    for (let number of numbers) {
        await asyncStep(number)
    }
}

// concurrent execution
async function foo() {
    let numbers = [1, 2, 3]
    // error, await cannot be used in normal function forEach
    numbers.forEach(async (number) => await asyncStep(number))      // all promises started
}

// concurrent execution
async function foo() {
    let numbers = [1, 2, 3]
    const promises = numbers.map(number => asyncStep(number))       // all promises started

    let results = []
    for (let promise of promises) {
        results.push(await promise)
    }
    const [r1, r2, r3] = results
}

// concurrent execution
async function foo() {
    let numbers = [1, 2, 3]
    const promises = numbers.map(number => asyncStep(number))       // all promises started
    const [r1, r2, r3] = await Promise.all(promises)
}
```

Promise start execution when it's created. So concurrent promises are created without waiting, then `await` is used to wait until they are finished sequentially. Sequential promises are created one at a time, `await` until current one is finished, then create next promise to execute sequentially.

## Promise

When a promise is resolved or rejected, its `then()` callback is scheduled at next possible asynchronous moment(microtask, Jobs).

1. If `then()` is scheduled sychronously and promise is already resolved or rejected, `then()` will not be called. Unified asynchronous `then()` ensures that it will always be called properly whether promise is resolved or not when `then()` is registered.
1. Promise can only be resolved or rejected once, any subsequent `resolve()` or `reject()` call will be ignored silently. This ensures an registered `then()` will be called once, no more no less. Register same `then()` multiple times if you want it to be called more than once.
1. `resolve()` and `reject()` receives only the first paramter passed in and invoke registered function with it. Other parameters are ignored, `undefined` will be used if no parameters passed in. Wrap multiple values into single object to be used as first paremeter if you want to return more than one objects.
1. Exception inside promise constructor causes the newly constructed promise to be rejected with same exception. Exception inside `then()` returns a promise rejected with same exception.

Default fullfilment handler and rejection handler is used when needed.

```javascript
var p = Promise.resolve(42);
p.then(null, null);

// default handler used
p.then(value => Promise.resolve(value), err => Promise.reject(err));
```

### resolve

Promise can be resolved with normal object or a Promise asynchronously, but notice that when a promise is resolved with another promise, it's unwrapped one layer each loop.

```javascript
var p3 = new Promise((resolve, reject) => {
  resolve("B");
});
var p1 = new Promise((resolve, reject) => {
  resolve(p3);
});
var p2 = new Promise((resolve, reject) => {
  resolve("A");
});

p1.then(v => console.log(v));
p2.then(v => console.log(v));

// A B <- not B A as you might expect
```

Promise is unwrapped if used as parameter of `resolve()` inside constructor or returned by `then()`. A new promise is created by promise constructor or `then()`. New promise adopts the state of unwrapped promise, thus creating a chain of asynchronous operations.

```javascript
var p1 = Promise.resolve("1");
var p3 = p1.then(value => {
  var p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, "3");
  });
  return p2;
});
p3.then(value => console.log("value: ", value));

// unwrapping inside then() returns promise chain to be resolved in sequential order p1 -> p2 -> p3
```

```javascript
var p2 = new Promise((resolve, reject) => {
  var p1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, "3");
  });
  resolve(p1);
});
p2.then(value => console.log("value: ", value));

// unwrapping inside constructor creates promise chain to be resolved in sequential order p1 -> p2
```

`Promise.resolve()` can accept a normal object, a promise or a thenable object.

1. If received a normal object, it returns a promise object resolved with it.
1. If received a promise, it returns that promise.
   ```javascript
   var p1 = Promise.resolve(42);
   var p2 = Promise.resolve(p1);
   console.log(p1 === p2); // true
   ```
1. If received a thenable object, it returns a trustable Promise wrapper.

   ```javascript
   var p = {
     then: function(cb, errcb) {
       cb(42);
       errcb("evil laugh");
     }
   };

   // trustable issues
   p.then(
     function fulfilled(val) {
       console.log(val); //42
     },
     function rejected(err) {
       // oops, shouldn't have run
       console.log(err); // evil laugh
     }
   );

   // safe Promise wrapper
   Promise.resolve(p).then(
     function fulfilled(val) {
       console.log(val); // 42
     },
     function rejected(err) {
       // never gets here
     }
   );
   ```

### Timeout Promise

Use a timeout promise to prevent it from hanging indefinitely and not called.

```javascript
function delay(delayedMilliseconds) {
  return new Promise(fullfill => {
    setTimeout(fullfill, delayedMilliseconds)
  })
}

function timeoutPromise(promise, delayedMilliseconds) {
  return Promise.race([promise, delay(time).then(() => {
    throw new Error('Operation timed out.')
  })])
}
```

### `then()`

Unwrapping also happens when you return a thenable or Promise from fullfilment or rejection handler. This allows us to chain multiple asynchronous steps together using `then()`.

```javascript
var p = Promise.resolve(21);

p.then(v => {
    console.log(v); // 21

    return new Promise((resolve, reject) => {
      resolve(v * 2); // fullfill with 42
    });
  })
 .then(v => console.log(v)); // 42

p.then(v => {
    console.log(v); // 21

    // asynchronous
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(v * 2); // fullfill with 42
      }, 100);
    });
  })
  .then(v => console.log(v)); // 42, runs after 100ms delay in previous step
```

### Thenable

Thenable is an object with `then()` method, it's a general label for promise-like objects. It's mainly used as a conception to cooperate between different promise implementations. Use `Promise.resolve()` to turns thenalbes into a standard promise object. `then()` method of thenable object is expected to have the same parameters as `Promise.prototype.then(onFullFilled, onRejected)`.

```javascript
function isThenable(p) {
  return (
    p !== null &&
    (typeof p === "object" || typeof p === "function") &&
    typeof p.then === "function"
  );
}
```

### Terminology

1. `fullfill` means to transform promise from `pending` state to `fullfilled` state.
1. `reject` means to transform promise from `pending` state to `rejected` state.
1. `resolve` means to transform promise from `pending` state to `fullfilled` or `rejected`

`Promise.resolve()` receives a normal object, a promise or a thenable. It may return a rejected promise when receiving promise or thenable object. So `resolve` instead of `fullfill` is an accurate terminology here. Same is true for first paramter of promise constructor.

```javascript
// Promise.resolve()
var fullfilledPromise = Promise.resolve(42);

var rejectedThenable = {
  then: (resolve, reject) => {
    reject("Oops");
  }
};
var rejectedPromise = Promise.resolve(rejectedThenable);

var rejectedPromise = Promise.resolve(Promise.reject("Oops"));

// Promise constructor
var rejectedPromise = new Promise((resolve, reject) => {
  resolve(Promise.reject("Oops"));
});

rejectedPromise.then(
  function fullfilled() {
    // never gets here
  },
  function rejected(err) {
    console.log(err); // 'Oops'
  }
);
```

For `then(fullfilled, rejected)`, first parameter should be called `fullfilled` instead of `resolved` because it will always and only be called when promise is fullfilled.

`reject` from `Promise.reject()` and `new Promise((resolve, reject) => {})` will not unwrap passed in parameters.

```javascript
var p1 = Promise.resolve(42);

// p2 is a rejected promise and its value is p1
var p2 = Promise.reject(p1);
p2.catch(err => console.log(err)); // err is p1 instead of 42
```

1. [Promise A+ Standard](https://promisesaplus.com/)
1. [https://www.promisejs.org/](https://www.promisejs.org/)
1. [ES6 Promise Standard](https://github.com/domenic/promises-unwrapping)
1. [States and Fates](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md)
1. [Redemption from Callback Hell](https://www.youtube.com/watch?v=hf1T_AONQJU&list=PLyBKX6F2pyZKCdHAtRnPxdGse1n4NC6Lb)
1. [Promises Are Awesome](https://www.youtube.com/watch?v=tbc-el52guw)

### API

`Promise.race(iterable)`

returns a pending promise that will be resolved or rejected as soon as one of the given iterable resolves or rejects, adopting that first promise's value as its value. If the iterable is empty, the promise returned will be forever pending. Non promise value from `iterable` will be wrapped as a resolved promise with that value. TODO: a more appropriately behaved race function for promise, refer to [properRace](https://www.jcore.com/2016/12/18/promise-me-you-wont-use-promise-race/).

`Promise.all(iterable)`

1. Returns a resolved `Promise` if iterable is emtpy, it's resolved synchronously.
1. Returns a pending promise that will be resolved asynchronously when `iterable` contains no promises. Chrome returns a resolved promise in this case, Firefox and Node confirms with ES6 standard.
1. Returns a pending promise that will be resolved or rejected asynchronously. Promise is resolved with an array containing all resolved values in same order if all promises from `iterable` are resolved. Promise is rejected with first rejected value if any of the promises from `iterable` is rejected.

Extended API

1. `none(iterable)`
1. `any(iterable)`
1. `first(iterable)`
1. `last(iterable)`

### Promisory

`promisory` is a function that returns a promise, `promisify` is a function that receives a function `fn(...args, cb)` and returns a `promisory`. Returned promise is resolved or rejected when `cb` is called. This turns callback style function `fn(...args, cb)` into promise style.

```javascript
// doesn't support fn with default parameter
const promisify = (fn, context) => (...args) => {
  return new Promise((resolve, reject) => {
    fn.call(context, ...args, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
};
```

## Performance

### Web Workers

Share data between workers

| Method                                                          | Cost                                               |
| --------------------------------------------------------------- | -------------------------------------------------- |
| Serialize data to string and deserialize it back another worker | serialization cost and double memory for same data |
| Structured Cloning Algorithm                                    | double memory for same data                        |
| Transferable Objects                                            | none                                               |

SharedWorker

### **S**ingle **I**nstruction **M**ultiple **D**ata

[SIMD](https://01.org/node/1495) and [polyfill](https://github.com/johnmccutchan/ecmascript_simd)

```javascript
var v1 = SIMD.float32x4(3.14159, 21.0, 32.3, 55.55);
var v2 = SIMD.float32x4(2.1, 3.2, 4.3, 5.4);
var v3 = SIMD.int32x4(10, 101, 1001, 10001);
var v4 = SIMD.int32x4(10, 20, 30, 40);
SIMD.float32x4.mul(v1, v2); // [ 6.597339, 67.2, 138.89, 299.97 ]
SIMD.int32x4.add(v3, v4); // [ 20, 121, 1031, 10041 ]
```

### asm.js

Use special style of code to specify variable types and avoid performance penalty involving type coercions. Refer to [http://asmjs.org/](http://asmjs.org/).

asm.js is often a target for cross-compilation from other highly optimized program languages -- for example, [Emscripten](https://kripken.github.io/emscripten-site/) transpiling C/C++ to javascript.

```javascript
var a = 42;
var b = a | 0; // this indicates b is always an integer
```

### Benchmark.js

Donald Knuth

> Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.

YDKJS

> Non-critical path optimization is the root of all evil. No amount of time spent optimizing critical paths is wasted, no matter how little is saved; but no amount of optimization on noncritical pathhs is justified, no matter how much is saved.

### **T**ail **C**all **O**ptimization

```javascript
function factorial(n) {
  if (n < 2) return 1;
  return n * factorial(n - 1);
}

function factorial(n) {
  function fact(n, res) {
    if (n < 2) return res;
    return fact(n - 1, n * res);
  }

  return fact(n, 1);
}
```

## Snippets

### Debounce

```javascript
var debounce = function (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait)；
      if (callNow) {
        func.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  }
}
```

### Throttle

1. [reference](http://www.alloyteam.com/2012/11/javascript-throttle/)

## Memory Management

_Memory leak_ is memory that is not required by an application anymore but for some reason is not returned to operating system or the pool of free memory.

_Garbage collected languages_ manage memory automatically by periodically checking which previously allocated pieces of memory can still be "reached" from other parts of the application.

### Reference Counting Memory Management

Reference counting uses a counter recording how many viariables references a piece of memory. When there's no variables referencing a certain piece of memory, it will be collected and returned to operating system.

But there's exist a case that reference counting memory management cannot solve: circular reference.

When two variables refers to each other and no other varaibles refers to them, a circular reference is formed. These two variables ought to be collected but is prevented by references to each other.

### WeakMap and WeakSet

`WeakMap` and `WeakSet` are introduced in ES6 to solve reference counting problem. When a `WeakMap` or `WeakSet` instance refers to a varaible `a`, a _weak_ reference is created, which means it will not increase reference count to `a`. So when there's no other variables refering to `a` and only weak references to `a` exist, reference count is 0 and `a` can be collected and returned to operating system.

Use weak reference to DOM nodes, so it's not necessary for developers to dereference DOM nodes when no longer needed. This reduces cognitive load of manual reference management for developers.

```js
const wm = new WeakMap()

const element = document.getElementById('example')

wm.get(element, 'some information')
wm.get(element) // 'some information'
```

### Mark and Sweep

1. Garbage collector builds a list of 'roots'. 'Roots' are global variables to which a reference is kept in code.
1. All roots are inspected and marked as active. All children are inspected recursively. Everything that can be reached from a root is not considered garbage.
1. All pieces of memory not marked as active are considered garbage and the collector frees and returns it to operating system.

![Mark and Sweep](./mark_and_sweep.gif)

### Typical JavaScript Memory Leaks

#### Accidental Global Variables

Function `foo()` refers to an undeclared variable `bar`, which accidentally creates a global variable `window.bar` in browser environment.

```js
function foo(arg) {
  bar = 'this is a hidden global variable'
}
```

Another way of creating an accidental global variable.

```js
function foo(arg) {
  this.bar = 'potential accidental global variable'
}

// foo called with this bind to global object implicitly,
// thus creating a global variable accidentally
foo()
```

#### Forgotten timers or callbacks

`node` in callback function refers to a DOM node, if DOM node is removed, callback function and `someResource` is not needed anymore. But interval timer is not cleared and requires callback function. This prevents unrequired variable `someResource` and callback function from being collected and returned to operating system. Memory leak happens.

```js
var someResource = getData();
setInterval(function() {
    var node = document.getElementById('Node')
    if(node) {
        node.innerHTML = JSON.stringify(someResource)
    }
}, 1000)
```

Observers like timer callbacks or event listeners should be removed explicitly when they're not required anymore. Depedent memory of observers are not able to be collected because of forgotten observers. In the past, this is particularly important since old browsers like IE6 were not able to manage cyclic references. Mordern browsers are able to manage cyclic references and collects unreachable variables.

```js
var element = document.getElementById('button')

// onClick references element
function onClick(event) {
    element.innerHtml = 'text'
}

// element references onClick
element.addEventListener('click', onClick)

// important to remove explicitly
element.removeEventListener('click', onClick)
element.parentNode.removeChild(element)
```

#### Out of DOM References

Sometimes it's useful to store DOM nodes in variables for easy manipulation. Two references to same DOM element are kept: one in DOM tree and the other in variable. Later when you decide to remove need to make both references unreachable.

```js
var elements = {
    button: document.getElementById('button'),
    image: document.getElementById('image'),
    text: document.getElementById('text')
};

function doStuff() {
    image.src = 'http://some.url/image';
    button.click();
    console.log(text.innerHTML);
    // Much more logic
}

function removeButton() {
    // The button is a direct child of body.
    document.body.removeChild(document.getElementById('button'));

    // At this point, we still have a reference to #button in the global
    // elements dictionary. In other words, the button element is still in
    // memory and cannot be collected by the GC.
}
```

#### Closures

```js
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing)
      console.log("hi");
  };
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log(someMessage);
    }
  };
};
setInterval(replaceThing, 1000);
```

[Blog On Detailed Description](https://blog.meteor.com/an-interesting-kind-of-javascript-memory-leak-8b47d2e7f156)

### References

1. [Memory Management]( https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/)
1. [Memory Leak Patterns in JavaScript](https://www.ibm.com/developerworks/web/library/wa-memleak/wa-memleak-pdf.pdf)

## Ajax with XMLHttpRequest

`XMLHttpRequest` is used to retrieve data from server. It's naming is a history issues, which doesn't mean it can only retrieve XML data. Any type of data is and other protocols like `file:` and `ftp` are supported. Prototyp chain of `XMLHttpRequest` is like below.

```txt
EventTarget -> XMLHttpRequestEventTarget -> XMLHttpRequest
```

`XMLHttpRequest.readyState` property returns a `unsigned int` value indicating state of XHR object, which can be one of following types.

| Value | State | Description |
| - | - | - |
| 0 | UNSENT | XHR object has been created, `open()` not called |
| 1 | OPENED | `open()` called |
| 2 | HEADERS_RECEIVED | `send()` has been called and headers and status are available |
| 3 | LOADING | downling, `responseText` holds partial data |
| 4 | DONE | operation is complete |

General life cycle and usage of `XMLHttpRequest` usage is like below.

```js
// 1. create xhr object with constructor, readyState is UNSENT
let xhr = new XMLHttpRequest()

/*
* 2. initialize request with (method, url, async, user, password),
* method and url are required, others are optional
*/
xhr.open('GET', 'https://www.example.com', true)

/*
* 3. set request HTTP header, must be called after open() and before send().
*/
xhr.setHeader(header1, value2)
xhr.setHeader(header2, value2)

// 4. send data with credentials if needed
xhr.withCredentials = true

// set time limit in milliseconds for auto termination
// should not be used with synchronous request
xhr.timeout = 2000
xhr.ontime = function(e) {
  // handle when request timed out
  console.error('request timed out')

  // maybe abort it
  xhr.abort()
}

// data fetch succeeded
xhr.onload = function() {

}

// data is transferring
xhr.onprocess = function() {
  xhr.upload
}

// error handling
xhr.onerror = function() {
  consoloe.log(xhr.statusText)
}

// 4. add listener to handle readyState change including case of
// failing to get data, getting partial data and receiving all data,
// usually it's needed to process reponse data by type.
xhr.onreadystatechange = function() {
  // request not finished
  if (xhr.readyState === XMLHttpRequest.DONE) {
    return
  }

  // finished request in error status
  if (xhr.status !== 200 && xhr.statusText !== '200 OK') {
    return
  }

  // finished request in success status
  // check response status (unsinged int) and reason text
  // returns string, ArrayBuffer, Blob, Document ...
  console.log(xhr.response)

  // returns one of "", "arraybuffer", "blob", 'document', 'json', 'text'
  // empty string means "text" will be used
  console.log(xhr.response)

  // returns a DOMString that contains response as text or null
  // if request failed or not sent yet
  console.log(xhr.reponseText)

  // returns seiralized URL of response or empty string if URL is null
  console.log(xhr.reponseURL)

  // returns Document
  console.log(xhr.reponseXML)
}

// 5. Specify body data and send request. If request method is GET
// or HEAD, argument is ignored and request body is set to null. If
// Accept header hasn't been set, it's set to */* and sent with request
// body can be string, Document, Blob, ArrayBufferView ...
xhr.send(body)

// 6. you may want to abort sent request
xhr.abort()

// get response information
xhr.getAllResponseHeaders()
xhr.getResponseHeader()

// override MIME type
xhr.overrideMimeType()
```

1. [Ajax Getting Started](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started)
1. [Using XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)
1. [XMLHttpRequest Standard](https://xhr.spec.whatwg.org)

## Fetch (TODO:)

## Tricks

### `parseInt`

```js
['11', '11', '11', '11'].map(parseInt)
```

Result is `[11, NaN, 3, 4]`, because `parseInt` receives a second argument as radix to parse string. `Array.prototype.map` receives parameters like below.

```js
Array.prototype.map(
  callback: (currentValue, index, array) => any,
  thisArg,
)
```

So `parseInt` is called four times like below.

```js
parseInt('11', 0)   // radix is 10
parseInt('11', 1)   // invalid radix, return NaN
parseInt('11', 2)
parseInt('11', 3)
```

`parseInt` parses string according to its radix.

1. `2` ~ `36` - valid radix is an integer in range of 2 ~ 36.
1. `undefined` or `0` - JavaScript assumes radix based on string prefix.
  1. `0x` or `0X` - radix is 16
  1. `0` - radix is 8 or 10, ES5 specifies that 10 is used, but it's not universally supported.
  1. other - radix is 10
1. radix of non-integer value will be truncated to an integer firstly.

For invalid radix or invalid string , `NaN` is returned.

```js
function toHex(value) {
  let hex = value.toString(16)
  return hex.length < 2 ? `0${hex}` : hex
}

function rgbToHexString(r, g, b) {
  return ['#', toHext(r), toHext(g), toHext(b)].join('')
}
```

### wraps an object

Given an object `http` like below. If you want to wrap it and provides new implementation some methods. Remeber that except target implementation to repalce, other properties should remain same on wrapped object, this ensures full compatability.

```js
const http = {
  get() {
    console.log('original get')
  },
  post() {
    console.log('original post')
  },
  other() {
    console.log('original other')
  }
}

const methods = ['get', 'post']
const wrappedHttp = {
  // inherit all properties from original object so that other properties remains same,
  ...http,
}

methods.forEach(method => {
  const orignalMethod = http[method]

  wrappedHttp[method] = (...args) => {
    // reimplementation using original method, add enhanced function here
    return originalMethod(...args)
  }

  // new method should inherit orignal method so that any properties on orignal method are accessible too
  Object.setPrototypeOf(wrappedHttp[method], originalMethod)
})
```