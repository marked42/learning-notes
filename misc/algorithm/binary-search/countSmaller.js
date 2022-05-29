/**
 * @param {number[]} nums
 * @return {number[]}
 */
var countSmaller = function (nums) {
  const counts = new Array(nums.length)

  counts[counts.length - 1] = 0
  const rightArray = []

  for (let i = nums.length - 1; i >= 1; i--) {
    const upper = upperBound(rightArray, nums[i])

    rightArray.splice(upper, 0, nums[i])

    counts[i - 1] = lowerBound(rightArray, nums[i - 1])
  }

  return counts

  function upperBound(array, target) {
    let low = 0
    let high = array.length

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2)

      if (array[mid] > target) {
        high = mid
      } else {
        low = mid + 1
      }
    }

    return low
  }

  function lowerBound(array, target) {
    let low = 0
    let high = array.length

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2)

      if (array[mid] >= target) {
        high = mid
      } else {
        low = mid + 1
      }
    }

    return low
  }
}

let nums = [5, 2, 6, 1]
// [2,1,1,0]
console.log(countSmaller(nums))
