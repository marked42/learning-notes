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

1. Functional
   1. [谈递归（一）：递归的五种定式](https://zhuanlan.zhihu.com/p/84452538)
   1. [函数式编程](https://www.bilibili.com/video/BV1Mh411Z7LC)

## Y combinator

1. global definition, waste of global variable space, dependency on global definition
1. letrec implemented by **side effects**

1. multi-argument version of self-application
1. convert to nested single-argument self-application with currying
1. extract self-application logic to get y combinator

Design concepts in Programming Languages Chapter 5 fixed points

References

1. [Why of Y](https://www.dreamsongs.com/Files/WhyOfY.pdf)
1. https://blog.moertel.com/tags/recursion-to-iteration%20series.html
1. https://en.wikipedia.org/wiki/Tail_call
1. https://www.cs.odu.edu/~zeil/cs361/latest/Public/recursionConversion/index.html
1. https://www.refactoring.com/catalog/replaceRecursionWithIteration.html

fixed point

https://www.dreamsongs.com/Files/WhyOfY.pdf

```
function fact(h, n) {
    if (n < 2) {
        return 1
    } else {
        return n * h(h, n - 1)
    }
}

function fact1(h) {
    return function (n) {
        return n < 2 ? 1 : n * h(h)(n - 1)
    }
}

// console.log(fact(fact, 10))

function fact2(h) {
    return function (n) {
        return n < 2 ? 1 : n * h(n - 1)
    }
}

function y(fact2) {
    let k = fact2(fact2)

    return function (n) {
        return fact2(k)(n)
    }
}

let f = y(fact2)

console.log(f(2))

```
