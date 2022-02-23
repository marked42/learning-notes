# Recursion & Iteration

Questions

1. direct recursion/indirect mutual recursion 递归的几种形式

1. 什么是 Tail Call https://stackoverflow.com/questions/12045299/what-is-difference-between-tail-calls-and-tail-recursion
1. 什么是尾递归 Tail Recursion
1. 如何修改为尾递归形式
   1. accumulator 形式 运算有 结合性 associativity 和交换性 commutativity
   1. 无法使用 accumulator 的形式，使用逆转递归调用的求值顺序 类似动态规划打表法
   1. 使用显式的栈模拟入栈出栈
   1. 二叉树的循环形式遍历
1. 非尾递归形式如何修改为对应循环实现
1. Trampoline 蹦床函数
1. continuation passing style

References

1. https://blog.moertel.com/tags/recursion-to-iteration%20series.html
1. https://en.wikipedia.org/wiki/Tail_call
1. https://www.cs.odu.edu/~zeil/cs361/latest/Public/recursionConversion/index.html
1. https://www.refactoring.com/catalog/replaceRecursionWithIteration.html
