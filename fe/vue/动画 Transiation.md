# 动画

## Transition

### visibility

`visibility`属性比较特殊，是animatable的。`visible`和`hidden`关键字分别被当做数值1和0进行插值，插值结果在(0, 1]范围内时效果等同于`visible`，结果为0时效果等同于`hidden`。


## Animation

一般来说 keyframes 中所有 non-animatable 和语法不正确的规则(rule)会被忽略，但是`visibility`和`animation-timing-function`除外。 `animation-timing-function`会在每个keyframe立即生效.

开始帧(from)和结束帧(to)使用`from`/`to`或者百分比(0%/100%)指定，如果没有指定则相关属性值等同于没有该动画的效果

关键帧(keyframe)可以重复指定，靠后的关键帧规则会覆盖之前关键帧中同名规则。

多个Animation同时应用在一个元素上，最后一个具有最高优先级

### [DOM](https://drafts.csswg.org/css-animations/#interface-dom)
