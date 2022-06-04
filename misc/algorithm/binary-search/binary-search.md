# 二分查找

1. 元素都不相同最简单的二分查找
1. 有相同元素
1. 递归的写法

1. 循环不变量 loop invariant 典型的三段论推导

   1. 初始条件下循环不变量成立
   1. 进行一次循环能维持循环不变量成立
   1. 循环结束后循环不变量也能成立
   1. 格外注意的是每次循环需要让问题空间变小，否则会出现死循环的情况。

## 目标元素是否存在

使用闭区间`[low, high]`记录二分查找目标区间的边界，在区间为空时停止查找。

二分查找模板情况 1，判断数组中元素是否存在，数组内不存在重复元素。循环内判断元素是否符合条件，存在符合条件元素的话循环内返回，否则循环结束，代表不存在的情况。

分析 `low/high`取值的范围。

```js
function binarySearch(arr, value) {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2)
    if (arr[mid] === value) {
      return true
    } else if (arr[mid] > value) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return false
}
```

对于数组中存在重复元素上面代码同样能判断元素是否存在，但是不能告诉我们到底存在几个符合条件的元素，对应下标范围。

二分查找解决符合某种条件的元素是否存在的问题适合使用闭区间，循环条件是`low <= high`，终止时`low > high`此时区间为空。如果找到中间值`arr[mid]`满足条件即可返回，否则根据条件收缩有边界到`mid`左边或者左边界到`mid`右边，将区间缩小为一半大小且不包括`mid`。

## 下边界

### 左闭右开区间解法

对于一个数组，如果函数`f(x)`使得数组中元素映射到`true`或者`false`，数组本身映射到`[false, ..., true, ..., true]`，开始是连续的`false`然后是连续的`true`，函数对数组起到了一个二分(partition)的作用。

二分查找可以用来确定映射到`true`的下标最小的数组元素。

```js
function lowerBound(arr, predicate) {
  // 左闭右开初始化对应值
  let low = 0
  let high = arr.length

  while (low < high) {
    const mid = Math.floor(low + (high - low) / 2)
    if (predicate(arr[mid])) {
      // 收缩区间到左侧
      high = mid
    } else {
      // 收缩区间到右侧
      low = mid + 1
    }
  }

  return low
}
```

使用左闭右开区间`[low, high)`，当`low == high`时区间为空，所以循环结束的条件是`low < high`。

循环过程中不变量是`[0, low)`映射到`false`，`[low, high)`待定，`[high, arr.length)`映射到`true`

1. 循环开始时`[0, low)`和`[high, arr.length)`都是空区间，可以认为条件成立。
1. 进行一次循环
   1. 当中间值`predicate(arr[mid])`条件为真时，`high = mid`将待定的区间`[low, high)`收缩到`[low, mid)`，左侧区间`[0, low)`不变，右侧区间扩大为`[high, arr.length - 1)`，不变量同样成立
   1. 反之当`predicate(arr[mid])`为假时，`low = mid + 1`，将左边界扩大到`[0, mid + 1)`，右边界不变，不变量同样成立。
1. 当循环结束的时候`low == high`，根据前面的推理此时不变量同样成立，因此`[0, low)`映射到`false`，`[high, arr.length)`映射到`true`，所以`low`、`high`的值就是条件`f(x)`的对应的`true`值的下边界。

这种解法下`low`是条件`f(x)`对应的`true`值的下边界，同时`low - 1`就是`false`值的上边界。

### 闭区间解法

采用闭区间的形式重写上述代码

```js
function lowerBound(arr, predicate) {
  // 左闭右开初始化对应值
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2)
    if (predicate(arr[mid])) {
      // 收缩区间到左侧
      high = mid - 1
    } else {
      // 收缩区间到右侧
      low = mid + 1
    }
  }

  return low
}
```

可以看到区别在于`high`初始化为`arr.length - 1`最后一个元素位置，循环结束条件是`low <= high`，收缩到左边时`high`的值是`mid - 1`。两种形式表达的二分查找收缩过程是一样的，只有右边界值错了一位。闭区间的情况下循环结束时`high = low - 1`，根据上面的分析知道最终的`low`是`true`值的下边界，`high`是`false`值的上边界。

### 变形

下边界函数`lowerBound`可以用来解决有序数组中二分查找元素的几个经典问题。

1. 大于等于某个值`value`的数组元素中最小的（下边界问题），对应的映射函数如下
   ```js
   // 注意映射函数接受一个数组元素作为参数，返回boolean
   function predicate(arrayElement) {
     return arrayElement >= value
   }
   ```
1. 小于某个值`value`的数组元素中最大的（上边界问题），条件小于取反的条件是大于等于所以对应函数
   ```js
   // 注意映射函数接受一个数组元素作为参数，返回boolean
   function predicate(arrayElement) {
     return arrayElement >= value
   }
   ```

这两个问题就是一个问题的两个部分，所以使用的`predicate`函数是同一个。

1. 大于某个值`value`的数组元素中最小的（下边界问题）

   ```js
   // 注意映射函数接受一个数组元素作为参数，返回boolean
   function predicate(arrayElement) {
     return arrayElement > value
   }
   ```

1. 小于等于某个值`value`的数组元素中最大的（上边界问题），条件小于等于取反的条件是大于所以对应函数
   ```js
   function predicate(arrayElement) {
     return arrayElement > value
   }
   ```

这两个问题同样也是。

使用下边界法也可以判断元素是否存在，需要注意的是在得到下边界之后需要有额外的判断。如果使用的映射函数是`arrElement >= value`，得到的下边界值`low`就是大于等于`value`的最小元素。

