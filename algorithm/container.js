/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  function getBiggerContainer(container) {
    const [left, right, amount] = container

    if (height[left] < height[right]) {
      for (let i = left + 1; i <= right; i++) {
        if (height[i] > height[left]) {
          const newContainer = getContainer(i, right)
          if (newContainer[2] > amount) {
            return newContainer
          }
        }
      }
      return container
    } else {
      for (let i = right - 1; i >= left; i--) {
        if (height[i] > height[right]) {
          const newContainer = getContainer(left, i)
          if (newContainer[2] > amount) {
            return newContainer
          }
        }
      }
      return container
    }
  }

  function getContainer(left, right) {
    return [left, right, (right - left) * Math.min(height[left], height[right])]
  }

  let container = getContainer(0, height.length - 1)

  while (true) {
    const bigger = getBiggerContainer(container)
    if (bigger === container) {
      break
    }
    container = bigger
  }

  return container[2]
}

console.log(maxArea([2, 3, 4, 5, 18, 17, 6]))
