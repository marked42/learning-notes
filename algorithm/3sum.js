/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  let triplets = []

  nums.sort((a, b) => a - b)

  for (let i = 0; i < nums.length - 2; i++) {
    // 避免第一个数重复
    if (nums[i] === nums[i - 1]) {
      continue
    }

    let j = i + 1
    let k = nums.length - 1
    while (j < k) {
      const sum = nums[i] + nums[j] + nums[k]
      if (j > i + 1 && nums[j] === nums[j - 1]) {
        j++
        continue
      }

      if (sum < 0) {
        j++
      } else if (sum > 0) {
        k--
      } else {
        triplets.push([nums[i], nums[j], nums[k]])
        j++
        k--
      }
    }
  }

  return triplets
}

// console.log(threeSum([-1, 0, 1, 2, -1, -4]))

function buildTree(array) {
  nodes = array.map((value) => ({ value, left: null, right: null }))

  const left = (i) => i * 2 + 1
  const right = (i) => i * 2 + 2

  for (let i = 0; left(i) < nodes.length; i++) {
    nodes[i].left = nodes[left(i)]
    if (right(i) < nodes.length) {
      nodes[i].right = nodes[right(i)]
    }
  }

  return nodes[0]
}

// console.log(buildTree([0, 1, 2, 3, 4, 5, 6]))

// function debounce(fn, delay) {
//   let timer = null

//   return function wrapper(...args) {
//     if (timer) {
//       clearTimeout(timer)
//     }
//     timer = setTimeout(() => {
//       fn.apply(this, [...args])

//       timer = null
//     }, delay)
//   }
// }

// const log = debounce(function (...args) {
//   console.log(this, ...args)
// }, 100)

// log.call('fu1', 1)
// log.call('fu2', 2)
// log.call('fu3', 3)

// function throttle(fn, delay) {
//   let called = false
//   let timer = null

//   return function wrapper(...args) {
//     if (called) {
//       return
//     }

//     called = true
//     timer = setTimeout(() => {
//       called = false
//       timer = null
//     }, delay)

//     fn.call(this, ...args)
//   }
// }

// const log = throttle(function (...args) {
//   console.log(this, ...args)
// }, 100)

// log.call('fu1', 1)
// log.call('fu2', 2)
// log.call('fu3', 3)
// setTimeout(() => {
//   log.call('fu4', 4)
//   log.call('fu5', 5)
// }, 200)

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestArithSeqLength = function (nums) {
  if (nums.length <= 2) {
    return nums.length
  }

  const dp = new Array(nums.length)

  dp[0] = {}
  dp[1] = {
    [nums[1] - nums[0]]: 2,
  }

  let max = 0
  for (let i = 2; i < nums.length; i++) {
    dp[i] = {}

    for (let j = i - 1; j >= 0; j--) {
      const gap = nums[i] - nums[j]
      if (dp[j][gap]) {
        dp[i][gap] = dp[j][gap] + 1
      } else {
        dp[i][gap] = 2
      }

      max = Math.max(dp[i][gap], max)
    }
  }

  return max
}

// console.log(longestArithSeqLength([3, 6, 9, 12]))
// console.log(longestArithSeqLength([20, 1, 15, 3, 10, 5, 8]))

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestArithSeqLength = function (nums) {
  const N = nums.length
  const dp = new Array(N)
  for (let i = 0; i < N; i++) {
    dp[i] = new Array(1001).fill(0)
  }

  let max = 0

  const offset = 500
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i; j++) {
      const gap = nums[i] - nums[j] + offset
      dp[i][gap] = Math.max(dp[j][gap] + 1, dp[i][gap])

      max = Math.max(dp[i][gap], max)
    }
  }

  return max + 1
}
console.log(longestArithSeqLength([3, 6, 9, 12]))
