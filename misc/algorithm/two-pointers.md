# 双指针

双指针，滑动窗口

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
