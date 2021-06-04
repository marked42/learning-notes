# 词法分析

1. 递归下降的词法分析
1. 使用正则表达式进行词法分析
1. 手动构造状态机 NFA -> DFA

Tokenizer 构造状态机进行分词，有两个问题：

1. 存在关键词 int 和 identifier 模式冲突，为每个构造独立的状态
1. = == === 这种 token 之间模式重合，首选尽可能长的 token，会存在失败回退的情况如何处理?
1. 空白字符被忽略，不产生对应的 token
1. 处理 token 使用状态机转换识别字符串，在一个已经可接受的状态下，需要获取到下一个字符才能确认当前 token 已经结束 ，这里对应了 initToken 的操作，同时 initToken 中的最后一个 else 情况，保持 initial 状态不变，忽略所有未知的 token 模式，包括空白。
1. 循环结束后需要处理之前遗留的最后一个 token，将其添加到 tokens 列表中。

正则表达式与状态机

1. 一组状态，
1. 起始状态
1. 一组接受状态
1. 所有输入组成的字符集 Alphabet
1. 状态转换函数

正则表达式由基本的操作组成

1. concatenation 拼接
1. alternation 选择
1. kleen closure 重复

正则表达式的几种操作有优先级顺序，\* > concatenation > alternation

扩展的几个操作

1. 指定数目的重复 ？+ \* {}
1. 范围 [a-z]
1. 补集操作 [^a]

1. 正则表达式生成 NFA，Thompson 构造，空转换用来连接多个 NFA 模式。
1. NFA -> DFA 子集构造 Subset Construction
1. DFA 最小化 Hopcroft’s Algorithm
1. 使用 NFA，DFA 对一个输入字符串传进行识别，

NFA 对比 DFA，表达能力相同，具有 N 个状态的 NFA 构成出来的 DFA 最多有 2^N 个状态，可能出现状态爆炸的情况，空间要求高，但是 DFA 的执行时间只和输入的长度线性相关，和状态的数目无关。

## Scanner 的实现

### 表格驱动法 (Table-Driver Scanner)

一个 DFA 由三个表格来表示

1. 单个字符到字符分类映射表，将字符划分成不同的种类，同一类的两个字符在 DFA 中应该造成相同的状态转换。对于 Unicode 等字符数目很大的字符集分类处理能显著降低表格大小，如果是 ASCII 这样字符数目比较小的字符集，不分类处理也可以。
1. 二维状态转换表，(S, C) -> S'，状态 S 接受字符类型 C 转换到新状态 S'。
1. 状态到 Token 类型映射表，非接受状态和错误状态（Se）映射到 token 类型是 invalid，代表非法 Token，每个接受状态 S 映射到对应的 Token 类型 T。

使用这三个表格进行分词的逻辑如下：

```js
const STATE_ERROR = -1

const charCategories = []
const transitions = []
const tokenTypes = []

function isAcceptingState() {
  const stateStatus = []
}

function nextToken() {
  // 1. 数据初始化
  let state = s0
  let stack = []
  let lexeme = ''

  // 2. 状态转换直到进入到一个错误状态，这一步是为了获取输入中最长的有效Token
  // 进入错误状态，然后回退到上一个接受状态，就是最长的token
  // 如果之前没有接受状态，就代表从当前输入无法识别合法的token
  while (state !== STATE_ERROR) {
    const char = getChar()
    const category = charCategories[char]
    state = transitions[category]
    if (isAcceptingState(state)) {
      stack = []
    } else {
      stack.push(state)
    }
    lexeme += char
  }

  // 3. 进行回退，直到上一个接受状态或者是开始状态
  while (!isAcceptingState(state) && state !== s0) {
    // 回退一个状态
    state = stack.pop()
    // 回退一个字符
    lexeme.splice(lexeme.length - 1, 1)
    // 输入流需要回退
    ungetChar()
  }

  // 4. 根据回退结束的状态得到对应token类型
  if (isAcceptingState(state)) {
    return tokenTypes[state]
  }

  return TOKEN_INVALID
}
```

另外对于`ab | (ab)*c`这样的模式，输入`abababc`可以一趟匹配完成，但是输入`ababab`第一次匹配发现末尾没有字符'c'然后回退得到 token 'ab'；
消耗掉开头的`ab`后剩余输入`abab`进行下次匹配，这里同样会匹配到末尾然后进行回溯。这种重复匹配模式的情况下，会出现同一个状态，输入的同一个位置进行多次匹配然后回溯，如果回溯操作是单个字符进行的，那么可能出现 O(n^2)的极端回溯情况。为了避免这种情况，需要使用一个二维表格`Failed[state][pos]`记录了状态`state`对于输入位置`pos`是否曾经进行过失败匹配，如果在前一次匹配出现过失败的记录，在第二步中直接**快速**失败，避免极端回溯的情况。注意需要在每次进行匹配前对 Failed 数据进行初始化为 false，pos 重新置 0 将每次重新开始匹配时输入流中的字符标记为起始位置，pos 不代表字符在整个输入流中的位置。

```js
function nextToken() {
  // 1. 数据初始化
  let failed = []
  let pos = 0
  let state = s0
  let stack = []
  let lexeme = ''

  // 2. 状态转换直到进入到一个错误状态，这一步是为了获取输入中最长的有效Token
  // 进入错误状态，然后回退到上一个接受状态，就是最长的token
  // 如果之前没有接受状态，就代表从当前输入无法识别合法的token
  while (state !== STATE_ERROR) {
    const char = getChar()
    const category = charCategories[char]
    // 快速失败
    if (failed[state] && failed[state].has(pos)) {
      break
    }
    pos++
    state = transitions[category]
    if (isAcceptingState(state)) {
      stack = []
    } else {
      stack.push(state)
    }
    lexeme += char
  }

  // 3. 进行回退，直到上一个接受状态或者是开始状态
  while (!isAcceptingState(state) && state !== s0) {
    // 回退一个状态
    state = stack.pop()
    // 回退一个字符
    lexeme.splice(lexeme.length - 1, 1)
    // 输入流需要回退
    const set = (failed[state] || failed[state] = new Set())
    set.add(pos)
    pos--
    ungetChar()
  }

  // 4. 根据回退结束的状态得到对应token类型
  if (isAcceptingState(state)) {
    return tokenTypes[state]
  }

  return TOKEN_INVALID
}
```

自动构造三个表格，可以从最开始状态字符映射表，对于相同的列进行合并，合并后的每一列代表一种字符分类。
这个合并的过程可能使用 Union Find 算法？

不成熟的想法，不记录 stack 没法构造 failed 表格，无法避免极端回溯情况。
这种方式使用 stack 记录了从开始状态或者最近的接受状态进行状态转换的路径，可以用一个变量 lastAcceptingState 记录最近的一个接受状态，`lastAcceptingStateDistance`记录该状态和第二步匹配结束的错误状态之间的距离，同时需要输入流支持一次回退多个字符，这样第三步的操作就能在常数时间完成。

## 空间优化

将编译过程中使用到的所有静态字符串信息进行哈希操作，存储为哈希表，减少内存占用，同时能够提供常数时间的字符串相等操作。

例如解决一个 identifier 是不是保留字的问题，完美哈希方法（perfect hash）。

1. ANTLR 生成的 Lexer 中进行类似的优化处理。
1. [v8 引擎的优化](https://v8.dev/blog/scanner#keywords)
1. https://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones
