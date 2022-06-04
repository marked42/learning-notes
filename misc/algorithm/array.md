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

## 合并区间

1. [56. 合并区间](https://leetcode.cn/problems/merge-intervals/)

## 矩阵题目

1. [48. 旋转图像](https://leetcode.cn/problems/rotate-image/)
1. [矩阵遍历](https://leetcode.cn/leetbook/read/array-and-string/cuxq3/)
