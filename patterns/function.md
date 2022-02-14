# 函数

写代码 等于 讲故事，更合理的叫写说明书，用合理的逻辑

Clean Code

> Every system is built from a domain-specific language designed by the programmers to describe that system. Functions are the verbs of that language, and classes are the nouns.

> Master programmers think of systems as stories to be told rather than programs to be written.

函数体语句进行拆分时遵循 Same Level of Details 的原则

编写函数的一些规则

1. 函数组成合理的树形结构
1. 短，不超过一屏，最好 10 行以内。
1. 只做一件事情，函数体内的语句应该是同一个级别的步骤，对应函数名称。
1. 如果函数名称中出现了 and/or 等单词，说明函数做了多个事情，

```js
// 做了两件事
function doTask1AndTask2() {}

// 做了一件事
function deletePageAndAllReferences() {}
```

假设有一个 10000 行代码的过程，可以平铺也可以提取函数嵌套，合理的形式如何？

## 命名

1. 有意义的名称
1. 动词 + 名词的组合

## Extract Function/Inline Function

什么时候进行

1. 意图与实现分离 separation between intention and implementation
1. 超过 10 行，一屏能够展示
1. 重复
1. 出现注释解释某些代码时是个提取方法的好时机

## 参数

1. Parameterize Function
1. 不要超过 3 个参数
1. 使用命名参数形式 function test({ person, name }) {}

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

### 标志位参数 Flag Argument

不要使用布尔类型的标志位参数，true/false 参数值多数情况下不能准确表达参数含义。使用枚举等更有意义的形式。

如果 true 和 false 代表两种不同的情况，需要进行不同的处理，将函数进行拆分。

1. Remove Flag Argument 不要使用参数控制函数内部不同逻辑，将函数拆分，单一责任原则。

### 减少参数

1. Preserve Whole Object

```java
Circle makeCircle(double x, double y, double radius);
Circle makeCircle(Point center, double radius);
```

### 数组与单个元素

统一为数组形式

## 过程

1. Replace Temp with Query 拆分函数局部变量相关逻辑。

### 避免副作用

有副作用的函数只能在特定情况调用一次，多次调用会出现不可预期的结果。
纯函数最好
幂等函数

1. 参数分为入参（in）和出参（out），尽量避免使用出参而是使用返回值代表数据结果，C#有三种表参数标记 in/out/ref
1. Collecting Parameters TODO: TDD / Refactoring To Patterns

可以将包含出参（output argument）的函数调用重构为对象方法调用消除出参。

```js
append(str, suffix)

str.append(suffix)
```

### 读写分离

1. Separate Query with Modifier （Refactoring 2）/ Command Query Separation（Clean Code）

### 错误处理

使用异常而不是错误码作为返回值的形式

新增错误种类时，可以方便的添加子类异常，而不改变已有代码；错误码的话需要修改代码，

违反开闭原则

### 嵌套层次

很多 if/switch/break/continue 等嵌套，嵌套层数过多时说明函数复杂，

理想的情况是函数只有一层嵌套，顺序的几句，最后一个返回语句。

## 参考资料

1. Clean Code Chapter 3 Functions
