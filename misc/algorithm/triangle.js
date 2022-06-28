/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
  const N = triangle.length
  const dp = new Array(N)
  dp[0] = triangle[0][0]

  // dp[i][j] = min(dp[i-1][j-1], dp[i-1][j]) + triangle[i][j]
  for (let i = 1; i < N; i++) {
    for (let j = i; j >= 0; j--) {
      const top = j === i ? Number.MAX_SAFE_INTEGER : dp[j]
      const diag = j === 0 ? Number.MAX_SAFE_INTEGER : dp[j - 1]
      dp[j] = Math.min(top, diag) + triangle[i][j]
    }
  }

  return Math.min(...dp)
}

console.log(minimumTotal([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]))
