# Visual Formatting Model

1. position & layout
    1. parent block width: auto; child block: width: calc(100% - 100px)使用100%不生效
    1. [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
    1. https://www.w3.org/TR/CSS2/visuren.html#positioning-scheme
    1. [常见布局问题](https://juejin.im/post/5aa252ac518825558001d5de)
    1. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Alignment#Types_of_alignment
    1. text-align
        1. https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-align
        1. https://css-tricks.com/almanac/properties/t/text-align/
    1. vertical-align
        1. https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align
    1. 字体，行高，vertical-align 对齐 font-size, em box, 中文字体，全角字体，13px的字体水平宽度为8px？
    1. `vertical-align: top`指`inline`元素的`inline-box`顶部与`line-box`顶部对齐，line-height的大小决定
    1. `vertical-align: text-top` `inline`元素的`inline-box`顶部与`line-box`的内容区域顶content area部对齐，font-size的大小决定
    1. `vertical-align`只能用在`inline`元素和`table-cell`元素上，不能用在`block`元素上，这个属性不能继承
    1. font-size决定了em box的高度，英文字母的宽度由字形决定，中文字体方块字所以em box的宽高都等于font-size的大小。字体表现出来的字形(glyph)的大小有字体设计决定，以em box为基础，
    但是并不局限在其中，而很有可能超出。
    ```css
        无单位的数字1.1可以从父元素继承，相对于元素本身的font-size计算 
        父元素上使用百分比和em单位时，继承的计算后的绝对值，因此元素的line-height和本身的font-size很可能不一致
    div {
        line-height: 1.1;
        line-height: 100%;
        line-height: 1em;
    }
    ```
    1. nonreplaced inline 元素width, height都不起作用,使用line-height，font-size调整
    1. replaced inline元素有intrinsic width和height，底部与基线对齐
    1. inline-block内部有inline元素的话，最后一行文字基线作为其基线，没有inline元素的话底边作为其基线
    1. display: flow; 1. display: flow; 1. display: contents; 
    1. display的computed值受position, float影响；是否根元素也会影响
    1. box-decoration-break
    1. font-size
       1. https://developer.mozilla.org/en-US/docs/Web/CSS/font-size