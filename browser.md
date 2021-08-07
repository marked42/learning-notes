# 浏览器原理

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
   1.
   1. [Layout](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/layout/README.md)
   1. [Paint](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/paint/README.md)
   1. [Compositor Thread](https://www.chromium.org/developers/design-documents/chromium-graphics)
1. [Inside look at modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part1)
   1. [中文简体](https://zhuanlan.zhihu.com/p/47407398)
1. [How Browsers Work: Behind the scenes of modern web browsers](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/)
1. [浏览器布局](https://zhuanlan.zhihu.com/p/25445527)

# Browser

[Parsing HTML](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
[html5 parsing test](https://github.com/html5lib/html5lib-tests)

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

## Layout

visual formatting model

1. [Preventing 'layout thrashing'](http://blog.wilsonpage.co.uk/preventing-layout-thrashing/)

盒子生成算法
https://www.w3.org/TR/CSS2/visuren.html#box-gen
StyleNodeTree -> LayoutTree

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model

介绍浏览器原理
https://mp.weixin.qq.com/s?__biz=MzI0ODA2ODU2NQ==&mid=2651131609&idx=2&sn=3df598084177675024492b6a2b3fb9b5&chksm=f257ce63c520477590331c84a849f4d1df328a98e6cd54799227ca03b4697a8d5b35535d02cc&scene=21#wechat_redirect

布局相关问题

1. 全局布局 global layout 自上而下的递归式布局，大多数情况一次递归完成 single pass， table 布局可能需要多次遍历

什么时候需要重新布局，布局发生变化如何处理

1. 窗口大小变化
1. 全局或者局部样式变化
1. 滚动条位置变化

1. 增量式布局 incremental layout Dirty Bit System 记录

全局布局使用同步布局，增量布局通常使用异步布局。

Javascript 中对于元素尺寸信息的访问会强制重新布局，这时候触发的局部布局是同步的。

为了避免布局抖动，避免多次读写元素尺寸信息，采用批量写入，一次读取的方式，只触发一次布局。

1. 同步布局 synchronous layout
1. 异步布局 asynchronous layout

## 布局算法

The layout usually has the following pattern:

1. Parent renderer determines its own width.
1. Parent goes over children and:
   1. Place the child renderer (sets its x and y).
   1. Calls child layout if needed–they are dirty or we are in a global layout, or for some other reason–which calculates the child's height.
1. Parent uses children's accumulative heights and the heights of margins and padding to set its own height–this will be used by the parent renderer's parent.
1. Sets its dirty bit to false.

https://zhuanlan.zhihu.com/p/104927765

[Render Tree Construction](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)
https://github.com/beeware/colosseum

### 宽度的计算

width/margin-left/margin-right auto 关键字的计算规则

padding/border 不接受 auto 关键字

1. overflow 的情况下，没有剩余空间可以分配
   1. width: auto 等于 0，其余的 auto 值也为 0，但是 margin-right 要重新计算值使得约束成立
   1. width 不是 auto 的情况，因为 width 本身造成了 overflow，其余 auto 为 0，不需要重新计算使约束成立
1. underflow 的情况下，存在剩余空间可以分配
   1. width: auto 占据全部剩余空间，其余 auto 为 0
   1. width: 不是 auto 的情况，margin-left/margin-right 有一个 auto 时占据剩余空间，两个都是 auto 时评分剩余空间，都不是 auto 时剩余空间分配给 margin-right。
1. 上述计算的是 preferred width，另外要考虑到 min-width/max-width 确定最后真实的 width。

https://spin.atomicobject.com/2015/07/14/css-responsive-square/
https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css

子节点的宽度取决于父节点的宽度，父节点的高度取决于子节点的高度

inline 布局

换行算法，换行的节点通知符节点自己需要断行，父节点将子节点拆分为多个。

Skia: https://mp.weixin.qq.com/s/gs1CBWpnPpbK2fD9tQKEKw

## Painting

[High Performance Animations](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
[16 毫秒的优化](https://github.com/puterjam/speed_render)
[GPU Accelerated Compositing in Chrome](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
