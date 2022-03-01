# Javascript 中的编码问题

https://cjting.me/2018/07/22/js-and-unicode/

源码规定使用 utf16 编码

https://262.ecma-international.org/6.0/#sec-source-text

## 获取字符串对应的码点数组

String 类型实现的[迭代器协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator)返回字符串的码点序列，每个码点以**字符串**形式返回。

```js
let string = '\ud83d\udc0e\ud83d\udc71\u2764'

for (let codePoint of string) {
  console.log(codePoint.codePointAt(0).toString(16))
}
// '1f40e', '1f471', '2764'

Array.from(string)

// 内部使用了迭代器协议
Array.prototype.forEach.call((codePoint) => {
  console.log(codePoint)
})

Array.prototype.map.call((codePoint) => {
  console.log(codePoint)
})
```

## 字符串转义序列

https://262.ecma-international.org/6.0/#sec-literals-string-literals

## 正则表达式中的转义序列
