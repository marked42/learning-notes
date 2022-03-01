# 打包

1. 模块打包 webpack/rollup/vite
   1. minipack
   1. 模块依赖分析 对这个过程如何抽象设计才合理
   1. javascript 的环境对象 process.env 如何处理？DefinePlugin？Javascript 的代码分为几部分，语言规范本身、host 环境、测试环境 describe 等 webpack 5 需要手动添加 node-polyfill-plugin
      1. https://www.npmjs.com/package/node-polyfill-webpack-plugin
      1. https://github.com/webpack/webpack/issues/11282
      1. https://github.com/webpack/changelog-v5#automatic-nodejs-polyfills-removed
      1. https://webpack.js.org/configuration/resolve/#resolvealias
      1. fs 等浏览器不支持的功能无法 polyfill
      1. 讲解 webpack 使用的 umd 模块格式
   1. rollup 对于 process 的处理？
1. bundler 包括依赖分析、异步组件，参考 webpack/rollup/parcel/vite

   1. webpack 打包使用 node 原生模块 path 的代码会报错，path 找不到，rollup 将其默认为外部模块？
   1. [webpack loader plugin](https://juejin.cn/post/6871239792558866440)
   1. [webpack code splitting](https://zhuanlan.zhihu.com/p/25534249)
   1. [深入了解 webpack 模块加载原理](https://juejin.cn/post/6872354325553741838)
   1. [从构建进程间缓存设计 谈 Webpack5 优化和工作原理](https://zhuanlan.zhihu.com/p/110995118)
   1. https://zhuanlan.zhihu.com/p/24717349
   1. [三十分钟掌握 Webpack 性能优化](https://juejin.cn/post/6844903651291447309)
   1. webpack hmr https://zhuanlan.zhihu.com/p/30669007
   1. webpack hash https://zhuanlan.zhihu.com/p/31456808
   1. [热更新](https://juejin.cn/post/6844903933157048333)
   1. [rollup](https://juejin.cn/post/6898865993289105415)
   1. [rollup](https://www.bilibili.com/video/BV1Ah411S7wJ)
   1. [vite](https://www.bilibili.com/video/BV1kh411Q7WN)
   1. [vite](https://zhuanlan.zhihu.com/p/149033579)
   1. [如何写一个标准的前端脚手架](https://zhuanlan.zhihu.com/p/105846231)
   1. [蒋豪群：我在维护 VUE CLI 项目过程中学到了什么](https://www.bilibili.com/video/BV1R54y1B7FB?from=search&seid=11465468630072303797)

1. JavaScript: Build Your Own Module Bundler - Minipack
1. [Tiny Package Manager](https://github.com/g-plane/tiny-package-manager)

[snowpack](https://zhuanlan.zhihu.com/p/149351900) Vite

打包构建需要解决的问题

1. 支持引入资源文件（css、image）等
1. 语法转换能力，支持 Typescript/JSX 等语法扩展
1. HMR 热更新能力
1. Code Splitting 代码拆分
1. Tree Shaking
1. 异步模块
1. 外部依赖 external dependency，库代码预先打包，不会频繁发生变化
1. 环境变量支持
1. 性能问题
1. SSR

### Cross Platform Code Sharing

1. UMD 模块写法
1. 运行时的环境判断
1. 打包时环境判断，`package.json#browser`字段
