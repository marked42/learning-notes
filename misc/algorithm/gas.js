/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function (gas, cost) {
  const N = gas.length
  const gap = new Array(N)

  for (let i = 0; i < gap.length; i++) {
    gap[i] = gas[i] - cost[i]
  }

  let start = 0
  while (start < gap.length) {
    let sum = 0
    let end = start
    do {
      sum += gap[end]
      end = (end + 1) % N
    } while (sum >= 0 && end !== start)
    if (end === start && sum >= 0) {
      return start
    }

    if (end > start) {
      start = end
    } else {
      break
    }
  }

  return -1
}

console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]))
console.log(canCompleteCircuit([2, 3, 4], [3, 4, 3]))
