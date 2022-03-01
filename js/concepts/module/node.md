## Node 模块

### 机制

[CommonJS 模块机制 Wiki](https://zh.wikipedia.org/wiki/CommonJS#cite_note-7)
[Official Spec](https://github.com/commonjs/commonjs)
[Modules 1.1.1](http://wiki.commonjs.org/wiki/Modules/1.1.1)

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

```js
function loadModule(filename, module, require) {
  var wrappedSrc =
    '(function(module, exports, require) {' +
    fs.readFileSync(filename, 'utf8') +
    '})(module, module.exports, require);'
  eval(wrappedSrc)
}

var require = function (moduleName) {
  console.log('Require invoked for module: ' + moduleName)
  var id = require.resolve(moduleName)
  if (require.cache[id]) {
    return require.cache[id].exports
  }
  //module metadata
  var module = {
    exports: {},
    id: id,
  }
  require.cache[id] = module
  //load the module
  loadModule(id, module, require)
  //return exported variables
  return module.exports
}
require.cache = {}
require.resolve = function (moduleName) {
  /* resolve a full module id from the moduleName */
}
```

### Node 模块实现机制

核心模块和文件模块，核心模块直接编译执行。

1. 路径分析
1. 文件定位
1. 编译执行

#### 路径分析与文件定位

Node 有四种类型路径

1. 核心模块
1. `.`/`..`的相对路径文件模块
1. `.`/`..`的绝对路径文件模块
1. 非路径形式的文件模块，使用`module.paths`路径，从当前目录中`node_modules`子目录中查找，逐层向上

对于不存在扩展名的情况依次尝试`.js`、`.json`、`.node`

1. 可能找到一个文件
1. 目录 -> 尝试查找 package.json 文件的 main 字段指定的入口文件，不存在的话依次使用`index.js`，`index.json`，`index.node`。
   1. 使用本地 node_modules，逐层向上，
   1. 使用 NODE_PATH 环境变量指定的全局 node_modules 目录
1. 不存在的情况抛出错误

[require](http://nodejs.cn/api/modules.html#modules_all_together)

```js
interface Require {
  (id: string): any;
  resolve: RequireResolve;
  cache: Dict<NodeModule>;
  /**
   * @deprecated
   */
  extensions: RequireExtensions;
  main: Module | undefined;
}
```

#### 模块编译

每个模块都是一个对象

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  if (parent && parent.children) {
    parent.children.push(this)
  }
  this.filename = null
  this.loaded = false
  this.children = []
}
```

如果想要整体导出，使用`module.exports = value`，因为`exports`是一个函数形参，无法改变外部的变量

核心模块分为 JS 模块和 C/C++模块

```js
function NativeModule(id) {
  this.filename = id + '.js'
  this.id = id
  this.exports = {}
  this.loaded = false
}
NativeModule._source = process.binding('natives')
NativeModule._cache = {}
```

#### 缓存与循环依赖

模块加载第一次就会进行缓存，再次加载时从缓存中读取，因此允许循环依赖的情况出现。

使用`require`的模块会被缓存，缓存使用模块被解析的**文件名**作为 key，所以使用不同的路径名，但是路径经过解析后相同的话，是同一个模块。

```js
// 同一个模块
const mod1 = require('./test')
const mod1 = require('./test.js')

// 在不区分大小写的文件系统上，这两个模块指向同一个文件，但是使用的解析得到的路径名不同，所以同一个文件会被加载两次。
const mod1 = require('./test')
const mod1 = require('./TEST')
```

使用`new Module`创建模块可以使每个模块实例都是独立的

`require.main` 入口模块

#### 内建 C/C++模块

1.  Node.js：来一打 C++ 扩展

### 其他模块

AMD

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

UMD

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
