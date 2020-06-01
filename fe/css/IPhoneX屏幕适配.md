# IPhoneX屏幕适配

添加`<meta>`标签是的页面包裹整个屏幕，否则默认情况(`viewport-fit:contain`)下web页面包括在安全区内，四周默认显示的白条无法控制。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

![viewport-fit](./viewport_clipped_area.png)

在`viewport-fit: cover`的情况下IPhoneX上的Safari浏览器提供了全局环境变量来表示安全区域到屏幕边界的距离，使用这些距离值作为padding
将web页面控制在安全区内，边界使用合适背景色的背景。

`constant`是IOS11.2之前提供的函数，之后方案标准化后规定使用`env`获取全局变量。

```css
body {
  padding: constant(safe-area-inset-top) constant(safe-area-inset-right) constant(safe-area-inset-bottom) constant(safe-area-inset-left);
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```




1. [viewport-fit](https://www.w3.org/TR/css-round-display-1/#viewport-fit-descriptor)
1. [CSS Environment Variables Module Level 1](https://drafts.csswg.org/css-env-1/#env-function)
1. [safe-area-inset values on iOS11](https://www.quirksmode.org/blog/archives/2017/10/safeareainset_v.html)
1. [网页适配 iPhoneX，就是这么简单](https://aotu.io/notes/2017/11/27/iphonex/index.html)
