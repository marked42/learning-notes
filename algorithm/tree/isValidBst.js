var isValidBST = function (root) {
  let prevVal = null

  const stack = []

  let next = root
  while (next !== null || stack.length > 0) {
    while (next !== null) {
      stack.push(next)
      next = next.left
    }
    // if (next) {
    //     stack.push(next)
    //     next = next.left
    // } else {
    const top = stack.pop()
    // if (prevVal !== null && prevVal >= top.val) {
    //   return false
    // }

    // prevVal = top.val
    console.log('val: ', top.val)
    next = top.right
    // }
  }

  return true
}

// const root = [5, 1, 4, null, null, 3, 6]
const root = {
  val: 5,
  left: { val: 1, left: null, right: null },
  right: {
    val: 4,
    left: { val: 3, left: null, right: null },
    right: { val: 6, left: null, right: null },
  },
}
isValidBST(root)
