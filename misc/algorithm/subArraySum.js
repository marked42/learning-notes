/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraysDivByK = function (nums, k) {
  const prefixSum = new Array(nums.length)

  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    prefixSum[i] = sum
  }

  const map = new Map()
  map.set(0, 1)

  for (let i = 0; i < prefixSum.length; i++) {
    const prefix = prefixSum[i]
    const remainder = prefix % k
    const count = map.has(remainder) ? map.get(remainder) : 0
    map.set(remainder, count + 1)
  }

  let count = 0
  for (const value of map.values()) {
    count += (value * (value - 1)) / 2
  }

  return count
}

console.log(subarraysDivByK([-1, 2, 9], 2))
