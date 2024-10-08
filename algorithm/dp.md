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

## 一维 DP

[279. Perfect Squares](https://leetcode.cn/problems/perfect-squares/)

$K = \lfloor\sqrt{n}\rfloor$

```js
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
  const dp = new Array(n + 1)
  dp[0] = 0

  for (let i = 1; i <= n; i++) {
    let min = n + 1
    for (let k = 1; k * k <= i; k++) {
      min = Math.min(min, dp[i - k * k] + 1)
    }
    dp[i] = min
  }

  return dp[n]
}
```

从`1`遍历到`n`计算了所有子问题，但是`n`实际上只依赖于部分`n-1/.../n-k^2`等子问题，其中有些问题不必要计算，可以使用记忆化方法只计算必要的子问题。

### [343. Integer Break](https://leetcode.cn/problems/integer-break/)

状态转移方程 $dp[i] = max{j * (i - j), j * dp[i - j]}$

<!-- dp[i]= 1≤j<i max ​ {max(j×(i−j),j×dp[i−j])} -->

### [96. Unique Binary Search Trees](https://leetcode.cn/problems/unique-binary-search-trees/)

一维 DP，卡特兰数，n 个节点每次选取一个节点做根节点，剩余`n-1`个节点分给两个子树，左子树可能的个数是`dp[0] ... dp[n-1]`，右子树是`dp[n-1] ... dp[0]`，配对乘积之和得到`dp[n]`。注意初始化条件`dp[0] = dp[1] = 1`。

```js
/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function (n) {
  const dp = new Array(n + 1)
  dp[0] = 1
  dp[1] = 1

  for (let i = 2; i <= n; i++) {
    let sum = 0
    for (let j = 0; j < i; j++) {
      sum += dp[j] * dp[i - 1 - j]
    }
    dp[i] = sum
  }

  return dp[n]
}
```

## 二维 DP

[64. Minimum Path Sum](https://leetcode.cn/problems/minimum-path-sum/)
[72. Edit Distance](https://leetcode.cn/problems/edit-distance/)

编辑距离是典型的二维 DP 问题。

```js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
  const M = word1.length
  const N = word2.length

  const dp = new Array(M + 1)
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(N + 1)
  }

  // 初始化第一行
  for (let i = 0; i < dp[0].length; i++) {
    dp[0][i] = i
  }

  // 初始化第一列
  for (let i = 0; i < dp.length; i++) {
    dp[i][0] = i
  }

  for (let row = 1; row <= M; row++) {
    for (let col = 1; col <= N; col++) {
      const left = dp[row][col - 1] + 1
      const top = dp[row - 1][col] + 1
      const diagonal =
        dp[row - 1][col - 1] + (word1[row - 1] === word2[col - 1] ? 0 : 1)
      dp[row][col] = Math.min(left, top, diagonal)
    }
  }

  return dp[M][N]
}
```

### [120. Triangle](https://leetcode.cn/problems/triangle/)

三角形，状态转移方程式`dp[i][j] = min(dp[i-1][j-1], dp[i-1][j]) + triangle[i][j]`，使用滚动数组的方法可以将空间复杂度从`O(N^2)`降低到`O(N)`，但是注意因为`dp[i][j]`依赖于`dp[i-1][j-1]`，所以内层循环需要反向遍历，这样`dp[i-1][j-1]`不会被`dp[i][j-1]`覆盖，这两者都滚动数组中的`dp[j-1]`。

```js
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
  const N = triangle.length
  const dp = new Array(N)
  dp[0] = triangle[0][0]

  // dp[i][j] = min(dp[i-1][j-1], dp[i-1][j]) + triangle[i][j]
  for (let i = 1; i < N; i++) {
    for (let j = i; j >= 0; j--) {
      const top = j === i ? Number.MAX_SAFE_INTEGER : dp[j]
      const diag = j === 0 ? Number.MAX_SAFE_INTEGER : dp[j - 1]
      dp[j] = Math.min(top, diag) + triangle[i][j]
    }
  }

  return Math.min(...dp)
}
```

### [62. Unique Paths](https://leetcode.cn/problems/unique-paths/)

状态转移方程`dp[i][j] = dp[i-1][j] + dp[i][j-1]`。考虑问题`dp[i][j] === dp[j][i]`是对称的，使用二维数组时存在重复，所以采用缓存方式，调整`i`和`j`的顺序，让`i <= j`。另外`i === 1`的时候，是递归的出口，长度为 1 的矩形只有一条路径。

```js
const memo = new Map()

/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  // dp[i][j] = dp[i][j-1] + dp[i-1][j]
  if (m > n) {
    return uniquePaths(n, m)
  }

  if (m === 1) {
    return 1
  }

  const key = `${m}-${n}`
  if (memo.has(key)) {
    return memo.get(key)
  }

  const count = uniquePaths(m - 1, n) + uniquePaths(m, n - 1)

  memo.set(key, count)

  return count
}
```

### [63. Unique Paths II](https://leetcode.cn/problems/unique-paths-ii/)

具有障碍物的最小路径个数，当前位置有障碍物时，不能达到，可以将个数取 0，加法运算中相当于不参与贡献，该子问题不对更大子问题参与贡献。
注意第一行第一列的初始化，默认路径个数是 1，从遇到第一个障碍物开始是 0。

```js
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
  const M = obstacleGrid.length
  const N = obstacleGrid[0].length

  const dp = new Array(M)
  for (let i = 0; i < M; i++) {
    dp[i] = new Array(N)
  }

  // 初始化第一行
  let col = 0
  for (; col < N && obstacleGrid[0][col] === 0; col++) {
    dp[0][col] = 1
  }
  for (; col < N; col++) {
    dp[0][col] = 0
  }

  // 初始化第一例
  let row = 0
  for (; row < M && obstacleGrid[row][0] === 0; row++) {
    dp[row][0] = 1
  }
  for (; row < M; row++) {
    dp[row][0] = 0
  }

  for (row = 1; row < M; row++) {
    for (col = 1; col < N; col++) {
      const top = dp[row - 1][col]
      const left = dp[row][col - 1]
      dp[row][col] = obstacleGrid[row][col] === 1 ? 0 : left + top
    }
  }

  return dp[M - 1][N - 1]
}
```

### [718. Maximum Length of Repeated Subarray](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/)

暴力解法下需要比较每个可能的下表对`(i, j)`，时间复杂度是`O(N ^ 3)`，利用动态规划可以将单个坐标对`(i, j)`的处理从线性时间降低到常数时间。

`dp[i][j]`表示下表对`(i, j)`开头的最长公共子串的长度，根据`nums1[i]`是否等于`nums[2]`分为两种情况，状态转移方程如下。

```js
dp[i][j] = nums1[i] === nums2[j] ? dp[i + 1][j + 1] : 0
```

和普通的二维动态规划不同，这里行列方向要逆向递减处理。边界条件的情况是行列坐标超出范围，相当于公共子串长度为`0`。考虑到缓存的局部性，可以使用正向迭代，对应的`(i, j)`含义需要做调整。

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
  const M = nums1.length
  const N = nums2.length
  const dp = new Array(M)
  for (let i = 0; i < M; i++) {
    dp[i] = new Array(N)
  }

  let max = 0
  for (let row = M - 1; row >= 0; row--) {
    for (let col = N - 1; col >= 0; col--) {
      const outside = row === M - 1 || col === N - 1
      const prev = outside ? 0 : dp[row + 1][col + 1]
      dp[row][col] = nums1[row] === nums2[col] ? prev + 1 : 0

      max = Math.max(dp[row][col], max)
    }
  }

  return max
}
```

## 背包问题

https://leetcode.cn/problems/last-stone-weight-ii/solution/yi-pian-wen-zhang-chi-tou-bei-bao-wen-ti-5lfv/
https://leetcode.cn/problems/last-stone-weight-ii/solution/gong-shui-san-xie-xiang-jie-wei-he-neng-jgxik/
https://www.youtube.com/watch?v=LPIvL-jvGdA&list=PLLuMmzMTgVK5DkeNodml9CHCW4BGxpci7&index=2

Divide and Conquer

背包问题分类

1. 0/1 背包
1. 完全背包
1. 多重背包
1. 组合背包

1. 极值问题 最大最小
1. 存在问题
1. 组合问题

初始化条件

### 0/1 背包问题

#### [1049. Last Stone Weight II](https://leetcode.cn/problems/last-stone-weight-ii/)

```js
/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeightII = function (stones) {
  const sum = stones.reduce((acc, val) => acc + val, 0)
  const volume = Math.floor(sum / 2)

  const dp = new Array(volume + 1).fill(0)
  const n = stones.length

  // 0/1 背包问题
  for (let i = 0; i < n; i++) {
    for (let j = volume; j >= stones[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - stones[i]] + stones[i])
    }
  }

  return sum - 2 * dp[volume]
}
```

#### [494. Target Sum](https://leetcode.cn/problems/target-sum/)

总共组合的情况有`2 ^ n`种，使用回溯方法检查所有组合的和是否等于目标值时间复杂度是`O(2^n)`。使用动态规划`dp[i][j]`表示数组`[0, i]`可以组成和为`j`的情况，`i`有正负两种情况，因此状态转移方程。

```js
// i的个数等于 i-1两种情况个数的和
dp[i][j] = dp[i - 1][j - nums[i]] + dp[i - 1][j + nums[i]]
```

初始化条件是第一个数组元素能组成和的情况，`dp[0][nums[0]] = dp[0][-nums[0]]`都是`1`，如果`nums[0]`等于 0 的话，`dp[0][0]`初始化为 2。`i`的取值范围是`[0, n-1]`，`j`的取值范围是和的范围`[-sum, sum]`。超出这个范围的`dp[i][j]`的值都可以当做 0，不参与结果贡献。

注意我们这里使用了负数作为下标，数组中的话要对负数列下标做偏移处理。也可以使用滚动数组的方法优化空间复杂度。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
  const M = nums.length

  const sum = nums.reduce((acc, val) => acc + val, 0)
  const N = 2 * sum + 1

  const dp = new Array(M)
  for (let i = 0; i < M; i++) {
    // 所有都初始化为0
    dp[i] = new Array(N).fill(0)
  }

  // 初始化第一行，组成正负nums[0]两种情况，nums[0]可能为0，这时dp[0] = 2
  set(0, nums[0], get(0, nums[0]) + 1)
  set(0, -nums[0], get(0, -nums[0]) + 1)

  function get(i, j) {
    return dp[i][j + sum] || 0
  }
  function set(i, j, val) {
    dp[i][j + sum] = val
  }

  for (let i = 1; i < M; i++) {
    for (let j = -sum; j <= sum; j++) {
      const val = get(i - 1, j - nums[i]) + get(i - 1, j + nums[i])
      set(i, j, val)
    }
  }

  return get(M - 1, target)
}
```

上面的动态规划方法时间复杂度是`O(N * SUM)`，我们计算了二维数组中所有值，如果只是为了计算`dp[i][target]`，可以使用记忆化方法避免重复子问题计算的同时又只递归计算需要的子问题的答案。

#### [416. Partition Equal Subset Sum](https://leetcode.cn/problems/partition-equal-subset-sum/)

划分两个子集和相等等价于能够选出一个子集的和是整个集合和的一半，这意味着集合必须包含至少两个元素，而且和是偶数。使用`dp[i][target]`来表示从
子数组`[0, i]`中找出一个子集和等于`target`。根据是否使用元素`nums[i]`将问题拆分为两种情况，状态转移方程如下。

```js
dp[i][target] =
  // 不使用nums[i]
  dp[i - 1][target] ||
  // 使用nums[i]
  dp[i - 1][target - nums[i]]
```

考虑边界情况，`target = 0`第一列的情况，相当于在数组中划分出一个空集和等于 0，初始化为`true`。`i=0`第一行的情况，从`i = 1`开始，`dp[0][0]`已经被第一列覆盖了，使用`nums[0]`能够构成的和只有`nums[0]`，其他的应该设置为`false`。

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
  const N = nums.length

  if (N < 2) {
    return false
  }

  const total = nums.reduce((acc, val) => acc + val, 0)
  if (total % 2 === 1) {
    return false
  }
  const target = total / 2.0

  const dp = new Array(N)
  for (let i = 0; i < N; i++) {
    dp[i] = new Array(target + 1)
  }

  // 初始化第一列
  for (let i = 0; i < N; i++) {
    dp[i][0] = true
  }

  // 初始化第一行
  for (let i = 1; i <= target; i++) {
    dp[0][i] = false
  }
  dp[0][nums[0]] = true

  for (let i = 1; i < N; i++) {
    for (let j = 1; j <= target; j++) {
      dp[i][j] = dp[i - 1][j] || !!dp[i - 1][j - nums[i]]
    }
  }

  return dp[N - 1][target]
}
```

#### [322 Coin Change](https://leetcode.cn/problems/coin-change/)

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

### [518. Coin Change 2](https://leetcode.cn/problems/coin-change-2/)

此题求能凑出总额的硬币组合数。

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

## [174. Dungeon Game](https://leetcode.cn/problems/dungeon-game/)

困难，逆向 dp。

```js
/**
 * @param {number[][]} dungeon
 * @return {number}
 */
