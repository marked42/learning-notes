# 数组题目

[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

思路是子序列必须以元素 i 结尾，考虑 dp[i]和 dp[0~i-1]之间的关系 dp[i] = max(dp[0 ~ i- ]) + 1。

最终的答案是 dp 中最大的。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  // 以每个下标元素结尾的最长子序列
  const counts = new Array(nums.length).fill(1)

  for (let i = 1; i < nums.length; i++) {
    // 这个循环中存在优化的空间
    for (let j = i - 1; j >= 0; j--) {
      if (nums[j] < nums[i]) {
        counts[i] = Math.max(counts[j] + 1, counts[i])
      }
    }
  }

  return Math.max(...counts)
}
```

[1027. Longest Arithmetic Subsequence](https://leetcode.cn/problems/longest-arithmetic-subsequence/)

求最长等差子序列，将子序列按照结尾元素划分，可能有`N`中情况，用`dp[i][gap]`表示以下标`i`元素结尾且子序列差值是`gap`的长度，如果下标`i`的元素
和`[0, i - 1]`中的某个结尾元素为`j`的子序列组成更长的等差数列（`gap`值相同），等差序列长度增加`1`，`dp[i][gap] = dp[j][gap] + 1`。
如果`j`对应元素没有组成等差数列，可以认为这个是长度为`1`的等差序列，即`dp[i][gap]`默认为`1`。`j`可能的范围是`[0, i-1]`，这个范围内的元素都按照这个关系进行更新，就得到了`dp[i]`。`dp[i][gap]`中的最大值也就是数组中所有可能的等差数列的最大长度。

每个下标`i`出可能的等差数列的差值`gap`和对应的最大长度使用字典（对象或者 Map）记录。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestArithSeqLength = function (nums) {
  if (nums.length <= 2) {
    return nums.length
  }

  const dp = new Array(nums.length)
  dp[0] = {}

  let max = 0
  for (let i = 2; i < nums.length; i++) {
    dp[i] = {}

    for (let j = i - 1; j >= 0; j--) {
      const gap = nums[i] - nums[j]
      // dp[i][gap] 是其中最大者
      dp[i][gap] = Math.max(dp[i][gap] || 0, (dp[j][gap] || 1) + 1)

      // max是所有i对应的dp[i][gap]中最大的
      max = Math.max(dp[i][gap], max)
    }
  }

  return max
}
```

算法使用了一个双层循环，循环的内层是对字典的读取和更新操作，所以时间复杂度是`O(N ^ 2 * log K)`，其中`K`是等差序列的可能的取值个数。
空间复杂度最差的情况是`O(N * K)`。

题目中数组元素的取值范围是`[0, 500]`，所以差值`K`的取值范围是`[-500, 500]`总共`1001`中可能，使用数组替代上面的字典实现。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestArithSeqLength = function (nums) {
  const N = nums.length
  const dp = new Array(N)

  // 初始化为0
  for (let i = 0; i < N; i++) {
    dp[i] = new Array(1001).fill(0)
  }

  let max = 0

  const offset = 500
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i; j++) {
      const gap = nums[i] - nums[j] + offset
      dp[i][gap] = Math.max(dp[j][gap] + 1, dp[i][gap])

      max = Math.max(dp[i][gap], max)
    }
  }

  return max + 1
}
```

上面的实现中`dp[j][gap]`初始化为`0`，相当于只有一个数的等差数列长度记为`0`，所以最后范围结果时应该再加上`1`。

[873. Length of Longest Fibonacci Subsequence](https://leetcode.cn/problems/length-of-longest-fibonacci-subsequence/)

最长斐波那契子序列，同样的思路，使用`dp[i]`表示以下标`i`作为最后一个元素的菲波那切数列子数列信息，`j`在`[0, i)`的范围内，如果元素`i`能够与`j`
组成更长的斐波那契数列，那么`arr[k] + arr[j] === arr[i]`，`k`是元素`j`结尾的斐波那契子数列的前一项，需要在每个下标`j`处记录所有的`nums[k]`以及对应的长度信息。知道斐波那契数列的后三项以及长度信息就能完全确定整个数列，所以记录这些信息就枚举了所有可能的情况。

第一种解法我们在每个下标处使用一个`Map`记录这些信息，键是数列前一项的值，值是数列长度。如果`k i j`对应的三个元素能够组成更长的数列，那么下标`i`处记录前一项是`nums[j]`时的最长数列长度等于`dp[j] + 1`，否则就只有`i j`两个元素组成数列。因为数列是严格自增的，所以`nums[j]`的值不存在重复，所以直接更新`map.set(arr[j], len)`即可，不需要检查`map.get(arr[j])`和`len`的大小关系。

整个数组中最长的斐波那契子序列长度是循环中计算到的所有长度中最大值，注意题目中对于斐波那契数列要求长度最小为 3，循环中小于 3 个元素的情况也当成了斐波那契数列，返回值需要进行判断。

此解法的空间复杂度是`O(N ^ 2)`，时间复杂度是`O(N ^ 2 * log N)`，因为双层循环内是使用`Map`的读写操作。

```js
/**
 * @param {number[]} arr
 * @return {number}
 */
