# 编译原理

## 文法

正则文法不能处理嵌套、上下文无关文法支持嵌套

### 二义性

消除文法的二义性

## 递归下降解析器 Recursive Descent Parsing

使用递归现将解析表达式存在两个问题

1. 如何处理运算符优先级和结合性
1. 在运算符优先级很多的情况下如何高效处理

表达式文法定义

```BNF
E --> E "+" E
    | E "-" E
    | "-" E
    | E "*" E
    | E "/" E
    | E "^" E
    | "(" E ")"
    | v
```

经典解决方法，通过定义更多的中间语法规则区分运算符的优先级

```BNF
E --> T {( "+" | "-" ) T}
T --> F {( "*" | "/" ) F}
F --> P ["^" F]
P --> v | "(" E ")" | "-" T
```

缺点

1. The size of the code is proportional to the number of precedence levels.
1. The speed of the algorithm is proportional to the number of precedence levels.
1. The number of precedence levels and the set of operators is built in.

第一个问题可以通过一个带有优先级参数的函数替换多个手写的函数实现。
第二个问题无法避免，一个标识符的解析跟优先级层数成线性关系。

1. [Parsing Expressions by Recursive Descent](https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm)
1. https://eli.thegreenplace.net/tag/recursive-descent-parsing
1. [自上而下的运算符优先解析](https://firecodelab.com/blog/translate-top-down-operator-precedence-parsing/)
1. [From Precedence Climbing to Pratt Parsing](https://www.engr.mun.ca/~theo/Misc/pratt_parsing.htm)

### Operator Precedence Parser

https://en.wikipedia.org/wiki/Operator-precedence_parser

### Precedence Climbing

能够处理的语法是由二元运算符连接原子表达式组成的表达式。

优先级

每个二元运算符都有预先定义好的一个自然数代表其优先级，数值越大优先级越高。

分析例子

```js
2 + 3 * 4 * 5 - 6
```

一个表达式包含的所有二元运算符的最小优先级决定了当前原子表达式和后续原子表达式之间的顺序，

```js
1 + 2 * 3

1 * 2 + 3
```

结核性

左结合、右结合

```js
1 + 2 + 3
```

```cpp
1 ^ 2 ^ 3
```

通过扩展原子表达式的定义可以处理一元表达式，标识符等情况。

三元运算符如何处理？

实际例子

Clang 的编译器前端就是手写的递归下降解析，在`lib/Parse/ParseExpr.cpp`中使用了 Precedence Climbing 方法。

1.  [Parsing Expressions by precedence climbing](https://eli.thegreenplace.net/2012/08/02/parsing-expressions-by-precedence-climbing)
1.  [The top-down parsing of expressions](https://www.antlr.org/papers/Clarke-expr-parsing-1986.pdf)
1.  [Pratt Parsing and Precedence Climbing Are the Same Algorithm](http://www.oilshell.org/blog/2016/11/01.html)
1.  [Top Down Operator Precedence Vaughan R. Pratt](https://dl.acm.org/doi/10.1145/512927.512931)
1.  [Top Down Operator Precedence Douglas Crockford](https://www.crockford.com/javascript/tdop/tdop.html)

### Shunting Yard

### TDOP

1. [Essentials of Programming Language](http://www.eopl3.com/)

1. [Beautiful Code](https://eli.thegreenplace.net/2007/09/28/book-review-beautiful-code-edited-by-andy-oram-greg-wilson/)

1. http://www.yinwang.org/
1. https://blog.csdn.net/ViVivan1992/article/details/101302986
