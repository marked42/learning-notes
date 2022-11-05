# 浏览器原理

1. [自制浏览器](https://github.com/marked42/jsjs/tree/main/browser)

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

## Style

[Assigning Property Values](https://www.w3.org/TR/CSS2/cascade.html)

样式匹配 对于每一个 DOM Node 区所有的 CSS Style 进行匹配

对于逗号分隔的多个 Selector 匹配 DOM 节点时选用优先级（Specificity）最高的选择器，可以在解析 CSS 规则时将选择器按照优先级从高到底排序，
这样第一个匹配的选择器就是所有匹配的选择其中具有最高优先级的。

优先级的匹配，单个选择其中的标签（Tag）、ID 和所有类（class）必须都匹配。

找到 DOM 节点所有匹配的 CSS 规则后，按照优先级从低到高排序，对每个 CSS 规则中的属性进行计算，同名的属性，优先级高的规则排在后边会覆盖优先级低的规则中的属性值。

对 DOM 树中的所有 DOM 节点进行样式匹配构建样式树（StyleTree）。

1. [Cascade 规则](https://www.w3.org/TR/CSS2/cascade.html#cascade)，样式优先级，根据样式来源，origin。
1. 没有样式规则匹配到的 DOM 节点对应的样式属性使用默认值
1. 对于文字节点等无法声明样式的节点，其样式属性继承父节点属性
1. [specified, computed, actual values](https://www.w3.org/TR/CSS2/cascade.html#value-stages)
1. 内联样式

## 盒子模型 Box Model

margin

1. margin 部分背景色永远是透明的，视觉效果上显示 containing block 的 content area 颜色
1. 盒子的宽度取决于包围盒宽度，盒子高度取决于内部盒子高度
1. margin 的百分比值相对于包围盒的宽度计算 content width
1. 竖直方向的 margin 存在[边距收缩](https://www.w3.org/TR/CSS2/box.html#collapsing-margins)
1. margin-top/margin-bottom 对于对于非替换的行内元素（文字）but vertical margins will not have any effect on non-replaced inline elements
1. margin 对于 table display 的元素不起作用（除了 table-caption 和 inline-table）
1. margin 值可以是负值

padding

1. 适用范围 all elements except table-row-group, table-header-group, table-footer-group, table-row, table-column-group and table-column
1. 不能为负值

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

1. [浏览器工作原理与实践](https://time.geekbang.org/column/intro/216)
1. [Let's Build A Browser Engine](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
1. [浏览器渲染详细过程：重绘、重排和 composite 只是冰山一角](https://juejin.im/entry/590801780ce46300617c89b8)

1. [从 Chrome 源码看 WebSocket](https://zhuanlan.zhihu.com/p/37350346)
1. [websocket](https://zhuanlan.zhihu.com/p/25592934)
1. [WebSocket 与 TCP/IP](https://zhuanlan.zhihu.com/p/27021102)
