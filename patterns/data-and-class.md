# Data

如何合理地组织数据

数据

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

## 聚合为类

1. Change Reference to Value
1. Change Value to Reference

## 组合优于继承

composite inheritance