var calculateMinimumHP = function (dungeon) {
  const M = dungeon.length
  const N = dungeon[0].length

  const dp = new Array(M + 1)
  for (let i = 0; i <= M + 1; i++) {
    dp[i] = new Array(N + 1)
  }

  // row = M
  for (let col = 0; col <= N - 1; col++) {
    dp[M][col] = Number.MAX_SAFE_INTEGER
  }
  // col = N
  for (let row = 0; row <= M - 1; row++) {
    dp[row][N] = Number.MAX_SAFE_INTEGER
  }

  dp[M][N - 1] = 1
  dp[M - 1][N] = 1

  for (let row = M - 1; row >= 0; row--) {
    for (let col = N - 1; col >= 0; col--) {
      dp[row][col] = Math.min(
        Math.max(dp[row + 1][col] - dungeon[row][col], 1),
        Math.max(dp[row][col + 1] - dungeon[row][col], 1)
      )
    }
  }

  return dp[0][0]
}
```

## 子数组和

[前缀和](https://leetcode.cn/tag/prefix-sum/problemset/)

前缀数组法和滑动窗口法

### [560. Subarray Sum Equals K](https://leetcode.cn/problems/subarray-sum-equals-k/)

长度为`N`的子数组的个数为`N * (N - 1)`，求子数组的和需要对数组元素进行线性扫描，所以暴力验证所有子数组和等于目标值
的解法时间复杂度是`O(N ^ 3)`。

利用数组的前缀和可以在常数时间内求的子数组的和`sum[i, j] = prefix[j] - prefix[i-1]`，求数组前缀和的时间复杂度是`O(N)`。

遍历所有子数组对同时利用前缀和的话可以在`O(N^2)`内找出所有和为 K 的子数组。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  const prefixSum = new Array(nums.length)

  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    prefixSum[i] = sum
  }

  let count = 0
  prefixSum[-1] = 0
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      if (prefixSum[j] - prefixSum[i - 1] === k) {
        count++
      }
    }
  }

  return count
}
```

