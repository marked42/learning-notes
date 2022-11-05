/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  if (n === 0) {
    return 1
  }
  if (n < 0) {
    return 1 / myPow(x, -n)
  }

  let ans = n % 2 === 1 ? x : 1

  const half = myPow(x, Math.floor(n / 2))

  return ans * half * half
}

console.log(myPow(2, 10))