```js
// 下边界超出数组右侧，数组中的元素都小于value，所以不肯能有等于value的
if (low === arr.length) {
  return -1
}

// 下边界存在但是low对应的元素可能是大于value的，需要额外判断下
return arr[low] === value ? low : value
```

### C++

C++中的库函数[lower_bound](https://en.cppreference.com/w/cpp/algorithm/lower_bound)、[upper_bound](https://en.cppreference.com/w/cpp/algorithm/upper_bound)、[equal_range](https://en.cppreference.com/w/cpp/algorithm/equal_range)、[binary_search](https://en.cppreference.com/w/cpp/algorithm/binary_search)和上述边界函数类似，区别在于其映射函数是一个二元函数`binaryPredicate: (a, b) => boolean`，由唯一一个小于运算符可以确定两个值`(a, b)`之间的三种关系。

```js
// 全序序列 对于 x = 4来说
// --------lower_bound >= 4
;[1, 2, 3, 4, 4, 4, 5, 6]
// -----------------upper_bound > 4
```

1. `a`小于`b`，`a < b`
1. `a`大于`b`，`b < a`
1. `a`等于`b`，`!(a < b || b < a)`

`a`是数组元素，`x`是比较的目标元素，几个函数的含义

1. `lower_bound(arr, f)`表示的是`f(a, x)`映射元素为`true`即`a >= x`的下边界。
1. `upper_bound(arr, f)`的含义有所不同，**不是**`f(a, x)`映射元素到`false`的上边界，而是`!f(x, a)`映射到`true`即`!(x >= a) = a < x`的下边界。

这样定义的好处在于`[lower_bound(arr, f), upper_bound(arr, f))`表示的是数组`arr`中元素等于`x`的左闭右开区间，也就是`equal_range`的定义。

`binary_search`利用`lower_bound`获取下边界的下标，然后检测下标是否越界，以及下标元素是否与目标元素`x`相等。

```cpp
template<class ForwardIt, class T>
bool binary_search(ForwardIt first, ForwardIt last, const T& value)
{
    first = std::lower_bound(first, last, value);
    return (!(first == last) && !(value < *first));
}
```

### 递归形式

1. https://github.com/labuladong/fucking-algorithm/blob/master/%E7%AE%97%E6%B3%95%E6%80%9D%E7%BB%B4%E7%B3%BB%E5%88%97/%E4%BA%8C%E5%88%86%E6%9F%A5%E6%89%BE%E8%AF%A6%E8%A7%A3.md
1. https://www.youtube.com/watch?v=v57lNF2mb_s

1. 递归版本
1. John Bentley 的经典书里有大概第 4 章，第 9 章进行了讨论 编程珠玑
   When Jon Bentley assigned binary search as a problem in a course for professional programmers, he found that ninety percent failed to provide a correct solution after several hours of working on it, mainly because the incorrect implementations failed to run or returned a wrong answer in rare edge cases.
1. Knuth
   Although the basic idea of binary search is comparatively straightforward, the details can be surprisingly tricky...
1. 代码之美有两章涉及
1. [What are the pitfalls in implementing binary search?](https://stackoverflow.com/questions/504335/what-are-the-pitfalls-in-implementing-binary-search)
1. [Binary search is a pathological case for caches](http://pvk.ca/Blog/2012/07/30/binary-search-is-a-pathological-case-for-caches/)
1. [Extra, Extra - Read All About It: Nearly All Binary Searches and Mergesorts are Broken](https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html)

## 基础应用

### [第一个错误的版本 278](https://leetcode.cn/problems/first-bad-version/)

使用 lower_bound

```js
/**
 * Definition for isBadVersion()
 *
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function (isBadVersion) {
  /**
   * @param {integer} n Total versions
   * @return {integer} The first bad version
   */
  return function (n) {
    let low = 1
    let high = n

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2)

      if (isBadVersion(mid)) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    return low
  }
}
```

### [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)

upper_bound

### [744. 寻找比目标字母大的最小字母](https://leetcode.cn/problems/find-smallest-letter-greater-than-target/)

使用条件`letters[mid] > target[0]`将数组一分为二即可，注意题目中的循环出现条件。

```js
/**
 * @param {character[]} letters
 * @param {character} target
 * @return {character}
 */
var nextGreatestLetter = function (letters, target) {
  let low = 0
  let high = letters.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    if (letters[mid] > target[0]) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low === letters.length ? letters[0] : letters[low]
}
```

### [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

查找元素范围

## 旋转数组

### 构建旋转数组

通过反转操作来实现旋转数组，旋转数组 k 次相当于把数组末尾的 k 各元素换到数组开头，可以通过首尾元素位置对调的方式实现，但是对调之后数组元素的顺序
也反了，所以需要在分别对两个子数组`[0, k - 1]/[k, n - 1]`再进行反转，恢复原来的顺序。 下面例子将数组最旋转两次。

```
1 2 3 4 5
5 4 3 2 1
4 5 1 2 3
```

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
  const n = nums.length
  k = k % n
  if (k === 0) {
    return nums
  }

  flipArray(0, nums.length - 1)
  flipArray(0, k - 1)
  flipArray(k, nums.length - 1)

  return nums

  function flipArray(i, j) {
    while (i < j) {
      const temp = nums[i]
      nums[i] = nums[j]
      nums[j] = temp

      i++
      j--
    }
  }
}
```

如何找到旋转数组的旋转点下标，如果全部元素相同或者完全升序的话返回下标 0。

### 旋转数组中的最小值

[153 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/) 数组中不存在**重复元素**。

循环的终止条件是只剩一个元素，就是最小元素

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let low = 0
  let high = nums.length - 1

  while (low <= high) {
    if (low === high) {
      return nums[low]
    }
    // 整个数组有序，所以最小值是low，对于有序数组的提前判断
    if (nums[low] < nums[high]) {
      return nums[low]
    }

    const mid = low + Math.floor((high - low) / 2)

    // 左侧有序
    if (nums[mid] > nums[low]) {
      low = mid + 1
      // mid/low是同一个元素，而且不可能是最小元素，这种情况已经在上面排除了
    } else if (nums[mid] === nums[low]) {
      // 这里使用 low = mid + 1 或者 low++ 没有差别，在数组不包含重复元素的情况下 只能是low === mid成立
      low++
    } else {
      // mid 可能是最小元素，不能使用high = mid - 1 排除
      high = mid
    }
  }
}
```

下面有一个更简洁的解法，来分析下为什么可以这样写。首先循环结束的条件还是只剩一个元素，同样使用左闭右闭区间，但是使用了`low < high`的条件，将显式的返回结束循环修改为了条件结束循环，所以在循环外需要`return nums[low]`。另外循环内部使用了`high`而不是`low`去和`mid`做比较，在数组有两个以上元素时`low/mid/high`三者都不相同，这两种做法没有区别。但是在数组只有两个元素时`low === mid === high - 1`，使用`high`与`mid`不相等，因此减少了`nums[high] === nums[mid]`的情况分支判断。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let low = 0
  let high = nums.length - 1

  // 对于完全升序数组的提前检查
  if (nums[low] < nums[high]) {
    return nums[low]
  }

  // 只有一个元素时循环结束，也就是最小值
  while (low < high) {
    const mid = Math.floor((low + high) / 2)

    // 左侧有序
    if (nums[mid] > nums[high]) {
      // 本轮循环至少排除掉一个mid元素
      low = mid + 1
    } else {
      // 本轮循环至少排除掉一个high元素
      high = mid
    }
  }

  return nums[low]
}
```

[154 允许数组出现重复元素](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array-ii/submissions/)

在数组允许出现重复元素时，上述分析中`nums[high] === nums[mid]`的情况就有可能出现，因此还需要额外判断，剔除 `high`对应元素，因为剔除一个重复元素不影响最终的结果，但是可以使循环进入下一轮。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let low = 0
  let high = nums.length - 1
  while (low < high) {
    const pivot = low + Math.floor((high - low) / 2)
    if (nums[pivot] < nums[high]) {
      high = pivot
    } else if (nums[pivot] > nums[high]) {
      low = pivot + 1
    } else {
      high--
    }
  }
  return nums[low]
}
```

### 旋转数组二分查找

有序旋转数组中进行二分查找要利用数组的局部有序性，来达到求解问题空间减半的操作实现二分查找。

mid 代表中间元素，局部有序的情况有两种。

1. `array[low] < array[mid]`成立，这意味着数组左半边有序，旋转的节点在数组右半边。
1. `array[low] > array[mid]`成立，这意味着数组右半边有序，旋转的节点在数组左半边。

如果数组中允许出现重复元素，这时候可能出现`array[low] === array[mid]`，可以通过`low++`的操作将`low`对应的元素剔除。问题空间减少一个元素，而不是减少一半，因此在数组允许出现重复元素时，最坏情况下数组所有元素相同，算法时间复杂度从 O(logN)降低为 O(N)。

#### [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

在旋转数组中搜索目标值，数组中不存在重复元素。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let low = 0
  let high = nums.length - 1

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2)

    if (nums[mid] === target) {
      return mid
    }

    // 左侧有序
    if (nums[mid] > nums[low]) {
      if (target >= nums[low] && target < nums[mid]) {
        high = mid - 1
      } else {
        low = mid + 1
      }
      // 中间节点和左侧节点是同一个
    } else if (nums[mid] === nums[low]) {
      low = mid + 1
      // 右侧有序
    } else {
      if (target > nums[mid] && target <= nums[high]) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
  }

  return -1
}
```

#### [81. 搜索旋转排序数组 II](https://leetcode.cn/problems/search-in-rotated-sorted-array-ii/)

旋转数组中是否存在目标值，数组元素可重复。

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {boolean}
 */
var search = function (nums, target) {
  let low = 0
  let high = nums.length - 1

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2)

    if (nums[mid] === target) {
      return true
    }

    // 左侧有序
    if (nums[mid] > nums[low]) {
      if (target >= nums[low] && target < nums[mid]) {
        high = mid - 1
      } else {
        low = mid + 1
      }
      // 左侧是同一个值
    } else if (nums[mid] === nums[low]) {
      // 注意这里去除掉一个相同的元素，来转移到左侧有序或者右侧有序的情况上
      low++
      // 右侧有序
    } else {
      if (target > nums[mid] && target <= nums[high]) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
  }

  return false
}
```

