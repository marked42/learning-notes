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
