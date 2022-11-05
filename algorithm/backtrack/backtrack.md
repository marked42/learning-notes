# 回溯算法

## 排列组合（Permutation & Combination）

排列强调顺序，组合的顺序无所谓。

1. 字典序法，
1. 递归法
1. https://www.tamarous.com/leetcode-next-permutation/

### 全排列

1. 全排列 46
给定一组元素`[1, 2, 3]`，总共有`n`个元素，从其中选出`k`个元素组成排列，如果`k == n`时叫做全排列。

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const path = []
    const result = []
    // 使用整数表示boolean数组，每一bit代表一个boolean值
    const visited = new Array(nums.length).fill(false)

    (function generate(path, result, visited) {
        if (path.length === nums.length) {
            result.push(path.map(i => nums[i]))
            return
        }

        for (let i = 0; i < nums.length; i++) {
            if (!visited[i]) {
                path.push(i)
                visited[i] = true
                generate(path, result, visited)
                visited[path.pop()] = false
            }
        }
    })(path, result, visited);

    return result
};

```

1. 47 不重复的全排列

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
    const countMap = new Map()
    for (let i = 0; i < nums.length; i++) {
        countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1)
    }

    const path = []
    const result = []
    function generate(path) {
        if (path.length === nums.length) {
            result.push([...path])
            return
        }

       for (const key of countMap.keys()) {
          if (countMap.get(key) > 0) {
              path.push(key)
              countMap.set(key, countMap.get(key) - 1)
              generate(path)
              countMap.set(key, countMap.get(key) + 1)
              path.pop()
          }
      }
    }
    generate(path)

    return result
};
```

1. 60 第K个排列

1. c++ next permutation
1. 17电话号码组合 47 SKU全排列

1. 51 N 皇后

```js
    const array = [
      ['IPhone X', 'IPhone XS'],
      ['black', 'white'],
      ['64g', '256g'],
    ]
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    if (!digits) { return [] }
    const map = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz',
    }

    const N = digits.length
    const result = []
    const path = []
    function generate(path) {
        if (path.length === N) {
            result.push(path.join(''))
            return
        }

        const chars = map[digits[path.length]]
        for (let i = 0; i < chars.length; i++) {
            path.push(chars[i])
            generate(path)
            path.pop()
        }
    }
    generate(path)

    return result
};
```
1. 31
1. https://juejin.im/post/5de7c053518825125d1497e2
1. 77 回溯法、回溯转换为迭代实现，递归（f(n, k) = f(n-1, k-1), f(n-1, k) 分解， 转化为动态规划，

#### 括号生成

https://leetcode-cn.com/problems/generate-parentheses/


### 组合

1. 77组合 78 子集 90 子集II 93, 784

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    nums.sort((a, b) => a - b)
    const N = nums.length

    const result = []
    const path = []
    function generate(path) {
        result.push(path.map(i => nums[i]))
        const last = path.length === 0 ? -1 : path[path.length - 1]
        for (let i = last + 1; i < N; i++) {
            path.push(i)
            generate(path)
            path.pop()
        }
    }
    generate(path, 0)

    return result
};
```

组合总和

1. 39 40