#### [面试题 10.03. 搜索旋转数组](https://leetcode.cn/problems/search-rotate-array-lcci/submissions/)

```js
/**
 * @param {number[]} arr
 * @param {number} target
 * @return {number}
 */
var search = function (arr, target) {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    if (arr[low] === target) {
      return low
    }

    const mid = low + Math.floor((high - low) * 0.5)

    // 去除右侧元素，注意high肯定大于mid，因为只有数组包含一个元素 low/high/mid三者相相等，这种情况在上面已经处理了
    // 因此这里不会造成死循环
    if (arr[mid] === target) {
      high = mid
      continue
    }

    // 左侧有序
    if (arr[mid] > arr[low]) {
      if (target >= arr[low] && target < arr[mid]) {
        high = mid - 1
      } else {
        low = mid + 1
      }
      // 无法判断左侧有序还是右侧有序，而且low也不是目标元素，所以可以剔除掉，在下个循环转移到左侧有序或者右侧有序的情况
    } else if (arr[mid] === arr[low]) {
      // 在数组所有元素相同且不是目标元素的情况下，退化为 O(N)
      low++
      // 右侧有序
    } else {
      if (target > arr[mid] && target <= arr[high]) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }
  }

  return -1
}
```

## 变形情况

二分查找循环结束条件是只剩一个元素，使用闭区间行使表示。

540 注意此题条件变形了，循环不变量是什么？结束条件是什么？

```js
const low = 0
// 闭区间
const high = array.length - 1

// 循环结束时 low === high，区间内剩一个元素
while (low < high) {
  const mid = low + Math.floor((high - low) / 2)

  // mid 可能等于 low 或者大于low
  // mid < high
  // mid + 1必然存在
}
```

二分查找循环结束条件是一个元素的情况。

[寻找峰值 162](https://leetcode.cn/problems/find-peak-element/)

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findPeakElement = function (nums) {
  let low = 0
  let high = nums.length - 1

  // 终止条件是只剩一个元素
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2)

    // mid + 1 在数组元素数量大于一个的时候肯定存在，数组只有一个元素时循环终止，不会执行到这里
    if (nums[mid] < nums[mid + 1]) {
      // 更大的在右侧，爬坡
      low = mid + 1
    } else {
      // 更大的在左侧，包含mid
      high = mid
    }
  }

  // 只剩一个元素，就是峰值
  return low
}
```

1.  山峰索引 852

[540. 有序数组中的单一元素](https://leetcode.cn/problems/single-element-in-a-sorted-array/)

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNonDuplicate = function (nums) {
  let low = 0
  let high = nums.length - 1

  // 终止条件是剩一个元素
  while (low < high) {
    let mid = low + Math.floor((high - low) / 2)

    // 提前检查
    if (nums[mid - 1] !== nums[mid] && nums[mid] !== nums[mid + 1]) {
      return nums[mid]
    }

    if (nums[mid - 1] === nums[mid]) {
      mid = mid - 1
    }

    // 如果左边有奇数个元素，说明目标元素在左边
    if ((mid - low) % 2 === 1) {
      high = mid - 1
    } else {
      // 要保证每次循环去除了已检测元素，否则死循环
      low = mid + 2
    }
  }

  return nums[low]
}
```

1.  两个数组的交集，二分查找作为 log n 判定值是否存在的方法应用到其他问题中。

## 应用

需要从题目中寻找出引用二分查找的场景

#### 平方

