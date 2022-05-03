# 刀耕火种

在没有模块机制之前，编写涉及多个部分的代码会遇到很多问题，将同一个功能相关的代码集中在一起编写是基本的诉求。例如我们使用 JQuery 编写一个应用，代码包含三个脚本，入口逻辑`app.js`、自定义的工具函数脚本`util.js`以及 JQuery 脚本代码。

```html
<!-- filename: index.html -->
<body>
  <script src="/jquery.js"></script>
  <script src="/utils.js"></script>
  <script src="/app.js"></script>
</body>
```

有这些问题需要处理。

1. 模块的下载安装，需要手动下载 JQuery 代码或者使用 CDN 地址。
1. 脚本定义的变量都在全局作用域，可能存在命名冲突，需要通过手动维护不同的命名空间来解决。
1. 模块依赖处理，需要保证脚本顺序正确，被依赖的模块先加载，模块数量很多时维护这个依赖关系成本较高。
1. 脚本之间的依赖关系通过隐式的使用关系确定，缺乏显式的指定

需要一种模块的机制来解决这些问题，遵循高内聚低耦合的原则将代码合理组织。另外对于 Javascript 模块来说还有以下问题需要考虑。

1. 模块加载机制同步、异步
1. 循环依赖处理
1. 模块依赖关系是静态还是动态，静态的依赖关系可以在编译时进行分析优化，动态的依赖关系更灵活。

有一些基本的代码模式提供了基本的模块机制。

# 对象模式（Object Literal Pattern）

[对象模式](https://www.oreilly.com/library/view/jquery-design-patterns/9781785888687/ch04s02.html#:~:text=The%20Object%20Literal%20Pattern%20is%20probably%20the%20simplest,pattern%20accurately%20describes%20the%20way%20it%20is%20used.)将同一个模块的代码全部定义到一个全局对象上，这种方式对代码进行了基本的划分，但是没有封装，模块内部代码仍然是公开的，可以被任意访问。

```html
<body>
  <script>
    var utils = {
      square(x) {
        return x * x
      },
      sum(x, y) {
        return x + y
      },
    }
  </script>
  <script>
    console.log(
      'squaredSum(1, 2) = ',
      utils.sum(utils.square(1), utils.square(2))
    )
  </script>
</body>
```

# 模块模式（Module Pattern）

[模块模式](https://www.patterns.dev/posts/classic-design-patterns/#modulepatternjavascript)使用 IIFE 的方式将模块的代码定义在独立的函数作用域，与全局作用域隔离，因此函数作用域内的私有变量对全局不可见，模块的公开变量通过函数返回值显式导出。

```js
var utils = function utils() {
  function square(x) {
    return x * x
  }

  function sum(x, y) {
    return x + y
  }

  return {
  }
})()

utils.sum(1, 2)
```

# CommonJS

Synchronous API makes it not suitable for certain uses (client-side).
One file per module.
Browsers require a loader library or transpiling.
No constructor function for modules (Node supports this though).
Hard to analyze for static code analyzers.

# AMD

https://requirejs.org/

1. 异步模块

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

```js
//Calling define with a dependency array and a factory function
define(['dep1', 'dep2'], function (dep1, dep2) {
  //Define the module value by returning a value.
  return function () {}
})

// Or:
define(function (require) {
  var dep1 = require('dep1'),
    dep2 = require('dep2')

  return function () {}
})
```

# UMD

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

# ES Module

# 参考

1. [Exploring JS Chapter 16. Modules](https://exploringjs.com/es6/ch_modules.html)
1. [What Server Side JavaScript needs](https://www.blueskyonmars.com/2009/01/29/what-server-side-javascript-needs/)
1. [Writing Modular JavaScript With AMD, CommonJS & ES Harmony](https://addyosmani.com/writing-modular-js/)
1. [JavaScript Module Systems Showdown: CommonJS vs AMD vs ES2015](https://auth0.com/blog/javascript-module-systems-showdown/)
1. [Javascript Design Pattern](https://www.patterns.dev/posts/classic-design-patterns/#modulepatternjavascript)
1. [History of Web Development: Javascript Modules](https://lihautan.com/javascript-modules/)
1. [ECMAScript 6 modules: the final syntax](https://2ality.com/2014/09/es6-modules-final.html)
1. Books About Module YDNJS/Ninja
1. 模块化 js ninja ch11
1. [ECMAScript Modules: Past, Present, and Future - Georg Neis](https://www.youtube.com/watch?v=F0K9jbw1T08)

Invalid Cycles

```js
// foo.js
export { x } from './foo.js'
```

```js
// foo1.js
export { x2 as x1 } from './foo2.js'

// foo2.js
export { x1 as x2 } from './foo1.js'
```

Valid Cycles

```js
// foo.js
import from './foo.js' // noop
```

```js
// foo.js
console.log(1)
export var f = () => 42
import './bar.js'

// bar.js
import { f } from './foo.js'
console.log(f())

// main.js
import './bar.js' // correct
```

```js
// foo.js
console.log(1)
export var f = () => 42
import './bar.js'

// bar.js
import { f } from './foo.js'
console.log(f()) // f 声明但是没有初始化，读取获得值undefined

// main.js
import './foo.js' // throws TypeError
```

```js
// foo.js
console.log(1)
export const f = () => 42
import './bar.js'

// bar.js
import { f } from './foo.js'
console.log(f()) // f声明但是没有初始化，const/let 变量位于TDZ

// main.js
import './foo.js' // throws ReferenceError TDZ
```

```js
// foo.js
console.log(1)
export function f() {
  return 42
}
import './bar.js'

// bar.js
import { f } from './foo.js'
console.log(f()) // f声明但是没有初始化，const/let 变量位于TDZ

// main.js
import './foo.js' // correct print 1 then 42
```

[import-maps](https://github.com/WICG/import-maps)
