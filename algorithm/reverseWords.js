/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  const chars = [...s]

  const result = []
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] !== ' ' || isLetter(result[result.length - 1])) {
      result.push(chars[i])
    }
  }
  if (result[result.length - 1] === ' ') {
    result.pop()
  }

  function isLetter(char) {
    return typeof char === 'string' && char !== ' '
  }

  function swap(chars, i, j) {
    const char = chars[i]
    chars[i] = chars[j]
    chars[j] = char
  }

  function swapRange(chars, start, end) {
    for (let i = start, j = end; i < j; i++, j--) {
      swap(chars, i, j)
    }
  }

  swapRange(result, 0, result.length - 1)

  for (let i = 0; i < result.length; i++) {
    let j = i
    for (; j < result.length; j++) {
      if (j + 1 === result.length || result[j + 1] === ' ') {
        break
      }
    }

    swapRange(result, i, j)

    i = j + 1
  }

  return result.join('')
}

console.log(reverseWords('  hello world  '))
