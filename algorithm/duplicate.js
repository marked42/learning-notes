/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function (nums, k) {
  const set = new Set()

  for (let i = 0; i <= Math.min(k, nums.length - 1); i++) {
    const num = nums[i]
    if (set.has(num)) {
      return true
    } else {
      set.add(num)
    }
  }

  for (let i = k + 1; i < nums.length; i++) {
    set.delete(nums[i - k - 1])
    if (set.has(nums[i])) {
      return true
    } else {
      set.add(nums[i])
    }
  }

  return false
}

// console.log(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2))
// console.log(containsNearbyDuplicate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 15))

/**
 *
 * @param {number[]} nums
 * @param {number} k
 * @param {number} t
 * @return {boolean}
 */
var containsNearbyAlmostDuplicate = function (nums, k, t) {
  let ascending = []

  for (let i = 0; i < nums.length; i++) {
    if (i >= k + 1) {
      ascending = ascending.filter((e) => e !== nums[i - k - 1])
    }

    // 二分查找
    let low = 0
    let high = ascending.length - 1
    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2)

      if (ascending[mid] >= nums[i]) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    const lowWithRange =
      low < ascending.length && Math.abs(ascending[low] - nums[i]) <= t
    const highWithRange = high >= 0 && Math.abs(ascending[high] - nums[i]) <= t
    if (lowWithRange || highWithRange) {
      return true
    }

    // insert
    let j = 0
    for (; j < ascending.length; j++) {
      if (ascending[j] > nums[i]) {
        break
      }
    }
    ascending.splice(j, 0, nums[i])
  }

  return false
}

console.log(containsNearbyAlmostDuplicate([1, 2, 1, 1], 1, 0))
