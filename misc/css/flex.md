# 弹性盒布局

`display`值为`flex`或者`inline-flex`的元素内部开启弹性盒布局，弹性盒布局元素的子元素（不包括后代元素）称为Flex Item，按照弹性盒布局算法进行定位布局。

其中`position: absolute`的Flex Item不受弹性布局影响，依然是绝对定位。

弹性盒布局属于一维布局，首先沿着主轴（Main Axis）进行布局，只有在主轴方向无法容纳的情况下，且允许换行与交叉轴（Cross Axis）

1. item intrinsic size; min-content, max-content, width: auto;

1. 确定flex items
  1. 直接子元素 （定位不是absolute, fixed)
  1. 包含非空白字符的TextNode
  1. 伪元素
1. 调整顺序order属性
1. 确定主轴与交叉轴的方向
  1. writing-mode
  1. direction: ltr | rtl 这个属性不指定时又HTML中的 dir属性决定
  1. flex-direction: row | column | row-reverse | column-reverse
1. 计算flex item的基本尺寸
  1. `flex-basis
    1. `content`: 等于item的自然尺寸max-content
    1. `auto`: 由item的width决定，`width: auto`长度等于max-content, 其他
    1. 固定值
    1. 百分比 相对于flex container的内容区域宽度
1. flex中元素剩余还未布局的元素个数s（初始值等于元素总个数），计算出前n个元素长度小于主轴尺寸, n+1大于主轴尺寸，
  1. n = s 至此所有元素均完成布局，不考虑flex-wrap
  1. n < s 这一行主轴元素是n个，考虑到flex-wrap: nowrap | wrap | wrap-reverse
    1. nowrap: 不允许wrap, 所有元素在当前行定位布局
    1. wrap | wrap-reverse: 允许wrap的话, s更新为s-n，当前行n个元素进行定位布局
      1. wrap: 下一行主轴延交叉轴正向位置摆放，进行单行内元素定位布局
      1. wrap-reverse: 下一行主轴延交叉轴负向摆放
  1. 重复这一个过程直到所有元素均已布局

1. 仍有空白的话,在一行主轴的控件内处理空白尺寸
  1. `flex-grow`主轴上的item加起来尺寸小于主轴长度，有多余空间（available space）的情况，多余空间按照`flex-grow`占比分配。
  1. `flex-shrink`主轴上的item加起来尺寸大于主轴长度，有超出的长度（negative available space），按照 flex-basis * flex-shrink值按比例分配。这样的原因是flex item不会出现尺寸小的已经缩减到0了，尺寸大的还没什么变化。
  1. flex item的min-width属性默认是auto，意味着min-width的值是min-content, flex item最小会缩减到min-content的尺寸，除非设置了min-width为0，尺寸可以小于min-content。
1. 处理完空白之后按照justify-content进行主轴上定位
  1. start | end | left | right | flex-start | flex-end | center | space-evenly | space-between | space-around | baseline | first baseline | last baseline | normal | stretch | safe | unsafe
1. 每个item的主轴尺寸确定之后，交叉轴上的默认尺寸也确定，根据 align-items align-self计算交叉轴上的尺寸与位置
  1. align-items: flex-start | flex-end | center | [first | last]? baseline | stretch | safe unsafe

1. flex: flex-grow flex-shrink flex-basis `flex`使用与flex item否则无效
  1. initial: 0 1 auto
  1. auto: 1 1 auto
  1. none: 0 0 auto
  1. number

## 参考

1. [CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
1. CSS The Definitive Guide, 4th Edition Chapter 12
1. [Specification](http://www.w3.org/TR/css-flexbox-1/)
1. https://philipwalton.github.io/solved-by-flexbox/
1. https://davidwalsh.name/flexbox-dice
1. https://github.com/amfe/article/issues/17
1. https://time.geekbang.org/column/article/90148
