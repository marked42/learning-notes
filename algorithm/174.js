/**
 * @param {number[][]} dungeon
 * @return {number}
 */
var calculateMinimumHP = function (dungeon) {
  const M = dungeon.length
  const N = dungeon[0].length

  const dp = new Array(M)
  for (let i = 0; i < M; i++) {
    dp[i] = new Array(N)
  }

  dp[0][0] = dungeon[0][0]
  for (let col = 1; col < N; col++) {
    dp[0][col] += dp[0][col - 1]
  }

  for (let row = 1; row < M; row++) {
    dp[row][0] += dp[row - 1][0]
  }

  let max = null
  for (let row = 1; row < M; row++) {
    for (let col = 1; col < N; col++) {
      const top = dp[row - 1][col]
      const left = dp[row][col - 1]

      dp[row][col] = Math.min(left, top) + dungeon[row][col]

      if (max === null || dp[row][col] > max) {
        max = dp[row][col]
      }
    }
  }

  return 1 - max
}

console.log(
  calculateMinimumHP([
    [-2, -3, 3],
    [-5, -10, 1],
    [10, 30, -5],
  ])
)
