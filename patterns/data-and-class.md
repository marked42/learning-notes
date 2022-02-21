# Data

如何合理地组织数据

数据

1. Extract Data/Inline Data
1. Separate Query from Modifier
1. Split Variable 单一职责，解释性命名
1. Replace Derived Variable with query

1. 删除不必要的写方法 setting method
1. 读写分离，变量拆分
1. 避免全局数据，尽量缩小数据的可见范围，权限 don't modify object you don't own

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

## Special Case

Null Object

Martin Fowler Introduce Special Case

对于某个类空值的特殊处理逻辑散落**多处**，应该将这些逻辑抽取到单独的类对象中。这属于 Primitive Obsession 的一种。

introduce null object

## Value/Reference

Value Object TDD

1. Value <-> Reference Data Refactoring

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

## Object & Data Structure

Clean Code Chapter 6 Objects & Data Structures

1. Data Structure，关键在于所有 Field 都独立修改，不独立的话没法全部公开，必须带有修改函数，如果只是读函数的话是 Active Record 还属于是 Data Structure
1. Object 关键在于抽象，
1. Feature Envy
1. Law of Demeter
1. Dual Dispatch / Visitor Pattern

Data Structure 方便添加新 behaviour，Object 方便添加新的 data

## Class

1. Clean Code Ch 10
