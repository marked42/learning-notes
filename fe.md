# 前端知识体系

知识或者技能的掌握程度划分

1. what 了解概念
1. how 能够应用
1. why 清楚原理
1. why why 熟悉原理背后的权衡取舍
1. better 对现有方案进行改进、或者提出其他更好的方案（针对相同或者不同场景、不同条件）

学习一个知识或者技术的六个步骤

1. 输入
   1. 了解概念
   1. 能够应用 通过解决典型问题体现
   1. 清楚原理
1. 输出

   1. 自己实现
   1. 总结文档
   1. 教会别人

## JS

1. 如何定义 a 能使 console.log(a == 1 && a == 2 && a == 3) 输出 true

```js
var a = (function () {
  let i = 1
  return {
    valueOf: function () {
      return i++
    },
  }
})()
```

2. 手写 async/await 实现 说了大致的思路
3. https://zhuanlan.zhihu.com/p/60822797
4. base 64 编码
5. url 编码解码
1. 防抖截流

## 浏览器

浏览器的渲染进程包括哪些线程

setTimeout 的回调能否按时执行？OK

## CSS


## HTTP

缓存机制、浏览器缓存存储位置 1. https://zhuanlan.zhihu.com/p/40733281
禁用缓存 no-cache，no-store
cookie https://zhuanlan.zhihu.com/p/58660326

## Vue

Vue.$set

1. vue jsx https://zhuanlan.zhihu.com/p/59434351

## 性能优化

关注哪些性能指标？白屏时间 fcp，fmp
针对首屏时间优化？先分析具体原因，根据不同原因做相应的处理

## 项目稳定性

如何收集错误并分析
如何收集用户行为数据并进行分析

## 工程能力

如何保障项目的稳定性？标准化搭建项目，静态检测，定期现场 CR，提交代码 CR，测试，流水线标准化，容器标准化，部署标准化，监控

## 项目管理

如何把一个项目做好？选人、用人、项目风险把控
