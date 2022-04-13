## 不同模块交互机制

CommonJS / ESModule / tsconfig esModuleInterop interoperability
CommonJS 模块历史

参考

1. [深入解析 ES Module（一）：禁用 export default object](https://zhuanlan.zhihu.com/p/40733281)
1. [深入解析 ES Module（二）：彻底禁用 default export](https://zhuanlan.zhihu.com/p/97335917)
1. [cjs 的模块如何和 es6 的模块相互调用？](https://www.zhihu.com/question/288322186/answer/460742151)
1. [ES Module Interoperability](https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#46-es-consuming-commonjs)
1. [Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)

不建议使用 default import/export

由于 ES6 还未被浏览器直接支持，所以其模块需要转换成 CommonsJS/AMD 等模块进行执行。默认导出在这里面会有点问题，CommonJS 模块中默认导出相当于是整体导出，但是 ES Module 需要同时支持默认导出和命名导出，所以转换为 CommonJS 时只好使用`module.exports.default`变量代表默认导出的内容。但是这样存在一个问题，普通的 CommonJS 模块文件并没有这个`default`属性，那么混用的时候无法区分 CommonJS 模块是否由 ES Module 转换而来。

```js
// 需要手动指定 default属性
const Math = require('./math.js').default
```

为了进行区分，Babel 给由 ES Module 转换生成的 CommonJS 模块添加了一个属性`__esModule`，并且在模块加载的时候将`__esModule`是`false`的普通 CommonJS 模块添加`default`属性，转换成统一的形式。

参考下面的[例子](https://ryerh.com/javascript/2016/03/27/babel-module-implementation.html)、[问题](https://stackoverflow.com/questions/50943704/whats-the-purpose-of-object-definepropertyexports-esmodule-value-0)

用法

```js
// 解释为什么有这些不同
// 正确
require(`${path}/counter.js`).count

// 错误
import { count } from `${path}/counter.js`

import value from `${path}/counter.js`
const { count } = value;
```

导出

```js
export const InlineExport = {}
const NormalExport = {}
const RenameExport = {}
const DefaultExport = {}

export { NormalExport }
export { RenameExport as HasRenamed }
export default DefaultExport

// 转换后
;('use strict')

// 定义 __esModule
Object.defineProperty(exports, '__esModule', {
  value: true,
})
var InlineExport = (exports.InlineExport = {})
var NormalExport = {}
var RenameExport = {}
var DefaultExport = {}

exports.NormalExport = NormalExport
exports.HasRenamed = RenameExport
exports.default = DefaultExport
```

导入

```js
import { NormalExport } from 'normal'
import { HasRenamed as RenameAgain } from 'rename'
import DefaultExport from 'default'
import * as All from 'all'

NormalExport()
RenameAgain()
DefaultExport()
All()

// 转换后
;('use strict')

var _normal = require('normal')
var _rename = require('rename')

var _default = require('default')
var _default2 = _interopRequireDefault(_default)

var _all = require('all')
var all = _interopRequireWildcard(_all)

;(0, _normal.NormalExport)()
;(0, _rename.HasRenamed)()
;(0, _default2.default)()
all.hello()

// 这里为obj添加default属性指向它本身
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

// 通配符导入对象整体不包含default属性
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj
  } else {
    var newObj = {}
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key]
      }
    }
    newObj.default = obj
    return newObj
  }
}
```

`__esModule`解决了识别 ES Module 转换成的 CommonJS 模块的问题，但是对于普通调用者来说在默认导入 CommonJS 模块时还需要手动指定`.default`属性。在模块[**只有默认导出**](https://www.npmjs.com/package/babel-plugin-add-module-exports)的情况下，[**Babel 6 之前**](https://babeljs.io/docs/en/babel-plugin-transform-es2015-modules-commonjs#nointerop)对此进行了处理，将默认导出对象当做整体导出。

```js
// 只有默认导出
export default test

// 默认导出被绑定到整体
exports['default'] = test
module.exports = exports['default']

// 直接导入即可，不需要指定.default
const test = require('./test')
```

一旦不是只有默认导出，这种情况就不再成立，还是需要手动指定`default`属性。

Typescript 对此的[解决办法](https://github.com/Microsoft/TypeScript/issues/2719)是提供了 import/export assignment 语法来专门对应默认导入导出，且 import/export assignment 只能在目标模块是 CommonJS 时使用。同时为默认导入导出语法提供和 Babel 一致的处理方法。

但是其他的打包工具如 Rollup 对默认导出的处理不尽相同，不一定使用和 Babel 一致的方案，Rollup 现在通过[插件](https://www.npmjs.com/package/rollup-plugin-es-module-interop)提供了和 Babel 一致的方案。

Chalk 为了支持默认导出且能使用`const a = required()`不添加`default`属性的形式，自身做了处理。

```js
module.exports = Chalk()
module.exports.default = module.exports
```

但是这样形成了循环引用，如果需要对其序列化会出[问题](https://github.com/sindresorhus/mem/issues/31)。

## 禁用默认导入导出

1. CommonJS 默认导入的命名是随意的，不经意的拼写错误不会有任何提示。命名导出能够保证名称在多个文件中的一致性，即使使用重命名的命名导出，二者之间的关系也比较清楚。
1. ES Module 的静态模块机制下，命名导出的名称如果不存在会报错，默认导出则不会。IDE 还可以提示可导入的名称。
1. 命名导出有利于重构，改变导出名称时自动完成。
1. 默认导出不利于 treeshaking
1. 在**默认导出意图非常明显**同时不使用**命名导出**的情况下考虑使用默认导出，例如单个 React 组件默认导出。

# 参考

1. [深入解析 ES Module（一）：禁用 export default object](https://zhuanlan.zhihu.com/p/40733281)
1. [深入解析 ES Module（二）：彻底禁用 default export](https://zhuanlan.zhihu.com/p/97335917)
1. [cjs 的模块如何和 es6 的模块相互调用？](https://www.zhihu.com/question/288322186/answer/460742151)
1. [ES Module Interoperability](https://github.com/nodejs/node-eps/blob/master/002-es-modules.md#46-es-consuming-commonjs)
1. [Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/)
