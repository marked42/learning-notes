# 工程化

参考书籍 前端工程化体系设计与实践

## 前端项目生命周期

需求定义 -> 开发 -> 测试 -> 部署 -> 维护

开发: 需求讨论 -> UI 设计 -> 接口定义 -> 联调

参与人员 产品、设计师、前端、后端、测试

1. 需要一张图展示总结前端项目的生命周期
1. 需要一张脑图总览前端工程化的要点

## 技术选型

衡量一个技术方案的指标，稳定性、可控性、适用性、

## 规范化

### 编码规范

Javascript 命名规范、注释规范只做有必要的注释，解释 why

[airbnb](https://github.com/airbnb/javascript), [standard](https://github.com/standard/standard/blob/master/docs/README-zhcn.md)

typescript
vue
css

eslint-config-alloy

相关工具 prettier, eslint

### git 规范

方便 code review，开发历史清晰，降低理解成本，人员变动时其他人容易接手

1. 分支规范 git flow,github flow, gitlab flow
1. [commit message 规范](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/) husky, lint-staged, precise-commit
1. changelog

https://zhuanlan.zhihu.com/p/104032620

发布时根据选择合适的 tag，不要适用 master 分支直接发布。

### 项目规范

项目结构、文件命名（大小写还是 kebab-case)

### UI 规范

MTD
UI 界面缺乏设计的情况下，有没有程序能够自动为页面设计质量做评分，提供改进建议？

UI 设计统一化 Sketch sketch 激活版 Sketch 自采及报销流程 https://ingee.meituan.com/#/detail/31516

### 物料市场

总结前端典型业务场景及其解决方案，形成方便使用的组件或者模板页面

1. 页面结构相对稳定，但是数据有频繁变动需求的场景，C 端偏多
1. 需要收集其他典型场景
1. 长列表
1. 富文本
1. 自适应
1. 滑动手势

## 自动化

1. 使用 yeoman 自动生成模板项目
1. 自动创建 git 仓库
1. 自动进行机器/ci/cd 配置
1. github steamerjs
   衡量一个脚手架的指标

1. 快速部署更新
1. 团队约定一致
1. 快速配置，新人容易上手使用
1. 页面性能
1. 构建性能

### 测试

单侧缺失、单侧质量，能否做到可观测、可衡量、可感知（报警通知）。

### 协同合作问题

nohost github

### 部署

自动化部署

https://zhuanlan.zhihu.com/p/47492668
enginx https://zhuanlan.zhihu.com/p/65393365

## 前端监控

https://woai3c.gitee.io/introduction-to-front-end-engineering/07.html#%E4%BB%80%E4%B9%88%E6%97%B6%E5%80%99%E9%9C%80%E8%A6%81%E7%9B%91%E6%8E%A7

[7 天打造前端性能监控系统](https://fex.baidu.com/blog/2014/05/build-performance-monitor-in-7-days/)
[sentry](https://docs.sentry.io/) https://zhuanlan.zhihu.com/p/75577689
[前端异常监控系统的落地](https://zhuanlan.zhihu.com/p/26085642)

### 数据采集

性能数据 单页面应用的白屏时间，需要在路由切换时计算。
错误数据
埋点方案
https://www.zhihu.com/question/290066361/answer/486336434

## 性能优化

1. [Preload & Prefetch](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
1. https://zhuanlan.zhihu.com/p/30349982
1. https://github.com/fi3ework/blog/issues/32
1. https://juejin.im/post/6844903613790175240
1. https://juejin.im/post/6844903728433070094#heading-69
1. https://zhuanlan.zhihu.com/p/67134654
1. 响应式图片 https://zhuanlan.zhihu.com/p/61291942
1. 前端缓存最佳实践 https://zhuanlan.zhihu.com/p/52916788
1. Web 静态资源缓存及优化 https://zhuanlan.zhihu.com/p/30780216
1. [设计一个无懈可击的浏览器缓存方案：关于思路，细节，ServiceWorker，以及 HTTP/2](https://zhuanlan.zhihu.com/p/28113197)
1. https://zhuanlan.zhihu.com/p/55431529
1. https://zhuanlan.zhihu.com/p/25718817
1. 性能指标 https://zhuanlan.zhihu.com/p/46132555
1. 关键路径优化 https://zhuanlan.zhihu.com/p/38548289

### 加载时的优化

1. 减少 HTTP 请求
1. HTTP2 多路复用、头部压缩、高优先级、服务端推送、流量控制
1. 服务端渲染
1. CDN https://www.zhihu.com/question/320489602/answer/683562496
1. css preload https://zhuanlan.zhihu.com/p/32561606
1. https://www.bilibili.com/video/BV1AQ4y1Z7XP?t=65

### 运行时的优化

1. https://www.zhihu.com/question/24907805/answer/470550004
1. https://zhuanlan.zhihu.com/p/56001951
1. 减少重排重绘
1. 事件委托
1. 动画 requestAnimationFrame transform/opacity
1. webworker

### 数据上报

## 教育

工程化概念的教育

## 参考资料

[大公司里怎样开发和部署前端代码？](https://www.zhihu.com/question/20790576)
[前端工程 FIS](https://github.com/fouber/blog)

1. https://zhuanlan.zhihu.com/p/359734011
