# 代码模式与生态

1. [Javascript Patterns](http://shichuan.github.io/javascript-patterns/)
1. [EventEmitter](https://www.bilibili.com/video/BV1qL4y1j7eM)
1. [透过现象看本质: 常见的前端架构风格和案例](https://juejin.cn/post/6844903943068205064#heading-9)
1. [JS 设计模式入门和框架中的实践](https://zhuanlan.zhihu.com/p/24980136)

## Practices

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
1. deep copy https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1
1. [菜鸟前端的咸鱼之旅-第四天：防抖节流](https://zhuanlan.zhihu.com/p/62138440)
1. [JavaScript 专题系列 20 篇正式完结！](https://juejin.cn/post/6844903506017517582)
1. throttle/debounce
1. lodash utils functions

### wraps an object

Given an object `http` like below. If you want to wrap it and provides new implementation some methods. Remeber that except target implementation to replace, other properties should remain same on wrapped object, this ensures full compatibility.

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
  },
}

const methods = ['get', 'post']
const wrappedHttp = {
  // inherit all properties from original object so that other properties remains same,
  ...http,
}

methods.forEach((method) => {
  const orignalMethod = http[method]

  wrappedHttp[method] = (...args) => {
    // reimplementation using original method, add enhanced function here
    return originalMethod(...args)
  }

  // new method should inherit orignal method so that any properties on orignal method are accessible too
  Object.setPrototypeOf(wrappedHttp[method], originalMethod)
})
```
