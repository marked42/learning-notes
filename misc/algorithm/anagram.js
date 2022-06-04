/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  const map = new Map()

  for (let i = 0; i < s.length; i++) {
    map.set(s[i], (map.get(s[i]) || 0) + 1)
  }

  for (let i = 0; i < t.length; i++) {
    if (!map.has(t[i]) || map.get(t[i]) === 0) {
      return false
    }
    map.set(t[i], map.get(t[i]) - 1)
  }

  const hasCountBiggerThanOne =
    map.values().length > 0 && map.values.some((v) => v > 0)

  return !hasCountBiggerThanOne
}

isAnagram('ab', 'a')
