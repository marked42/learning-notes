# 操作符优先级解析（Top Down Operator Precedence）

## 问题介绍

表达式的解析是编译原理前端中的一个非常有趣的问题，下面是一个普通的表达式。

```js
1 + 2 * 3 - 4
```

使用经典的递归下降算法可以对表达式进行解析，定义表达式的文法如下。

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

中间规则`<term>`和`<factor>`的定义是为了区分运算符的优先级，根据规则的递归定义可以很方便的写出对应的代码实现。但是递归下降的解析方法有一些[问题](https://eli.thegreenplace.net/2009/03/14/some-problems-of-recursive-descent-parsers)。

1. 操作符的优先级与文法定义绑定，如果需要修改操作符优先级，对应的文法定义也需要修改。
1. 操作符优先级层级很多时，对应需要很多中间文法规则，定义起来比较复杂，同时递归下降解析的效率也会与层级线性相关，解析一个简单的数字表达式也需要从上到下递归一遍，效率很低。
1. 操作符结合性的问题，递归下降分析方法必须消除左递归，将左递归文法转换为等价的右递归文法。但是右递归文法只能产生右结合的表达式，无法处理左结合的二元表达式。

由于以上这些问题，实际的表达式解析实现通常不会使用递归下降解析算法，而是使用操作符优先级解析算法。 有趣的是基本上所有的教材中都没有提及这个算法，但是实际上几乎所有的工业实现都是使用的这个算法，颇有些口口相传的意味。

## TDOP 算法

### 操作符结合力

自顶向下的运算符优先级分析法最早由 Pratt 提出，也叫 Pratt Parsing，具体的历史可参考这篇[文章](http://www.oilshell.org/blog/2016/11/01.html)的总结。**关键**在于通过给操作符定义**结合优先级**（Binding Power）来解决**操作符优先级**的问题。

二元操作符（binary operator）左右都可以存在操作数（operand），定义结合优先级`bp(op) = (lbp, rbp)`，`lbp`是左侧结合优先级（**L**eft **B**inding **P**ower），`rbp`是右侧结合优先级（**R**ight **B**inding **P**ower）。

下面这个数学表达式中，定义加法操作符`bp(+) = (1, 2)`，乘法操作符`bp(*) = (3, 4)`。

```js
  3   +   1   *   2   *   4   +   5
0   1   2   3   4   3   4   1   2   0
```

上边是表达式，下边是每个二元运算符左右两侧的`bp`值。数字`1`左侧是加号，右侧是乘号，乘号的`lbp = 3`大于加号的`rbp = 2`所以`1`应该与乘号优先结合，数字`4`同理可知应该与左侧乘号结合。

不同符号通过定义`bp`来确定优先级，对于同一符号来说还存在结合律的问题，加法和乘法都是左结合（left associativity），考虑上面的`1 * 2 * 4`应该解析为`(1 * 2) * 4`而不是`1 * (2 * 4)`。数字`2`左侧是乘号的`rbp = 4`大于其右侧乘号的`lbp = 3`，所以解析结果应该是左结合。同理定义`bp(^) = (6, 5)`可以使得操作符`^`是右结合。

### 二元操作符（Binary Operator）解析

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

### 一元操作符（Unary Operator）

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

### 括号（Parenthesis）

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

### 索引符号（Index Operator）

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

### 三元操作符（Ternary Operator）

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
1. 对于`a ? b : c ? d : e`，第一个`:`右侧有操作数，但是不同于`?`的是，`:`存在结合性的问题，如果是条件表达式左结合，那么相当于`rbp = p + 1; expression(rbp)`；如果是右结合`rbp == p`。
1. 对于后缀表达式`a++`，`++`的右侧没有操作数，因为其`rbp`不存在。

注意结合性出现的条件是表达式的第一个和最后一个位置都是操作数，这时最后一个操作符就会与下一个表达式的第一个同等级操作符发生结合性问题。

```js
a + b + c
a ? b : c ? d : e
a op1 b op2 c op3 d op1 e op2 f op3 g
```

给定一个表达式形式，可以根据操作符有没有左右操作数、操作符在表达式中的位置分析出操作符的`lbp`和`rbp`的取值。

### 更多表达式形式

有些语言中支持`if`表达式 `if <expression> then <expression> otherwise <expression>`，也可以考虑用 TDOP 解析。

### 更好的方案

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

### 参考资料

Aleksey Kladov 在[《Simple But Powerful》](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)，使用 Rust 实现了，从实际例子与代码出发，比较容易理解。Rust 使用模式匹配（Pattern Match）实现的版本比 Javascript 要方便简洁多了。在[From Pratt to Dijkstra](https://matklad.github.io/2020/04/15/from-pratt-to-dijkstra.html)中将上述版本逐步重构为调度厂算法。

[《Top Down Operator Precedence Parsing》](https://eli.thegreenplace.net/2010/01/02/top-down-operator-precedence-parsing) 为 Nud/Led 方案实现了 Python 的版本。

[gcc 和 Parot](http://en.wikipedia.org/wiki/Operator-precedence_parser) 使用了 TDOP 的解析。

[《How Desmos uses Pratt Parsers》](https://engineering.desmos.com/articles/pratt-parser/)，从 jison 生成解析器的方案迁移到手写 TDOP，使用 [Typescript](https://github.com/desmosinc/pratt-parser-blog-code) 和类方式实现。文章总结了 Parser Generator 和手写 TDOP 方案的优劣势，手写 TDOP 的主要优势如下。

1. 代码结构清晰，对于解析代码更有掌控力，例如可以提供用户友好的错误信息，而不像 jison 只能提示语法错误。
1. 代码尺寸更小 20KB 降低到 10KB、性能更高 4 倍左右提升，Parser Generator 方案生成的 Parser 优化程度不够。
1. 严重依赖递归调用，对于`1^1^1....`的极端情况，递归层数太多而爆栈，可以记录递归深度对最大深度进行限制，或者自己管理调用栈数据，将数据挪到堆内存中，或者使用 trampoline。

[《Pratt Parsers: Expression Parsing Made Easy》](http://journal.stuffwithstuff.com/2011/03/19/pratt-parsers-expression-parsing-made-easy/)实现了 Java 的版本。

[《Top Down Operator Precedence》](https://tdop.github.io/)
和 [《Top Down Operator Precedence Vaughan R. Pratt》](https://dl.acm.org/doi/10.1145/512927.512931)是 Pratt Parser 的原版论文。

Douglas Crockford 在《Beautiful Code》第 9 章中介绍了使用 TDOP 实现 Javascript 语言的子集的方案，他的文章[《Top Down Operator Precedence》](https://www.crockford.com/javascript/tdop/tdop.html)包含了同样的内容。

Andy Chu 对 TDOP 的相关教程与文章做了个总结[《Pratt Parsing Index and Updates》](http://www.oilshell.org/blog/2017/03/31.html)，并且指出了 TDOP 和 Precedence Climbing 实际是一个算法 [《Pratt Parsing and Precedence Climbing Are the Same Algorithm》](http://www.oilshell.org/blog/2016/11/01.html)。
