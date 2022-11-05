# 数组题目

## 最长子序列问题

TODO: 可以积累更多 https://leetcode.cn/problemset/all/?search=longest+subsequence&page=1

最长子串/子数组/子序列

### [53. Maximum Subarray](https://leetcode.cn/problems/maximum-subarray/)

状态转移方程$dp[i] = Math.max(dp[i-1] + nums[i], nums[i])$，当前元素`nums[i]`要么跟之前的最大连续数组组成更大的，要么自己单独一个。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  const dp = new Array(nums.length)
  dp[0] = nums[0]

  for (let i = 1; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1] + nums[i], nums[i])
  }

  return Math.max(...dp)
}
```

时间复杂度和空间复杂度都是`O(N)`，可以使用滚动数组方式只用一个变量记录`dp[i-1]`，将空间复杂度降低为`O(1)`。

TODO:
方法二，使用分治的策略。

使用`[l, r]`表示数组闭区间，`f(l, r)`表示`[l,r]`范围内连续子数组最大和。选中其中一个元素下标为`m`将数组拆分为左右两半`[l, m] [m+1, r]`，
考虑子问题和原问题的关系。

```js
f(l, r) = Math.max(f(l, m), f(m+1, r), f_left(m) + f_right(m+1))
```

其中`f_left(m)`表示下标`m`对应元素向左的连续数组最大和，`f_right(m+1)`代表下标`m+1`的元素向右的连续数组最大和。数组`[l,r]`的连续数组最大和可能出现在左半边，也可能是右半边，或者横跨中间元素`[m,m+1]`，分别对应三种情况，其中最大者就是等于`f(l, r)`。

同样对于`f_left(l, r)`进行分析，右侧元素的`f_left(r)`有两种情况，要是连续数组位于`[m+1, r]`范围内，要么跨过`[m+1, r]`并包含了`[l, m]`中右侧的一部分元素。

```js
f_left(r) = Math.max(f_left(r), f_left(m) + sum(m+1, r))
```

```js
function Status(l, r, m, i) {
  this.lSum = l
  this.rSum = r
  this.mSum = m
  this.iSum = i
}

const pushUp = (l, r) => {
  const iSum = l.iSum + r.iSum
  const lSum = Math.max(l.lSum, l.iSum + r.lSum)
  const rSum = Math.max(r.rSum, r.iSum + l.rSum)
  const mSum = Math.max(Math.max(l.mSum, r.mSum), l.rSum + r.lSum)
  return new Status(lSum, rSum, mSum, iSum)
}

const getInfo = (a, l, r) => {
  if (l === r) {
    return new Status(a[l], a[l], a[l], a[l])
  }
  const m = (l + r) >> 1
  const lSub = getInfo(a, l, m)
  const rSub = getInfo(a, m + 1, r)
  return pushUp(lSub, rSub)
}

var maxSubArray = function (nums) {
  return getInfo(nums, 0, nums.length - 1).mSum
}
```

### [674. Longest Continuous Increasing Subsequence](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/)

使用双指针记录连续的子序列，序列递增时`end`增加`1`，直到不满足递增或者数组结束，这样找到一个连续递增序列，记录其长度。
更新`start`等于`end`，开始下一轮循环，`start`代表子序列的起点，也小于数组长度`nums.length`。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function (nums) {
  let len = 0
  for (let start = 0; start < nums.length; ) {
    let end = start + 1
    while (end < nums.length && nums[end] > nums[end - 1]) {
      end++
    }

    len = Math.max(end - start, len)
    start = end
  }

  return len
}
```

### [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

考虑数组`[0, i]`的最长上升子序列和子数组`[0, i-1]`的最长上升子序列之间的关系，假设子数组`[0, i-1]`中的最长上升子序列是结尾元素是`j`，
如果`nums[i] > nums[j]`，那么元素`i`和`[0, i-1]`中的最长上升子序列构成了更长的子序列，也就是`[0, i]`中的最长上升子序列。但是如果`nums[i] <= nums[j]`，那么不能从`[0, i-1]`的最长上升子序列得到`[0, i]`的最长上升子序列。也就是对于最长上升子序列问题，子问题`[0, i-1]`的答案和`[0, i]`没有直接关系。

