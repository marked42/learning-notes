/**
 * @param {number[]} nums
 * @return {number}
 */
// var lengthOfLIS = function (nums) {
//   // 以每个下标元素结尾的最长子序列
//   const counts = new Array(nums.length).fill(1)

//   for (let i = 1; i < nums.length; i++) {
//     for (let j = i - 1; j >= 0; j--) {
//       if (nums[j] < nums[i]) {
//         counts[i] = Math.max(counts[j] + 1, counts[i])
//       }
//     }
//   }

//   return Math.max(...counts)
// }

// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))
// console.log(lengthOfLIS([0, 1, 0, 3, 2, 3]))

/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  // 以每个下标元素结尾的最长子序列
  const dp = new Array(nums.length + 1)
  dp[1] = nums[0]
  let len = 1

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > dp[len]) {
      len++
      dp[len] = nums[i]
    } else {
      let low = 1
      let high = len

      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2)

        if (dp[mid] >= nums[i]) {
          high = mid - 1
        } else {
          low = mid + 1
        }
      }

      dp[low] = nums[i]
    }
  }

  return len
}

console.log(lengthOfLIS([4, 10, 4, 3, 8, 9]))
