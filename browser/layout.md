# Layout

整体流程

RenderTree -> LayoutTree（生成盒子） -> Layout（尺寸、位置计算）

visual formatting model

盒子生成算法
https://www.w3.org/TR/CSS2/visuren.html#box-gen
StyleNodeTree -> LayoutTree

https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model

介绍浏览器原理
https://mp.weixin.qq.com/s?__biz=MzI0ODA2ODU2NQ==&mid=2651131609&idx=2&sn=3df598084177675024492b6a2b3fb9b5&chksm=f257ce63c520477590331c84a849f4d1df328a98e6cd54799227ca03b4697a8d5b35535d02cc&scene=21#wechat_redirect

布局

https://zhuanlan.zhihu.com/p/104927765

width/margin-left/margin-right auto 关键字的计算规则

padding/border 不接受 auto 关键字

1. overflow 的情况下，没有剩余空间可以分配
   1. width: auto 等于 0，其余的 auto 值也为 0，但是 margin-right 要重新计算值使得约束成立
   1. width 不是 auto 的情况，因为 width 本身造成了 overflow，其余 auto 为 0，不需要重新计算使约束成立
1. underflow 的情况下，存在剩余空间可以分配
   1. width: auto 占据全部剩余空间，其余 auto 为 0
   1. width: 不是 auto 的情况，margin-left/margin-right 有一个 auto 时占据剩余空间，两个都是 auto 时评分剩余空间，都不是 auto 时剩余空间分配给 margin-right。

https://spin.atomicobject.com/2015/07/14/css-responsive-square/
https://stackoverflow.com/questions/1495407/maintain-the-aspect-ratio-of-a-div-with-css

子节点的宽度取决于父节点的宽度，父节点的高度取决于子节点的高度

Skia: https://mp.weixin.qq.com/s/gs1CBWpnPpbK2fD9tQKEKw

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

## 视觉格式化模型（Visual Formatting Model）