var lenLongestFibSubseq = function (arr) {
  const N = arr.length
  const dp = new Array(N)

  let max = 0
  for (let i = 0; i < N; i++) {
    const map = (dp[i] = new Map())
    for (let j = 0; j < i; j++) {
      // 前一项数据
      const prev = arr[i] - arr[j]

      const len = dp[j].has(prev) ? dp[j].get(prev) + 1 : 2
      map.set(arr[j], len)

      max = Math.max(max, len)
    }
  }

  // 题目要求斐波那契数列长度最小为3，否则返回0
  return max >= 3 ? max : 0
}
```

时间复杂度可以进行优化，上面我们使用一维数组嵌套`Map`的数据结构，但是每个`Map`中最多包含`N`个元素，这样可以使用长度为`N`的数组来替换`Map`，将读写操作从`O(logN)`降低为`O(1)`。由于数组是严格递增的，所以`nums[i]`和下标`i`一一对应，我们使用数组中下标`i`的位置记录`Map`中`nums[i]`键记录的长度数据。

在处理前一项数据时使用`dp[j].get(prev)`，修改为数组后需要知道`prev`对应的下标，所以需要事先对数组做一个值到下标的映射，必须使用`HashMap`保证这里的操作仍然是`O(1)`，否则整个优化失去了意义。

```js
var lenLongestFibSubseq = function (arr) {
  const N = arr.length
  const dp = new Array(N)

  // 这里是HashMap
  const indexes = new Map()
  for (let i = 0; i < N; i++) {
    indexes.set(arr[i], i)
  }

  let max = 0
  for (let i = 0; i < N; i++) {
    const map = (dp[i] = new Array(N))
    for (let j = 0; j < i; j++) {
      // 前一项数据
      const prev = arr[i] - arr[j]

      const len = (dp[j][indexes.get(prev)] || 1) + 1
      map[j] = len

      max = Math.max(max, len)
    }
  }

  // 题目要求斐波那契数列长度最小为3，否则返回0
  return max >= 3 ? max : 0
}
```

更进一步的可以把这个二维数组优化为一维，二维数组`[i, j]`位置的元素对应一维数组下标`[i * N + j]`。

```js
var lenLongestFibSubseq = function (arr) {
  const N = arr.length
  const dp = new Array(N * N)

  // 这里是HashMap
  const indexes = new Map()
  for (let i = 0; i < N; i++) {
    indexes.set(arr[i], i)
  }

  let max = 0
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i; j++) {
      // 前一项数据
      const prev = arr[i] - arr[j]

      // const len = (dp[j][indexes.get(prev)] || 1 ) + 1
      const len = (dp[j * N + indexes.get(prev)] || 1) + 1
      //  map[j] = len
      dp[i * N + j] = len

      max = Math.max(max, len)
    }
  }

  // 题目要求斐波那契数列长度最小为3，否则返回0
  return max >= 3 ? max : 0
}
```

## 最长子串/子数组/子序列

[3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

## 前缀和

1. [724. 寻找数组的中心下标](https://leetcode.cn/problems/find-pivot-index)
1. [134. Gas Station](https://leetcode.cn/problems/gas-station/)

## 合并区间

1. [56. 合并区间](https://leetcode.cn/problems/merge-intervals/)

## 矩阵题目

### 1. [48. 旋转图像](https://leetcode.cn/problems/rotate-image/)

N x N 矩阵顺时针旋转 90 度，原点`(0, 0)`旋转后的位置是`(0, N)`，考虑其中的一个点`(i, j)`利用两个点的相对位置不变得知
旋转后的位置应该是`(j, N - 1 - i)`。新点的行`i -> j`可以沿着对角线将对称点互换，列`i -> N - 1 - i`可以沿着矩阵竖直方向的对称轴进行镜像反转，这两个转换的效果等同于顺时针旋转 90 度。

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const size = matrix.length

  // 对角线镜像反转
  for (let row = 1; row < size; row++) {
    for (let col = 0; col < row; col++) {
      swap(row, col, col, row)
    }
  }

  // 竖直对称轴反转
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 1 - col; col++) {
      swap(row, col, row, size - 1 - col)
    }
  }

  return matrix

  function swap(row1, col1, row2, col2) {
    const temp = matrix[row1][col1]
    matrix[row1][col1] = matrix[row2][col2]
    matrix[row2][col2] = temp
  }
}
```

