# Interview

1. 面试题 https://zhuanlan.zhihu.com/p/62595083
1. 如何面试 https://www.zhihu.com/question/19568008/answer/39895653
1. 面试技巧 https://zhuanlan.zhihu.com/p/28333260

## JS

1. for in/for of/ enumerable property/Object.hasOwnProperty
1. 数组去重
1. 版本号对比
1. 深拷贝 https://yanhaijing.com/javascript/2018/10/10/clone-deep/

```js
compareVersion('4.0.1.0', '=', '0.4.1.0') // false
compareVersion('4.0.1.0', '>', '4') // true(0417修正)
compareVersion('4.0.1.0', '<', '4.1.0') // true
```

1. 笔试题 https://zhuanlan.zhihu.com/p/28592290
1. debounce/throttle
1. 原生 JS 实现发布订阅模式
1. leftPad 函数

```js
function leftpad(str, len, ch) {
  str = String(str)
  var i = -1
  if (!ch && ch !== 0) ch = ' '
  len = len - str.length
  while (++i < len) {
    str = ch + str
  }
  return str
}
```

对于一个数字进行格式化打印时需要左侧补位，得到指定长度的字符串，这样打印才能对齐，考虑实现这样一个函数有哪些问题？

1. 对于输入进行校验，是否数字类型、负数如何处理、0 如何处理、浮点数符合处理、带有+/-的数字处理、
1. 返回类型校验
1. 扩展性，可以指定补齐字符串的长度、可以指定用来补齐字符串的字符，不一定是'0'，也可以是空格；补齐支持使用字符串而不仅仅是单个字符；
1. 补齐的循环实现，每次都是拼接新的字符串，可以提前一次求得左侧补齐字符串，只做一次字符串拼接。
1. 扩展成右侧补齐，居中补齐

promise 十道题
https://zhuanlan.zhihu.com/p/30797777
https://www.zhihu.com/question/62305365/answer/199219185
https://www.zhihu.com/question/62305365/answer/198580686

## CSS

1. 盒模型面试题 https://zhuanlan.zhihu.com/p/61638917
1. opacity: 0、visibility: hidden、display: none 的区别

## Git

https://github.com/airuikun/blog/issues/5
