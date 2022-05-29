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

就是 upper_bound

### [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

查找元素范围

## 旋转数组

### 构建旋转数组

189

如何找到旋转数组的旋转点下标，如果全部元素相同或者完全升序的话返回下标 0。

### 旋转数组中的最小值

[153 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/) 数组中不存在重复元素。

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

官方的解法要简洁许多，来分析下为什么可以这样写。首先循环结束的条件还是只剩一个元素，同样使用左闭右闭区间，但是使用了`low < high`的条件，将显式的返回结束循环修改为了条件结束循环，所以在循环外需要`return nums[low]`。另外循环内部使用了`high`而不是`low`去和`mid`做比较，在数组有两个以上元素时`low/mid/high`三者都不相同，这两种做法没有区别。但是在数组只有两个元素时`low === mid === high - 1`，使用`high`与`mid`不相等，因此减少了`nums[high] === nums[mid]`的情况分支判断。

```js
var findMin = function (nums) {
  let low = 0
  let high = nums.length - 1
  while (low < high) {
    const pivot = low + Math.floor((high - low) / 2)
    if (nums[pivot] < nums[high]) {
      high = pivot
    } else {
      low = pivot + 1
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

1. 69 求开方 https://leetcode.cn/problems/sqrtx/

1. 875 koko banana
1. 378 https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/submissions/

1. 544 寻找条件将数组二分转换
1. 744

#### [4 Median of two sorted array](https://leetcode.cn/problems/median-of-two-sorted-arrays/)

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

#### [315. 计算右侧小于当前元素的个数](https://leetcode.cn/problems/count-of-smaller-numbers-after-self/)

使用二分查找维护右侧的有序数组，但不是最优解。(TODO:)

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

#### [354. 俄罗斯套娃信封问题](https://leetcode.cn/problems/russian-doll-envelopes/)

最长子序列的二维拓展问题

## 参考

1. [花花酱 LeetCode 1760. Minimum Limit of Balls in a Bag - 刷题找工作 EP384](https://www.youtube.com/watch?v=yEHgt1UZo7A&list=PLLuMmzMTgVK74vqU7Ukaf70a382dzF3Uo&index=1)
1. [LeetBook 二分查找](https://leetcode.cn/leetbook/detail/binary-search/)
