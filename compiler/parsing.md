# Parsing

## 解析方法分类

Top Down Parsing
Bottom Up Parsing

## 递归下降解析 Recursive Descent Parsing

### 分类

1. 带回溯的递归下降解析 带回溯的的解析器相当于能够预看任意个符号，因此解析能力强于 LL(k)解析器，但是回溯的运算代价比较高。
   为什么需要任意个预看符号，例如函数声明和定义的结构只在最右边有区别，而函数定义可以无限长，所以无法使用 LL(k)解析。缓冲区可以增长以
   支持任意长度的预看符号。分成推演和实际匹配两个过程。

```cpp
// 函数定义
void bar() {}
// 函数声明
void bar();
```

1. 记忆解析器 林鼠解析器 packrat parser
1. 确定性解析 LL(1) LL(k)
1. 谓词解析器

### 带回溯的递归下降解析

最基础的方法

```BNF
E -> T | T + E
T -> int | int * T | ( E )
```

成功的例子，一个选项失败时整个解析过程失败

```cpp
( int )
```

可能存在多个成功的产生式，一个产生式解析成功时整体的解析可能失败，需要尝试其他的可能成功的产生式，

只能解析非终结符最多只有一个产生式会成功的语法

```cpp
int * int
```

使用递归现将解析表达式存在两个问题

1. 如何处理运算符优先级和结合性
1. 在运算符优先级很多的情况下如何高效处理

上下文无关文法中一个子集可以使用无回溯的递归下降分析法

构造这种解析器的两个方法

1. 手写
1. 生成的 LL(1)解析器

带有回溯的递归下降分析，递归写法和循环写法

```txt
root ← node for the start symbol, S;
focus ← root;
push(null);
word ← NextWord();
while (true) do;
    if (focus is a nonterminal) then begin;
        pick next rule to expand focus (A → β1,β2,...,βn);
        build nodes for β1 , β2 . . . βn as children of focus;
        push(βn, βn−1, ..., β2);
        focus ← β1;
    end;
    else if (word matches focus) then begin;
        word ← NextWord();
        focus ← pop()
    end;
    else if (word = eof and focus = null)
        then accepttheinputandreturnroot;
        else backtrack;
    end;
end;
```

### 左递归

左递归

```BNF
S -> Sa | b

S -> bS'
S' -> aS' | empty
```

间接左递归

```BNF
S -> Aa | b
A -> Sc
```

```BNF
Expr → Expr + Term
    | Expr - Term
    | Term
Term → Term x Factor
    | Term ÷ Factor
    | Factor
```

手动消除左递归

```
Expr → Term Expr′
Expr′ → + Term Expr′
    | - Term Expr′
    | ε

Term → Factor Term′
Term′  → x Factor Term′
    | ÷ Factor Term′
    | ε
```

有算法自动消除左递归 Dragon Book

```txt
impose an order on the nonterminals,A1, A2, ..., An
for i ← 1 to n do;
    for j ← 1 to i - 1 do;
        if ∃ a production Ai→Aj γ
            then replace Ai→Ajγ with one or more productions that expand Aj
    end;
    rewrite the productions to eliminate any direct left recursion on Ai
end;
```

类似图论中的循环问题

外层循环的循环不变量，对于 k < i 的情况，Ak 的所有产生式都中不能存在以 Al 开头的，l < k，

```txt
∀ k < i, no production expanding Ak has Al in its rhs, for l < k.
```

### packrat parser

带记忆的递归下降解析器

1. Bryan Ford Packrat parsing: simple, powerful, lazy, linear time, functional parser

### 谓词解析器

上下文相关文法，根据谓词来决定是否启用某个匹配

### Backtrack Free Parsing

是可回溯的递归下降分析法对应语法的子集 LL(k) 语法

1. left-to-right 对输入进行从左到右处理
1. leftmost-derivation 有限处理最左侧的非终结符
1. k 个预看 token 主要使用 k = 1

left-factoring 转换 LL(1)语法

