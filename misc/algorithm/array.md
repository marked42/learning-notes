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
