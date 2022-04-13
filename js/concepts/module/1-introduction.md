# Javascript 模块机制

# 蛮荒时代

举一个例子，这个例子涉及几个模块，表现出下面描述的问题，

1. 全局变量，所有变量都在全局中， variables declared within a module is now "public" and available to other modules, which wasn't intended
1. 多个模块存在命名冲突，需要通过引入标识符重命名功能解决 The "scope pollution" problem
1. 被依赖的脚本必须在之前使用 script 标签引入，需要手动维护这个顺序
1. 异步模块

## 模块化解决的问题

1. 封装内部细节
1. 高内聚、低耦合的原则
1. 模块间的交互问题 导入导出机制，显式导入导出方式优于隐式 explicit is better than implicit, 对比 C++的 using std; Java 的 static import 等，批量导出
1. 模块加载机制 同步、异步
1. 循环依赖处理

模块声明导入导出，遵循面向接口编程，而不是面向实现

使用 IIFE 的方式将变量隔离，这种写法叫做 Module Pattern（模块模式）

[Javascript Module Pattern In Depth](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)

[Object Literal Pattern](http://blog.rebeccamurphey.com/2009/10/15/using-objects-to-organize-your-code)

<a href="https://docs.microsoft.com/en-us/previous-versions/msdn10/hh227261(v=msdn.10)"> Script Loader </a>

# 各种模块机制

1. [JavaScript Module Systems Showdown: CommonJS vs AMD vs ES2015](https://auth0.com/blog/javascript-module-systems-showdown/)
1. [History of Web Development: Javascript Modules](https://lihautan.com/javascript-modules/)
1. [图说 ES Modules](https://segmentfault.com/a/1190000014318751)

1. CommonJS
1. AMD
1. UMD
1. ES Module

## AMD

```js
define(id?, dependencies?, factory);

// 兼容commonjs的写法
define(function (require, exports, module){
  var someModule = require("someModule");
  var anotherModule = require("anotherModule");

  someModule.doTehAwesome();
  anotherModule.doMoarAwesome();

  exports.asplode = function (){
    someModule.doTehAwesome();
    anotherModule.doMoarAwesome();
  };
});
```

## UMD

```js
;(function (name, definition) {
  var hasDefine = typeof define === 'function'
  var hasExports = typeof module !== 'undefined' && module.exports

  // amd
  if (hasDefine) {
    define(name, definition)
    // commonjs
  } else if (hasExports) {
    module.exports = definition()
    // 全局
  } else {
    this[name] = definition()
  }
})('hello', function () {
  var hello = function () {}
  return hello
})
```

# 参考

1. [Exploring JS Chapter 16. Modules](https://exploringjs.com/es6/ch_modules.html)
1. Books About Module YDNJS/Ninja
1. 模块化 js ninja ch11
