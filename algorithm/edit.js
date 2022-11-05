/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function (word1, word2) {
  const M = word1.length
  const N = word2.length

  const dp = new Array(M + 1)
  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(N + 1)
  }

  // 初始化第一行
  for (let i = 0; i < dp[0].length; i++) {
    dp[0][i] = i
  }

  // 初始化第一列
  for (let i = 0; i < dp.length; i++) {
    dp[i][0] = i
  }

  for (let row = 1; row <= M; row++) {
    for (let col = 1; col <= N; col++) {
      const left = dp[row][col - 1] + 1
      const top = dp[row - 1][col] + 1
      const diagonal =
        dp[row - 1][col - 1] + (word1[row - 1] === word2[col - 1] ? 0 : 1)
      dp[row][col] = Math.min(left, top, diagonal)
    }
  }

  return dp[M][N]
}

console.log(minDistance('horse', 'ros') === 3)
