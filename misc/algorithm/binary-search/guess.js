/**
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */

/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function (n) {
  let low = 1
  let high = n

  // 循环肯定结束
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2)

    const ans = guessNumber(mid)
    if (ans === 0) {
      return mid
    }
    if (ans === 1) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return low
}

function guessNumber(val) {
  if (val === 6) return val
}
