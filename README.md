# FE

## 每周的计划

按照强度划分的任务

1. 一两个小时内能够完成的小任务，基本功练习，提高计算机科学素养，贵在坚持。
   1. 知乎博文一篇
   1. 一个刻意小练习，例如常用工具函数
   1. 算法题两道
   1. 培养技术敏感性与开阔视野，领域前沿动态的视频一个，了解领域内别人在做些什么，有哪些我们可以借鉴，输出笔记
1. 一到两周的时间能够完成的任务，有一定复杂度的业务或者技术问题，目标在于不断提高能力上限。

   1. ast
   1. [js 常见模式](https://www.cnblogs.com/tugenhua0707/p/5198407.html)
      1. pub/sub
      2. event emitter
      3. observer 观察者
      4. https://juejin.im/post/59eff1fb6fb9a044ff30a942
   1. UI/UX 方向，使用 css 实现各种不同的炫酷效果
   1. 模块化机制，实现 require(commonjs), define(amd), umd
   1. bundler 包括依赖分析、异步组件，参考 webpack/rollup/parcel/vite
   1. 模板引擎 EJS
   1. 前端生态中很多库和工具使用的插件机制研究
   1. semver
   1. observable
   1. 类似 vue template 解析
   1. 虚拟 DOM 算法
   1. LRU 缓存机制，vue 组件 keep-alive
   1. 设计模式例子
   1. vue-router 路由库
   1. vuex 状态管理库
   1. code diff editor

1. 需要几个月或者数年完成的任务，目标在于磨炼解决大型项目、高难度问题的工程能力。
   1. 使用 vue3 开发一套通用组件库
      1. 参考 element-ui,antd,material,quaksa,整理问题。
      1. 多主题/动态主题问题
      1. 组件库的 i18n 解决方案
      1. 布局方案 栅格系统、flex、
      1. 组件库设计遵循的 UI/UX 设计原则，material design
      1. 高阶 vue 组件，传递属性和事件
      1. 跑马灯组件，滚动数字组件，carousel 组件，message 组件，landing 页顶栏 sticky 效果，参考知乎的的低栏效果。
      1. 动态位置的组件 element-ui Message/Popover/Tooltip/Drawer/Portal append-body ?
   1. 软素质
      1. 沟通交流
      1. 文档与写作
      1. 项目管理能力
      1. 排期能力，如何准确衡量自己的开发速度，对一个需求进行准确排期。寻找衡量开发速度的基准、统计平均每天的有效代码行数、页面数、业界成熟的方案。
      1. 面试能力 整理面试指南与手册
      1. 新人培训，整理输出各种课程与技术文档
   1. vue3 的核心原理
   1. 工程化方向
   1. 可视化方向
   1. HTTP
   1. Web 安全相关
   1. Web 页面性能优化相关
   1. node 方向
   1. JS/TS
      - [ ] Secrets of the JavaScript Ninja, 2nd Edition
      - [ ] You Don't Know Javascript
      - [ ] Functional Programming in JavaScript by Luis Atencio (Manning, 2016),
      - [ ] DOM Enlightenment
   1. 浏览器原理

按照强度划分任务主要是为了便于在每周内安排合适强度的学习计划，一个中高强度的任务可以拆分为多个低强度的项目来完成。

每周开始之前提前安排本周任务，结束时进行回顾。

1. 两三道算法题训练
1. 一个中强度任务
1. 一个高强度任务的部分问题

## 填坑挖坑

收藏了很多文章却从来没去学过，这个列表记录了挖的坑，需要持续填坑。

1. [常见算法问题](https://juejin.im/post/5958bac35188250d892f5c91#heading-27)

## HTTP

1. 图解 HTTP
1. HTTP 权威指南
1. 缓存 https://www.cnblogs.com/lyzg/p/5125934.html
1. [HTTP2.0](https://www.cnblogs.com/yingsmirk/p/5248506.html)
1. HTTPS
   1. [握手过程](https://developers.weixin.qq.com/community/develop/article/doc/000046a5fdc7802a15f7508b556413)
   1. 中间人攻击
   1. 证书验证方法
1. https://segmentfault.com/a/1190000015316332
1. network-path reference protocol-relative url https://tools.ietf.org/html/rfc3986#section-4.2

## 安全

1. XSS
   1. https://juejin.im/post/59dc2b7a6fb9a0451869ae3a
   1. https://github.com/dwqs/blog/issues/68
1. CRSF
1. [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
1. https://juejin.im/post/593df628da2f60006728cff2
1. [劫持与反劫持](https://juejin.im/post/593df628da2f60006728cff2)
1. X-Frame-Options
1. Content-Security-Policy
   https://www.keycdn.com/support/content-security-policy

## 性能优化

1. [Preload & Prefetch](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
1. https://github.com/fi3ework/blog/issues/32
1. https://juejin.im/post/6844903613790175240
1. https://juejin.im/post/6844903728433070094#heading-69

## node

1. [ElemeFE/node-interview](https://github.com/ElemeFE/node-interview/tree/master/sections/zh-cn)

## JS & TS

1. 深入 javascript https://juejin.im/post/59278e312f301e006c2e1510
1. 周爱民老师的 Javascript 课程
1. https://www.zhihu.com/question/303073602
1. https://www.npmjs.com/package/especially
1. articles
   1. [JavaScript. The Core: 2nd Edition](http://dmitrysoshnikov.com/ecmascript/javascript-the-core-2nd-edition/)
   1. [ECMA-262-5 in detail. Chapter 0. Introduction](http://dmitrysoshnikov.com/ecmascript/es5-chapter-0-introduction/)
   1. [ECMA-262-5 in detail. Chapter 1. Properties and Property Descriptors.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-1-properties-and-property-descriptors/)
   1. [ECMA-262-5 in detail. Chapter 2. Strict Mode.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-2-strict-mode/)
   1. [ECMA-262-5 in detail. Chapter 3.1. Lexical environments: Common Theory](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-1-lexical-environments-common-theory/#rules-of-function-creation-and-application)
   1. [ECMA-262-5 in detail. Chapter 3.2. Lexical environments: ECMAScript implementation.](http://dmitrysoshnikov.com/ecmascript/es5-chapter-3-2-lexical-environments-ecmascript-implementation/#identifier-resolution)
   1. [ECMA-262-3 in detail. Chapter 1. Execution Contexts](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)
   1. [ECMA-262-3 in detail. Chapter 2. Variable object](http://dmitrysoshnikov.com/ecmascript/chapter-2-variable-object/)
   1. [ECMA-262-3 in detail. Chapter 3. This](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)
   1. [ECMA-262-3 in detail. Chapter 4. Scope chain](http://dmitrysoshnikov.com/ecmascript/chapter-4-scope-chain/)
   1. [ECMA-262-3 in detail. Chapter 5. Functions.](http://dmitrysoshnikov.com/ecmascript/chapter-5-functions/)
   1. [ECMA-262-3 in detail. Chapter 6. Closures.](http://dmitrysoshnikov.com/ecmascript/chapter-6-closures/)
   1. [ECMA-262-3 in detail. Chapter 7.1. OOP: The general theory](http://dmitrysoshnikov.com/ecmascript/chapter-7-1-oop-general-theory/)
   1. [ECMA-262-3 in detail. Chapter 7.2. OOP: ECMAScript implementation.](http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/)
   1. [ECMA-262-3 in detail. Chapter 8. Evaluation strategy](http://dmitrysoshnikov.com/ecmascript/chapter-8-evaluation-strategy/)
   1. [The Quiz](http://dmitrysoshnikov.com/ecmascript/the-quiz/)
   1. [OO Relationships](https://medium.com/@DmitrySoshnikov/oo-relationships-5020163ab162)
   1. [Note 6. ES6: Default values of parameters](http://dmitrysoshnikov.com/ecmascript/es6-notes-default-values-of-parameters/)
   1. [JavaScript Array “Extras” in Detail](https://dev.opera.com/articles/javascript-array-extras-in-detail/)
   1. [Javascript Closures](http://jibbering.com/faq/notes/closures/)
1. 异步 async/await/Promise 05*You_Don't \_Know_JS_Async*&\_Performance
   1. https://css-tricks.com/understanding-async-await/
1. https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1 deep copy
1. https://zhuanlan.zhihu.com/p/41203455
1. 模块化 js ninja ch11
1. object 相关
   1. 01*You_Don't \_Know_JS_Up*&\_Going
   1. 03*You_Don't \_Know_JS_this*&\_Object_Prototypes
   1. 基础 04*You_Don't \_Know_JS_Types*&\_Grammar
   1. javascript ninja ch7 ch8
   1. collections, Array, Map, set, WeakSet js ninja ch9
   1. RegExp js ninja ch10
1. 跨浏览器 js ninja ch14
1. 06*You_Don't \_Know_JS_ES6*&\_Beyond

## 浏览器

1. [从输入 URL 到页面加载的过程？如何由一道题完善自己的前端知识体系！](https://zhuanlan.zhihu.com/p/34453198?group_id=957277540147056640)
1. https://zhuanlan.zhihu.com/p/47407398
1. [从浏览器多进程到 JS 单线程，JS 运行机制最全面的一次梳理](https://juejin.im/post/5a6547d0f265da3e283a1df7)
1. https://time.geekbang.org/column/intro/216

## Books

- [ ] CSS 揭秘
- [ ] Refactoring 2nd Edition
- [ ] 高性能网站建设指南
- [ ] [Algorithms In JS](https://github.com/trekhleb/javascript-algorithms?utm_source=gold_browser_extension)