[Visual Formatting Model MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model)
[Visual Formatting Model Spec](https://www.w3.org/TR/2011/REC-CSS2-20110607/visuren.html#box-gen)

1. 行内格式区域 inline formatting context

“在一个块格式区域中，盒子会从包含块的顶部开始，按序垂直排列。同级盒子间的垂直距离会由“margin”属性决定。相邻两个块级盒子之间的垂直间距会遵循外边距折叠原则被折叠。

在一个块格式区域中，每个盒子的左外边缘会与包含块左边缘重合（如果是从右到左的排版顺序，则盒子的右外边缘与包含块右边缘重合）。” - 9.4.1

1. 块格式区域 block formatting context

“在内联格式区域中，盒子会从包含块的顶部开始，按序水平排列。只有水平外边距、边框和内边距会被保留。这些盒子可以以不同的方式在垂直方向上对齐：可以底部对齐或顶部对其，或者按文字底部进行对齐。我们把包含一串盒子的矩形区域称为一个线条框。（The rectangular area that contains the boxes that form a line is called a line box.）” - 9.4.2

[流式布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display#css_flow_layout_display_block_display_inline)

双关键字形式 [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display/two-value_syntax_of_display)
https://www.smashingmagazine.com/2019/04/display-two-value/

[常规流中的块和内联布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flow_Layout/Block_and_Inline_Layout_in_Normal_Flow)

[WEBKIT 渲染不可不知的这四棵树](https://juejin.cn/post/6844903446391308301)
[Chromium 网页 Render Object Tree 创建过程分析](https://blog.csdn.net/Luoshengyang/article/details/50615628)
[CSS Box Model and Positioning](https://www.codeproject.com/Articles/567385/CSSplusBoxplusModelplusandplusPositioning)
[Render-Tree Construction, Layout, and Paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=en)

1. 块级元素 block level element， display block/list-item/table
1. 块级盒子（block-level box）
1. 块容器盒子 block containing box
1. 块盒子 block box

块级元素会生成至少一个主块级盒子（principal block-level box），列表项会生成额外的盒子放置项目符号。
块级盒子描述盒子作为块格式化上下文的参与者，从上到下布局（水平方向书写模式下），强调的是元素与其父元素和兄弟元素的关系。

块容器盒子能**包含**其他盒子形成新的格式化上下文（Formatting Context），强调的是元素与其子元素的关系。块容器盒子形成的格式化上下文是块级格式化上下文（Block Formatting Context）或者行内格式化上下文（Inline Formatting Context）。块级格式化上下文中只能包含块级盒子，行内格式化上下文中只能包含行内级盒子。

块级盒子同时是块容器盒子时称为块盒子（block box）。

![box types](./box-types.png)

1. 是块级盒子但不是块盒子，table/可替换元素
1. 块容器盒子但不是块盒子，非替换的 inline-block/和非替换的 inline-table

块级元素可能包含块级元素和行内级元素，此时需要形成匿名的块级盒子包裹住行内级元素对应的盒子；行内级元素可能包含行内级元素和块级元素，同样需要形成匿名的行内级元素。

[盒子生成算法](https://www.w3.org/TR/CSS2/visuren.html#box-gen)

匿名盒子生成的例子

1. 块包含盒子可能只包含行内级盒子，也可能只包含块级盒子，但通常的文档都会同时包含两者，在这种情况下，就会在相邻的行内级盒子外创建匿名块盒子。
1. 另一种会创建匿名块盒子的情况是一个行内盒子中包含一或多个块盒子

匿名盒子无法被 CSS 选择器选中，所以匿名盒子可继承的样式属性值都是`inherit`，不可继承的样式属性值都是`initial`。

1. 行内级元素 inline-level element, display inline/inline-block/inline-table
1. 行内级盒子 inline-level box
1. 行内盒子（inline box
1. 原子行内级盒子（atomic inline level box）

[外边距折叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)

[BFC](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context)
https://www.smashingmagazine.com/2017/12/understanding-css-layout-block-formatting-context/

## 布局（Layout）

http://book.mixu.net/css/

[从 Chrome 源码看浏览器如何计算 CSS](https://mp.weixin.qq.com/s?__biz=MzI0ODA2ODU2NQ==&mid=2651131609&idx=2&sn=3df598084177675024492b6a2b3fb9b5&chksm=f257ce63c520477590331c84a849f4d1df328a98e6cd54799227ca03b4697a8d5b35535d02cc&scene=21#wechat_redirect)
[从 Chrome 源码看浏览器如何 layout 布局](https://mp.weixin.qq.com/s?__biz=MzI0ODA2ODU2NQ==&mid=2651131615&idx=2&sn=fcb743ed1448be5a13efb22db7c88107&chksm=f257ce65c5204773ab413d6819c9e1ae0785ccdec0acd1d6acf1781b9a4c8e81258c2506cfec&scene=0&key=31a87ca88902ae43bad5c493b64337c36ee2f4b42d197b5412ee85b74d706c59026b6f7488791cbb25f40fbbb1d374a50ca6a08c79c3f1f2d04337c24db4f0dc0bcc9a80f98c47cc9286de8ac67e1573&ascene=0&uin=MTU5MDQxMTgwOA==&devicetype=iMac%20MacBookPro11,1%20OSX%20OSX%2010.12.4%20build%2816E195%29&version=12020010&nettype=WIFI&fontScale=100&pass_ticket=4GNHpvW%2b%2bQjkuIsGQIH2rty%2b/6fvftft87oMZ1nEqtAaJVpFZVYCUdIVZQiNUZmZ)

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

定位机制（Positioning Scheme） position 和 float 属性

1. 正常流 Normal Flow position: static/relative
1. 浮动 Float
1. 绝对定位 position: absolute/fixed position:sticky ?

[布局](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#css)相关的四个因素

1. 盒子类型
1. 盒子的尺寸
1. 盒子的定位 Position
1. 图片尺寸、屏幕尺寸等外部信息

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

## 重新布局

（Relayout Reflow）

1. [Preventing 'layout thrashing'](http://blog.wilsonpage.co.uk/preventing-layout-thrashing/)
1. [Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

1. [Box Sizing Module Level 3](https://drafts.csswg.org/css-sizing-3/#valdef-width-max-content)

1. [Layout Thrashing](https://devhints.io/layout-thrashing)
1. 布局 https://eloquentjavascript.net/14_dom.html#h_lyrY2KUDl7

## Flexbox & Grid

### Flex

1. [CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
1. CSS The Definitive Guide, 4th Edition Chapter 12
1. [Specification](http://www.w3.org/TR/css-flexbox-1/)
1. https://philipwalton.github.io/solved-by-flexbox/

1. bfc https://zhuanlan.zhihu.com/p/52426569
1. [从 Chrome 源码看浏览器如何 layout 布局](https://www.zhihu.com/collection/144350453)
1. [Web Layout History](http://grid-layout.com/history.html) [中文简体](https://zhuanlan.zhihu.com/p/104927765)
1. layoutNG https://zhuanlan.zhihu.com/p/37847490

1. [Blink Layout](https://www.youtube.com/watch?v=Y5Xa4H2wtVA)

1. [WebCore Rendering](https://webkit.org/blog/115/webcore-rendering-ii-blocks-and-inlines/)
1. [Chromium Design Documents](https://www.chromium.org/developers/design-documents)
1. [How Rendering Work](https://www.zybuluo.com/rogeryi/note/18709)
1. [How Webkit Work](https://docs.google.com/presentation/d/1ZRIQbUKw9Tf077odCh66OrrwRIVNLvI_nhLm2Gi__F0/pub?slide=id.p)
1. [Webkit For Developers](https://www.paulirish.com/2013/webkit-for-developers/)
1. [GPU Accelerated Compositing in Chrome](http://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome)
1. [](https://coolshell.cn/articles/9666.html)
1. [WebCore Rendering](https://trac.webkit.org/wiki/WebCoreRendering)
1. [Efficiently Rendering CSS](https://css-tricks.com/efficiently-rendering-css/)
1. [Rendering: repaint, reflow/relayout, restyle](https://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)
1. http://www.nowamagic.net/academy/part/48/115/#

### Font

1. [深入了解 CSS 字体度量，行高和 vertical-align](https://www.w3cplus.com/css/css-font-metrics-line-height-and-vertical-align.html)
1. [Deep dive CSS: font metrics, line-height and vertical-align](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)
1. [line-height vertical-align](https://zhuanlan.zhihu.com/p/51189193)
1. [What is vertical align](https://css-tricks.com/what-is-vertical-align/)
