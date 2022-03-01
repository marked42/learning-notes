# 二分查找

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
    let low = 0;
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
    let low = 0;
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

1. 递归版本

1. John Bentley的经典书里有大概第4章，第9章进行了讨论 编程珠玑
When Jon Bentley assigned binary search as a problem in a course for professional programmers, he found that ninety percent failed to provide a correct solution after several hours of working on it, mainly because the incorrect implementations failed to run or returned a wrong answer in rare edge cases.
1. Knuth
Although the basic idea of binary search is comparatively straightforward, the details can be surprisingly tricky...
1. 代码之美有两章涉及
1. https://www.quora.com/What-is-the-simplification-of-Although-the-basic-idea-of-binary-search-is-comparatively-straightforward-the-details-can-be-surprisingly-tricky
1.http://pvk.ca/Blog/2012/07/30/binary-search-is-a-pathological-case-for-caches/

1. 35 插入位置
1. 34 求上下边界 equal_range
1. 69求开方
1. 744,
1. 典型应用 第一个错误的版本 278
1. 544 寻找条件将数组二分转换
1. 33 搜索旋转排序数组 81 153 寻找旋转排序数组中的最小值 154 允许数组出现重复元素
1. 寻找峰值 162
1. 山峰索引 852

1. 两个数组的交集，二分查找作为log n判定值是否存在的方法应用到其他问题中。
