/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} A
 * @param {TreeNode} B
 * @return {boolean}
 */
var isSubStructure = function (A, B) {
  function isSub(A, B) {
    if (!B) {
      return true
    }
    if (!A || A.val !== B.val) {
      return false
    }

    return isSub(A.left, B.left) && isSub(A.right, B.right)
  }

  return (
    A &&
    B &&
    (isSub(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B))
  )
}

// const [-1,3,2,0]
const tree = {
  val: -1,
  left: {
    val: 3,
    right: null,
    left: {
      val: 0,
      left: null,
      right: null,
    },
  },
  right: {
    val: 2,
    left: null,
    right: null,
  },
}

console.log(isSubStructure(tree, null))