`O(N^2)`的做法对于较大的问题规模会超时，考虑利用哈希表记录已经出现过的子数组和的情况。从左到右遍历前缀和数组元素，假设已经处理过数组`[0, i - 1]`，
使用哈希表记录这个范围中出现的前缀和的个数，然后在遍历到元素`i`时，如果`[0, i-1]`中的某个下标`j`满足`prefixSum[i] - prefixSum[j] === K`，则表明子数组`[j+1, i]`的和是`K`，那么前缀和`prefix[i] - K`在`[0, i-1]`中出现的个数就是结束元素下标为`i`的和为`K`的子数组个数。检查过元素`i`之后将`prefixSum[i]`添加到哈希表中继续下一轮循环。

注意这里面有个边界条件，当`i === 0`时使用到`prefixSum[i-1] === prefixSum[-1]`的值，对应的前缀和值是`0`，因此哈希表初始化时记录出现`0`的个数是`1`次。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  const prefixSum = new Array(nums.length)

  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    prefixSum[i] = sum
  }

  const map = new Map()
  map.set(0, 1)
  let count = 0
  for (let i = 0; i < prefixSum.length; i++) {
    const prefix = prefixSum[i]
    const complement = prefix - k
    if (map.has(complement)) {
      count += map.get(complement)
    }

    const prefixCount = map.has(prefix) ? map.get(prefix) : 0
    map.set(prefix, prefixCount + 1)
  }

  return count
}
```

### [523. Continuous Subarray Sum](https://leetcode.cn/problems/continuous-subarray-sum/)

本题与 560 类似，同样使用前缀和数组加上哈希表的方法在`O(N)`的时间内验证所有子数组和，区别在于这里要求子数组和必须是`n * k`的形式，也就是说是`k`的整数倍，`prefixSum[i] - prefixSum[j] === n * k`，将条件等价转换为`prefixSum[i]`和`prefixSum[j]`的模`k`余数相同。所以在哈希表中使用`prefixSum[i]`的模`k`余数作为键，一旦出现两个相同的`key`值就满足了条件，同时题目要求子数组至少包含两个元素，对于同一个余数`r`来说，在哈希表中只记录第一个`r`出现的元素下标作为值，对应的子数组是`[map.get(r) + 1, i]`，元素个数是`i + 1 - (map.get(r) + 1)`，也是就`i - map.get(r) >= 2`。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var checkSubarraySum = function (nums, k) {
  const prefixSum = new Array(nums.length)

  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    prefixSum[i] = sum
  }

  const map = new Map()
  map.set(0, -1)

  const LEAST_ELEMENT_COUNT = 2
  // 模k余数相同的两个前缀和组成的子数组和满足条件，使用模k余数作为k记录前缀和。
  for (let i = 0; i < prefixSum.length; i++) {
    const prefix = prefixSum[i]
    const remainder = prefix % k

    if (map.has(remainder)) {
      if (i - map.get(remainder) >= LEAST_ELEMENT_COUNT) {
        return true
      }
    } else {
      // 记录remainder第一次出现元素下标，作为子数组左边，能够与i组成最长的满足条件的子数组
      map.set(remainder, i)
    }
  }

  return false
}
```

