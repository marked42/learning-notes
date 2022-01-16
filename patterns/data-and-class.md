# Data

如何合理地组织数据

数据

1. Extract Data/Inline Data
1. Separate Query from Modifier
1. Split Variable
1. Replace Derived Variable with query
1. Value <-> Reference Data

1. 删除不必要的写方法 setting method
1. 读写分离，变量拆分

## 基础数据

1. Primitive Obsession
1. Replace Primitive with Object，Replace Type Code with Class 属于其中特例

```js
orders.filter((o) => o.priority === 'high' || o.priority === 'rush')

orders.filter((o) => o.priority.higherThan(new Priority('normal')))

// double vs Temperature
class Temperature {
  // 摄氏度，华氏度，热力学温度
}
```

Effective Java Type-safe Enum Patterns

类型安全，且可拓展

## Null Object

Martin Fowler Introduce Special Case

对于某个类空值的特殊处理逻辑散落**多处**，应该将这些逻辑抽取到单独的类对象中。这属于 Primitive Obsession 的一种。

introduce null object

## 聚合为类

1. Change Reference to Value
1. Change Value to Reference

## 数据层级

Method/Field/Constructor 放到合适的层级

1. Extract Superclass 消除多个子类中相同的代码重复多次，或者利用模板方法模式消除部分重复，可能需要新建共同的父类。
1. Extract Class 使用 Composite 解决类数目爆炸问题
1. 将父类中的成员下降到具体子类中，消除 Refused Bequest

## 组合优于继承

Favor object composition over class inheritance
Liskov Principle

composite inheritance
Replace Subclass with delegate
Replace Superclass with delegate
