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

  // high === arr.length 时，所有元素都处理完了，没有更多的元素需要加入数组处理
  let res = arr.length + 1
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

      res = Math.min(res, dp[low] + length)
    } else {
      dp[high] = dp[high - 1]
    }

    // 使用high之前进行判断
    if (high >= arr.length) {
      break
    }
    sum += arr[high++]
  }

  return res > arr.length ? -1 : res
}

console.log(minSumOfLengths([3, 2, 2, 4, 3], 3))