### [974. Subarray Sums Divisible by K](https://leetcode.cn/problems/subarray-sums-divisible-by-k/)

同样使用前缀和数组加上哈希表的解法，子数组和被`K`整除的话需要两个前缀数组和同余，记录同余前缀和出现的个数，假设为`n`，那么能组成子数组的个数是`n * (n - 1) / 2`。同样需要初始化哈希表，下标`-1`对应的前缀数组和是`0`，所以哈希表中`0`的次数初始化为`1`。

`-13 % 5 === -3`取模运算会保留负号，本题的测试用例中出现了负数，需要将余数归一到`[0, K-1]`的范围内，使用`((val % K) + K) % K`或者条件判断。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraysDivByK = function (nums, k) {
  const prefixSum = new Array(nums.length)

  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    prefixSum[i] = sum
  }

  const map = new Map()
  // 初始化
  map.set(0, 1)

  for (let i = 0; i < prefixSum.length; i++) {
    const prefix = prefixSum[i]
    const remainder = prefix % k
    // % 默认保留符号，这里需要将余数转换为[0, k-1]的范围内
    const positiveRemainder = remainder < 0 ? remainder + k : remainder
    const count = map.has(positiveRemainder) ? map.get(positiveRemainder) : 0
    map.set(positiveRemainder, count + 1)
  }

  // 这里在哈希表完成后再进行计数，也可以将计数的过程放到上面for循环中
  let count = 0
  for (const value of map.values()) {
    count += (value * (value - 1)) / 2
  }

  return count
}
```

### [525. Contiguous Array](https://leetcode.cn/problems/contiguous-array/)

前缀和加哈希表的方法，与求解子数组和相同。如果子数组`[i, j]`中有着相同数量的 0 和 1，可以记录前缀数组`dp[i]`表示数组`[0, i]`内 0 和 1 的个数。

下面条件成立时`[i, j]`中 0/1 个数相同。

```js
dp[j].zeroCount - dp[i - 1].zeroCount === dp[j].oneCount - dp[i - 1].oneCount
```

起始不需要知道 0/1 的具体个数，只要知道每个下标对应的 0/1 个数的差值，调整等式形式，等价条件是`j/i-1`两个子数组下标代表的 0/1 个数差值相同。

```js
dp[j].oneCount - dp[j].zeroCount === dp[i - 1].oneCount - dp[i - 1].zeroCount
```

使用变量`gap`代表数组中 1 的个数减去 0 的个数，从左到右遍历时，记录每个`gap`第一次出现的下标`i`，再次出现相同的`gap`时的下标`j`，数组`[i+1, j]`是一个符合条件的子数组，数组长度是`j - i`，最终答案是`j-i`中的最大值。`Map`中记录同一个`gap`出现的最小下标，然后遍历过程每次更新变大。

由于`dp[i - 1]`的使用，`i === 0`的时候，表示子数组`[0, j]`具有相同的 0 和 1，意味着`dp[-1] = 0`，因此`Map`初始化为包含一个元素 0，下标值是`-1`。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxLength = function (nums) {
  const map = new Map()
  map.set(0, -1)

  // 1的个数减去0的个数
  let gap = 0
  let max = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      // 遇到1 gap递增
      gap++
    } else {
      // 遇到0 gap递减
      gap--
    }

    // 之前记录的gap与当前gap相等时，是子数组的0/1个数相同
    if (map.has(gap)) {
      max = Math.max(max, i - map.get(gap))
    } else {
      map.set(gap, i)
    }
  }

  return max
}
```

