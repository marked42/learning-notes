## HTML Attribute & DOM Properties

DOM Properties

1. value 可以是任何 Javascript 数据类型
2. 名称是大小写敏感

HTML Attribute

每个标签 Element 都有标准的一组属性，用来初始化对应的 DOM Property，非标准属性没有对应 DOM Property

1. 名称是大小写不敏感的
2. 值的类型是字符串
3. 名字并不总是相同

DOM 标准中 Attributes 相关的 API

[MDN hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute)
[whatwg](https://dom.spec.whatwg.org/#ref-for-dom-element-hasattribute%E2%91%A0)

```js
el.hasAttribute(name)
el.getAttribute(name)
el.setAttribute(name)
el.deleteAttribute(name)
el.attributes
```

```
<div class="foo"></div>
el.className
```

1. 有些 Attribute 没有对应的 DOM Properties 例如 `aria-*`
1. 有些 DOM Properties 没有对应的 Attribute 例如 textContent
1. 值并不相同

```js
// <div id="foo"></div>
// Attribute永远是字符串类型
el.getAttribute('id') === 'foo'
el.id === 'foo'

// <input value="foo"/>

el.getAttribute('value') === 'foo'
el.value === 'foo'
//  用户修改了input内容之后Attribute不会变
el.getAttribute('value') === 'foo'
el.value === 'bar'
```

## custom attribute

`data-*` 防止冲突

## Synchronization

1. style 属性是对象
1. href 属性是字符串
1. boolean 属性

Attributes -> DOM Properties 如何映射

1. 修改 Attribute 会造成 DOM 变化
2. 修改 DOM Attribute 不会变化

### Boolean Attribute

原生标签的属性

```html
<button :disabled="false"></button>
<button :disabled="true"></button>
<button disabled></button>
```

https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#boolean_attributes

### Readonly Attribute

只读的，不能通过 DOM Properties 修改，只能通过 Attribute 修改

```html
<form id="form1"></form>
<input form="form1" />
```

### Class 属性

### Event

事件属性

https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#boolean_attributes

[HTML Attributes and DOM Properties](https://javascript.info/dom-attributes-and-properties)

[Attribute 的语法](https://html.spec.whatwg.org/dev/syntax.html#attributes-2)

[Attributes and properties](https://javascript.info/dom-attributes-and-properties)
