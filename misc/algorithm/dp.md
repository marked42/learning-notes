# 动态规划

## 斐波那契与爬楼梯

这两道题解法类似，状态转移方程都是`f(n) = f(n-1) + f(n-2)`，区别在于初始状态不同，以斐波那契为例。

使用数组来保存每个值对应解的个数，时间复杂度和空间复杂度都是`O(N)`。

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  const dp = new Array(n + 1)
  dp[0] = 0
  dp[1] = 1

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }

  return dp[n]
}
```

由于`f(n)`的值只跟前两项有关，因此只记录前两项即可，空间可以从数组压缩为两个变量`fn_1/fn_2`。

```js
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n === 0) {
    return 0
  }
  if (n === 1) {
    return 1
  }

  let fn_2 = 0
  let fn_1 = 1
  let fn = 0
  for (let i = 2; i <= n; i++) {
    fn = fn_1 + fn_2
    fn_2 = fn_1
    fn_1 = fn
  }

  return fn
}
```

空间复杂度从降低为`O(1)`，时间复杂度为`O(N)`。

利用加速幂的方法可以优化时间复杂度，每一轮迭代实际上是更新了`fn_1/fn_2`两个变量得值，可以表示为矩阵乘法。

$$
\begin{bmatrix}1 & 1\\ 1 & 0\end{bmatrix}
\begin{bmatrix}f(n-1) \\ f(n-2) \end{bmatrix} =
\begin{bmatrix}f(n) \\ f(n-1) \end{bmatrix}
$$

也就是每轮循环相当于一次矩阵左乘，为了得到`f(n)`的结果需要从初始值进行`N-1`次左乘。

$$
\begin{bmatrix}1 & 1\\ 1 & 0\end{bmatrix}^{N-1}
\begin{bmatrix}f(1) \\ f(0) \end{bmatrix} =
\begin{bmatrix}f(n) \\ f(n-1) \end{bmatrix}
$$

利用矩阵快速幂的原理，在对数时间内`O(logN)`完成矩阵幂运算。

```js
var fib = function (n) {
  if (n < 2) {
    return n
  }
  const q = [
    [1, 1],
    [1, 0],
  ]
  const res = pow(q, n - 1)
  // fn是0行0列的元素
  return res[0][0]
}

const pow = (a, n) => {
  // 单位矩阵
  let ret = [
    [1, 0],
    [0, 1],
  ]
  while (n > 0) {
    if ((n & 1) === 1) {
      ret = multiply(ret, a)
    }
    // 右移等于除以2
    n >>= 1
    a = multiply(a, a)
  }
  return ret
}

// 矩阵乘法
const multiply = (a, b) => {
  const c = new Array(2).fill(0).map(() => new Array(2).fill(0))
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      c[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j]
    }
  }
  return c
}
```

## 背包问题

Divide and Conquer

https://www.youtube.com/watch?v=LPIvL-jvGdA&list=PLLuMmzMTgVK5DkeNodml9CHCW4BGxpci7&index=2

## 凑硬币

### [322 Coin Change](https://leetcode.cn/problems/coin-change/)

硬币面值个数假设为`n`，总钱数为`S`，$S = \sum_{i=0}^{n-1}x_i c_i$，其中$c_i$是第`i`中硬币的面值，$x_i$是第`i`中硬币的数量。

使用`f(S)`表示答案，从其中选取一枚硬币$c_0$，剩余的钱数$S-C_0$，则`f(S) = f(S-C_0) + 1`，注意总共硬币面值个数种选法，`f(S)`是其中最小者，
但是注意如果`f(S-Ci)`无法用硬币组成，则不参与`f(S)`的计算，如果所有情况`f(S-Ci)`都无法组成，那么`f(S)`也无法组成。

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  // 初始化为最大值
  const dp = new Array(amount + 1).fill(Number.MAX_SAFE_INTEGER)
  // 钱数0对应硬币数为0
  dp[0] = 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      // 对于每个硬币，当前面额i必须大于coin情况才有效
      // 同时子问题不能为Number.MAX_SAFE_INTEGER，这种情况子问题无解
      // 子问题有效时才是一种合法情况贡献给父问题
      if (i >= coin && dp[i - coin] !== Number.MAX_SAFE_INTEGER) {
        // dp[i] 初始化为最大值，如果没有合法的子问题，则父问题保持初始值不变
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
  }

  // 初始值表示该问题无解
  return dp[amount] === Number.MAX_SAFE_INTEGER ? -1 : dp[amount]
}
```

使用更符合转移方程的形式

```js
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  const dp = new Array(amount + 1).fill(Number.MAX_SAFE_INTEGER)
  dp[0] = 0

  // i 小于0时问题无解
  function getDP(i) {
    return i < 0 ? Number.MAX_SAFE_INTEGER : dp[i]
  }

  function setDP(i, value) {
    return (dp[i] = value)
  }

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      // 子问题不等于Number.MAX_SAFE_INTEGER，子问题有解
      if (getDP(i - coin) !== Number.MAX_SAFE_INTEGER) {
        setDP(i, Math.min(getDP(i), getDP(i - coin) + 1))
      }
    }
  }

  return dp[amount] === Number.MAX_SAFE_INTEGER ? -1 : dp[amount]
}
```

## 买卖股票

1. 121 Best Time to Buy and Sell Stock
1. 122 Best Time to Buy and Sell Stock II
1. 123 Best Time to Buy and Sell Stock III
1. 188 Best Time to Buy and Sell Stock IV
1. 309 Best Time to Buy and Sell Stock with Cooldown

## 接雨水

https://leetcode.cn/problems/trapping-rain-water/

每个下标的水量等于两侧峰值中较小者减去下标对应元素值。

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  const N = height.length
  const leftMax = new Array(N)

  let max = 0
  for (let i = 0; i < N; i++) {
    leftMax[i] = max = Math.max(max, height[i])
  }

  const rightMax = new Array(N)
  max = 0
  for (let i = N - 1; i >= 0; i--) {
    rightMax[i] = max = Math.max(max, height[i])
  }

  let water = 0
  for (let i = 0; i < N; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - height[i]
  }

  return water
}
```

TODO: 还有单调栈的解法
