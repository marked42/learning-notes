const findMedianSortedArrays1 = (nums1, nums2) => {
  if (nums1.length > nums2.length) {
    return findMedianSortedArrays(nums2, nums1)
  }

  let m = nums1.length
  let n = nums2.length
  let left = 0,
    right = m
  // median1：前一部分的最大值
  // median2：后一部分的最小值
  let median1 = 0,
    median2 = 0

  while (left <= right) {
    // 前一部分包含 nums1[0 .. i-1] 和 nums2[0 .. j-1]
    // 后一部分包含 nums1[i .. m-1] 和 nums2[j .. n-1]
    let i = Math.floor((left + right) / 2)
    let j = Math.floor((m + n + 1) / 2) - i

    // nums_im1, nums_i, nums_jm1, nums_j 分别表示 nums1[i-1], nums1[i], nums2[j-1], nums2[j]
    let nums_im1 = i == 0 ? Number.MIN_SAFE_INTEGER : nums1[i - 1]
    let nums_i = i == m ? Number.MAX_SAFE_INTEGER : nums1[i]
    let nums_jm1 = j == 0 ? Number.MIN_SAFE_INTEGER : nums2[j - 1]
    let nums_j = j == n ? Number.MAX_SAFE_INTEGER : nums2[j]

    if (nums_im1 <= nums_j) {
      median1 = Math.max(nums_im1, nums_jm1)
      median2 = Math.min(nums_i, nums_j)
      left = i + 1
    } else {
      right = i - 1
    }
  }

  return (m + n) % 2 == 0 ? (median1 + median2) / 2.0 : median1
}

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const m = nums1.length
  const n = nums2.length

  if (m > n) {
    return findMedianSortedArrays(nums2, nums1)
  }

  let low = 0
  let high = m

  while (low <= high) {
    const i = Math.floor((low + high) / 2)

    const { num_i_1, num_j } = getNumbers(nums1, nums2, i)

    if (num_i_1 > num_j) {
      high = i - 1
    } else {
      low = i + 1
    }
  }

  // 循环结束后，high的值就是前半段false数组的最后一个元素
  const { num_i_1, num_j_1, num_i, num_j } = getNumbers(nums1, nums2, high)
  const median1 = Math.max(num_i_1, num_j_1)
  const median2 = Math.min(num_i, num_j)

  const odd = (m + n) % 2 === 1
  return odd ? median1 : (median1 + median2) / 2

  function getValueOrDefault(value, fallback) {
    return value === undefined ? fallback : value
  }

  function getNumbers(nums1, nums2, i) {
    const halfCount = Math.ceil((nums1.length + nums2.length) / 2)
    const j = halfCount - i
    const num_i_1 = getValueOrDefault(nums1[i - 1], Number.MIN_SAFE_INTEGER)
    const num_j_1 = getValueOrDefault(nums2[j - 1], Number.MIN_SAFE_INTEGER)
    const num_i = getValueOrDefault(nums1[i], Number.MAX_SAFE_INTEGER)
    const num_j = getValueOrDefault(nums2[j], Number.MAX_SAFE_INTEGER)

    return {
      num_i,
      num_i_1,
      num_j,
      num_j_1,
    }
  }
}

console.log(findMedianSortedArrays([3], [-2, -1]))
// console.log(findMedianSortedArrays([1, 3], [2]))
// console.log(findMedianSortedArrays([1, 2], [3, 4, 5]))
// console.log(findMedianSortedArrays([], [0]))
// console.log(findMedianSortedArrays([2], []))
