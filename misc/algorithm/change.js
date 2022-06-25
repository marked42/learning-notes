/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  coins.sort((a, b) => a - b)

  let count = 0
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i]
    count += Math.floor(amount / coin)
    amount %= coin
  }

  return amount === 0 ? count : -1
}

// console.log(coinChange([186, 419, 83, 408], 6249))

/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function (amount, coins) {
  const dp = new Array(amount + 1).fill(0)
  dp[0] = 1

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      dp[i] += i < coin ? 0 : dp[i - coin]
    }
  }

  return dp[amount]
}

console.log(change(5, [1, 2, 5]))
