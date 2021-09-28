# 虚拟机

## V8

字节码，基于寄存器的设计

https://github.com/v8/v8/blob/master/src/interpreter/bytecodes.h

## 隐藏类

1. 为每个新建创建一个隐藏类记录对象布局,具有相同形状的对象可以共用同一个隐藏类，对象的第一个属性指针指向其隐藏类（称为 map）。
1. 对象形状改变（删除、添加属性、属性类型变化）后更新隐藏类

```js
// 顺序不同隐藏类不同
let point1 = { x: 100, y: 200 }
let point2 = { y: 100, x: 200 }

// 一次初始化完整对象属性
// 尽量不使用delete删除对象属性
```

## 内联缓存

### 安装

下载与编译 V8 depot_tools

### 设计

对象属性设计

ECMAScript 规定数字属性按照索引值大小升序排列，字符串属性根据创建时顺序排列。

排序属性 elements, 常规属性 properties

快属性、线性数据结构
慢属性、非线性数据结构

### On Stack Replacement

https://wingolog.org/archives/2011/06/20/on-stack-replacement-in-v8