1. 69 求开方 https://leetcode.cn/problems/sqrtx/
1. [367. 有效的完全平方数](https://leetcode.cn/problems/valid-perfect-square/)

```js
/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function (num) {
  let low = 1
  let high = num

  while (low <= high) {
    const mid = Math.floor((high + low) / 2)

    const square = mid * mid
    if (square === num) {
      return true
    } else if (square < num) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return false
}
```

#### [Pow(x, n)](https://leetcode.cn/problems/powx-n/solution/powx-n-by-leetcode-solution/)

快速幂

```js
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  if (n === 0) {
    return 1
  }
  if (n < 0) {
    return 1 / myPow(x, -n)
  }

  let ans = n % 2 === 1 ? x : 1

  // 平方加速
  const half = myPow(x, Math.floor(n / 2))

  return ans * half * half
}
```

#### [875. 爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/)

```js
/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
var minEatingSpeed = function (piles, h) {
  const max = Math.max(...piles)

  let low = 1
  let high = max

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2)

    let hours = 0
    for (let i = 0; i < piles.length; i++) {
      hours += Math.ceil(piles[i] / mid)
    }
    if (hours <= h) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low
}
```

#### [378. 有序矩阵中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/)

矩阵最小元素`min`位于左上角，最大元素`max`位于右下角。这个范围的中间值是 `mid` ，然后统计矩阵中小于等于中间元素`mid`的个数，对于第`k`小的元素来说，元素个数是大于等于`k`的，也就是说使用条件`count(i) >= k`能够进行二分。

```js
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (matrix, k) {
  const n = matrix.length
  let low = matrix[0][0]
  let high = matrix[n - 1][n - 1]

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2)

    if (lessOrEqualCount(mid) >= k) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low

  function lessOrEqualCount(mid) {
    let count = 0

    for (let row = 0; row <= n - 1; row++) {
      for (let col = 0; col <= n - 1 && matrix[row][col] <= mid; col++) {
        count++
      }
    }

    return count
  }
}
```

上边的`lessOrEqualCount(mid)`对矩阵每一个进行扫描，统计小于等于`mid`的数字个数，只利用了每行都是升序数组，没有利用列元素之间的关系。
同一列中的元素，行数大的元素值较大，因此最后一行中小于等于`mid`的数字最大的下标如果是`i`，那么上一个对应数字下标必然大于等于`i`。因此可以从最后
一行开始统计个数，而且每一个统计的时候都可以从下面一行的下标`i`而不是从`0`开始。

```js
function lessOrEqualCount(mid) {
  let count = 0
  let row = n - 1
  let col = 0

  while (row >= 0) {
    if (matrix[row][col] <= mid) {
      col++
    } else {
      count += col
      row--
    }
  }

  return count
}
```

#### [287. 寻找重复数](https://leetcode.cn/problems/find-the-duplicate-number/)

注意题目的条件，总共有 `n + 1`个数，重复的数只有一个，但是这个重复的数出现的次数可能大于 2。`count(i)`指小于等于`i`的数出现的个数，对于`1`到`n`的数字，`count(i) === i`成立，多了一个重复的数假设是`target`，那么从`target`开始，`count(i) > i`。如果重复次数大于 2，对于`[1, target - 1]`的数字，`count(i)`变小了，`count(i) <= i`成立，对于`[target, n]`，`count(i)`的数字变大，`count(i) > i`仍然成立。

也就是说使用条件`count(i) > i`可以将数组进行二分，左边结果为`false`，右边结果为`true`，目标数字`target`是这个条件的下界。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function (nums) {
  let low = 1
  let high = nums.length - 1

  while (low <= high) {
    const mid = Math.floor((high + low) / 2)

    if (count(mid) > mid) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low

  // 二分的条件是小于等于i的数字的个数 小于或者等于 i，从重复的数开始大于i
  function count(value) {
    return nums.filter((num) => num <= value).length
  }
}
```

#### [658. 找到 K 个最接近的元素](https://leetcode.cn/problems/find-k-closest-elements/)

先找到数组中距离 X 最近的元素下标`closest`，然后由于数组有序性`closet`两侧的元素中某一个是下一个更接近`x`的，重复直到找到`k`个元素。

```js
/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */
var findClosestElements = function (arr, k, x) {
  const closest = findClosestToX(arr, x)
  let start = closest
  let end = closest

  while (end + 1 - start < k) {
    if (start === 0) {
      // start左侧没有元素时可以一步到位
      end = start + k - 1
    } else if (end === arr.length - 1) {
      // end右侧没有元素时可以一步到位
      start = end + 1 - k
    } else if (closerToX(start - 1, end + 1) === start - 1) {
      start--
    } else {
      end++
    }
  }

  return arr.slice(start, end + 1)

  function lowerBound(arr, x) {
    let low = 0
    let high = arr.length - 1

    while (low <= high) {
      const mid = Math.floor((high + low) / 2)

      if (arr[mid] >= x) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }

    return low
  }

  function findClosestToX(arr, x) {
    const lower = lowerBound(arr, x)

    let closest = -1
    if (lower === arr.length) {
      closest = lower - 1
    } else if (arr[lower] === x) {
      closest = lower
    } else if (lower >= 1 && closerToX(lower - 1, lower) === lower - 1) {
      closest = lower - 1
    } else {
      closest = lower
    }

    return closest
  }

  // i < j
  function closerToX(i, j) {
    const left = Math.abs(arr[i] - x)
    const right = Math.abs(arr[j] - x)
    if (left <= right) {
      return i
    }
    return j
  }
}
```

#### [719. 找出第 K 小的数对距离](https://leetcode.cn/problems/find-k-th-smallest-pair-distance)

数组中可能的数对数量是`n * (n - 1) / 2`，暴力寻找第`k`个最小的数对时间复杂度是`O(n^2)`。考虑首先对数组进行排序，数组中最大的数记为`max`，
那么数对距离的取值范围是`[0, max]`。对于距离`d`，数对距离小于等于`d`的个数记为`lessOrEqualDistancePairCount(d)`，考虑`d`从`0`到`max`升序遍历，那么第`k`小的数对距离
就是满足条件`lessOrEqualDistancePairCount(d) >= k`的最小`d`值。使用二分法可以从`[0, max]`中找到这个`d`值。

对于`lessOrEqualDistancePairCount(d)`可以使用动态规划的方法在线性时间内求出，使用`dp[i]`表示数组`[0, i]`内数对距离小于等于`d`的数对个数，`dp[n-1]`就是整个数组中数对距离小于等于`d`的数对个数。

考虑状态转移方程，将`dp[i]`分为两部分，一部分是数组`[0, i - 1]`中数对距离小于等于`d`的个数（`dp[i-1]`），另一部分是元素`nums[i]`和`nums[0] ~ nums[i - 1]`组成的满足条件的数对个数。要数对距离`nums[i] - nums[j] <= d`也就是`nums[j] >= nums[i] - d`，满足条件的`j`的个数等于总的元素个数减去满足相反条件`nums[j] <= nums[i] - d - 1`的元素个数（`i - lessOrEqualCount(nums[i] - d - 1)`）。如果`nums[i] - d - 1 < 0`的话，根据含义可以知道小于或者等于`nums[i] - d - 1`的元素个数为`0`。具体的公式如下。

```js
const max = nums[i] - d - 1
dp[i] = dp[i - 1] + i - (max < 0 ? 0 : lessOrEqualCount[max])
```

`lessOrEqualCount`可以通过对数组首先进行排序，然后进行一次遍历获得。

完整代码如下。

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var smallestDistancePair = function (nums, k) {
  nums.sort((a, b) => a - b)

  const n = nums.length
  const max = nums[n - 1]

  const lessOrEqualCount = new Array(max + 1)

  // j 是整个循环中数组下标，由于双层循环效果是遍历了数组一次，所以双层循环在线性时间完成
  let j = 0
  // 每个距离一层外循环
  for (let distance = 0; distance <= max; distance++) {
    // 内层循环中每次停止在刚好大于距离distance的位置，或者数组末尾，
    // 如果内层循环j每次从0开始，计算的结果是一样的，但是因为存在重复计算，会造成双层循环时间复杂度变为O(n^2)
    while (nums[j] <= distance && j < n) {
      j++
    }
    lessOrEqualCount[distance] = j
  }

  let low = 0
  let high = max

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    if (lessOrEqualDistancePairCount(mid) >= k) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low

  function lessOrEqualDistancePairCount(distance) {
    const dp = new Array(n)
    dp[0] = 0
    for (let i = 1; i < n; i++) {
      const biggest = nums[i] - distance - 1
      dp[i] = dp[i - 1] + i - (biggest < 0 ? 0 : lessOrEqualCount[biggest])
    }
    return dp[dp.length - 1]
  }
}
```

#### [4 Median of two sorted array](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

最简单的方法是将两个有序数组合并，然后寻找中位数，这个方法的时间复杂度是`O(m + n)`，空间复杂度也是`O(m + n)`，需要一个新的数组长度为`m+n`的数组。不使用新的数组，直接从原数组上寻找中位数，将空间复杂度降低为常数，时间复杂度仍然是`O(m+n)`。

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const m = nums1.length
  const n = nums2.length

  const halfCount = Math.ceil((m + n) / 2)

  let i = 0
  let j = 0

  function getValue(nums, i) {
    return i >= nums.length ? Number.MAX_SAFE_INTEGER : nums[i]
  }

  let last = null
  while (i < m || j < n) {
    if (i + j === halfCount) {
      break
    }

    const first = getValue(nums1, i)
    const second = getValue(nums2, j)

    if (first <= second) {
      last = first
      i++
    } else {
      last = second
      j++
    }
  }

  const next = Math.min(getValue(nums1, i), getValue(nums2, j))
  const odd = (m + n) % 2 === 1

  return odd ? mid : (mid + next) / 2
}
```

顺序的寻找下一个元素的过程可以利用数组有序性优化，假设`nums1[i] < nums2[j]`，接下来可以在数组`nums1[i+1, nums1.length]`中使用二分查找找到比`nums2[j]`小的最大的数，数列`nums1[i, ...] < nums2[j]`构成了升序数组，然后判定当前元素个数是否超过了一半，包含了中位数。

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const total = nums1.length + nums2.length
  const mid = Math.ceil((nums1.length + nums2.length) / 2) - 1

  if (total % 2 === 1) {
    return findKthElement(nums1, nums2, mid)
  }

  return (
    (findKthElement(nums1, nums2, mid) +
      findKthElement(nums1, nums2, mid + 1)) /
    2
  )

  function findKthElement(nums1, nums2, index) {
    let largerIndex = 0
    let smallerIndex = 0
    let largerArray = nums1[0] >= nums2[0] ? nums1 : nums2
    let smallerArray = nums1[0] >= nums2[0] ? nums2 : nums1

    while (true) {
      if (largerIndex >= largerArray.length) {
        return smallerArray[index - largerIndex]
      }
      if (smallerIndex >= smallerArray.length) {
        return largerArray[index - smallerArray]
      }

      const upper = upperBound(smallerArray, largerArray[largerIndex])
      if (largerIndex + upper >= index + 1) {
        return smallerArray[index - largerIndex]
      }

      smallerIndex = upper
      ;[largerIndex, smallerIndex] = [smallerIndex, largerIndex]
      ;[largerArray, smallerArray] = [smallerArray, largerArray]
    }

    function upperBound(array, target) {
      let low = 0
      let high = array.length

      while (low < high) {
        const mid = low + Math.floor((high - low) / 2)

        if (array[mid] > target) {
          high = mid
        } else {
          low = mid + 1
        }
      }

      return low
    }
  }
}
```

考虑中位数将数组拆分为数量相等的两半，假设下标`i`对应数组`nums1`，`j`对应数组`nums2`，分别将数组划分为两半，如果满足`nums1[i - 1] <= nums2[j] && nums2[j - 1] <= nums1[i]`，那么`nums1`和`nums2`的左半边合起来就是整个数组的左半边，元素个数是`i + j = Math.ceil((m + n)/2)`。其中`i`的取值范围是`[0, m]`，开区间的写法，可以对`i`在这个范围内进行二分查找，`j = Math.ceil((m + n)/2) - i`。

```txt
nums1: 0 ... i - 1, i ... m
nums2: 0 ... j - 1, j ... n
```

假设将两个数组正确拆分为左右两半的`i`值记为`i0`，那么`nums1[i0 - 1] <= nums2[j0] && nums2[j0 - 1] <= nums1[i0]`成立。当`i`减一为`i0-1`是，对应`j0+1`，所以`nums1[i0 - 1 - 1] <= nums[j0 + 1]`也成立。也就是说`i`的取值范围`[0, m]`可以被条件`nums1[i-1] <= nums2[j]`二分，一半成立，一半不成立。这种情况下左半边的最后一个元素对应的`i`取值就是一种求得中位数的情况。

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const m = nums1.length
  const n = nums2.length

  if (m > n) {
    return findMedianSortedArrays(nums2, nums1)
  }

  let low = 0
  let high = m

  while (low <= high) {
    const i = Math.floor((low + high) / 2)

    const { num_i_1, num_j } = getNumbers(nums1, nums2, i)

    // 将数组划分为 false ... false true ... true 两半的条件
    // 这里的写法对应前边false，后边true的情况，所以将 num_i_1 <= num_j 进行反转
    if (num_i_1 > num_j) {
      high = i - 1
    } else {
      low = i + 1
    }
  }

  // 循环结束后，high的值就是前半段false数组的最后一个元素
  const { num_i_1, num_j_1, num_i, num_j } = getNumbers(nums1, nums2, high)
  const median1 = Math.max(num_i_1, num_j_1)
  const median2 = Math.min(num_i, num_j)

  const odd = (m + n) % 2 === 1
  return odd ? median1 : (median1 + median2) / 2

  function getValueOrDefault(value, fallback) {
    return value === undefined ? fallback : value
  }

  function getNumbers(nums1, nums2, i) {
    const halfCount = Math.ceil((nums1.length + nums2.length) / 2)
    const j = halfCount - i
    const num_i_1 = getValueOrDefault(nums1[i - 1], Number.MIN_SAFE_INTEGER)
    const num_j_1 = getValueOrDefault(nums2[j - 1], Number.MIN_SAFE_INTEGER)
    const num_i = getValueOrDefault(nums1[i], Number.MAX_SAFE_INTEGER)
    const num_j = getValueOrDefault(nums2[j], Number.MAX_SAFE_INTEGER)

    return {
      num_i,
      num_i_1,
      num_j,
      num_j_1,
    }
  }
}
```

注意如果数组中存在重复的元素，那么可能存在多个`i`值使得中位数二分条件成立，上面方法中求的结果是其中最大的。

#### [315. 计算右侧小于当前元素的个数](https://leetcode.cn/problems/count-of-smaller-numbers-after-self/)

使用二分查找维护右侧的有序数组，但不是最优解。

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var countSmaller = function (nums) {
  const counts = new Array(nums.length)

  counts[counts.length - 1] = 0
  const rightArray = []

  for (let i = nums.length - 1; i >= 1; i--) {
    const upper = upperBound(rightArray, nums[i])

    rightArray.splice(upper, 0, nums[i])

    counts[i - 1] = lowerBound(rightArray, nums[i - 1])
  }

  return counts

  function upperBound(array, target) {
    let low = 0
    let high = array.length

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2)

      if (array[mid] > target) {
        high = mid
      } else {
        low = mid + 1
      }
    }

    return low
  }

  function lowerBound(array, target) {
    let low = 0
    let high = array.length

    while (low < high) {
      const mid = low + Math.floor((high - low) / 2)

      if (array[mid] >= target) {
        high = mid
      } else {
        low = mid + 1
      }
    }

    return low
  }
}
```

