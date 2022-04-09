# 问题

1. 支持单纯的模块 模块 id
   1. 核心模块
   1. 相对路径（`./`、`../`）、绝对路径（`/a`）、文件模块，文件存在时默认为 js 模块，否则依次尝试不同后缀.js/.json/.node
   1. 文件夹模块、软链接 package.json#main 或者 index.js/index.json/index.node
   1. 用法 require 可以接受的模块标识 node:?，、、 ，
   1. 支持不同的扩展名 json 模块，.js 模块，node 模块
1. 加载失败处理
1. 导出对象

Module.paths

```js
> module
Module {
  id: '<repl>',
  path: '.',
  exports: {},
  filename: null,
  loaded: false,
  children: [],
  paths: [
    '/Users/penghui/coding/learning-notes/repl/node_modules',
    '/Users/penghui/coding/learning-notes/node_modules',
    '/Users/penghui/coding/node_modules',
    '/Users/penghui/node_modules',
    '/Users/node_modules',
    '/node_modules',
    '/Users/penghui/.node_modules',
    '/Users/penghui/.node_libraries',
    '/Users/penghui/.nvm/versions/node/v16.14.2/lib/node'
  ]
}
```

require steps

1. Resolving: To find the absolute path of the file
1. Loading: To determine the type of the file content
1. Wrapping: To give the file its private scope. This is what makes both the require and module objects local to every file we require
1. Evaluating: This is what the VM eventually does with the loaded code
1. Caching: So that when we require this file again, we don’t go over all the steps another time

# resolve

resolve only

```js
require.resolve
```

## 软链接问题

## webpack enhanced-resolve

# loading

cjs 的 this 指向 module.exports

```js
Module._load = function (request, parent, isMain) {
  // 1. Check Module._cache for the cached module.
  // 2. Create a new Module instance if cache is empty.
  // 3. Save it to the cache.
  // 4. Call module.load() with your the given filename.
  //    This will call module.compile() after reading the file contents.
  // 5. If there was an error loading/parsing the file,
  //    delete the bad module from the cache
  // 6. return module.exports
}
```

```js
require.extensions
```

# wrapping

node.js NativeModule.wrap

[The module wrapper](https://nodejs.org/api/modules.html#the-module-wrapper)

1. 如何将 `module/exports/require/filename/dirname` 等变量传递给模块

导出的 module.exports/exports 是值拷贝形式，

require -> load -> resolveFilename -> compile

# 同步加载

CommonJS 模块是同步形式加载的，没法使用异步的方式设置模块导出对象

```js
fs.readFile('/etc/passwd', (err, data) => {
  if (err) throw err
  exports.data = data // Will not work.
})
```

# require.main

[Accessing the main module](https://nodejs.org/api/modules.html#accessing-the-main-module)

```js
require.main = process.mainModule
```

```js
// print-in-frame.js
const printInFrame = (size, header) => {
  console.log('*'.repeat(size))
  console.log(header)
  console.log('*'.repeat(size))
}

if (require.main === module) {
  printInFrame(process.argv[2], process.argv[3])
} else {
  module.exports = printInFrame
}
```

命令行直接使用 `node print-in-frame 8 Hello`

或者脚本使用。

```js
const print = require('./print-in-frame')

print(5, 'Hey')
```

NPM 在 8.0.0 版本后使用[`require.main`](https://github.com/npm/cli/blob/1617bce61663a743435d162b003d3b99376d426f/index.js#L1)禁用代码形式的使用方式，只允许通过命令行方式。

```js
if (require.main === module) {
  require('./lib/cli.js')(process)
} else {
  require('./lib/cli.js')(process)
  // throw new Error('The programmatic API was removed in npm v8.0.0')
}
```

wrapper

# 缓存

```js
require.cache
```

1. 添加缓存支持，添加循环依赖支持
1. 模块缓存，模块加载失败需要从缓存中删除
1. [invalidate cache](https://stackoverflow.com/questions/9210542/node-js-require-cache-possible-to-invalidate)

# 副作用

想要一个模块每次被加载时副作用都会执行的办法

1. 加载后删除 cache，效率较低
1. 导出函数，每次调用

# 循环依赖

[循环依赖](https://nodejs.org/api/modules.html#cycles)

# ts-node 如何使用加载 ts 文件？

# 虚拟模块

http://www.ayqy.net/blog/api%e6%b3%a8%e5%85%a5%e6%9c%ba%e5%88%b6%e5%8f%8a%e6%8f%92%e4%bb%b6%e5%90%af%e5%8a%a8%e6%b5%81%e7%a8%8b_vscode%e6%8f%92%e4%bb%b6%e5%bc%80%e5%8f%91%e7%ac%94%e8%ae%b02/

# C++ 模块

node-gyp

# 模块别名

alias

webpack/typescript

# debug node.js source

# vm 模块

vm.runInThisContext

# ESM

1. 静态机制，要经过解析和运行两个阶段
1. import readonly，导入的符号只读
1. import 语句提升，会在模块加载前初始化
1. 导入符号是引用形式，不是拷贝，所以引用内容发生变化得到的值也会变化

# babel 模拟 ESM

1. 引用值 改变
1. 导入符号只读
1. 导入语句符号提升

# 参考资料

1. [Module Loader](https://es6.ruanyifeng.com/#docs/module-loader)
1. [The Node.js Way - How `require()` Actually Works](http://fredkschott.com/post/2014/06/require-and-the-module-system/)
1. [Requiring Modules](https://jscomplete.com/learn/node-beyond-basics/requiring-modules)
1. [node_main.cc 模块加载](https://juejin.cn/post/6929135927323262983)