组成一个新的更长的子序列需要比较当前子序列结尾元素和下一个元素的大小，如果将子序列按照结尾元素来划分，那么结尾元素为`nums[i]`的最长子序列就与子问题`[0, j] (0 <= j < i)`有关系了。

```js
// length[i] 是其中最大值
length[i] = nums[i] > nums[j] ? length[j] + 1 : 1
```

这样能求得数组中每个元素结尾的最长上升子序列长度，整个数组的最长上升子序列就是其中最大值。

```js
var lengthOfLIS = function (nums) {
  // 这里使用初始值为1，意思是每个元素默认组成一个长度为1的子序列
  const length = new Array(nums.length).fill(1)

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        length[i] = Math.max(length[j] + 1, length[i])
      }
    }
  }

  return Math.max(...length)
}
```

这种方法使用双层循环，时间复杂度是`O(N ^ 2)`，使用了一个长度为的数组，空间复杂度为`O(N)`。

考虑第二种时间复杂度为`O(N logN)`的方法。元素`i`如何从`[0, i-1]`中组成最长递增子序列，用`(j, i)`表示下标`j`的最长递增子序列与`i`组成的最长递增子序列，`0 <= j < i`。这其中存在重复的计算，如果两个下标`j1/j2`的最长子序列长度一样，那么只需要将`nums[i]`与`nums[j1]/nums[j2]`中较小的做比较，就能知道是否能构成更长的子序列了。

下标`j`对应的子问题信息包括对应序列长度`length`和序列最后一个元素`nums[j]`两个信息，如果使用`length`作为键，同一个长度只保留对应`nums[j]`中最小值，就对子问题的可能情况进行了减枝。以数组`min[len]`记录长度`len`的最长递增子序列的末尾元素最小值，由于数组严格递增，那么`min[len+1]`对应的序列末尾元素必然大于`min[len]`，也就是`min`是一个严格递增的数组。

假设已经知道了`[0, i-1]`对应的`min`数组，来分析到下一个元素`i`时如何更新数组`min`，有两种情况。

如果`nums[i] > min[len]`，那么组成了更长的子序列，`len`长度加一，末尾元素就是`nums[i]`；否则的话`nums[i]`**小于**`min[1, len]`中的某些元素，可以将对应下标代表的末尾元素值更新为更小的`nums[i]`，也就是需要在`min[1, len]`中查找元素`nums[i]`的上界。上界的下标取值范围是`[1, len + 1]`，其中取值在`[1, len]`的范围内时更新元素为`nums[i]`。`len + 1`时不要更新元素为`nums[i]`，这会造成脏数据，下一轮循环`len + 1`时如果对应的最小值大于这个`nums[i]`，就会造成`len + 1`对应的数据比正确值更小，出现错误。

对于整个数组来说，`min`数组对应的最大`len`值就是数组中最长递增子序列的长度。外层循环嵌套内层有序数组的二分查找操作，时间复杂度是`O(N logN)`，空间复杂度仍然是`O(N)`。

```js
var lengthOfLIS = function (nums) {
  const min = []

  // 初始条件，数组至少有一个元素，不用检查空数组的情况
  let len = 1
  min[len] = nums[0]

  // 第二个元素开始
  for (let i = 1; i < nums.length; i++) {
    // 能组成更长的序列，尾元素是nums[i]
    if (nums[i] > min[len]) {
      len++
      min[len] = nums[i]
    } else {
      // 在[1, len]范围内寻找上界
      let upper = upperBound(min, 1, len, nums[i])
      // 如果找到 upper在范围内，进行更新
      // upper === len + 1 不要更新，这会导致脏数据，造成下一轮的更新错误。
      if (upper <= len) {
        min[upper] = nums[i]
      }
    }
  }

  function upperBound(nums, start, end, value) {
    let low = start
    let high = end

    // 使用闭合区间的写法
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)

      // 下界条件 >
      if (nums[mid] > value) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    return low
  }

  return len
}
```

