# 用法

[CommonJS 模块机制 Wiki](https://zh.wikipedia.org/wiki/CommonJS#cite_note-7)
[Official Spec](https://github.com/commonjs/commonjs)
[Modules 1.1.1](http://wiki.commonjs.org/wiki/Modules/1.1.1)

Kevin Dangoor 最早在[What Server Side Javascript Needs](https://www.blueskyonmars.com/2009/01/29/what-server-side-javascript-needs/)提出了 CommonJS 的设想，

1. [CommonJS effort sets JavaScript on path for world domination](https://arstechnica.com/information-technology/2009/12/commonjs-effort-sets-javascript-on-path-for-world-domination/)
1. [CommonJS Wiki](http://wiki.commonjs.org/wiki/Modules)

1. require
   1. 使用`require(module-name)`函数导入模块
   1. `require.main` 只读，等同于`module`
   1. `require.paths`
1. module context
   1. 使用`exports`导出,`module`代表模块本身，`module.id`是模块的 id，`require(module.id)`返回同一个模块
   1. module.id
   1. module.uri
1. module identifiers
   1. 驼峰式，'.' '..'
   1. 可以没有文件后缀`.js`
   1. `/`分隔
   1. 相对路径模块`.`,`..`开头，其他形式是顶层模块，相对模块相对于`require`所在的文件进行解析，顶层模块相对于项目根目录解析

CommonJS 中使用变量`module.exports`和`exports`来导出对象，使用`require(module_name)`来导入对象。

## 分别导出

```js
// math.js
const PI = 3.141592653589793
const E = 2.718281828459045
module.exports = PI
module.exports = E

// require函数返回值就是module.exports，在此重新赋值给其他变量math
const math = require('./math.js')
console.log(math.PI)
console.log(math.E)

// 可以直接使用解构语法，但这和模块导入本身没关系
const { PI, E } = require('./math.js')
```

## 整体导出

也可以对`module.exports`整体赋值，导出一整个对象。但是注意 CommonJS 模块导出的对象始终是`module.exports`,而`exports`不过是指向`module.exports`的一个普通变量，对其**整体赋值**的话并**不能**整体导出，反而切断了`exports`与`module.exports`的联系，后续`exports`也就不能再进行导出。仅仅为了**少打几个字**而提供的`exports`附带了这样一个[坑](https://blog.codinghorror.com/falling-into-the-pit-of-success/)不能不说是一个设计失误，反而只有`module.exports`一种导出语法，使用起来简单一致才是更好的设计。

```js
// math.js
const Math = {
  PI: 3.141592653589793,
  E: 2.718281828459045,
}
module.exports = Math

// 导入语法相同，将返回值赋值给其他变量即可
const Math = require('./math.js')
```

## 导入

CommonJS

1. 解释 module.exports/exports 几种不同用法的含义，应该禁用使用 exports 的方式避免落入陷阱

```js
module.exports = 1

exports = 2

module.exports.a = 1
exports.a = 2
```
