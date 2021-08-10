# Layout

整体流程

RenderTree -> LayoutTree（生成盒子） -> Layout（尺寸、位置计算）

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

[视觉格式化模型](http://grid-layout.com/history.html)

[盒子生成算法](https://www.w3.org/TR/CSS2/visuren.html#box-gen)

1. 块级盒子（block-level box）
1. 行级盒子 inline-level box
1. 内联盒子（inline box
1. block containing box
1. block box
1. 内联格式区域 inline formatting context

“在一个块格式区域中，盒子会从包含块的顶部开始，按序垂直排列。同级盒子间的垂直距离会由“margin”属性决定。相邻两个块级盒子之间的垂直间距会遵循外边距折叠原则被折叠。

在一个块格式区域中，每个盒子的左外边缘会与包含块左边缘重合（如果是从右到左的排版顺序，则盒子的右外边缘与包含块右边缘重合）。” - 9.4.1

1. 块格式区域 block formatting context

“在内联格式区域中，盒子会从包含块的顶部开始，按序水平排列。只有水平外边距、边框和内边距会被保留。这些盒子可以以不同的方式在垂直方向上对齐：可以底部对齐或顶部对其，或者按文字底部进行对齐。我们把包含一串盒子的矩形区域称为一个线条框。（The rectangular area that contains the boxes that form a line is called a line box.）” - 9.4.2

[流式布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display#css_flow_layout_display_block_display_inline)

双关键字形式 [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display/two-value_syntax_of_display)

[常规流中的块和内联布局](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flow_Layout/Block_and_Inline_Layout_in_Normal_Flow)

[外边距折叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)

## 布局（Layout）

[从 Chrome 源码看浏览器如何计算 CSS](https://mp.weixin.qq.com/s?__biz=MzI0ODA2ODU2NQ==&mid=2651131609&idx=2&sn=3df598084177675024492b6a2b3fb9b5&chksm=f257ce63c520477590331c84a849f4d1df328a98e6cd54799227ca03b4697a8d5b35535d02cc&scene=21#wechat_redirect)

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

## Flexbox & Grid

TODO:

1. bfc https://zhuanlan.zhihu.com/p/52426569
1. [从 Chrome 源码看浏览器如何 layout 布局](https://www.zhihu.com/collection/144350453)
1. [Web Layout History](http://grid-layout.com/history.html) [中文简体](https://zhuanlan.zhihu.com/p/104927765)
1. layoutNG https://zhuanlan.zhihu.com/p/37847490
1. [深入了解 CSS 字体度量，行高和 vertical-align](https://www.w3cplus.com/css/css-font-metrics-line-height-and-vertical-align.html)
1. [Deep dive CSS: font metrics, line-height and vertical-align](https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)
1. [Blink Layout](https://www.youtube.com/watch?v=Y5Xa4H2wtVA)
