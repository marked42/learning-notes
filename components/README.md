# 组件库

组件库

ElementUI, vuetify, iview, material design ,Quasar, vant

如何做一个开源库

https://zhuanlan.zhihu.com/p/46332833
https://www.zhihu.com/question/22195970/answer/135676894
https://www.zhihu.com/question/22195970/answer/204910302
[开发更好用的 JavaScript 模块](https://zhuanlan.zhihu.com/p/31499310)
[从零做一个开源项目](http://www.imooc.com/learn/1003)
[Element 源码分析](https://space.bilibili.com/390120104/favlist?fid=333106404&ftype=create)

## 倒计时组件

https://zhuanlan.zhihu.com/p/20832837

问题调研与技术方案设计

应该选择哪个 setTimeout/setInterval 来实现倒计时

1. setTimeout 配合函数递归调用的方式实现
1. setInterval 直接调用函数的方式实现，Javascript 执行线程任务很多时会造成 setInterval 注册回调函数，在不被阻塞时连续触发。
1. setTimeout 每次只注册一个回调函数，不存在连续触发的问题，但是也会被阻塞，这种情况如何处理？

1. 需要支持开始、暂停、停止、重新开始功能
1. 拆分计时逻辑部分和 DOM 渲染部分代码
1. 存在多个倒计时实例时，每个实例有自己的计时器需要的资源较多，考虑计时器实现为一个全局实例，没秒发出一个事件，所有的倒计时实例接收事件触发更新，避免使用多余的计时器。
   这种情况适用于所有倒计时需要的计时器都是在整数秒进行触发，如果倒计时开始的时间不同、或者触发间隔秒数不同，那么无法公用同一个计时器。TimerPool 互质的间隔秒数时可以公用一个计时器的 :upside_down_face:

定时器阻塞问题，跟服务端沟通修正时间、使用 Webworker 启用别的线程？

参考例子 https://github.com/helloyou2012/google-io-countdown

## 组件设计

1. 正交 https://zhuanlan.zhihu.com/p/96084784

1. 按需加载 https://zhuanlan.zhihu.com/p/35789551

1. 组件插件话 https://zhuanlan.zhihu.com/p/32119059
