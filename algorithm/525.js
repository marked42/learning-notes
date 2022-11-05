/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxLength = function (nums) {
  const map = new Map()
  map.set(0, -1)

  // 1的个数减去0的个数
  let gap = 0
  let max = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      gap++
    } else {
      gap--
    }

    // 之前记录的gap与当前gap和为0时也就是子数组的0/1个数相同
    // 寻找-gap
    const complement = gap
    if (map.has(complement)) {
      max = Math.max(max, i - map.get(complement))
    }

    if (!map.has(gap)) {
      map.set(gap, i)
    }
  }

  return max
}

console.log(findMaxLength([0, 0, 1, 0, 0, 0, 1, 1]))
