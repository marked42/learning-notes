/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
  const dp = new Array(n + 1)
  dp[0] = 0

  for (let i = 1; i <= n; i++) {
    let min = n + 1
    for (let k = 1; k * k <= i; k++) {
      min = Math.min(min, dp[i - k * k] + 1)
    }
    dp[i] = min
  }

  return dp[n]
}

console.log(numSquares(12))