```BNF
E -> T + E | T
T -> int | int * T | ( E )
```

```BNF
E -> T X
X -> + E | ε
T -> int Y | ( E )
Y -> \* T | ε
```

Predictive Parsers

使用 Parse Table 解析输入

```txt
initialize stack = <S $> and next
repeat
    case stack of
    <X, rest> : if T[X, *next] = Y1, ..., Yn
        then stack <- <Y1, ..., Yn, rest>;
        else error();
    <t, rest> : if t == *next++
        then stack <- <rest>;
        else error();
until stack == <>
```

一个例子

E$, int * int$ Action

![Example](./llk-parsing.png)

对于一个非终结符 A, 输入 t 选用规则 P = A -> b 的情况。

1. t 可以作为非终结符 A 的第一个终结符，t belongs First(b)
1. 或者非终结符 A 可以是展开为空，t 能够跟在 A 的后边，t 属于 Follow(A)

First Set

1. 终结符 a 的 First(a) = { a }
1. A -> a | B C
   1. a 属于 First(A)
   1. First(B) 属于 First(A)
   1. 如果 B -> ε，First(C) 属于 First(A)
   1. A -> ε， ε 属于 First(A)

采用不动点计算方法，直到所有的非终结符的 First(A)不再变化为止，参考 Engineering A Compiler Ch3 P.104。

先要计算 A -> ε

![First Set](./first-set.png)

Follow Set

X -> A B

1. First(B) 属于 Follow(A)， Follow(X) 属于 Follow(B)
1. 如果 B -> ε，First(X)属于 Follow(A)
1. $ 属于 Follow(S)

同样采用不动点计算，参考 Engineering A Compiler Ch3 P.106。

对于每一条产生式 Follow Set 需要从后向前分析

![Follow Set](./follow-set.png)

定义产生式 A -> B 的 First Set

1. First(B) 如果 First(B)包含 ε
1. First(B) & Follow(A) 如果 First(B)不包含 ε

对于任何非终结符 A，如果其所有产生式的 First Set 不重叠，则可以通过预看下一个 token 来唯一选择要使用的产生式，实现无递归的分析。

计算出 First Set/Follow Set 之后有两种方式实现无回溯递归下降分析

1. 手写，非终结符 A 根据输入 token 和 First Set(P)来选择产生式 P 的逻辑转换为代码
2. 表驱动方式，将所有非终结符、token 和 First(P)的关系组成表格数据，根据表格跳转调用。

Parsing Table

A -> a

1. 终结符 t 属于 First(a) T[A, t] = a
1. First(a)可以是 ε，t 属于 Follow(a)， T[A, t] = a
1. First(a)可以是 ε，$属于 Follow(A)， T[A, $] = a

