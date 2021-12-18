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
 * @return {number}
 */
var maxProduct = function (root) {
  function sum(node) {
    if (!node) {
      return 0
    }

    return node.val + sum(node.left) + sum(node.right)
  }
  const treeSum = sum(root)

  let max = Number.MIN_SAFE_INTEGER
  function dfs(node) {
    if (!node) {
      return 0
    }

    const sum = dfs(node.left) + dfs(node.right) + node.val
    const product = (treeSum - sum) * sum
    if (product > max) {
      max = product
    }

    return sum
  }
  dfs(root)

  return max % (Math.pow(10, 9) + 7)
}

// const tree = [1, 2, 3, 4, 5, 6]

const tree = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
    },
    right: {
      val: 5,
    },
  },
  right: {
    val: 3,
    left: {
      val: 6,
    },
  },
}

console.log(maxProduct(tree))