#### [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

思路是子序列必须以元素 i 结尾，考虑 dp[i]和 dp[0~i-1]之间的关系 dp[i] = max(dp[0 ~ i-1]) + 1。

最终的答案是 dp 中最大的。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  // 以每个下标元素结尾的最长子序列
  const counts = new Array(nums.length).fill(1)

  for (let i = 1; i < nums.length; i++) {
    // 这个循环中存在优化的空间
    for (let j = i - 1; j >= 0; j--) {
      if (nums[j] < nums[i]) {
        counts[i] = Math.max(counts[j] + 1, counts[i])
      }
    }
  }

  return Math.max(...counts)
}
```

第一种解法的内层循环中，要遍历之前所有结果找到最大值。要想递增子序列最长，那么同样长的递增子序列末尾元素应该尽可能小。使用数组 `dp` 记录这个信息，下标 `j` 的元素表示长度为 `j` 的子序列的末尾元素最小值，`dp` 的最大下标也就是当前最长子序列长度`len`。

碰到新元素时需要对应更新 `dp`，有两种情况。新元素的值`nums[i] > dp[len]`，形成了更长的子序列，因此`dp[++len] = nums[i]`，数组长度`len`增长，而且新子序列末尾元素就是`nums[i]`。如果`nums[i] <= dp[len]`，无法形成更长的子序列，但是将`dp`数组以`nums[i]`划分为左右两半，左侧`dp[j] < nums[i]`，这样`dp[j]`和`nums[i]`可以形成严格单调递增序列。右侧`dp[j]`如果大于`nums[i]`，则可以将`dp[j]`更新为`nums[i]`记录更小的末尾元素。数组`dp`根据其含义可以判断出整个数组是有序的，所有可以使用二分查找的方式来找出`dp`中`nums[i]`的下界，更新`dp`中大于等于`nums[i]`的第一个元素为`nums[i]`。注意不能使用上界，因为子序列**严格单调递增**。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  // 以每个下标元素结尾的最长子序列
  const dp = new Array(nums.length + 1)
  dp[1] = nums[0]
  let len = 1

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > dp[len]) {
      len++
      dp[len] = nums[i]
    } else {
      let low = 1
      let high = len

      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2)

        // 这里需要使用下界，也就是nums[i] === dp[low] 要严格大于dp[low - 1]，这样才符合严格递增
        if (dp[mid] >= nums[i]) {
          high = mid - 1
        } else {
          low = mid + 1
        }
      }

      dp[low] = nums[i]
    }
  }

  return len
}
```