### [209. Minimum Size Subarray Sum](https://leetcode.cn/problems/minimum-size-subarray-sum/)

### 指定子数组和

如果数组只包含正数，可以使用滑动窗口的方式找到所有和为指定值`target`的子数组，使用左闭右开的形式表示子数组，初始值为`[low, high) = [0, 0)`表示空数组，子数组和`sum = 0`。

```js
function sumArraySum(array, target) {
  let sum = 0
  let low = 0
  let high = 0

  const subArrays = []

  while (high <= array.length) {
    if (sum === target) {
      subArrays.push([low, high])
    } else if (sum < target) {
      // 增大sum，high指向的元素尚未处理
      sum += array[high]
      high++
    }
  }
}
```

### [209. Minimum Size Subarray Sum](https://leetcode.cn/problems/minimum-size-subarray-sum/)

```js
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
  let low = 0
  let high = 0
  let sum = 0

  // 使用超出可能解的最大值作为初始值，可以使用Math.min统一求最小值过程中对于不存在情况的处理
  let minLength = nums.length + 1
  while (low < nums.length) {
    while (sum < target && high < nums.length) {
      sum += nums[high++]
    }

    // 上述循环终止的条件是 high === nums.length，这时候仍然不满足条件
    // low++ sum只会变小，后续不存在满足 sum >= target的情况，所以终止循环
    if (sum < target) {
      break
    }

    minLength = Math.min(minLength, high - low)
    sum -= nums[low++]
  }

  return minLength > nums.length ? 0 : minLength
}
```