#### [面试题 01.08. Zero Matrix LCCI](https://leetcode.cn/problems/zero-matrix-lcci/solution/)

类似炸弹人一样的效果，将矩阵中元素`0`所在的行和列也全部设置为`0`。只进行一次遍历直接修改矩阵元素时为`0`时无法确认这个`0`是原来就有
的还是新设置的，所以需要对矩阵进行两边遍历，第一遍记录`0`出现的行和列，分别用两个数组记录。第二遍根据记录的信息修改矩阵。空间复杂度可以继续优化，参考[官方题解](https://leetcode.cn/problems/zero-matrix-lcci/solution/ling-ju-zhen-by-leetcode-solution-7ogg/)。

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
  const M = matrix.length
  const N = matrix[0].length

  const zeroRows = new Array(M)
  const zeroCols = new Array(N)

  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      if (matrix[row][col] === 0) {
        zeroRows[row] = true
        zeroCols[col] = true
      }
    }
  }

  for (let row = 0; row < M; row++) {
    for (let col = 0; col < N; col++) {
      if (zeroRows[row] || zeroCols[col]) {
        matrix[row][col] = 0
      }
    }
  }
}
```

## 矩阵遍历

### [对角线](https://leetcode.cn/leetbook/read/array-and-string/cuxq3/)

遍历时的方向是来回切换的，可以使用布尔值控制。遍历所在的直线满足行列之和等于一个固定值`row + col = sum`，`sum`的范围是`[0, M - 1 + N - 1]`。
直线与矩阵边界的交点是每次遍历的两个端点，假设起始方向是正向，正向遍历时行数`row`应该是从最大递减到最小，反向遍历时行数`row`是从最小递增到最大。
另外输出数组的长度是整个矩阵元素的个数，可以事先分配好固定长度的数组。

时间复杂度是`O(M x N)`，空间复杂度是`O(1)`，除了结果只用到了固定的几个变量。

```js
/**
 * @param {number[][]} mat
 * @return {number[]}
 */
var findDiagonalOrder = function (mat) {
  const output = []
  const M = mat.length
  const N = mat[0].length

  for (let sum = 0; sum <= M - 1 + N - 1; sum++) {
    const forward = sum % 2 === 0
    const [min, max] = findIntersectionPointsRowRange(sum)

    if (forward) {
      for (let row = max; row >= min; row--) {
        output.push(mat[row][sum - row])
      }
    } else {
      for (let row = min; row <= max; row++) {
        output.push(mat[row][sum - row])
      }
    }
  }

  return output

  function findIntersectionPointsRowRange(sum) {
    const points = [
      [0, sum - 0],
      [M - 1, sum - (M - 1)],
      [sum - 0, 0],
      [sum - (N - 1), N - 1],
    ]

    const insidePoints = points.filter(
      ([row, col]) => row >= 0 && row <= M - 1 && col >= 0 && col <= N - 1
    )

    const rows = insidePoints.map((p) => p[0])

    return [Math.min(...rows), Math.max(...rows)]
  }
}
```