#### [410. 分割数组的最大值](https://leetcode.cn/problems/split-array-largest-sum/)

本题可以使用动态规划解决，时间复杂度为`O(m * n ^ 2)`，也可以使用二分查找加贪心算法。连续子数组和最大值的取值范围`[max, sum]`，最小是子数组为单个元素，其最大值为整个数组的最大值，最大不超过整个数组的和。对这个范围进行二分查找，可以找到最小的值`r`，满足将数组划分为`m`个连续子数组，其中子数组和最大值不超过`r`。对于单个的`r`来说，这个判断可以在线性时间内完成。使用贪心算法将数组分割为子数组，使子数组的和尽量大，但是不能超过`r`，这样划分的子数组个数最少，算法中`canSplitArray`代表了这个过程。

```js
/**
 * @param {number[]} nums
 * @param {number} m
 * @return {number}
 */
var splitArray = function (nums, m) {
  const max = Math.max(...nums)
  const sum = nums.reduce((sum, val) => sum + val, 0)

  let low = max
  let high = sum

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)

    if (canSplitArray(nums, mid, m)) {
      high = mid - 1
    } else {
      low = mid + 1
    }
  }

  return low
}
```

这里来仔细探讨下`canSplitArray`的实现，首先需要使用变量`sum`记录当前子数组的和，初始值为`0`，`count`记录使用的子数组个数，初始值为`0`。
在数组元素遍历的过程中，如果元素`nums[i]`使得子数组和小于等于`max`，应该正常更新`sum`，并且移动到下一个元素；否则子数组应该在此处拆分，此时子数组个数加一，而且`sum`重置为`0`，而且元素不要移动到下一个。另外如果有单个元素值大于最大值（`nums[i] > max`），直接返回`false`。

