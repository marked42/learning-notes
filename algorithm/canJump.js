/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  let max = 0
  for (let i = 0; i <= Math.min(max, nums.length - 1); i++) {
    max = Math.max(max, i + nums[i])
  }

  return max >= nums.length - 1
}

console.log(canJump([2, 3, 1, 1, 4]))
