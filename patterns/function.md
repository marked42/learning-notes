# 函数

函数体语句进行拆分时遵循 Same Level of Details 的原则

## Extract Function/Inline Function

什么时候进行

1. 意图与实现分离 separation between intention and implementation
1. 超过 10 行，一屏能够展示
1. 重复
1. 出现注释解释某些代码时是个提取方法的好时机

## 参数

1. Parameterize Function
1. Remove Flag Argument 不要使用参数控制函数内部不同逻辑，将函数拆分，单一责任原则。
1. Preserve Whole Object

```js
// 数据拆开，又都传入函数使用
const low = aRoom.daysTempRange.low
const high = aRoom.daysTempRange.high
if (aPlan.withinRange(low, high)) {
  // something
}
```

1. Replace Parameter with Query/Replace Query with Parameter

能由其他参数或者数据得到的函数参数可以替换为查询函数，倾向于使用这种方式减少参数个数，提取复用参数计算逻辑。
如果查询函数的输入不是函数原有的参数数据，这种做法会引入更多的数据依赖。对于不适合引入的数据依赖，避免使用这种做法。

### 数组与单个元素

统一为数组形式

### Collecting Parameters

TODO: TDD / Refactoring To Patterns

## 过程

1. Separate Query with Modifier

1. Replace Temp with Query 拆分函数局部变量相关逻辑。
