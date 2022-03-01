/**
 * @param {number[]} postorder
 * @return {boolean}
 */
var verifyPostorder = function (postorder) {
  function validate(start, end) {
    if (start >= end) {
      return true
    }

    const root = postorder[end]

    for (var i = end - 1; i >= start; i--) {
      if (postorder[i] < root) {
        break
      }
    }

    let smaller = true
    for (let j = start; j <= i; j++) {
      if (postorder[j] > root) {
        false
      }
    }

    return validate(start, i) && validate(i + 1, end - 1) && smaller
  }

  return validate(0, postorder.length - 1)
}

// console.log(verifyPostorder([4, 8, 6, 12, 16, 14, 10]))
console.log(verifyPostorder([5, 4, 3, 2, 1]))
