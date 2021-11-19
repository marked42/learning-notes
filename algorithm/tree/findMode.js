/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var findMode = function (root) {
  let result = []
  let maxCount = null

  let prevVal = null
  let count = null

  function traverse(node) {
    if (!node) {
      return
    }

    traverse(node.left)

    if (prevVal === null) {
      prevVal = node.val
      count = 1
    } else if (prevVal === node.val) {
      count++
    } else {
      if (maxCount === null || maxCount < count) {
        maxCount = count
        result = [prevVal]
      } else if (maxCount === count) {
        result.push(prevVal)
      }

      prevVal = node.val
      count = 1
    }

    traverse(node.right)
  }
  traverse(root)

  if (count > maxCount) {
    result = [prevVal]
  } else if (count === maxCount) {
    result.push(prevVal)
  }

  return result
}

const tree = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 2,
      left: null,
      right: null,
    },
    right: null,
  },
}

console.log(findMode(tree))
