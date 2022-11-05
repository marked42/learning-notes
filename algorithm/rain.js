/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  function findNextPeak(height, start) {
    let i = start + 1
    while (i < height.length) {
      if (height[i] < height[i - 1]) {
        return i - 1
      }

      if (i === height.length - 1) {
        return i
      }

      i++
    }

    return -1
  }

  function findNextValley(height, start) {
    let i = start + 1
    while (i < height.length) {
      if (height[i] > height[i - 1]) {
        return i - 1
      }

      if (i === height.length - 1) {
        return i
      }

      i++
    }

    return -1
  }

  const peakIndexes = []

  for (let i = 0; i < height.length; ) {
    const peak = findNextPeak(height, i)
    if (peak === -1) {
      break
    }
    peakIndexes.push(peak)
    let valley = findNextValley(height, peak + 1)
    if (valley === -1) {
      break
    }
    i = valley
  }

  let sum = 0
  for (let i = 0; i < peakIndexes.length - 1; i++) {
    const lowerPeak = Math.min(
      height[peakIndexes[i]],
      height[peakIndexes[i + 1]]
    )
    for (let j = peakIndexes[i]; j <= peakIndexes[i + 1]; j++) {
      sum += Math.max(0, lowerPeak - height[j])
    }
  }

  return sum
}

// console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]))
console.log(trap([4, 2, 0, 3, 2, 5]))