上面更新的操作中只能更新`[1, len]`内的元素，上界取值可能是`len + 1`超出这个范围导致错误。可以改用下界（`>=`）,下界的取值最大只能为`len`，因为第
二种情况下`nums[i] <= min[len]`必然成立，而等号成立的情况，更新`min`数组值为相同值不影响程序正确性，这样程序省略了额外判断的逻辑，看起来更简单。

```js
// 在[1, len]范围内寻找下界
let upper = lowerBound(min, 1, len, nums[i])

// 使用下界
function lowerBound(nums, start, end, value) {
  let low = start
  let high = end

  // 使用闭合区间的写法
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    // 下界条件 >=
    if (nums[mid] >= value) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low
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

## [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

字符子串个数是`N * (N - 1)`个，判断每个子串是否包含重复字符时间为`O(L)`，`L`是字符串长度，暴力情况下搜索下最坏时间复杂度`O(N ^ 3)`。

用`length[i]`记录以下标`i`结尾的不重复字符子串最大长度，那么`[i - length[i - 1], i - 1]`范围根据定义是`i - 1`位置对应的最长不重复子串，如果`i`的字符不重复就组成了更长的不重复子串；如果重复，可以从`i - 1`到`i - length[i - 1]`范围内寻找第一个重复字符下标`j`，这样`length[i] = i - j`。整个字符串对应的最长不重复子串是`length[i]`中的最大值。

外层是元素遍历，内层操作是线性扫描，最差情况是`O(N)`，整体是`O(N ^ 2)`时间复杂度。

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (s.length === 0) {
    return 0
  }

  const length = new Array(s.length)
  length[0] = 1

  for (let i = 1; i < s.length; i++) {
    let j = i - 1
    while (j >= i - length[i - 1] && s[j] !== s[i]) {
      j--
    }

    length[i] = i - j
  }

  return Math.max(...length)
}
```

TODO: 滑动窗口解法，时间复杂度`O(N)`

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

## Boyer-Moore 投票算法

https://leetcode.cn/problems/majority-element/

https://www.cs.ou.edu/~rlpage/dmtools/mjrty.pdf

## 重复元素

判断数组中是否出现[重复元素](https://leetcode.cn/problems/contains-duplicate/)，只需要对数组进行遍历，同时记录已经出现的元素，即可判断当前元素是否重复出现。

### [问题 2](https://leetcode.cn/problems/contains-duplicate-ii/)

滑动窗口方法，记录子串`[i, i + k]`中的元素集合`set`，集合中出现重复元素时返回`true`，窗口向右移动时维护这个集合，去掉最早的元素，加入最新的元素。

```js
var containsNearbyDuplicate = function (nums, k) {
  const set = new Set()

  for (let i = 0; i < nums.length; i++) {
    if (i >= k + 1) {
      set.delete(nums[i - k - 1])
    }

    if (set.has(nums[i])) {
      return true
    } else {
      set.add(nums[i])
    }
  }

  return false
}
```

Hash 表方法，遇到元素`i`时，为了判断是否存在`j < i && j >= i - k && nums[i] === nums[j]`，需要记录数组`[0, i-1]`中`nums[i]`出现的最大元素值，也就是`j`，如果`i - j <= k`则返回`true`。

```js
const indexMap = new Map()

for (let i = 0; i < nums.length; i++) {
  const num = nums[i]
  if (indexMap.has(num) && Math.abs(indexMap.get(num) - i) <= k) {
    return true
  } else {
    indexMap.set(num, i)
  }
}

return false
```

### [问题 3](https://leetcode.cn/problems/contains-duplicate-iii/)

同样使用滑动窗口，需要一个有序集合来记录长度为`k+1`的窗口中的所有元素，窗口向右移动时需要从集合中删除最早的元素，集合需要支持寻找与指定元素`nums[i]`最接近的元素，判断最接近的距离是否小于`t`。这里使用升序数组作为有序集合。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} t
 * @return {boolean}
 */
