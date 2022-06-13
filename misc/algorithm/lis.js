/**
 * @param {number[]} nums
 * @return {number}
 */
// var lengthOfLIS = function (nums) {
//   const length = new Array(nums.length).fill(1)

//   for (let i = 1; i < nums.length; i++) {
//     for (let j = 0; j < i; j++) {
//       if (nums[i] > nums[j]) {
//         length[i] = Math.max(length[j] + 1, length[i])
//       }
//     }
//   }

//   return Math.max(...length)
// }

/**
 * @param {number[]} nums
 * @return {number}
 */
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
      let upper = lowerBound(min, 1, len, nums[i])
      // 如果已经出现，就不需要更新min
      if (min[upper] === nums[i]) {
        continue
      }
      // [upper, len]对应的尾元素更新为更小值nums[i]
      while (upper <= len) {
        min[upper] = nums[i]
        upper++
      }
    }
  }

  function lowerBound(nums, start, end, value) {
    let low = start
    let high = end

    // 使用闭合区间的写法
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)

      if (nums[mid] >= value) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    return low
  }

  return len
}

// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))
console.log(lengthOfLIS([4, 10, 4, 3, 8, 9]))
