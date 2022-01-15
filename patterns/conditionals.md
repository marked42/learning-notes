# 条件

## 合并条件

decompose conditional

## Guard Clause

1. 使用 Guard Clause 语句简化条件，提早退出。

## Replace Conditional with Polymorphism

适合有多个方法需要同样一个条件选择逻辑的情况，多个方法提取为一个基类，每个条件分支对应一个子类。

1. type code/switch case/if 分支特别多，每个分支代码也很多的情况下
1. inheritance 形式。使用 replace type code with polymorphism，可以将每个分支代码封装在单独类中，类的个数和分支数相同。

## Replace Conditional with Strategy

应用场景

1. 运行时切换 对于同一个问题切换不同的策略
1. 很多相似的类，区别在于类的某些行为不同，使用策略模式减少类个数。

1. composition 形式。使用策略模式（Strategy），将不同分支代码封装在不同的策略类中，策略类可以*运行时*修改，隔离 context 和 strategy
1. 在 context 和 strategy 类中的数据传参策略。直接传数据，或者传整个 context 类实例

## Replace State-Altering Conditionals with State

针对比较复杂的状态改变条件逻辑。

需要一个前端状态转换的典型场景例子 Promise 有状态，太简单

client + context + state

好处

1. 拆分不同状态的代码
1. 方便增加新的状态

## Replace Conditional Dispatcher with Command

命令模式

例子 Editor copy/paste/cut/undo/redo
