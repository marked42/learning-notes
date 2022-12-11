# 打包

# 一个打包器要做什么？

输入 -> 输出

输入是什么，目标环境决定了输出的格式，如何区分目标环境

## webpack

将本地代码文件打包为 web 环境能够运行的代码，也就是 js 代码

支持使用 CommonJS / UMD 格式

1. 提供 require/module/module.exports 环境
1. 将 ESModule 转换为 CommonJS 在 web 端运行
1. 模块缓存

依赖分析

1. 合适的 Module Id
1. Module resolution 的过程
1. 如何处理输出格式中 模块 path 和模块 id 的对应关系
1. 如何构建依赖图 参考 https://zhuanlan.zhihu.com/p/369953304

webpack 配置文件中路径配置使用相对路径时，解析为绝对路径时不是以配置文件所在路径进行，而是以当前进程工作路径`process.cwd()`，所以如果当前工作路径与配置文件所在路径不一致而且错误地使用配置文件路径进行相对路径配置的话会造成文件无法正确找到的问题。可以考虑使用`entry.context`选项指定某个路径而不是使用当前工作路径进行配置文件中相对路径的解析。考虑每个模块需要唯一的模块 id，使用相对目录是一个直接的选择。

webpack resolve 配置

```js
module.exports = {
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
    // 必须加前缀.，否则解析模块会失败，对于常见的文件类型写到extensions中，其他类型书写完整的后缀名称，提高查找速度
    extensions: ['.vue', '.js'],
    // 指定查找目录，提高速度
    modules: [path.resolve(__dirname, 'node_modules')],
    mainFields: ['main'],
  },
}
```

解析模块时指定`package.json`中使用哪个字段代表模块的入口文件，默认配置和`target`的值有关。

1. `target`是`webworker`,`web`或者未指定，`mainFields: ['browser', 'module', 'main']`
1. `target`是`node`，`mainFields: ['module', 'main']`

按数组顺序找到第一个存在的字段使用。

# loader 机制的设计

1. 通过 loader 支持多种模块格式
1. 支持引入资源文件（css、image）等
1. 语法转换能力，支持 Typescript/JSX 等语法扩展

为什么这么设计，和 HTTP 请求有类似的结构，给出输入，经过一系列串行处理得到输出

Pitching Phase

post inline normal pre

Normal Phase

pre normal inline post

Rule.enforce: 'pre' | 'post'

pre: eslint-loader

```js
// Disable normal loaders
import { a } from '!./file1.js'

// Disable preloaders and normal loaders
import { b } from '-!./file2.js'

// Disable all loaders
import { c } from '!!./file3.js'
```

Inline loaders and ! prefixes should not be used as they are non-standard. They may be use by loader generated code.

```js
// PitchingLoader的参数类型
module.exports.pitch = function (request, previousRequest, data) {}
```

loader1.pitch -> loader2 -> ... -> loaderN
resource file
loader1.normal -> loader2 -> ... -> loaderN

Pitching Loaders 顺序执行，Normal Loaders 在逆序执行，每个 normal loader 接受的参数是上一个 loader 的返回值,
Pitching Loaders 返回值有不是 undefined 时终止执行，逆序执行 normal loader。
正常的第一个 normal loader 接受的参数 result 代表文件内容。

Pitching Loaders 和 Normal Loaders 执行流程中任何一个 Loader 抛出错误则整个流程结束

1. 同步 loader
   1. 使用`this.callback`作为回调，成功`callback(null, result)`，失败`callback(err)`
   1. 正常返回非 Promise 的值或者不返回任何值（相当于返回 undefined）
1. 异步 loader

   1. 返回 Promise，resolved 状态代表成功，reject 状态代表失败
   1. 使用`this.async`

1. normal loader 成功执行时，接受的 result 参数是 string 或者 Buffer 类型时，raw: true 选项自动转换为 Buffer 类型，raw:false 自动转换为 string 类型，其他类型保持不变。
   loader 函数执行出错调用`callback(err)`,成功`callback(null, result)`

# 输出格式

输出格式

https://juejin.cn/post/6872354325553741838#heading-0

1. 打包时环境判断，`package.json#browser`字段

## ES Module 顺序问题

outputPath
publicPath
动态的 publicPath，使用 `__webpack_public_path__`

存在一个问题，ES Module 的模块导入方式顶层`import`会被在模块加载时首先执行，

```js
__webpack_public_path__ = 'https://cdn.example.com'

import image from './image.png'

console.log('image: ', image)
```

相当于这样

```js
import image from './image.png'

__webpack_public_path__ = 'https://cdn.example.com'
console.log('image: ', image)
```

因此`__webpack_public_path__`在初始化之前就使用，无法正确生效。

使用以下两种正确的形式。

