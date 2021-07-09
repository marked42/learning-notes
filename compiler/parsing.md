# Parsing

## 解析方法分类

Top Down Parsing
Bottom Up Parsing

## 递归下降解析 Recursive Descent Parsing

### 分类

带回溯的递归下降解析 带回溯的的解析器相当于能够预看任意个符号，因此解析能力强于 LL(k)解析器，但是回溯的运算代价比较高。
为什么需要任意个预看符号，例如函数声明和定义的结构只在最右边有区别，而函数定义可以无限长，所以无法使用 LL(k)解析。缓冲区可以增长以
支持任意长度的预看符号。分成推演和实际匹配两个过程。

```cpp
// 函数定义
void bar() {}
// 函数声明
void bar();
```

[The Packrat Parsing and Parsing Expression Grammars Page](https://bford.info/packrat/)
[Packrat Parsing: a Practical Linear-Time Algorithm with Backtracking](https://pdos.csail.mit.edu/~baford/packrat/thesis/)
[Difference between an LL and Recursive Descent parser?](https://stackoverflow.com/questions/1044600/difference-between-an-ll-and-recursive-descent-parser/1044678#1044678)

1. 记忆解析器 林鼠解析器 packrat parser Bryan Ford Packrat Parsing: simple, powerful, lazy, linear time, functional pearl
1. 确定性解析 LL(1) JSON
1. LL(k) 寻找例子？ 大小为 k 的环形符号缓冲区
1. 回溯解析，缓冲区的大小可以增加，支持任意多个向前看符号，每个规则解析分为预测匹配(speculating)和实际匹配两个模式。预测匹配只确定规则能否匹配，并不记录具体的匹配结果，匹配结果会在实际匹配时产生。由于递归下降解析规则是逐层嵌套的，所以每个规则与匹配时对应一个位置，需要一个栈来记录逐层嵌套的每个规则对应的开始位置。
1. 记忆解析器，需要记录每个规则在某个位置 index 匹配的结果，有三种情况，未知、匹配成功（成功的情况记录匹配成功的位置 index），匹配失败。
1. 谓词解析器
1. Bryan Ford PEG 表达式文法，《解析表达式文法：基于识别的语法基础》，Parsec 语法谓词

[Parsing Expression Grammars: A Recognition-Based Syntactic Foundation](https://pdos.csail.mit.edu/~baford/packrat/popl04/peg-popl04.pdf)

[Parsec, a fast combinator parser](http://users.cecs.anu.edu.au/~Clem.Baker-Finch/parsec.pdf)

![Parsing](./Parsing.png)

GCC 的前端就是手写的递归下降解析器

#### 参考资料

1. [斯坦福大学 编译原理 递归下降解析](https://www.bilibili.com/video/BV1Ms411A7EP?p=24) 视频资料
1. [Recursive descent parsing Eli Bendersky's website](https://eli.thegreenplace.net/tag/recursive-descent-parsing) 入门文章

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

递归下降解析器问题

1. 根据文法情况分类书写对应函数，每个文法对应函数应该考虑失败的情况
1. 语法错误直接抛出异常
1. 语法正确，但是该产生式不合适需要返回 null 表示这种情况，然后在上层继续尝试其他的产生式
1. token stream 的回溯

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

递归下降分析法无法处理包含左递归的文法

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

外层循环的循环不变量，对于 k < i 的情况，Ak 的所有产生式都中不能存在以 Al 开头的，l < k，

```txt
∀ k < i, no production expanding Ak has Al in its rhs, for l < k.
```

### Packrat Parser

带记忆的递归下降解析器

1. Bryan Ford Packrat parsing: simple, powerful, lazy, linear time, functional parser

### 谓词解析器

上下文相关文法，根据谓词来决定是否启用某个匹配

### 无回溯的递归下降解析（Backtrack Free Parsing）

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

### 操作符优先级（Operator Precedence）

使用递归下降解析法解析包含不同优先级操作符的表达式，文法如下。

```BNF
<expr> : <expr> + <expr>
       | <expr> - <expr>
       | <expr> * <expr>
       | <expr> / <expr>
       | number
       | id
```

通过定义更多的中间语法规则区分运算符的优先级

```BNF
<expr> : <term> + <expr>
       | <term> - <expr>
       | <term>

<term> : <factor> * <term>
       | <factor> / <term>
       | <factor>

<factor> : number
         | id
         | '(' expr ')'
```

这种方法在操作符优先级层级很多的时候存在几个[问题](https://eli.thegreenplace.net/2009/03/14/some-problems-of-recursive-descent-parsers)

语法问题，需要定义大量的中间产生式，语法规则复杂。

操作符结合性的问题，递归下降分析方法必须消除左递归，将左递归文法转换为等价的右递归文法。但是右递归文法只能产生右结合的表达式，无法处理左结合的二元表达式。

语法 BNF

add ::= mul | add + mul
mul ::= pri | mul \* pri
pri ::= Id | Num | (add)

扩展巴科斯范式(EBNF)，使用类似正则表达式的写法

```js
<expr> : <term> { + <term> } *
       | <term> { - <term> } *
```

另外由于操作符的优先级是和文法对应的，所以操作符的优先级发生变化，或者新增操作符时都需要修改文法，比较麻烦。同时这种做法不支持在解析时临时调整操作符优先级或者增加操作符。

效率问题，一个简单的数字字面量表达式`1`也需要从最开始的非终结符展开，依次调用所有的产生式对应的解析函数，运行效率比较低。

#### 参考资料

操作符优先级解析方法参考[Wiki](https://en.jinzhao.wiki/wiki/Operator-precedence_parse)

### 为什么操作符会有结合性

操作符的**结合性**只出在以操作数作为第一个和最后一个 token 的表达式中。例如二元表达式`A + B`，首尾都可以出现操作数，所以两个连续的二元表达式出现时，中间那个操作数才会出现左结合或者又结合的问题。

```cpp
a + b + c;
(a + b) + c;    // 左结合
a + (b + c);    // 右结合

a ? b : c ? d : e;
(a ? b : c) ? d : e;    // 左结合
a ? b : (c ? d : e);    // 右结合
```

### 自顶向下操作符优先级分析（Top Down Operator Precedence）

自顶向下的运算符优先级分析法最早由 Pratt 提出，用来解决包含不同优先级操作符的表达式解析问题，也叫 Pratt Parsing，具体的历史可参考这篇[文章](http://www.oilshell.org/blog/2016/11/01.html)的总结。

TDOP 的**关键**在于通过给操作符定义**结合优先级**（Binding Power）来解决**操作符优先级**的问题。

二元操作符（binary operator）左右都可以存在操作数（operand），定义结合优先级`bp(op) = (lbp, rbp)`，`lbp`是左侧结合优先级（**L**eft **B**inding **P**ower），`rbp`是右侧结合优先级（**R**ight **B**inding **P**ower）。

下面这个数学表达式中，定义加法操作符`bp(+) = (1, 2)`，乘法操作符`bp(*) = (3, 4)`。

```js
  3   +   1   *   2   *   4   +   5
0   1   2   3   4   3   4   1   2   0
```

上边是表达式，下边是每个二元运算符左右两侧的`bp`值。数字`1`左侧是加号，右侧是乘号，乘号的`lbp = 3`大于加号的`rbp = 2`所以`1`应该与乘号优先结合，数字`4`同理可知应该与左侧乘号结合。

不同符号通过定义`bp`来确定优先级，对于同一符号来说还存在结合律的问题，加法和乘法都是左结合（left associativity），考虑上面的`1 * 2 * 4`应该解析为`(1 * 2) * 4`而不是`1 * (2 * 4)`。数字`2`左侧是乘号的`rbp = 4`大于其右侧乘号的`lbp = 3`，所以解析结果应该是左结合。同理定义`bp(^) = (6, 5)`可以使得操作符`^`是右结合。

#### 二元操作符（Binary Operator）解析

TDOP 通过使用递归和循环结合的方式解析表达式，整体流程如下。

```js
// 解析表达式
function expression(tokenStream, minBp = 0) {
  const token = tokenStream.consume()
  if (!token || token.type !== number) {
    throw new Error('expect a number')
  }
  let left = numericLiteral(token)

  while (true) {
    // 使用peek，因为存在直接返回和继续递归两种情况，继续递归时才要消耗掉当前token
    const op = tokenStream.peek()
    // 没有跟多输入了，应该返回，相当于最右侧rbp = 0的情况
    if (op === null) {
      break
    }

    // 有token的话应该是个operator，否则是语法错误
    if (op.type !== 'operator') {
      throw new Error('expect an operator')
    }

    // 获得操作符的bp
    const [lbp, rbp] = infixBindingPower(op)
    // 操作符的优先级低于当前要求的最低优先级minBp，应当返回
    if (lbp < minBp) {
      break
    }

    // 操作符lbp大于当前要求的最低优先级minBp，应当继续递归调用
    tokenStream.consume()

    // 递归调用解析右侧操作符组成的表达式
    const right = expression(tokenStream, rbp)

    // 将当前解析出的部分重新作为表达式左操作符，继续循环
    left = binaryExpression(op, left, right)
  }

  return left
}

function numericLiteral(token) {
  return {
    type: 'NumericLiteral',
    value: token.value,
  }
}

function binaryExpression(op, left, right) {
  return {
    type: 'BinaryExpression',
    left,
    right,
  }
}

function infixBindingPower(op) {
  const map = {
    '+': [1, 2],
    '-': [1, 2],
    '*': [3, 4],
    '/': [3, 4],
    '^': [6, 5],
  }
}
```

递归加循环的逻辑有三种情况

1. 向上 操作符优先级低，终止循环，返回上层函数
1. 向下 操作符优先级高，且右侧可以继续有操作数，则继续递归解析
1. 向右 操作符优先级高，但是右侧没有操作数，不继续递归，继续循环

表达式解析函数从`expression(tokenStream, 0)`开始调用，`minBp = 0`代表了初始的优先级，效果就是任意操作符的优先级都高于`0`，`expression`就会递归调用继续分析后续输入。

首先匹配一个数字，同时构造一个字符串字面值表达式作为结果存储到`left`变量中，`left`总是保存了当前已经解析部分产生的表达式。

接着需要进入一个循环，这个循环会对右侧的操作符进行分析。

如果右侧操作符优先级**低于**`minBp`说明左侧已经解析得到了包含更高优先级操作符的表达式，这个表达式在后续的解析中会作为右侧低优先级操作符表达式的左子树。如果右侧没有更多输入，函数同样需要返回，相当于`lbp < minBp`，`lbp = 0`的情况。如果右侧不是一个操作符，这是一个语法错误。

这里使用了`if (lbp < minBp) { break; }`，如果一个二元操作符的左右优先级设置为相同，现在的逻辑下会继续递归调用，相当于定义操作符为右结合，左结合操作符必须设置`lbp > rbp`。右结合操作符可以使用`lbp == rbp`的方案，但是没有必要，推荐永远使用不相同的数值配置，简单清晰。

如果循环结束条件设置为`lbp <= minBp`，那么具有结合性的操作符的`lbp`，`rbp`的设置需要相应调整。

如果右侧操作符优先级高于`minBp`，说明右边要解析的部分组成更高优先级表达式，当前得到的部分`left`是该表达式的左子树，这个表达式尚未解析完成，函数不应该返回而应该继续递归调用，解析右子树部分。注意递归调用使用的`minBp`更新为当前操作符的`rbp`。

循环的使用是为了解析右侧输入直到遇到了更低优先级的操作符，才能将当前结果作为左子树返回。

TDOP 虽然使用了递归嵌套的调用`expression`函数解析表达式，但是表达式抽象语法树的构造却是**自下而上**的`result`变量，`left`最开始是数字字面量表达式，遇到右侧更低优先级的操作符，函数返回上一层，返回的结果作为`right`和上一层的`left`组成一个更大一点的局部表达式，直到输入为空完成整个表达式的解析。

注意`tokenStream`使用了`peek()`操作，在确定解析一个`token`后才会进行`consume`。也可以使用回退的方案，首先`consume()`一个`token`，然后在发现不合适的时候回退，但是这种方案没有`peek()`简洁。

词法解析通常使用回退的方案，遇到错误字符时回退到上一个合法的位置，但是语法解析通常都使用预看符号的方案，两种方案都需要缓冲区的支持。

#### 一元操作符（Unary Operator）

一元操作符分为前缀操作符（Prefix Operator）和后缀操作符（Postfix Operator）两种。

负号`-`是典型的前缀操作符，前缀操作符的处理需要在`expression`函数调用的开头进行，这时当前 token 可能是数字也可能是一个前缀操作符。

```js
function expression(tokenStream, minBp = 0) {
  const token = tokenStream.consume()
  if (!token) {
    throw new Error('expect a number, get early EOF')
  }

  let left
  if (token.type === 'number') {
    left = numericLiteral(token)
  } else if (token.type === 'operator') {
    // 前缀操作符只有rbp
    const [_, rbp] = prefixBindingPower(token)

    // 前缀操作符后面是另外一个表达式，递归调用解析，rbp作为minBp
    const right = expression(tokenStream, rbp);

    // 组合结果
    left = unaryExpression(token.value, right)
  }

  ...
}

function prefixBindingPower(op) {
  const map = {
    '-': [undefined, 5],
    '+': [undefined, 5],
  }
  const bp = map[op]

  if (!bp) {
    throw new Error('expect prefix operator, get ' + op)
  }

  return bp
}
```

碰到前缀操作符时，后边必须跟随另外一个表达式，使用`expression(tokenStream, rbp)`递归调用解析，注意使用了操作符的`rbp`作为`minBp`。由于前缀操作符只有只能跟右侧操作数结合，所以只有`rbp`。

阶乘`!`是后缀操作符，后缀操作符出现在数字的后边，和中缀操作符是同一个位置，只不过后边不能再跟操作数。后缀操作的处理插入在中缀操作符的前边，首先进行尝试，优先级低时直接返回当前结果，优先级高时后缀操作符对应的表达式也解析完成，返回结果。

```js
function expression(tokenStream, minBp) {
    ...
    while (true) {
        ...

        // 首先尝试后缀操作符
        const [lbp, _] = postfixBindingPower(token.value)
        if (postfix && lbp) {
            if (lbp < minBp) {
                break
            }

            left = {
                type: 'UnaryExpression',
                operator: token.value,
                value: left,
            }
            tokenStream.consume()
            continue
        }

        // 中缀操作符
        ...
    }
}
```

#### 括号（Parenthesis）

括号不属于之前的任何一种情况，括号中间能够包含任意的表达。解析的时候遇到`(`之后应该递归调用函数，然后再预期遇到一个`)`。`(`可能和数字一样出现在开头，`)`可能和中缀、后缀操作符出现在同一个位置。

预期的解析流程上遇到左括号应该继续递归，相当于左括号有最高的优先级，而且左括号之后会匹配包含所有优先级操作符的表达式，所以 minBp 应该重置为 0。遇到右括号就返回，相当于右括号具有最低的优先级。

```js
function expression(tokenStream, minBp = 0) {
  const token = tokenStream.consume()
  if (!token) {
    throw new Error('expect a number, get early EOF')
  }

  let left
  if (token.type === 'number') {
    left = numericLiteral(token)
  // 左括号
  } else if (token.value === '(') {
      // 递归调用
      left = expression(tokenStream, 0)
      // 必须是个右括号
      match(')')
  } else if (token.type === 'operator') {
      ...
  }

  while (true) {
    // 后缀操作符
    ...

    // 直接返回
    if (op === ')') {
        break;
    }

    const [lbp, rbp] = infixBindingPower(op)
    // 操作符的优先级低于当前要求的最低优先级minBp，应当返回
    if (lbp < minBp) {
      break
    }

    // 操作符lbp大于当前要求的最低优先级minBp，应当继续递归调用
    tokenStream.consume()

    // 递归调用解析右侧操作符组成的表达式
    const right = expression(tokenStream, rbp)

    // 将当前解析出的部分重新作为表达式左操作符，继续循环
    left = binaryExpression(op, left, right)
  }
}
```

#### 索引符号（Index Operator）

索引符号`a[i]`形式中，`[]`可以采取和`()`相似的处理方法，碰到`[`后就递归调用`expression`进行解析，不同之处在于`[i]`相当于是`a`的后缀，`[`只能出现在循环的中。

```js
function expression(tokenStream, minBp = 0) {
  while (true) {
    // 后缀操作符
    ...

    // 直接返回
    if (op === ')' || op === ']') {
        break;
    }

    // 出现在这里
    if (op === '[') {
        tokenStream.consume();
        // 递归调用
        const right = expression(tokenStream, 0);
        // 必须是 ']'
        match(']')

        // 组合新结果
        left = memberExpression(left, right)
        break;
    }

    const [lbp, rbp] = infixBindingPower(op)
    // 操作符的优先级低于当前要求的最低优先级minBp，应当返回
    if (lbp < minBp) {
      break
    }

    // 操作符lbp大于当前要求的最低优先级minBp，应当继续递归调用
    tokenStream.consume()

    // 递归调用解析右侧操作符组成的表达式
    const right = expression(tokenStream, rbp)

    // 将当前解析出的部分重新作为表达式左操作符，继续循环
    left = binaryExpression(op, left, right)
  }
}
```

#### 三元操作符（Ternary Operator）

三元表达式`E ? E : E`中操作符`?`和`:`都是中缀操作符，操作数出现在两侧。

考虑表达式`E1 ? E2 : E3 ? E4 : E5`，三元表达式也存在结合律的问题，左结合`(E1 ? E2 : E3) ? E4 : E5`，右结合`E1 ? E2 : (E3 ? E4 : E5)`，右结合的形式相当于多个`if else`语句嵌套的效果，所以采用右结合的形式。

三元表达式解析的对应其结构。

1. 首先匹配第一个操作数
1. 匹配`?`
1. 递归调用`expression`匹配成功情况的表达式
1. 匹配`:`
1. 递归调用`expression`匹配失败情况的表达式

为了实现右结合的效果，`?`的`lbp`应该大于其`rbp`，这样遇到两个连续的三元表达式才会继续递归调用`expression`达到右结合的效果。

```js
expression('1 ? 2 : 3 ? 4 : 5')
function expression(tokenStream, minBp) {
  while (true) {
    ...

    const [leftBP, rightBP] = infixBindingPower(nextOp.value)
    if (leftBP < minBp) {
      // @ts-ignore
      break
    }
    tokenStream.consume()

    // 当成中缀操作符处理，三元表达式按结构解析递归调用解析部分操作数
    if (nextOp.value === '?') {
      // 注意这里又从0开始
      const consequent = _expression(tokenStream, 0)
      match({ type: 'operator', value: ':' })
      // 这里继续使用rbp
      const alternate = _expression(tokenStream, rightBP)
      result = {
        type: 'ConditionalExpression',
        test: result,
        consequent,
        alternate,
      }
      break
    }

    ...
  }
}
```

开始解析是使用`?`的`lbp`判断是否继续，结束解析完成后用`?`的`rbp`继续递归调用，中间的符号`:`是固定的，不需要为其配置优先级。

### 函数调用

函数调用的形式是`a(p1, ... pn)`，由括号包裹着若干个参数，参数之间逗号分隔。

```js
expression('a(p1, p2, p3)')
function expression(tokenStream, minBp) {
  // 这里解析开头的函数名称，保存在result变量中

  while (true) {
    ...

    // 函数调用中的'('是中缀操作符
    const [leftBP, rightBP] = infixBindingPower(nextOp.value)
    if (leftBP < minBp) {
      // @ts-ignore
      break
    }
    tokenStream.consume()

    // 当成中缀操作符处理，三元表达式按结构解析递归调用解析部分操作数
    if (nextOp.value === '(') {
        const params = [this.expression(0)]
        while (this.lexer.lookahead(0).type !== TokenType.RightParen) {
          this.lexer.consume(TokenType.Comma)
          params.push(this.expression(0))
        }
        this.lexer.consume(TokenType.RightParen)
        result = new CallExpression(result, params)
        continue
      }

    }
    if ([')', ','].includes(nextOp.value)) {
      break
    }

    ...
  }
}
```

### 任意操作符分析

操作符优先级解析支持的表达式有几个基本的假设。

1. 表达式的**语法**形式是操作符、操作数交替出现，不存在连续的操作符或者操作数的情况。注意最终的**代码**中可能出现连续操作符的情况，这是因为语法中的操作数是非终结符，可以展开导致的。
1. 具有**多个操作符**的语法，例如`( a + b )`括号表达式中间的部分必定形成括号表达式的操作数，而不会出现左右括号分别和其中的部分结合形成合法表达式的情况。当前分析的含有至少两个操作符的表达式只有`a[b] (a) a ? b : c`等几种形式，这些表达式使用不同的操作符所以不会导致二义性的问题，因此这个假设是合理的。但是如果支持了更多的具有多个操作符的表达式语法，打破了这个假设，那么操作符优先级分析法就不在适用了。

TDOP 解析过程中使用操作符左右结合力来判断操作数与正确的操作符优先结合，但是上边解析的过程还混合了碰到某些操作符就中断循环或者递归调用的逻辑，这部分逻辑可以通过设置操作符优先级的方式实现，从而将整个解析过程统一为只是用优先级的方式解决。假设操作符的优先级设置为`p`，下面具体分析一下左右结合力可能出现的不同情况。

左结合力（Left Binding Power）

1. 对于前缀操作符`- a`，`-`左侧不可能有操作数，因此其`lbp`不存在，代码实现时如果获取前缀操作符的`lbp`可以抛出异常。
1. 中缀操作符`a + b`，`+`的`lbp == p`，效果是会根据`lbp`和当前的`minBp`大小来决定`a`是与前边其前边的操作符还是`+`优先结合。
1. 中缀操作符`a ? b : c`，`:`的`lbp`相当于是`0`，因为上面的假设 2，`?`和`:`之间的部分是一个完整的操作数，碰到`:`相当于操作数`b`的解析完成了需要返回，也就是`if (op === ':') { break }`的逻辑。效果上相当于`:`优先级低于所有其他操作符的优先级，可以将`:`的`lbp`设置为`0`来实现这个中断循环进行返回的效果。

右结合力（Right Binding Power）

1. 对于前缀操作符`- a`，`-`右侧有操作数，因此其`rbp == p`。
1. 对于`a ? b : c`，`?`右侧同样有操作数，但是因为假设 2，操作数`b`中允许包含比`?`优先级还低的操作符，因此解析递归解析的时候使用的是`expression(0)`，也就是认为`?`的`rbp == 0`。注意这种情况出现在至少有两个操作数的表达式中的中缀操作符上，类似的还有索引表达式`a[b]`中的`[`，括号表达式中的`(a)`的`(`。
1. 对于`a ? b : c ? d : e`，第一个`:`右侧有操作数，但是不同于`?`的是，`:`存在结合性的问题，如果是条件表达式左结合，那么相当于`rbp = p + 1; expression(rbp)`；如果是又结合`rbp == p`。
1. 对于后缀表达式`a++`，`++`的右侧没有操作数，因为其`rbp`不存在。

根据上边的分析，有如下表格。

| lbp\rbp | p                   | p + 1  | 0                                               | 非法                                  |
| ------- | ------------------- | ------ | ----------------------------------------------- | ------------------------------------- |
| p       | 右结合              | 左结合 | `a[b]`的`[`                                     | `a++`后缀操作符                       |
| -1      | `a ? b : c` 中的`:` | x      | `a ? b : c = e` 中间符号`:`                     | `a[b]`的`]`没有右边操作数的后缀操作符 |
| 非法    | `-a` 前缀操作符     | x      | `(a)`中的`(` 具有多个操作符表达式中的前缀操作符 | x                                     |

注意结合性出现的条件是表达式的第一个和最后一个位置都是操作数，这时最后一个操作符就会与下一个表达式的第一个同等级操作符发生结合性问题。

```js
a + b + c
a ? b : c ? d : e
a op1 b op2 c op3 d op1 e op2 f op3 g
```

给定一个表达式形式，可以根据操作符有没有左右操作数、操作符在表达式中的位置分析出操作符的`lbp`和`rbp`的取值。

TODO:

### 更多表达式形式

有些语言中支持`if`表达式 `if <expression> then <expression> otherwise <expression>`，也可以考虑用 TDOP 解析。

1. 操作符优先级解析和递归下降解析的两者混合到一起
1. JSON 对象表达式的解析怎么和操作符优先级解析混合到一起?

#### 更好的方案

观察上面的代码逻辑，操作符出现的位置只有两个

1. 表达式的开头，前缀操作符，`expression`函数顶部，此外操作数也可以出现在表达式的开头。
1. 操作数的后边，后缀、中缀操作符 ，`expression`函数循环中

为出现在前缀操作符位置的 token 定义处理函数，称为 Nud（null denotation）；为出现在中缀、后缀位置的的操作符定义处理函数，成为 Led（left denotation）。

表达式整体的解析流程如下。

```js
/**
 * 将所有表达式token都按照nud和led两类处理
 **/
function expression(tokenStream, minBp) {
  const token = tokenStream.consume()
  let left = token.nud()

  while (true) {
    const token = tokenStream.peek()
    if (!token || minBp < token.lbp) {
      break
    }

    tokenStream.consume()
    left = token.led(left)
  }
  return left
}

// 每个token的处理封装在各自的类种。
class literalToken {
  nud() {
    return this.value
  }
}

class OperatorAdd {
  this.lbp = 10;

  led(left) {
    const right = expression(tokenStream, this.lbp)
    return {
      type: 'BinaryExpression',
      operator: '+',
      left,
      right,
    }
  }
}

class OperatorMul {}
    this.lbp = 20
    led(self, left) {

      const right = expression(this.lbp)
      return {
        type: 'BinaryExpression',
        left,
        right,
      }
    }
}
```

这种实现中将每个操作符、操作数的处理逻辑拆分到单独的类中，方便通过扩展而不是修改的方式增加新的操作符类型。

注意非操作符的 token 应该当做`nud`处理，直接返回其值。结束符号 EOF 相当于优先级为 0。

Nystrom 在[《Pratt Parsers: Expression Parsing Made Easy》](http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)实现了使用面向对象形式的 Java 版本代码，这种形式不同的表达式解析逻辑拆分到不同类中，代码组织结构更合理，且容易维护和新增表达式支持，但是如果对于优先级解析算法不了解的情况下，比较难以理解。

#### 参考文章

Aleksey Kladov 在[《Simple But Powerful》](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)，使用 Rust 实现了，从实际例子与代码出发，比较容易理解，本文整体思路参考这篇文章。Rust 使用模式匹配（Pattern Match）实现的版本比 Javascript 要方便简洁多了。在[From Pratt to Dijkstra](https://matklad.github.io/2020/04/15/from-pratt-to-dijkstra.html)中将上述版本逐步重构为调度厂算法。

[《Top Down Operator Precedence Parsing》](https://eli.thegreenplace.net/2010/01/02/top-down-operator-precedence-parsing) 为 Nud/Led 方案实现了 Python 的版本。

TODO: [gcc 和 Parot](http://en.wikipedia.org/wiki/Operator-precedence_parser) 使用了 TDOP 的解析，查看其源码。

然后可以看[《How Desmos uses Pratt Parsers》](https://engineering.desmos.com/articles/pratt-parser/)，从 jison 生成解析器的方案迁移到手写 TDOP，使用 [Typescript](https://github.com/desmosinc/pratt-parser-blog-code) 和类方式实现。文章总结了 Parser Generator 和手写 TDOP 方案的优劣势，手写 TDOP 的主要优势如下。

1. 代码结构清晰，对于解析代码更有掌控力，例如可以提供用户友好的错误信息，而不像 jison 只能提示语法错误。
1. 代码尺寸更小 20KB 降低到 10KB、性能更高 4 倍左右提升，Parser Generator 方案生成的 Parser 优化程度不够。
1. 严重依赖递归调用，对于`1^1^1....`的极端情况，递归层数太多而爆栈，可以记录递归深度对最大深度进行限制，或者自己管理调用栈数据，将数据挪到堆内存中，或者使用 trampoline (TODO:).

[《Pratt Parsers: Expression Parsing Made Easy》](http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)实现了 Java 的版本。

[《Top Down Operator Precedence》](https://tdop.github.io/)
和 [《Top Down Operator Precedence Vaughan R. Pratt》](https://dl.acm.org/doi/10.1145/512927.512931)是 Pratt Parser 的原版论文。

Douglas Crockford 在《Beautiful Code》第 9 章中介绍了使用 TDOP 实现 Javascript 语言的子集的方案，他的文章[《Top Down Operator Precedence》](https://www.crockford.com/javascript/tdop/tdop.html)包含了同样的内容。

Andy Chu 对 TDOP 的相关教程与文章做了个总结[《Pratt Parsing Index and Updates》](http://www.oilshell.org/blog/2017/03/31.html)，并且指出了 TDOP 和 Precedence Climbing 实际是一个算法 [《Pratt Parsing and Precedence Climbing Are the Same Algorithm》](http://www.oilshell.org/blog/2016/11/01.html)。

### Precedence Climbing

Precedence Climbing 方法和 TDOP 一样使用递归加循环的方式自底向上构造解析结果，区别之处在 Precedence Climbing 使用优先级（Precedence）而不是结合力（Binding Power）来解决操作符优先级问题。

整体的表达式解析流程如下。

```js
function expression(min_prec) {
  let result = atom()

  while (true) {
    const token = tokenStream.peek()
    const prec = precedence(token)
    const assoc = associativity(token)
    if (!token || prec < min_prec) {
      break
    }

    tokenStream.consume()
    const next_min_prec = assoc === 'left' ? prec + 1 : prec
    const rhs = expression(next_min_prec)
    result = operator(result, rhs)
  }

  return result
}
```

先调用`atom`获取子表达式，可能是操作数或者是另一个完整的表达式。然后同样在循环中根据当前 token 的优先级分情况处理。

1. 如果 token 优先级小于当前要求的最小优先级`min_prec`，应当提前返回。
1. 如果 token 优先级高于当前要求的最小优先级，继续递归调用`expression`解析右侧表达式，并将表达式返回结果进行组合，直到循环结束，回到第一种情况结束递归。

操作符结合性的问题通过调整表达式要求的最小优先级来处理，连续出现两个相同的操作符，右结合相当于右边的操作符有更高的优先级；左结合相当于左边的操作符有更高的优先级。

1. 对于右结合的操作符，递归调用`expression`时使用`min_prec = prec`，而循环终止的条件是`prec < min_prec`，所以会继续递归调用，形成右结合的效果。
1. 对于左结合的操作符，使用`min_prec = prec + 1`，这样后续遇到的操作符优先级`prec < min_prec`，递归结束，形成左结合的效果。

对于前缀操作符、括号、索引操作符、三元操作符的处理隐藏在`atom`表达式中，根据每种操作符与操作数相对位置的情况，递归的调用`expression`进行解析，思路和 TDOP 相同。

Clang 的编译器前端就是手写的[递归下降解析](https://clang.llvm.org/doxygen/ParseExpr_8cpp_source.html)，在`lib/Parse/ParseExpr.cpp`中使用了 Precedence Climbing 方法。

#### 参考资料

Eli Bendersky 在[《Parsing Expressions by precedence climbing》](https://eli.thegreenplace.net/2012/08/02/parsing-expressions-by-precedence-climbing)，针对只包含二元运算符的表达式，解释了 Precedence Climbing 方法的原理，对运算符**优先级**和**结合性**的问题给出解释。对于前缀操作符，文章建议将其当做子表达式来处理，这种做法相当于定死了前缀操作符的优先级高于任何二元操作符，`-x+y`固定解析为`(-x)+y`而不是`-(x+y)`，无法调整前缀操作符合二元操作符的优先级顺序。另外这篇文章没有对后置操作符、索引操作符、三元操作符的情况进行描述。

Nystrom 在[Pratt Parsers: Expression Parsing Made Easy](http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)中使用面向对象的方法实现了表达式解析，不同的操作符的解析代码位于各自的类中，代码组织结构十分清晰，且容易扩展新的操作符，开闭原则（Open to extension, close to modification），参考[Bantam](https://github.com/munificent/bantam)语言实现。

Theodore Norvell 在[Parsing Expressions by Recursive Descent](https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm#climbing)中对于 Precedence Climbing 进行了比较详细的描述，给出了包含前置操作符优先级处理的例子，并将其推广为表格驱动的解析方法。另外 Precedence Climbing 这个说法也是他提出的。

在[《From Precedence Climbing to Pratt Parsing》](https://www.engr.mun.ca/~theo/Misc/pratt_parsing.htm)中，Theodore Norvell 讨论了 TDOP 和 Precedence Climbing 方法之间的联系，并使用命令模式（Command Pattern）对 Precedence Climbing 进行改造，最终达到和 TDOP 相同的效果。

[《The top-down parsing of expressions》](https://www.antlr.org/papers/Clarke-expr-parsing-1986.pdf)Keith Clarke 的原文。

### 调度场算法（Shunting-Yard Algorithm）

[调度场算法](https://en.jinzhao.wiki/wiki/Shunting-yard_algorithm)对表达式的解析过程与上面两种方法类似，区别在于使用栈代替了递归，使用一个操作数的栈和一个操作符的栈分别记录已经处理过的 token。

```js
function shuntingYard(tokenStream) {
  const operatorStack = []
  const operandsStack = []

  while (true) {
    const token = tokenStream.peek()
    if (!token) {
      break
    }

    // 操作数直接入栈
    if (token.type === 'number') {
      push(token)
      continue
    }

    const prec = precedence(token)

    // 栈顶操作符如果优先级高于当前token操作符优先级，全部出栈
    while (prec < top(operatorStack)) {
      pop()
    }
  }

  // 清空操作数栈，这里可以把EOF token优先级设置为0，这样可以复用上边循环中相同的逻辑
  while (operators.length > 0) {
    pop()
  }

  // 操作数
  return top(operandsStack)
}

function top(stack) {
  return stack[stack.length - 1]
}

function precedence() {}

function pop() {
  const operator = operatorStack.pop()
  const operand2 = operandStack.pop()
  const operand1 = operandStack.pop()

  const newOperand = operator(operand1, operand2)
  push(newOperand)
}
```

算法结束后操作数栈中应该有一个操作数，这个操作数就是最终结果。操作数栈也可以改造为 ASTNode 的栈，这样最终得到的就是解析完成的抽象语法树。

TODO: 补充对于操作符的优先级、结合性、Unary、Binary、Ternary 的处理。

讨论 Pratt Parser 和 Dijkstra 之间的关系 [From Pratt to Dijkstra](https://matklad.github.io/2020/04/15/from-pratt-to-dijkstra.html)

#### 参考资料

Theodore Norvell 在[Parsing Expressions by Recursive Descent](https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm#shunting_yard)介绍了调度场算法

### LL(k)递归下降解析

不修改语法，构建 k 个预看 token 的环形缓冲区来支持。

## Bottom Up

自底向上解析

## 解释器生成器（Parser Generator）

使用解释器生成器根据文法自动生成解释器代码，例如[antlr4ts](https://www.npmjs.com/package/antlr4ts)可以生成 TS 代码。

1. [Modern Parser Generator](https://matklad.github.io/2018/06/06/modern-parser-generator.html)
1. PEG https://zhuanlan.zhihu.com/p/355364928
1. https://tomassetti.me/guide-parsing-algorithms-terminology/
1. https://tomassetti.me/resources-create-programming-languages/
1. https://tomassetti.me/parsing-in-javascript/

ANTLR

1. https://tomassetti.me/best-practices-for-antlr-parsers/

1. [list of languages that compile to js](https://github.com/jashkenas/coffeescript/wiki/list-of-languages-that-compile-to-js)

1. [A Unified Theory of Garbage Collection](https://researcher.watson.ibm.com/researcher/files/us-bacon/Bacon04Unified.pdf)

1. [The Next 700 Programming Languages](https://homepages.inf.ed.ac.uk/wadler/papers/papers-we-love/landin-next-700.pdf)

### Small Languages

1. Lox From Crafting Interpreters
1. http://finch.stuffwithstuff.com/

1. https://craftinginterpreters.com/contents.html