### 子数组和

对于只包含正数的数组，可以使用滑动窗口的方式在`O(N)`时间内获得所有连续子数组和等于目标值的情况。

使用左闭右开的方式`[low, high)`记录子数组，数组和是`sum`，如果`sum`等于`target`表示这是一个解。`high`右移的话子数组和单调增长，如果`sum > target`，可以直接排除`high`更大的情况，也就是当前下标`low`开头的情况就已经检查完了。`low`右移，和减小，继续向右侧寻找更多可能的解。

如果`low`一直右移，可能出现再次等于`high`的情况，这时候`sum === 0`，表示空数组，之后因为`sum < target`会继续`high`右移。使用双层循环，内层循环不断右移`low`保证`sum <= target`，这样每次外层循环对应一个`high`值，`high === arr.length`整个循环结束。因为`high`表示下一个要被加入数组的元素，所以是在使用`high`对应元素时检查`high`是否越界，越界时没有可以继续加入的元素，循环结束。

```js
function subArraySum(array, target) {
  // 起始为空数组，左闭右开区间[low, high)
  // low之前子数组第一个元素，也就是滑动窗口右移时要被移出的元素
  let low = 0
  // high代表下一个要被加入子数组的元素
  let high = 0
  let sum = 0

  const subArrays = []

  // high === arr.length 时，所有元素都处理完了，没有更多的元素需要加入数组处理
  while (true) {
    while (sum > target) {
      // 更新sum
      sum -= arr[low]
      low++
    }

    // 找到了一个子数组和等于target
    if (sum === target) {
      subArrays.push([low, high])
    }

    // 使用high之前进行判断
    if (high >= arr.length) {
      break
    }
    sum += arr[high++]
  }
}
```

