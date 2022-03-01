# 浏览器原理

## 页面渲染流程

1. 解析 HTML 构建 DOM 树
1. 解析 CSS
1. 构建渲染树 Render Tree
1. 对 RenderTree 进行布局，构建 LayoutTree
1. 绘制 RenderTree

![webkit](./webkitflow.png)
![Gecko](./gecko.jpeg)

为了尽快将网页展示给用户，布局和绘制不会等到全部页面解析完成才开始，部分解析完成的页面会首先开始进行布局渲染。

脚本的处理 [Javascript Async Defer](https://flaviocopes.com/javascript-async-defer/)

`<script>`标签脚本会同步下载（外部脚本文件）和执行，阻塞主线程 对 HTML 文档的解析。defer 属性开启外部并行脚本下载，不阻塞主线程，等到 HTML 文档解析完成后才在主线程同步阻塞执行。

async 同样开始脚本并行下载，但是一旦下载完成就会开始同步执行，阻塞 HTML 文档的解析，一般使用于独立脚本。

启发式解析优化

Webkit 和 Firefox 都有这个优化，在主线程执行脚本的同时，另外的线程尝试继续解析之后的文档，找到需要被下载的外部资源（脚本、样式、图片等）并行的下载。这个线程只对外部资源进行提前下载，不会改变 DOM 树。

样式表（Style Sheet）的处理

样式表不影响 DOM 树的构建，但是脚本可能访问样式属性，为了保证结果正确，这种情况下位于脚本之前的样式表必须完成下载解析。
Firefox 会在有样式表在下载或者解析时阻塞所有脚本的执行，Webkit 只会在脚本访问某些样式属性时阻塞脚本执行。

[The FOUC Problem](https://webkit.org/blog/66/the-fouc-problem/)

## 参考资料

1. [Let's Build A Browser Engine](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
   1. [TS](https://dev.to/sanemat/let-s-build-browser-engine-in-typescript-vol0-toy-browser-engine-egm)
   1. [Haskell](http://hrothen.github.io/posts/lets-build-a-browser-engine-in-haskell.html)
   1. [Swift](http://www.screaming.org/blog/2014/08/15/lets-build-a-browser-engine-in-swift/)
1. [W3C Build Your Own Browser](https://www.w3.org/blog/2008/09/build-your-own-browser/)
1. [Webkit for Developers](https://www.paulirish.com/2013/webkit-for-developers/)
1. [Life of a Pixel](https://docs.google.com/presentation/d/1boPxbgNrTU0ddsc144rcXayGA_WF53k96imRH8Mp34Y/edit#slide=id.ga884fe665f_64_6)
   1. [Life of a Pixel](https://zhuanlan.zhihu.com/p/44737615)
1. [How Blink Works](https://docs.google.com/document/d/1aitSOucL0VHZa9Z2vbRJSyAIsAz24kX8LFByQ5xQnUg/edit?pli=1#)
   1. [How Blink Works 中文译文](https://zhuanlan.zhihu.com/p/52918538)
   1. [DOM](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/dom/README.md)
   1. [Style](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/css/README.md)
   1. [Layout](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/layout/README.md)
   1. [Paint](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/paint/README.md)
   1. [Compositor Thread](https://www.chromium.org/developers/design-documents/chromium-graphics)
1. [Inside look at modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part1)
   1. [中文简体](https://zhuanlan.zhihu.com/p/47407398)
1. [How Browsers Work: Behind the scenes of modern web browsers](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)
1. [浏览器布局](https://zhuanlan.zhihu.com/p/25445527)
