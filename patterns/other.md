# 其他模式

## 观察者模式 Observer Pattern

Vue 的响应式数据

Publisher/Subscriber
Notifier/Receiver Listener

当 Notifier 只需要通知固定的一个 Receiver 时，可以直接写死，只有需用通知多个时才有必要重构为观察者模式。

## Adapter

Code Smell: Alternative Classes with Different Interfaces

Axios 的 HTTP 请求 Adapter

具有类似功能的类，但是接口不同，在无法改变接口的情况下，创建中间对象将类包装为指定接口形式。

## Facade

## Visitor & Interpreter

解释器模式，使用范围

## 单例模式

初始实现不需要立即使用单例模式，只有在存在性能问题或者需要保证实例唯一的需求出现时再重构为单例模式。