但是这里有个容易出错的地方，在循环结束`i === nums.length`的时候，`sum`中仍然记录着最后一个子数组的和，但是这个子数组没有执行对应的`count++`，因此得到的`count`错误，需要在循环结束后再多执行一次`count++`。

```js
function canSplitArray(nums, max, m) {
  let sum = 0
  let count = 0
  for (let i = 0; i < nums.length; ) {
    // 单个元素大于max
    if (nums[i] > max) {
      return false
    }

    if (sum + nums[i] <= max) {
      sum += nums[i]
      i++
    } else {
      count++
      sum = 0
    }
  }
  // 多执行一次
  count++

  return count <= m
}
```

但是上面这个写法还是有问题，在数组`nums`为空情况下，`count++`又多执行了一次，需要添加额外的条件检查。

```js
if (sum > 0) {
  count++
}
```

这里条件`sum`的含义实际上是说子数组至少包含了一个元素，才需要`count++`。将上述代码整理成更加统一的形式。

```js
function canSplitArray(nums, max, m) {
  let sum = 0
  let count = 0
  for (let i = 0; i <= nums.length; ) {
    // 单个元素大于max
    if (nums[i] > max) {
      return false
    }

    if (i === nums.length) {
      if (sum > 0) {
        count++
      }
      break
    }

    if (sum + nums[i] <= max) {
      sum += nums[i]
      i++
    } else {
      count++
      sum = 0
    }
  }

  return count <= m
}
```

对数组下标进行遍历`[0, nums.length]`，注意包括最后一个元素之后的位置。每个循环的含义是对`sum`代表的已经处理过的子数组进行判断，如果`sum + nums[i] <= max`，那么新元素可以继续添加到子数组中，否则形成新数组。但是对下标`nums.length`的单独处理让人感觉很不爽，而且`count++`的代码也重复了，能否将`nums.length`和其他下标的处理合并到一起？

仔细考虑下为什么这个遍历逻辑导致了下标`nums.length`要单独处理，因为对于`nums[i]`的处理真正的含义是使用`i`元素来判断其之前的元素是否形成单独的子数组，我们需要一个相邻元素对`(i - 1, i)`才能正确完成判断，因此最后一个元素的元素对`(nums.length - 1, nums.length)`也需要考虑进来。再看上面的代码，为什么`if (sum > 0)`的逻辑判断只在下标`nums.length`才需要？原因在于执行到普通元素逻辑`count++`时`sum > 0`肯定成立，因为`sum + nums[i] > max`成立才能执行到`count++`的逻辑，而在上一轮循环`sum + nums[i] <= max`成立时`sum`进行了更新`sum += nums[i]`。

如果我们将使用相邻元素对`(i - 1, i)`的判断逻辑修改为只需要元素`i - 1`的判断逻辑，那么就不用考虑下标`nums.length`了。使用`count`的初始值为`1`，含义是在开启一个新分组时，`count`的值就已经包含了该分组，不需要等待下一个元素来判断。这么做同时隐含一个前提，即数组至少有一个元素，`count`才能使用`1`作为初始值，对于空数组的情况直接返回`true`。

```js
function canSplitArray(nums, max, m) {
  if (nums.length === 0) {
    return true
  }

  let sum = 0
  let count = 1
  for (let i = 0; i <= nums.length; ) {
    // 单个元素大于max
    if (nums[i] > max) {
      return false
    }

    if (sum + nums[i] <= max) {
      sum += nums[i]
      i++
    } else {
      count++
      sum = 0
    }
  }

  return count <= m
}
```

上述写法中可以继续进行优化，考虑`i++`在`if/else`分支中不对称出现的情况，`else`分支执行时`i`不发生变化，下一轮循环会调到`if`分支执行，考虑将下一轮循环的`if`分支中的逻辑提前到当前循环的`else`分支，`sum`直接更新为`nums[i]`，同时`i++`可以放到`for`语句中上。

```js
function canSplitArray(nums, max, m) {
  if (nums.length === 0) {
    return true
  }

  let sum = 0
  let count = 1
  // 注意这里的条件是 <
  for (let i = 0; i < nums.length; i++) {
    // 单个元素大于max
    if (nums[i] > max) {
      return false
    }

    if (sum + nums[i] <= max) {
      sum += nums[i]
    } else {
      count++
      sum = nums[i]
    }
  }

  return count <= m
}
```

最后还有一个可以优化的逻辑，`return count <= m`代表的含义是循环结束后，如果子数组个数小于等于`m`，表示可以使用最多`m`个子数组保证子数组和的最大值小于`max`。如果数组很长的时候，没有必要遍历到数组末尾，在循环中就可以检查`count`和`m`的关系，在`count`大于`m`的时候提前结束。

```js
function canSplitArray(nums, max, m) {
  if (nums.length === 0) {
    return true
  }

  let sum = 0
  let count = 1
  // 注意这里的条件是 <
  for (let i = 0; i < nums.length; i++) {
    // 单个元素大于max
    if (nums[i] > max) {
      return false
    }

    if (sum + nums[i] <= max) {
      sum += nums[i]
    } else {
      count++
      // 提前返回
      if (count > m) {
        return false
      }
      sum = nums[i]
    }
  }

  return true
}
```

#### [354. 俄罗斯套娃信封问题](https://leetcode.cn/problems/russian-doll-envelopes/)

最长子序列的二维拓展问题

## 参考

1. [花花酱 LeetCode 1760. Minimum Limit of Balls in a Bag - 刷题找工作 EP384](https://www.youtube.com/watch?v=yEHgt1UZo7A&list=PLLuMmzMTgVK74vqU7Ukaf70a382dzF3Uo&index=1)
1. [LeetBook 二分查找](https://leetcode.cn/leetbook/detail/binary-search/)