```js
__webpack_public_path__ = 'https://cdn.example.com'

// require是commonjs形式，不会被提升
const image = require('./image.png')

console.log('image: ', image)
```

或者将其放入单独的模块中保证顺序。

```js
// public_path.js
__webpack_public_path__ = 'https://cdn.example.com'

// index.js
import './public_path'
import image from './image.png'

console.log('image: ', image)
```

# polyfill

JS 代码分为规范本身的语言特性 + 宿主环境提供的 API

1. polyfill 如何在浏览器上兼容 node 环境的 api
1. 全局变量 process.env
1. javascript 的环境对象 process.env 如何处理？DefinePlugin？Javascript 的代码分为几部分，语言规范本身、host 环境、测试环境 describe 等 webpack 5 需要手动添加 node-polyfill-plugin
   1. https://www.npmjs.com/package/node-polyfill-webpack-plugin
   1. https://github.com/webpack/webpack/issues/11282
   1. https://github.com/webpack/changelog-v5#automatic-nodejs-polyfills-removed
   1. https://webpack.js.org/configuration/resolve/#resolvealias
   1. fs 等浏览器不支持的功能无法 polyfill
   1. 讲解 webpack 使用的 umd 模块格式

# 打包优化

1. cache 缓存 / 文件改变后如何最小化增量打包 [webpack 5](https://zhuanlan.zhihu.com/p/110995118)
1. 插件系统如何设计
1. plugin 选项

# hash

1. hash 整个项目
1. chunkhash 每个模块入口对对应的所有 chunk，js 文件使用，公共代码不变的话 chunkhash 不变
1. contenthash 单个文件内容 css 文件使用

## scope hoisting

```js
module.exports {
  plugins: [
    new webpack.ModuleConcatenationPlugin()
  ]
}
```

## tree shaking

Tree Shaking 指的是通过对 JS 代码分析，将其中未使用到的代码（dead code elimination）在打包时移除的优化手段。基于 ES 模块的的[静态结构特性](.https://exploringjs.com/es6/ch_modules.html#static-module-structure)，如果一个模块中导出多个对象，如果其中一些导出对象未被其他任何模块使用到，那么这些导出对象的相关代码也是死代码，可以移除。CommonJS 模块不支持这种优化方式，因为模块被整体导出到`module.exports`对象上，无法区分导出对象上单个属性是否用到。

babel-plugin-lodash

对于只提供了 commonjs 模块代码的库，可以通过`package.json`的`sideEffects: false`将库标记为无副作用（改变全局变量，引入 css 等其他资源被认为是副作用）。如果该库被引入，但是引入对象并没有在其他模块使用，则该库可以被删除。

Webpack 的 Tree Shaking 优化

1. ES 模块被默认为是无副作用的`sideEffects: false`，
   ```js
   // esm模块这两种形式的倒入代码会被tree shaking优化掉，
   // 但是会存在修改全局变量等副作用代码，这个时候不能被优化掉，这种情况webpack没有正确处理
   import { NotUsed } 'esm';
   import 'esm';
   ```
1. commonjs 模块默认为有副作用的，可以配置`sideEffects: false`表明模块没有副作用，这样在未被其他模块饮用的情况下可以被优化掉。
1. `sideEffects`字段支持数组配置，相对路径、绝对路径和 glob 模式，表示对应文件有副作用。
   ```js
   {
     "name": "your-project",
     "sideEffects": [
       "./src/some-side-effectful-file.js",
       "*.css"
     ]
   }
   ```

Webpack 中的 Tree Shaking 优化由`terser-webpack-plugin`或者`uglifyjs-webpack-plugin`进行，默认或者`development`模式下这些插件没有使用，设置`production`模式启用插件开启优化。

`terser-webpack-plugin`对应的优化配置字段

```js
// 开启副作用优化
optimization: {
  sideEffects: true
}

// 只使用人工的无副作用标记，不对代码进行副作用分析。
optimization: {
  sideEffects: 'flag'
}
```

1. [如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432/answer/93346223)
1. https://webpack.js.org/configuration/optimization/#optimizationsideeffects
1. https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
1. https://github.com/webpack/webpack/issues/6065#issuecomment-351060570
1. https://github.com/webpack/webpack/issues/6065#issuecomment-351060570
1. https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.1ndfj9dqd

# split

1. 同一入口配置，多种输出配置
1. 支持模块拆分 split chunk
1. CommonsChunkPlugin/SplitChunkPlugin
1. [webpack code splitting](https://zhuanlan.zhihu.com/p/25534249)
1. 支持 external module

# 按需加载

异步模块

1. https://juejin.cn/post/6872354325553741838#heading-4
1. 支持 异步模块导入 import('./a') [按需加载](https://www.zhihu.com/question/58460116/answer/1814301201) https://zhuanlan.zhihu.com/p/100459699

1. 分包 code splitting externals, SplitChunksPlugin, split 字段，动态代码

使用`import(chunkName)`或者`require.ensure(chunkName)`异步加载组建，内部使用`document.createElement('script')`和`JSONP`实现。

1. import 一次，不重复发送异步代码请求

# 体积优化

1. 压缩输出

# 速度优化

# source-map

1. eval
1. source-map 生成.map 文件
1. cheap 不包含列信息
1. inline 内联的 DataUri，不生成.map 文件
1. module 包含 loader 信息的 source map

## 增量打包

1. webpack hash https://zhuanlan.zhihu.com/p/31456808

## cache 缓存

1.  [从构建进程间缓存设计 谈 Webpack5 优化和工作原理](https://zhuanlan.zhihu.com/p/110995118)

## 多线程

# preload & prefetch

1. `prefetch`空闲状态下载，调出空闲状态时下载中断，部分(Content-Range)或者全部文件内容缓存起来供未来使用。
1. `preload`中等优先级下载，不阻塞布局(non layout-blocking)
1. 所有的`prefetch`资源在一个队列中强占带宽，使用数字调整资源下载的优先级，`true`相当于`0`。
   `import(/* webpackPrefetch: true */ "...")`
   `import(/* webpackPrefetch: 10 */ "...")`
   `import(/* webpackPreload: true */ "...")`
1. 区别

   1. A preloaded chunk starts loading in parallel to the parent chunk. A prefetched chunk starts after the parent chunk finish.
   1. A preloaded chunk has medium priority and instantly downloaded. A prefetched chunk is downloaded in browser idle time.
   1. A preloaded chunk should be instantly requested by the parent chunk. A prefetched chunk can be used anytime in the future.
   1. Browser support is different.

1. https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c
1. https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content

# tapable

SyncHook 的两个要求

1. 能够单独指定两个函数的先后顺序 `before`字段
1. 能够给每个函数指定一个优先级，按照优先级顺序执行，`stage`字段
1. 同一 stage 且未指定先后顺序的，按照添加顺序先后执行。
1. tap 名称不能为空，能重名么？

# 资源文件处理

## style-loader

配合`css-loader`使用，生成的 js 模块副作用是利用`document.createElement('style')`在文档中自动插入`<style>`标签，内容是转换完成的 css，并且将
css modules 的本地类名导出（注意不在`locals`字段下了，且不包含`css-loader`其他的字段了，单纯的一个本地类名字典）。

## mini-css-extract-loader

配合`css-loader`使用，将 css 内容输出到单独的 css 文件中，并且对应的 js 模块和`style-loader`一样将 css modules 的本地类名导出。

注意配合使用的版本，可能会报错 `compilation.getAsset` is not a function

## postcss-loader

用在`less/sass/stylus`等 loader 之后，`css-loader`之前，用来对 css 做后处理。

# HRM

1. HMR 热更新能力
1. webpack hmr https://zhuanlan.zhihu.com/p/30669007
1. [热更新](https://juejin.cn/post/6844903933157048333)

# rollup

rollup

1. [rollup](https://www.bilibili.com/video/BV1Ah411S7wJ)

# bundless

1. [vite](https://www.bilibili.com/video/BV1kh411Q7WN)
1. [vite](https://zhuanlan.zhihu.com/p/149033579)

# 参考

1. [Everything is a plugin! Mastering webpack from the inside out - Sean Larkin](https://www.bilibili.com/video/BV195411Q7zS/)
1. [Minipack](https://github.com/ronami/minipack)
1. [简释前端打包工具 - Webpack, Rollup, Vite 1](https://www.bilibili.com/video/BV1bq4y117Hz)
1. [简释前端打包工具 - Webpack, Rollup, Vite 2](https://www.bilibili.com/video/BV1VZ4y1Q7QF)
1. [Webpack Plugins System](https://www.bilibili.com/video/BV1VS4y1G7W4)
1. [Tapable](https://zhuanlan.zhihu.com/p/367931462)
1. [前端有必要学习 webpack 吗？](https://www.zhihu.com/question/472006458/answer/2011414629)
1. [前端历史项目的 Vite 迁移实践总结](https://zhuanlan.zhihu.com/p/391077878)
1. [vite 多久后能干掉 webpack？](https://www.zhihu.com/question/477139054/answer/2156019180)
1. [HMR](https://github.com/withastro/esm-hmr/issues/7)
1. [如何阅读 Webpack 源码](https://www.bilibili.com/video/BV1vD4y1v7ok/?)

1. [ESBuild](https://esbuild.github.io/)
1. [SWC](https://swc.rs/)
1. [ninja](https://www.aosabook.org/en/posa/ninja.html)

1. [Writing build plugins](https://www.youtube.com/watch?v=mr67QkDfkoQ)

1. https://bundlers.tooling.report/
1. web.dev