上述遍历过程中，找到了所有可能的子数组，也可以寻找其中长度最小值或者最大者。
[305. Maximum Size Subarray Sum Equals k](https://leetcode.cn/problems/maximum-size-subarray-sum-equals-k/)

### [1477. Find Two Non-overlapping Sub-arrays Each With Target Sum](https://leetcode.cn/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/)

这里的问题在于如何确定不重叠的两个子数组长度最小的情况。如果将所有符合目标值的子数组对按照长度和从小到大遍历，然后获得第一个不重复的数组对就是要求的答案，这种方式需要对数组对按照长度和从小到大排序，时间复杂度是`O(K ^ 2)`，`K`是数组对个数。

使用动态规划的方式可以更巧妙地处理不重叠的长度和最小的数组对问题，先保证数组对不重叠，然后考虑长度和最小。在每次获得一个和等于目标值`target`的子数组`[low, high)`时，把这个子数组当做数组对的后一个数组，那么它与`[0, low)`范围内已经发现的和等于目标值中**长度最小**的子数组组成一个数组对，这个数组对就是备选答案之一，所有备选答案中的最小者就是最终的结果。这种做法只记录`[low, high)`范围具有最小长度的数组，排除了其他数组，对问题空间进行缩减，也是效率更高的原因。

使用数组`dp`来记录最小长度数组的信息，下标`i`记录数组范围`[0, i)`内具和等于目标值的子数组中最小长度，那么如果子数组`[low, high)`和等于目标值，转移方程是`dp[high] = Math.min(dp[high-1], high - low)`，否则`dp[high] = dp[high-1]`，也就是说`dp[high] <= dp[high-1]`。

注意这里使用的是左闭右开区间的写法`[low, high)`，`high`指向下一个要被加入数组的元素，在没有更多能被加入数组的元素时，循环结束，也就是`high < arr.length`。

注意初始化条件，因为`dp`记录的是子数组长度最小值，所以可以使用最大值`arr.length + 1`表示不存在的情况。对于`dp[0]`来说，左侧不存在数组，所以对应数组长度值应该使用`arr.length + 1`，下标`0`对应的是`sum === 0`的情况，在循环中执行语句`dp[high] = dp[high - 1]`计算得来，所以初始化`dp[-1]= arr.length + 1`，才能将值正确传递个`dp[0]`。Javascript 数组也是对象，支持设置下标`-1`，其他语言需要改换写法，可以分配更长的数组来处理。

循环结束后如果`minLength`的值大于`arr.length`，表明没有找到满足条件的子数组对，返回-1。

```js
/**
 * @param {number[]} arr
 * @param {number} target
 * @return {number}
 */
var minSumOfLengths = function (arr, target) {
  // dp的元素i代表i之前的部分中包含的和等于target的子数组最小长度
  const dp = new Array(arr.length)
  // 取超出数组长度值，表示元素0左边不存在子数组和等于target
  dp[-1] = arr.length + 1

  // 起始为空数组，左闭右开区间[low, high)
  // low之前子数组第一个元素，也就是滑动窗口右移时要被移出的元素
  let low = 0
  // high代表下一个要被加入子数组的元素
  let high = 0
  let sum = 0

  // min 记录长度和最小的值
  let minLength = arr.length + 1
  while (true) {
    while (sum > target) {
      // 更新sum
      sum -= arr[low]
      low++
    }

    // 找到了一个子数组和等于target
    if (sum === target) {
      const length = high - low
      dp[high] = Math.min(dp[high - 1], length)

      minLength = Math.min(minLength, dp[low] + length)
    } else {
      // sum < target
      dp[high] = dp[high - 1]
    }

    // 使用high之前进行判断
    // high === arr.length 时，所有元素都处理完了，没有更多的元素需要加入数组处理
    if (high >= arr.length) {
      break
    }
    sum += arr[high++]
  }

  return minLength > arr.length ? -1 : minLength
}
```

## 最大子数组
