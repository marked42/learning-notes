# 值与类型

### 数据类型与值

1. 基本数据类型（primitive type）string number boolean null undefined symbol
1. 对象类型 String Number Boolean Symbol Object Function Array Date RegExp Error

对象

1. 对象是属性的集合，属性 PropertyDescriptor 有两种，Writable/Enumerable/Configurable 的含义
1. 对象有内置的槽保存信息
1. 使用 `a.b`和 `a[b]`两种形式访问对象属性，key 只能是 string 和 symbol 类型，数字或者其他类型 key 值会被转换成字符串访问。

### 数据类型

1. typeof 12.5.6 /
1. instanceof
    1. InstanceofOperator 12.9.4
    1. OrdinaryHasInstance 7.3.19
    1. @@hasInstance

### 对象与原型链

内容顺序

对象的属性

```js
[[Prototype]]
string index
symbol index: PropertyDescriptor
```

一个属性只能是数据属性（Data Property）或者访问器属性（Accessor Property）

1. 对象就是一组键值对记录 对应基本操作 Object.keys() [[OwnPropertyKeys]] / GetOwnPropertyNames / GetOwnProperty/HasOwnProperty/DefineOwnProperty/DefineProperties

1. `[[Get]]` 访问对象属性的两种形式 `a.b`，`a[b]`
1. 控制对键值的读写 Writable/Enumerable/Configurable
1. 增加原型[[Prototype]]， GetPrototypeOf, SetPrototypeOf / Get / Set
1. 对于`[[Configurable]]`为`false`的属性值，再次使用`defineProperty`定义`[[Configurable]]`为`true`抛出错误么？
1. 对于`[[Configurable]]`为`false`的属性，哪些属性的操作被限制了？ Data Property/Accessor Property 互转
1. Accessor Property Get/Set

对于原型链上的数据属性，读操作继承，写操作不继承；访问器属性读写操作都继承。

写操作使用 `CreateDataProperty(Receiver, P, V)`，其中`Receiver`永远是写操作的对象

Questions

1. `[[Set]]`操作对于数据属性和访问器属性的处理差别？
1. 为对象新增属性时 `[[Set]]` 和 `[[DefineOwnProperty]]` 的区别
1. Accessor Property 相比于 Data Property 的主要用处？
1. `[[DefineOwnProperty]]`定义的属性已经存在时如何处理？
1. 哪些基本类型能作为对象的键？

对象上的 [[Set]] 语义和 defineProperty 区别

Immutability

### 遍历

Object.keys()/Object.values()/Object.entries

9.1.12 `[[OwnPropertyKeys]]`

### for in

for in 9.1.11 `[[Enumerate]]`() 遍历属性

1. 只遍历`enumerable: true`的 key
1. key 值出现一次，对象 key 隐藏其原型链上的同名属性
1. 遍历过程中属性发生变化的话，尚未被遍历到的属性被删除，该属性不会被遍历到；新增的属性

EnumerableOwnNames

1. 只遍历 string 类型的 key

### for of

https://mp.weixin.qq.com/s/foXbAj3ODqFKYGUP5K8MkQ

### 不变性

#### `[[Extensible]]`

`[[Extensible]]`为`false`的时候，相关操作 `[[SetPrototypeOf]]/[[IsExtensible]]/[[PreventExtensions]]`
默认值为 true

Object.isExtensible/Object.preventExtensions

1. 对象不能添加新的属性 ValidAndApplyPropertyDescriptor 当前属性 current 为 undefined，不能操作
1. 不能修改对象原型`[[Prototype]]`
1. 值不能从`false`修改为`true`，只有`[[PreventExtensions]]`没有逆操作

[[Configurable]] [[Writable]]
Extensible, seal, freeze

#### sealed 和 frozen

```js
Object.seal();
Object.isSealed();
Object.freeze();
Object.isFrozen();

SetIntegrityLevel();
TestIntegrityLevel();
```

sealed 将每一个属性设置为 configurable: false

frozen 将每个属性设置为 configurable: false, writable: false

### 规范值

1. 引用类型
1. Record/List/CompletionRecord/PropertyDesciptor
1. Lexical Environment / EnvironmentRecord

1. 左值、右值

### 类型转换

7.1 Type Conversion 臭名昭著的真值表

### 测试与比较操作

7.2 Testing and comparison operations

### 相等性

7.2.9 === == 符号

### 对象拷贝

### Exotic Object

以数组为例
