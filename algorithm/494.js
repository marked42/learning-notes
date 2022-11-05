/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function (nums, target) {
  const M = nums.length

  const sum = nums.reduce((acc, val) => acc + val, 0)
  const N = 2 * sum + 1

  const dp = new Array(M)
  for (let i = 0; i < M; i++) {
    // 所有都初始化为0
    dp[i] = new Array(N).fill(0)
  }

  // 初始化第一行，组成正负nums[0]两种情况，nums[0]可能为0，这时dp[0] = 2
  set(0, nums[0], get(0, nums[0]) + 1)
  set(0, -nums[0], get(0, -nums[0]) + 1)

  function get(i, j) {
    return dp[i][j + sum] || 0
  }
  function set(i, j, val) {
    dp[i][j + sum] = val
  }

  for (let i = 1; i < M; i++) {
    for (let j = -sum; j <= sum; j++) {
      const val = get(i - 1, j - nums[i]) + get(i - 1, j + nums[i])
      set(i, j, val)
    }
  }

  return get(M - 1, target)
}

console.log(findTargetSumWays([1, 1, 1, 1, 1], 3))
