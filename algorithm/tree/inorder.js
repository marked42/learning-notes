/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @return {TreeNode}
 */
var inorderSuccessor = function (root, p) {
  let found = false
  let next
  function inorder(node) {
    if (!node) {
      return
    }

    inorder(node.left)
    if (node.val === p.val) {
      found = true
    } else if (found && !next) {
      next = node
    }
    inorder(node.right)
  }
  inorder(root)

  return next
}

const tree = {
  val: 2,
  left: {
    val: 1,
  },
  right: {
    val: 3,
  },
}

console.log(inorderSuccessor(tree, tree.left))
