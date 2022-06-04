let nums = [7, 2, 5, 10, 8],
  m = 2

function canSplitArray(nums, max, m) {
  if (nums.length === 0) {
    return true
  }

  let sum = 0
  let count = 1
  for (let i = 0; i <= nums.length; i++) {
    // 单个元素大于max
    if (nums[i] > max) {
      return false
    }

    if (sum + nums[i] <= max) {
      sum += nums[i]
    } else {
      count++
      if (count > m) {
        return false
      }
      sum = nums[i]
    }
  }

  return true
}

console.log(canSplitArray(nums, 15, m))
