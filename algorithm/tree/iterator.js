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
 */
var BSTIterator = function (root) {
  this.stack = []
  this.stackTarget = root
}

/**
 * @return {number}
 */
BSTIterator.prototype.next = function () {
  while (this.hasNext()) {
    while (this.stackTarget) {
      this.stack.push(this.stackTarget)
      this.stackTarget = this.stackTarget.left
    }

    const top = this.stack.pop()

    this.stackTarget = top.right
    return top.val
  }
}

/**
 * @return {boolean}
 */
BSTIterator.prototype.hasNext = function () {
  return !!(this.stackTarget || this.stack.length > 0)
}

const tree = {
  val: 7,
  left: {
    val: 3,
    left: null,
    right: null,
  },
  right: {
    val: 15,
    left: {
      val: 9,
      left: null,
      right: null,
    },
    right: {
      val: 20,
      left: null,
      right: null,
    },
  },
}
/**
 * Your BSTIterator object will be instantiated and called as such:
 * var obj = new BSTIterator(root)
 * var param_1 = obj.next()
 * var param_2 = obj.hasNext()
 */
var bSTIterator = new BSTIterator(tree)
console.log(bSTIterator.next()) // 返回 3
console.log(bSTIterator.next()) // 返回 7
console.log(bSTIterator.hasNext()) // 返回 True
console.log(bSTIterator.next()) // 返回 9
console.log(bSTIterator.hasNext()) // 返回 True
console.log(bSTIterator.next()) // 返回 15
console.log(bSTIterator.hasNext()) // 返回 True
console.log(bSTIterator.next()) // 返回 20
console.log(bSTIterator.hasNext()) // 返回 False
