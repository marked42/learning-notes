# 组件异步更新与nexTick

在[Reactivity原理](./1-Reactivity原理.md)中介绍了Vue组件是异步更新的。Vue内部使用的Watcher可分为三类：

1. 用户使用`Vue.$watch`函数创建的Watcher
1. Watch选项创建的Watcher(内部也是使用`Vue.$watch`)创建
1. Vue组件的视图更新Watcher

其中只有在第一种情况先使用`Vue.$watch`才能通过选项`{ sync: true }`显式地指定Watcher是同步模式，其余两种情况都是使用默认值`false`因此对应的Watcher都是异步模式。


1. https://zhuanlan.zhihu.com/p/33090541
1. https://github.com/answershuto/learnVue/blob/master/docs/Vue.js%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0DOM%E7%AD%96%E7%95%A5%E5%8F%8AnextTick.MarkDown
