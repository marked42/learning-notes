# Tab

## 实现方案

### checked 伪类方案

https://www.bilibili.com/video/BV1uK411c7VW?from=search&seid=11563086495552762896

1. 默认情况下 tab 标签对应的内容卡片元素隐藏，tab 标签选中时才展示。利用`<input type="radio">`元素的伪类选择器`checked`检测当前被选中的 tab。使用`input:checked ~ tab`选择器设置选中 tab 标签对应的兄弟节点内容卡片元素进行显示。
1. 隐藏原始的`<input type="radio">`元素，使用`label`元素自定义 tab 标签的样式，`label`使用`for`属性和单个`radio`关联起来，点击`label`的时候激活`radio`的 checked 状态。
1. 同样适用`:checked`伪类加上兄弟节点选择器为选中状态下的 tab 标签添加背景，用作区分。

### 背景滑动切换

可以使用一个 DOM 元素代表背景圆角矩形，在 tab 标签选中或者切换时使用 JS 设置背景元素的位置`transform: translate(10px)`和长度属性`width: 10px`完成，背景元素需要设置`transition`效果使得位置和宽度具有渐变的效果。参考 ElementUI 的 tab 组件效果。

背景切换时自然滑动的效果