1. [Predictive Parser](https://www.bilibili.com/video/BV1Ms411A7EP?p=28)

### Operator Precedence

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
1. [斯坦福大学 编译原理 递归下降解析](https://www.bilibili.com/video/BV1Ms411A7EP?p=24)

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
1.  [The top-down parsing of expressions Keith Clarke](https://www.antlr.org/papers/Clarke-expr-parsing-1986.pdf)

### Shunting Yard

操作符的优先级、结合性、Unary、Binary、Tenary

### TDOP

TDOP 方法的历史参考文章[Pratt Parsing and Precedence Climbing Are the Same Algorithm](http://www.oilshell.org/blog/2016/11/01.html)

> Pratt (1973) is improving on the Floyd method (1963)
> Clarke (1986) is improving on the Richards method (1979)
> Pratt is assigning a total order to tokens with the binding power mechanism. Later in the paper you will see that this is done with two numbers -- left binding power lbp and right binding power rbp.
> Clarke is assigning numerical precedences and associativity to operators.
> They are both avoiding the construction of a partial order on operators, which can be represented as a matrix or table.

TDOP 的核心
优先级的例子

```js
1 + 2 * 3
3 + 1 * 2 * 4 + 5
```

1. 前缀、后缀、中缀，

```js
a = b - c
```

1. nud 和 led 的概念

1. 为每个操作符定义 Left Binding Power 和 Right Binding Power，
1. 每种操作符根据其相对于操作数的位置不同进行具体解析实现。

1. 使用递归加循环的方式实现
1. 注意 EOF token 的处理
1. 注意使用 peek 操作，操作符优先级高与当前要求的最小优先级时才会继续递归，consume 掉操作符，否则只用 peek。
1. 使用 0 作为初始的 binding power
1. 用一个变量 result 代表局部被解析出来的表达式节点，递归的构建出来最终的节点
1. 前置操作符的处理，
1. 后置操作符的处理，
1. 括号的处理

遇到左括号继续递归，遇到右括号就返回，所以左括号有最高的优先级，minBp 从 0 开始，右括号应该具有最低的优先级，

1. a[i]方括号，[i]相当于 a 的后置操作符，碰到`[`就进入递归，调用`expression`递归解析表达式，碰到`]`就出返回当前函数，
1. 三元表达式 ? :
   ?相当于 infix，且右结合，碰到：应该提前返回

1. [Simple But Powerful](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)
1. [Top Down Operator Precedence](https://tdop.github.io/)
1. [Pratt Parsers: Expression Parsing Made Easy](http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)
1. [Top Down Operator Precedence Vaughan R. Pratt](https://dl.acm.org/doi/10.1145/512927.512931)
1. [Top Down Operator Precedence Parsing](https://eli.thegreenplace.net/2010/01/02/top-down-operator-precedence-parsing)
1. Beautiful Code Chapter 9 Top Down Operator Precedence Douglas Crockford
1. [Top Down Operator Precedence Douglas Crockford](https://www.crockford.com/javascript/tdop/tdop.html)
1. [Pratt Parsing and Precedence Climbing Are the Same Algorithm](http://www.oilshell.org/blog/2016/11/01.html)
1. [Pratt Parsing Index and Updates](http://www.oilshell.org/blog/2017/03/31.html)
1. [How Desmos uses Pratt Parsers](https://engineering.desmos.com/articles/pratt-parser/)

### LL(k)递归下降解析

不修改语法，构建 k 个预看 token 的环形缓冲区来支持。

## Bottom Up

自底向上解析

## 类型

1. [Subtype Inference by Example Part 1: Introducing CubiML](https://blog.polybdenum.com/2020/07/04/subtype-inference-by-example-part-1-introducing-cubiml.html)

## 模式

### 解释器模式（Interpreter）

将操作放到每个节点类中

1. 方便增加新的 AST 节点类型
1. AST 节点类型太多时不方便管理，同一个功能的代码分散在不同的节点类中。
1. 不方便增加新的操作类型

通过多态实现

### 访问者模式（Visitor）

1. 同一种操作的代码从分散的节点类统一到一个操作类中
1. 在不改变节点类型的情况下容易增加操作类型
1. 不方便增加新的 AST 节点类型

遍历过程可能需要全局状态，Visitor 类中通过重载进行静态分发，双分派技术，如果语言本身支持双分派技术，访问者模式就不需要了。

访问者模式访问的类也可以没有关联关系，
Node 节点类的代码存在大量重复，

## Books

1. [Essentials of Programming Language](http://www.eopl3.com/)
1. [Beautiful Code](https://eli.thegreenplace.net/2007/09/28/book-review-beautiful-code-edited-by-andy-oram-greg-wilson/)

1. 四种树的遍历模式
1. 二元表达式不同文法对应同一种语法，文法的改变不影响语法。
1. 表达式短路求值优化
1. 树的相关算法
1. 改写简化向量乘法，乘以 0 的表达式
1. 迭代使用规则，加法乘法转换为位移操作
1. 解析抽象语法树，为什么有 expression statement

1. http://www.yinwang.org/
1. https://blog.csdn.net/ViVivan1992/article/details/101302986
1. [The Little Javascripter](http://www.crockford.com/little.html)
