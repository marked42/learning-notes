# 代码模式与生态

1. [Javascript Patterns](http://shichuan.github.io/javascript-patterns/)

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
1. [JSON Parser with Javascript](https://lihautan.com/json-parser-with-javascript/)
1. vue
    1. 类似 vue template 解析
    1. [Vue 的模板编译](https://www.bilibili.com/video/BV1Rf4y1S7RN?from=search&seid=12773308433329510711)
    1. vue publisher/subscriber
    1. [vue 的 nextTick 批量更新](https://zhuanlan.zhihu.com/p/36553258)
    1. https://zhuanlan.zhihu.com/p/24435564
1. 虚拟 DOM 算法
    1. https://zhuanlan.zhihu.com/p/36500459
    1. https://zhuanlan.zhihu.com/p/101176821
1. [响应式前端框架](https://zhuanlan.zhihu.com/p/62411633)
1. observable
1. express/koa 的核心代码分析
1. [透过现象看本质: 常见的前端架构风格和案例](https://juejin.cn/post/6844903943068205064#heading-9)
1. [JS 设计模式入门和框架中的实践](https://zhuanlan.zhihu.com/p/24980136)
1. [菜鸟前端的咸鱼之旅-第四天：防抖节流](https://zhuanlan.zhihu.com/p/62138440)
1. [JavaScript 专题系列 20 篇正式完结！](https://juejin.cn/post/6844903506017517582)
1. throttle/debounce
1. 模板引擎 EJS，字符串拼接的性能问题
1. [Template Engine](https://github.com/danistefanovic/build-your-own-x#build-your-own-template-engine)
1. 前端生态中很多库和工具使用的插件机制研究
1. Functional

    1. [谈递归（一）：递归的五种定式](https://zhuanlan.zhihu.com/p/84452538)
    1. [函数式编程](https://www.bilibili.com/video/BV1Mh411Z7LC)

### `parseInt`

```js
["11", "11", "11", "11"].map(parseInt);
```

Result is `[11, NaN, 3, 4]`, because `parseInt` receives a second argument as radix to parse string. `Array.prototype.map` receives parameters like below.

```js
Array.prototype.map((callback: (currentValue, index, array) => any), thisArg);
```

So `parseInt` is called four times like below.

```js
parseInt("11", 0); // radix is 10
parseInt("11", 1); // invalid radix, return NaN
parseInt("11", 2);
parseInt("11", 3);
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
	let hex = value.toString(16);
	return hex.length < 2 ? `0${hex}` : hex;
}

function rgbToHexString(r, g, b) {
	return ["#", toHext(r), toHext(g), toHext(b)].join("");
}
```

### wraps an object

Given an object `http` like below. If you want to wrap it and provides new implementation some methods. Remeber that except target implementation to replace, other properties should remain same on wrapped object, this ensures full compatibility.

```js
const http = {
	get() {
		console.log("original get");
	},
	post() {
		console.log("original post");
	},
	other() {
		console.log("original other");
	},
};

const methods = ["get", "post"];
const wrappedHttp = {
	// inherit all properties from original object so that other properties remains same,
	...http,
};

methods.forEach((method) => {
	const orignalMethod = http[method];

	wrappedHttp[method] = (...args) => {
		// reimplementation using original method, add enhanced function here
		return originalMethod(...args);
	};

	// new method should inherit orignal method so that any properties on orignal method are accessible too
	Object.setPrototypeOf(wrappedHttp[method], originalMethod);
});
```
