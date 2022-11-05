# 字符串相关算法与应用

https://www.cspiration.com/#/leetcodeClassification
https://www.youtube.com/watch?v=fZ8nkk220M4&list=PLLuMmzMTgVK49Hph4vV8DAzGZpj4azwmz&index=2

1. Edit Distance
1. Levenshtein Distance https://en.wikipedia.org/wiki/Levenshtein_distance
1. Longest Common Subsequence https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
1. Hamming Distance
1. spell check
1. Approximate string matching/fuzzy string searching

1. manhattan distance https://en.wikipedia.org/wiki/Taxicab_geometry

## 其他子序列算法

1. Longest Increasing Subsequence
1. Longest alternating subsequence

1. [string metics](https://en.wikipedia.org/wiki/String_metric)

## 子串匹配

KMP [28. 实现 strStr()](https://leetcode.cn/problems/implement-strstr/)

Rabin Karpe https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/

## 回文子串

1. 647. 回文子串
1. [409. 最长回文串](https://leetcode.cn/problems/longest-palindrome/)
1. [5. 最长回文子串](https://leetcode.cn/problems/longest-palindromic-substring/)

反转字符串中的单词

代码比较简单，相当于`squeeze -> reverse whole string -> reverse word`三个操作，但是注意对于`squeeze`实现中对于尾部空白的处理。

```js
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
```

## 计算器

1. [224. 基本计算器](https://leetcode.cn/problems/basic-calculator/)
1. [227. 基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii/)
1. [772](https://leetcode.cn/problems/basic-calculator-iii/)
1. [150. 逆波兰表达式](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)
1. [282. 给表达式添加运算符](https://leetcode.cn/problems/expression-add-operators/)
1. [494. 目标和](https://leetcode.cn/problems/target-sum/)