var containsNearbyAlmostDuplicate = function (nums, k, t) {
  let ascending = []

  for (let i = 0; i < nums.length; i++) {
    // 有序数组删除最早的元素
    if (i >= k + 1) {
      ascending = ascending.filter((e) => e !== nums[i - k - 1])
    }

    // 二分查找，找到最接近的两个元素，条件是 >= nums[i]
    let low = 0
    let high = ascending.length - 1
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2)

      if (ascending[mid] >= nums[i]) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    const lowWithRange =
      low < ascending.length && Math.abs(ascending[low] - nums[i]) <= t
    const highWithRange = high >= 0 && Math.abs(ascending[high] - nums[i]) <= t
    if (lowWithRange || highWithRange) {
      return true
    }

    // 新元素nums[i]插入到有序数组合适的位置
    let j = 0
    for (; j < ascending.length; j++) {
      if (ascending[j] > nums[i]) {
        break
      }
    }
    ascending.splice(j, 0, nums[i])
  }

  return false
}
```

同样使用滑动窗口，但是这次使用桶排序法将数字`nums[i]`划分为大小为`t + 1`的桶，其中`[0, t]`桶编号为`0`，`[t + 1, 2t + 1]`编号为`1`，`[-t-1, -1]`编号为`-1`，其他桶编号以此类推。

```js
// ... [-t-1, -1] [0, t] [t+1, 2t + 1] ...
// ... -1,        0,     1,            ...
// 桶编号计算方法
const id =
  nums[i] >= 0
    ? // 非负数
      Math.floor(nums[i] / (t + 1))
    : // 负数
      Math.floor((-nums[i] - 1) / (t + 1)) * -1 - 1
```

滑动窗口移动的时候，记录滑动窗口中元素的桶编号，对于新的元素`nums[i]`来说，如果窗口中存在相同编号的桶，条件符合`Math.abs(nums[i] - nums[j]) <= t && i - j <= k`；如果存在与`nums[i]`所在桶相邻的桶，两个元素**可能**满足条件`Math.abs(nums[i] - nums[j]) <= t`；不在相邻桶的元素肯定不满足条件。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @param {number} t
 * @return {boolean}
 */
var containsNearbyAlmostDuplicate = function (nums, k, t) {
  const getBucketId = (val, width) =>
    val < 0 ? Math.floor((-val - 1) / width) * -1 - 1 : Math.floor(val / width)

  const buckets = new Map()

  for (let i = 0; i < nums.length; i++) {
    if (i >= k + 1) {
      buckets.delete(getBucketId(nums[i - k - 1], t + 1))
    }

    const id = getBucketId(nums[i], t + 1)
    if (buckets.has(id)) {
      return true
    }
    if (buckets.has(id - 1) && Math.abs(nums[i] - buckets.get(id - 1)) <= t) {
      return true
    }
    if (buckets.has(id + 1) && Math.abs(nums[i] - buckets.get(id + 1)) <= t) {
      return true
    }

    buckets.set(id, nums[i])
  }

  return false
}
```

桶排序中判断元素是否符合条件耗费常量时间，所以整体的时间复杂度只跟遍历操作有关，是`O(N)`，空间复杂度是`O(min(n, k + 1)`。

# 动态规划

## [1143. Longest Common Subsequence](https://leetcode.cn/problems/longest-common-subsequence/)

二维动态规划，状态转移方程。

```js
f(i, j) = f(i - 1, j - 1) + 1  if text[i] === text[j]
f(i, j) = Math.max(f(i - 1, j), f(i, j - 1))  if text[i] !== text[j]
```

边界条件是其中一个字符串是空串，长度为 0，二维数组定义为`(M + 1) * (N + 1)`的大小，第一行第一列初始化为 0。

```js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function (text1, text2) {
  const M = text1.length
  const N = text2.length

  const dp = new Array(M + 1)
  for (let i = 0; i < M + 1; i++) {
    dp[i] = new Array(N + 1)
    dp[i][0] = 0
  }
  dp[0].fill(0)

  for (let i = 1; i < M + 1; i++) {
    for (let j = 1; j < N + 1; j++) {
      const same = text1[i - 1] === text2[j - 1]

      dp[i][j] = same
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  return dp[M][N]
}
```