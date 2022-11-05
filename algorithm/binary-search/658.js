/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */
var findClosestElements = function (arr, k, x) {
  const closest = findClosestToX(arr, x)
  let start = closest
  let end = closest

  while (end + 1 - start < k) {
    if (start === 0) {
      // start左侧没有元素时可以一步到位
      end = start + k - 1
    } else if (end === arr.length - 1) {
      // end右侧没有元素时可以一步到位
      start = end + 1 - k
    } else if (closerToX(start - 1, end + 1) === start - 1) {
      start--
    } else {
      end++
    }
  }

  return arr.slice(start, end + 1)

  function lowerBound(arr, x) {
    let low = 0
    let high = arr.length - 1

    while (low <= high) {
      const mid = Math.floor((high + low) / 2)

      if (arr[mid] >= x) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    return low
  }

  function findClosestToX(arr, x) {
    const lower = lowerBound(arr, x)

    let closest = -1
    if (lower === arr.length) {
      closest = lower - 1
    } else if (arr[lower] === x) {
      closest = lower
    } else if (lower >= 1 && closerToX(lower - 1, lower) === lower - 1) {
      closest = lower - 1
    } else {
      closest = lower
    }

    return closest
  }

  // i < j
  function closerToX(i, j) {
    const left = Math.abs(arr[i] - x)
    const right = Math.abs(arr[j] - x)
    if (left <= right) {
      return i
    }
    return j
  }
}

console.log(findClosestElements([1, 1, 1, 10, 10, 10], 1, 9))
