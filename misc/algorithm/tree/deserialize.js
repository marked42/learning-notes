/**
 * @param {string} preorder
 * @return {boolean}
 */
var isValidSerialization = function (preorder) {
  const nodes = preorder.split(',')
  let i = 0
  let valid = true

  function deserialize() {
    if (i >= nodes.length) {
      valid = false
      return
    }

    if (nodes[i] === '#') {
      i++
      return null
    }
    i++

    // left
    deserialize()
    // right
    deserialize()
  }
  deserialize()

  return valid && i === nodes.length
}

const preorder = '9,3,4,#,#,1,#,#,2,#,6,#,#'
isValidSerialization(preorder)
