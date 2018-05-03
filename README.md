# Learning Notes

Notes on Web Knowledge

## TODO

1. Questions components ul element height could not adjust automatically according to its contents.
1. half px border in new ui

1. containing block for normal child element and pseudo element ::before
1. vue v-loading `<yam-section v-loading='true'></yam-section>` and custom directives

1. computed properties are **cached** based on their dependencies.

1. font awesome, svg and images in web
1. vue extend component
  ```js
  {
    extends: BaseComponent
  }
  ```

1. BEM style naming convention.
  1. `section_body`
  1. `section_body--loading`
  1. `section_body--error`
  1. `section_body--created`
  1. `section_body--ready`
  1. `main-container__body`

1. CSS 如何布局，margin设置在父元素还是子元素上。

1. box-shadow

1. height, width 用在inline上没有效果,用在inline-block
1. z-index
1. responsive ui layout
1. ellipsis 断行,在span和p上效果不同。 [word-wrap, word-break](http://www.zhangxinxu.com/wordpress/2015/11/diff-word-break-break-all-word-wrap-break-word/)
```css
text-overflow hidden
white-space nowrap
text-overflow ellipsis
```
1. html color: rgba, hlsa, hex
1. image,icon,svg used in web

- 登陆态,单点登录
- js-cookie

### React

#### Components

- [ ] Pagination component [react-paginate](https://github.com/AdeleD/react-paginate), [Examples](https://react.rocks/tag/Pagination)
- [ ] Color picker
- [ ] date picker
- [ ] [rc-slider](https://github.com/react-component/slider)
- [ ] [react progress bar](https://github.com/kimmobrunfeldt/react-progressbar.js/)
- [ ] slide show / carousel, [1](https://qiutc.me/post/%E4%BD%BF%E7%94%A8-React-%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E8%BD%AE%E6%92%AD%E7%BB%84%E4%BB%B6.html)
- [ ] Notification System
- [ ] Tooltip System
- [ ] [Modal Dialog System](https://zhuanlan.zhihu.com/p/30271961)
- [ ] react-dnd
- [ ] [awesome components](https://github.com/enaqx/awesome-react#components)

#### Source

- [ ] Synthetic Event

#### React Like Libs

- [ ] [Luy](https://github.com/215566435/Luy) and [blog](https://zhuanlan.zhihu.com/p/30073543)

### Tasks

- [x] Basic websocket creation, sending/receiving message with consideration of different data type and error handling.
- [x] CORS Access-Control headers
- [x] Websocket, Long Polling, Server Send Events.
- [ ] HTTP Authentication and tokens
- [ ] JavaScript functional programming
- [ ] typescript
- [ ] reflow repaint
