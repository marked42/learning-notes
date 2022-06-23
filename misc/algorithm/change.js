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

console.log(coinChange([186, 419, 83, 408], 6249))
