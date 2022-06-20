/**
 * @param {number[]} nums
 * @return {number[]}
 */
var majorityElement = function (nums) {
  const count = new Map()
  const N = nums.length

  for (let i = 0; i < nums.length; i++) {
    count.set(nums[i], (count.get(nums[i]) || 0) + 1)
  }

  const threshold = Math.floor(N / 3)
  const majorElements = [...count.entries()]
    .filter((entry) => entry[1] > threshold)
    .map((entry) => entry[0])

  return majorElements
}

console.log(majorityElement([3, 2, 3]))
