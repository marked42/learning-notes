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
var widthOfBinaryTree = function (root) {
  const queue = root ? [{ node: root, pos: 0 }] : []

  let treeWidth = 0
  while (queue.length) {
    const count = queue.length

    const head = queue[0].pos
    const tail = queue[queue.length - 1].pos
    const levelWidth = tail - head + 1
    console.log('witd: ', levelWidth)
    if (levelWidth > treeWidth) {
      treeWidth = levelWidth
    }

    console.log('count: ', count)
    for (let k = 0; k < count; k++) {
      const top = queue.shift()
      if (top.node.left) {
        queue.push({ node: top.left, pos: top.pos * 2 })
      }
      if (top.node.right) {
        queue.push({ node: top.right, pos: top.pos * 2 + 1 })
      }
    }
  }

  return treeWidth
}

// 1
// /   \
// 3     2
// / \     \
// 5   3     9

const tree = {
  val: 1,
  left: {
    val: 3,
    left: {
      val: 5,
      left: null,
      right: null,
    },
    right: {
      val: 3,
      left: null,
      right: null,
    },
  },
  right: {
    val: 2,
    left: null,
    right: {
      val: 9,
      left: null,
      right: null,
    },
  },
}

widthOfBinaryTree(tree)
