/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const length = new Array(s.length)
  length[0] = 1

  for (let i = 1; i < s.length; i++) {
    let j = i - 1
    while (j >= i - length[i - 1] && s[j] !== s[i]) {
      j--
    }

    length[i] = i - j
  }

  return Math.max(...length)
}

console.log(lengthOfLongestSubstring('pwwkew'))
