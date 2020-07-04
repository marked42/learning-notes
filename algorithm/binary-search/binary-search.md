# 二分查找

## 有序数组

使用二分法查找给定值`v`在有序数组中的排名（rank），排名为`k`意味着数组中正好有`k`个值小于`v`。数组重元素不重复。

### 思路1

定义函数`rank(array, value, low, high)`查找值`value`在数组`array`的子数组`[low, high]`范围内的排名。

递归条件

1. 计算数组的下中为数`mid = low + (high - low) / 2`对应的元素`midValue`
1. 如果`value`等于`midValue`递归终止，数组中小于`value`的元素是`[low, mid -1]`，共`mid - low`个。
1. 如果`value`小于`midValue`，数组`[low, high]`中小于`value`的元素个数等于数组`[low, mid - 1]`中小于`value`的元素个数，即子问题`rank(array, value, low, mid - 1)`。
1. 如果`value`大于`midValue`，数组`[low, high]`中小于`value`的元素个数等于`[low, mid]`和`[mid + 1, high]`两部分之和，前一部分共`mid + 1 - low`个元素，后一部分是子问题`rank(array, value, mid + 1, high)`。
1. 递归还有另外一个终止条件`low > high`此时`rank(array, value, low, high) == 0`。

实现如下：

```java
class BinarySearchArray<Value extends Comparable<Value>> {
    private Value[] values;

    private int rank(Value value, int low, int high) {
        if (high < low) { return 0; }

        int mid = (low + high) / 2;
        int cmp = value.compareTo(values[mid]);

        if (cmp < 0) {
            return rank(key, low, mid - 1);
        } else if (cmp > 0) {
            return mid + 1 - low + rank(key, mid + 1, high);
        } else {
            return mid - low;
        }
    }

    /**
     * 改造成循环形式，rank记录已解决的子问题积累的比value小的元素的个数，分解成的新的子问题[mid + 1, high]时rank
     * 的值增加 mid + 1 - low，循环结束时rank值即为数组中小于value的元素个数。
     */
    private int rankLoop(Key key, int low, int high) {
       int rank = 0;

        int mid = (low + high) / 2;
        int cmp = key.compareTo(keys[mid]);

        while (low <= high) {
            if (cmp < 0) {
                high = mid - 1;
            } else if (cmp > 0) {
                rank += mid + 1 - low;
                low = mid - 1;
            } else {
                return rank + mid - low;
            }
        }

        return rank;
    }
}
```

### 思路2

直接定义函数`rank(array, value, low, high)`代表这个数组`[0, length - 1]`内小于`value`的元素个数，同样采用二分法分析。

1. 初始问题是`rank(array, value, 0, length - 1)`，同样计算下中位数`midValue`，其下标是`mid = (low + high) / 2`。
1. 如果`value`等于`midValue`问题解决，小于`value`的元素是`[0, mid - 1]`共`mid`个。
1. 如果`value`小于`midValue`，`value`应该位于`[low, mid - 1]`范围内，转换为求解子问题`rank(array, value, low, mid - 1)`。
1. 如果`value`大于`midValue`，`value`应该位于`[mid + 1, high]`范围内，转换为求解子问题`rank(array, value, mid + 1, high)`。
1. 数组中存在元素等于`value`是一种递归结束情况，不存在时二分法最终会导致`low > high`从而结束递归，而这种情况都是从`low == high`的子问题转化而来，此时`mid == low == high`。
  1. `value`等于`midValue`，这是已经分析过的递归结束情况
  1. `value`小于`midValue`，`high`更新为`mid - 1 == low - 1`，此时数组中小于`value`的元素是`[0, mid - 1]`个数为`mid == low`。
  1. `value`大于`midValue`，`low`更新为`mid + 1`，此时数组中小于`value`的元素是`[0, mid]`个数为`mid + 1 == low`。
  1. 以上两种情况递归结束时，小于`value`的元素的个数都等于`low`的值。

实现如下：

```java
class BinarySearchArray<Value extends Comparable<Value>> {
    private Value[] values;

      private int rank0(Value value, int low, int high) {
        // 递归终止情况2
        if (high < low) { return low; }

        int mid = low + (high - low) / 2;
        int cmp = value.compareTo(values[mid]);

        if (cmp < 0) {
            return rank(value, low, mid - 1);
        } else if (cmp > 0) {
            return rank(value, low + 1, high);
        } else {
            // 递归终止情况1
            return low;
        }
    }

    /**
     * 循环形式
     */
    private int rank0Loop(Value value) {
        int low = 0;
        int high = size - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            int cmp = value.compareTo(values[mid]);

            if (cmp < 0) {
                high = mid - 1;
            } else if (cmp > 0) {
                low = mid + 1;
            } else {
                // 递归终止情况1
                return mid;
            }
        }

        // 递归终止情况2
        return low;
    }
}
```

### 扩展

1. 数组中存在重复元素
1. 求数组中小于、小于等于、等于、大于、大于等于`value`的元素的个数。
1. 利用`rank`操作实现`floor(value)`返回数组中刚刚小于等于`value`的元素的值和`ceil(value)`返回数组中刚刚大于等于`value`的元素的值。
1. 实现`size(lowValue, highValue)`返回数组中在`[lowValue, highValue]`范围内的元素值。
1. `rank`的相反操作`select(k)`返回排名为`k`的元素的值。
