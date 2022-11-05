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

  return minLength
}

console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]))
