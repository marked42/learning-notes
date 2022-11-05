# 双指针

求一个数组的所有子数组中具有某个极值的子数组，暴力解法是枚举所有子数组，假设单个子数组的耗时是常量，则总的时间复杂度是`O(N ^ 2)`。

使用双指针，滑动窗口方法记录子数组，根据极值的相关特性，排除一部分不符合条件的双指针对，更新双指针对为可能的值，从而在线性时间内遍历所有子数组，时间复杂度是`O(N)`。

## [11. Container With Most Water](https://leetcode.cn/problems/container-with-most-water/)

使用双指针，容量等于宽度乘以两侧最小高度，初始化双指针指向数组头尾元素，此时宽度最大。调整双指针位置，左侧指针向右移动，右侧指针向左移动，宽度只会越来越小。容量只有在两侧最小高度值增加的情况下才可能增大，因此每次移动两侧高度较小的指针，左右指针重合时整个遍历过程结果，记录遍历过程中的容量最大值即可。

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let left = 0
  let right = height.length - 1
  let amount = 0

  while (left < right) {
    amount = Math.max(
      amount,
      (right - left) * Math.min(height[left], height[right])
    )
    if (height[left] <= height[right]) {
      left++
    } else {
      right--
    }
  }

  return amount
}
```

## [209. Minimum Size Subarray Sum](https://leetcode.cn/problems/minimum-size-subarray-sum/solution/)

两个指针以左闭右开区间`[slow, fast)`的形式来记录符合条件的子数组，使用双层循环，外层循环确定`slow`，内层循环确定`fast`，
注意可能如果`fast`超出数组范围意味着当前`slow`没有配对符合条件的`fast`，整个双层循环应该结束。找到符合条件的`fast`的话，`[slow, fast)`代表
一个符合条件的子数组，利用一个变量`minLength`记录符合条件的子数组中的最小值。一次内层循环完成后，利用数组只包含非负数的条件，
确定下一次外层循环的`slow`为下一个元素，同时更新记录子数组和的`sum`变量。

```js
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
  if (nums.length === 0) {
    return 0
  }

  let minLength = -1

  let slow = 0
  let fast = 0

  let sum = 0
  while (slow < nums.length) {
    while (sum < target && fast < nums.length) {
      sum += nums[fast]
      fast++
    }

    if (sum < target) {
      break
    }

    minLength =
      minLength === -1 ? fast - slow : Math.min(minLength, fast - slow)

    sum -= nums[slow]
    slow++
  }

  return minLength === -1 ? 0 : minLength
}
```
