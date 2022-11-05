# 二叉树（Binary Tree）

## 定义

二叉树的定义如下：

1. 二叉树中的节点最多有两个子节点，左子节点和右子节点。
1. 二叉树左子树和右子树也都是二叉树
1. 允许二叉树是空

这个定义是递归的，下面的二叉树定义中每个节点包含一个数字类型的值。

```ts
// 二叉树的定义
interface Node {
  value: number
  left?: Node
  right?: Node
}
```

二叉树的几种情况

1. 满二叉树（Full Binary Tree）中每个节点有 0 或者 2 个子节点
1. 完全二叉树（Complete Binary Tree）是只有最低层的节点不满，且最低层节点尽可能靠左。这种二叉树能够用数组表示，二叉堆使用的就是完全二叉树。
1. 完美二叉树（Perfect Binary Tree）所有叶节点都在最底层，高度相同。
1. 平衡二叉树（Balanced Binary Tree）中左右子树高度之差最多为 1。
1. 病态二叉树（degenerate or pathological）指每个节点只有一个子节点，二叉树退化成了链表。

### 平衡二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
  function height(root) {
    if (!root) {
      return 0
    }

    const left = height(root.left)
    const right = height(root.right)

    if (left === -1 || right === -1) {
      return -1
    }

    return Math.abs(left - right) <= 1 ? Math.max(left, right) + 1 : -1
  }

  return height(root) !== -1
}
```

### 相同性

判断两颗树是否相同。

```java
public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) { return true; }
    if (p == null || q == null) { return false; }

    return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

### 对称性

判断一个树是否对称。

```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) { return true; }

        return isMirror(root.left, root.right);
    }

    public boolean isMirror(TreeNode left, TreeNode right) {
        if (left == null && right == null) { return true; }
        if (left == null || right == null) { return false; }

        return left.val == right.val && isMirror(left.left, right.right)
            && isMirror(left.right, right.left);
    }
}
```

### 树的最大最小深度

1. 递归和层序遍历解法 注意最大最小深度的递归解法条件不同

### 高度平衡

深度，高度概念。

### 树深度与平衡

depth of leaf nodes all, min depth/max depth/ maxDepth,minDepth 最多差 1 称为平衡
104，111, , 559

左右子树的高度之差最多为 1 称之为高度平衡，高度平衡的树要求每个子树也是高度平衡，判断一个树是否高度平衡（Leetcode 110）。

常规的的递归解法先定义求解树高度的函数`maxHeight`，然后按照高度平衡定义递归求解`isBalanced`。

```java
public boolean isBalanced(TreeNode root) {
    if (root == null) { return true; }

    return Math.abs(maxHeight(root.left) - maxHeight(root.right)) <= 1
        && isBalanced(root.left) && isBalanced(root.right);
}

public int maxHeight(TreeNode node) {
    if (node == null) { return 0; }

    return Math.max(maxHeight(node.left), maxHeight(node.right)) + 1;
}
```

另外一个思路是将平衡的判断**混入**到求树高度的递归逻辑中，树的高度取值范围是$[0, \infty)$，所以在树不平衡时不妨选取一个负数-1 来表示。如果树是高度平衡的，那么计算得到的是树的高度，反之是-1。

```java
public final int unbalanced = -1;

public boolean isBalanced(TreeNode root) {
    return maxDepth(root) != unbalanced;
}

public int maxDepth(TreeNode root) {
    if (root == null) { return 0; }

    // 递归情况： 任一子树不平衡则当前树也不平衡
    int left = maxDepth(root.left);
    if (left == unbalanced) { return unbalanced; }

    int right = maxDepth(root.right);
    if (right == unbalanced) { return unbalanced; }

    // 递归终结情况： 树不平衡
    if (Math.abs(left - right) > 1) { return unbalanced; }

    // 递归情况： 平衡树高度计算
    return 1 + Math.max(left, right);
}
```

## 深度遍历

对树的节点进行**深度优先遍历（Depth First Search）**，根据遍历顺序的不同，常见的有三种方式，

1. 中序遍历（inorder traversal）：左子树 -> 根结点 -> 右子树
1. 前序遍历（preorder traversal）：根结点 -> 左子树 -> 右子树
1. 后序遍历（postorder traversal）：左子树 -> 右子树 -> 根结点

上述三种方式是根据根节点位于中间、前边、后边来定义的，但是**左子树**都是在**右子树**前边。左中右三个部分顺序的排列方式总共有六种，另外还有三种情况是右子树位于左子树前边的形式，可以称为**逆序**。

1. 逆中序遍历（reverse inorder traversal）：右子树 -> 根结点 -> 左子树
1. 逆前序遍历（reverse preorder traversal）：右子树 -> 左子树 -> 根结点
1. 逆后序遍历（reverse postorder traversal）：根结点 -> 右子树 -> 左子树

顺序与对应的逆序排列出来的节点顺序整体是**互逆**的，其中中序遍历的节点顺序是全局升序的（节点从小到大），逆中序遍历的节点顺序是全局降序的（节点从小到大）。

其中**前序**和**逆后序**在定义上根节点在其左右子节点之前，所以是[拓扑排序](https://en.wikipedia.org/wiki/Topological_sorting)。参考有向图中求拓扑排序的方式就是使用逆后续排序。

#### 递归实现

使用递归实现不同的节点遍历顺序很简单，只需要按照顺序定义调整左子树、根节点、右子树调用顺序即可。

```java
class BinaryTree {
    private static void inorderTraversal(Node node) {
        if (node == null) { return; }

        inorderTraversal(node.left);
        System.out.println(node);
        inorderTraversal(node.right);
    }

    private static void reverseInorderTraversal(Node node) {
        if (node == null) { return; }

        inorderTraversal(node.right);
        System.out.println(node);
        inorderTraversal(node.left);
    }

    private static void preOrderTraversal(Node node) {
        if (node == null) { return; }

        System.out.println(node);
        preOrderTraversal(node.left);
        preOrderTraversal(node.right);
    }

    private static void reversePreOrderTraversal(Node node) {
        if (node == null) { return; }

        preOrderTraversal(node.right);
        preOrderTraversal(node.left);
        System.out.println(node);
    }

    private static void postOrderTraversal(Node node) {
        if (node == null) { return; }

        postOrderTraversal(node.left);
        postOrderTraversal(node.right);
        System.out.println(node);
    }

    private static void reversePostOrderTraversal(Node node) {
        if (node == null) { return; }

        System.out.println(node);
        postOrderTraversal(node.right);
        postOrderTraversal(node.left);
    }
}
```

递归实现中每个节点对应一次递归函数调用，所以时间复杂度是$O(N)$，空间复杂度是$O(H)$，$H$是树的深度对应递归栈的最大深度，最坏的情况下树退化成链表的情况下$H = N$，最坏空间复杂度是$O(N)$。

#### 栈实现

中序遍历 LeetCode 94
前序遍历 LeetCode 144
后续遍历 LeetCode 145

对于上述的六种深度优先遍历的情况，还可以显式的使用栈来实现。因为深度遍历的过程是从上到下（根节点到叶节点），先遇到的节点后进行处理，正好需要**先进后出**的数据结构。每种顺序的具体实现代码稍有不同，由于左右对称总共六种情况对三种模式。

| 模式   | 顺序                                             | 说明         | 复杂程度 |
| ------ | ------------------------------------------------ | ------------ | -------- |
| 模式 1 | 前序（中 -> 左 -> 右）、逆后续（中 -> 右 -> 左） | 根节点在前边 | 最简单   |
| 模式 2 | 中序（左 -> 中 -> 右）、逆中序（右 -> 中 -> 左） | 根节点在中间 | 居中     |
| 模式 3 | 后续（左 -> 右 -> 中）、逆前序（右 -> 左 -> 中） | 根节点在后边 | 最复杂   |

利用显式栈来实现不同的遍历顺序的时候只需要实现三种正序即可，因为另外三种逆序正好对应相反的顺序。前序和逆前序顺序相反，所以计算较为简单的前序即可，逆序后得到相对复杂的逆前序的顺序。逆后续和后续这一对也是这样，中序和逆中序的根节点都在中间，复杂程度一样的。

遍历顺序中，**根节点越靠前的情况越简单**，这是由于树的数据结构造成了总是先碰到根节点，然后才能根据根节点获得其左右子节点。每种模式中的两种顺序的处理方法是一样的，只不过是左右子节点的顺序相反，代码实现中交换左右子节点的角色进行处理即可。

根节点在最前边的情况最简单（模式 1）是因为深度优先遍历时总是先碰到根节点，正好顺序是和要求的顺序是一致的，这样直接将碰到的根节点添加到结果队列即可。前序遍历的情况左子节点在右子节点前边，所以应该将右子节点先入栈，左子节点后入栈，这样待会出栈的时候左子节点才会先出栈，和前序遍历要求的顺序相同。逆后续的情况顺序与前序顺序左右翻转即可。

注意这里不要误认为使用队列也可以完成排序，就同一层级的左右子节点来说在前序顺序下可以将左右子节点按顺序先进先出，但是左子节点的更下层节点也应该在右子节点前边，使用队列的话右子节点会排在左子节点的下层节点之前出队。**深度优先遍历**的顺序决定了不能使用队列。

```ts
interface Node {
  value: number
  children: Node[]
}

function logValue(node: Node) {
  console.log('visiting: ', node.value)
}

function dfs(node: Node, cb: (node: Node) => void) {
  cb(node)
  for (let i = 0; i <= node.children.length; i++) {
    dfs(node.children[i], cb)
  }
}

const node = {
  value: 1,
  children: [
    {
      value: 2,
      children: [],
    },
    {
      value: 3,
      children: [],
    },
  ],
}

// dfs(node, logValue)

function dfsLoop(root: Node, cb: (node: Node) => void) {
  const stack = [{ node: root, index: 0 }]

  // 深度优先 先序遍历
  console.log('enter: ', root)
  cb(root)

  while (stack.length > 0) {
    const top = stack[stack.length - 1]
    const { node, index } = top

    if (index <= node.children.length - 1) {
      const child = node.children[index]
      top.index++
      console.log('enter: ', child)
      stack.push({ node: child, index: 0 })
    } else {
      stack.pop()
      // 深度优先 后序遍历
      console.log('exit: ', top.node)
    }
  }
}

dfsLoop(node, logValue)
```

```java
public static List<Integer> preOrderTraversalIteratively(TreeNode root) {
    if (root == null) { return null; }

    Stack<TreeNode> stack = new Stack<>();
    stack.add(root);

    List<Integer> result = new ArrayList<>();

    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.add(node.val);

        if (node.right != null) {
            stack.add(node.right);
        }

        if (node.left != null) {
            stack.add(node.left);
        }
    }

    return result;
}
```

模式 2（根节点在中间的情况）比模式 1（根节点在最前边）要稍微复杂，因为遍历先碰到根节点时不能立即进行处理，因为如果有左子节点的话左子节点要在根节点前边，因此要先把该根节点入栈，待左子节点完全处理完成，才能开始处理栈中的根节点。

使用一个栈保存遍历过程中从根节点到下一目标节点`next`经过的路径，如果目标节点存在则将节点入栈并将`next`指向左子节点开始下一轮循环；如果目标节点不存在，意味着栈顶元素就是最左节点了，出栈并加入结果队列，然后更新`next`指向栈顶元素节点的右子节点继续下一轮循环。`next`在循环中总是指向下一个要入栈的元素，循环终止的条件是没有下一个要入栈的元素而且栈为空。

```java
public List<Integer> inorderTraversalIteratively(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Stack<TreeNode> stack = new Stack<>();
    TreeNode next = root;

    // 用目标元素和栈控制循环终止
    while (next != null || !stack.isEmpty()) {
        // 沿着左子节点深度遍历全部入栈，因为中序遍历是深度递归，且左子节点在最前面处理
        while (next != null) {
            stack.add(next);
            next = next.left;
        }

        // 此时栈顶元素既是最深的左子节点，同时又是没有左子节点的根节点
        TreeNode top = stack.pop();

        // 存在左子节点的情况已经入栈完毕，接下来该处理根节点了，此时将根节点加入结果队列
        result.add(top.val);

        // 这里分为两种情况
        // 1. 右子节点存在，next指向右子节点，重新开始循环时会将右子节点作为目标入栈，这是个递归的情况
        // 2. 右子节点不存在，next为空，重新开始循环时因为没有新节点可加入，所以不断的出栈处理之前遇到的节点
        next = top.right;
    }

    return result;
}
```

根节点在最后的情况最复杂，以后序遍历为例。同样的也是要先将根节点不断入栈直到没有左子节点，不同的是后面要先处理右子节点。如果右子节点不存在，说明该处理当前栈顶元素了，将栈顶元素出栈而且`next`设为空，继续下一轮循环；如果右子节点存在，那么应该将`next`指向右子节点，开启下一轮循环从而将还没处理的右子节点加入栈中。但是这里有个需要注意的地方，右子节点不为空时出现在向下遍历和向上回溯两种情况中，在线上回溯的情况下该右子节点已经被处理过了，不能再次加入栈中，否则形成死循环。这种情况下右子节点在上一轮循环中被加入结果队列，是队列中的最后一个元素，也可以用一个变量`last`来记录上一个刚刚被处理的元素，以此区分两种情况。

![Binary Tree Post-Order Traversal Iteration](./binary-tree-post-order-traversal-iteration.jpg)

```java
public static List<Integer> postOrderTraversalIteratively(TreeNode root) {
    if (root == null) {
        return null;
    }

    Stack<TreeNode> stack = new Stack<>();
    List<Integer> result = new ArrayList<>();
    TreeNode next = root;
    Integer last = null;

    while (next != null || !stack.isEmpty()) {
        while (next != null) {
            stack.add(next);
            next = next.left;
        }

        TreeNode node = stack.peek();
        if (node.right != null && (last == null || node.right.val != last)) {
            next = node.right;
            continue;
        }

        stack.pop();
        result.add(node.val);
        next = null;
        last = node.val;
    }

    return result;
}
```

空间复杂度是$O(H)$，$H$是栈的最大深度，对应树的高度，也等于根节点到叶节点最长路径的长度。在平衡二叉树中$H = O(\log N)$，在非平衡二叉树中，最坏情况下$H = N$。

时间复杂度是$O(N)$，因为所有被遍历的元素都要经过入栈出栈的过程，而每个元素入栈出栈的操作是$O(1)$，所有元素合在一起是线性复杂度。

另外一种思路是使用队列保存输出结果，和栈的遍历顺序反向来保证输出结果的顺序。

```js
var postorderTraversal = function (root) {
  if (!root) {
    return []
  }
  const stack = [root]
  const result = []

  while (stack.length) {
    const top = stack.pop()
    result.unshift(top.val)

    if (top.left) {
      stack.push(top.left)
    }
    if (top.right) {
      stack.push(top.right)
    }
  }

  return result
}
```

#### 统一的形式的栈实现

递归的解法针对不同的遍历顺序只需要简单调整顺序，形式统一简单。上面使用栈实现三种顺序树遍历的方法，每种方法的代码框架都不相同，无法统一到一种形式。
考虑如何使用一种统一的循环逻辑实现三种顺序的遍历。

首先要对于数节点的处理，用一个栈来记录节点遍历顺序，对于然后对于

先考虑中序遍历，在出栈时对元素进行处理，所以入栈时应该以目标顺序相反的顺序入栈，先入栈右节点，然后是根节点，然后是左节点，出站时根节点已经遍历过，这时只需要放入结果数组。

但是根节点两次被弹出，一次对应递归调用开始，一次对应递归调用返回，返回的时候对根节点放入结果数组。这两种情况下需要额外的信息进行区分，使用节点后边跟空指针`null`的方式来区分。

这样的话不能将空节点放入 stack，可能与使用`null`的含义冲突

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
  const stack = root ? [root] : []

  const result = []
  // stack中不能将空节点添加进去
  while (stack.length) {
    const top = stack.pop()

    // 弹出栈的时候进行记录
    if (top == null) {
      result.push(stack.pop().val)
    } else {
      // 中
      stack.push(top)
      stack.push(null)

      // 右
      if (top.right) {
        stack.push(top.right)
      }

      // 左
      if (top.left) {
        stack.push(top.left)
      }
    }
  }

  return result
}
```

使用 visited 表示节点已经被访问过

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
  const stack = [{ node: root, visited: false }]

  const result = []
  // stack中不能将空节点添加进去
  while (stack.length) {
    const top = stack.pop()

    if (!top.node) {
      continue
    }

    // 弹出栈的时候进行记录
    if (top.visited) {
      result.push(top.node.val)
    } else {
      // 中
      top.visited = true
      stack.push(top)

      // 右
      stack.push({ node: top.node.right, visited: false })

      // 左
      stack.push({ node: top.node.left, visited: false })
    }
  }

  return result
}
```

结果放入数组时向头部插入，这样可以将代码逻辑调整为需要的顺序一致，性能相比尾部插入有损失。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
  const stack = [{ node: root, visited: false }]

  const result = []
  // stack中不能将空节点添加进去
  while (stack.length) {
    const top = stack.pop()

    if (!top.node) {
      continue
    }

    // 弹出栈的时候进行记录
    if (top.visited) {
      result.unshift(top.node.val)
    } else {
      // 左
      stack.push({ node: top.node.left, visited: false })
      // 右
      stack.push({ node: top.node.right, visited: false })
      // 中
      top.visited = true
      stack.push(top)
    }
  }

  return result
}
```

#### Morris Traversal（Threaded Binary Tree）

上面的递归和循环实现的二叉树遍历方法空间复杂度都是$O(H)$，[Morris, Joseph H](https://en.wikipedia.org/wiki/Threaded_binary_tree)提出一种在线性时间内遍历二叉树的方法，只需要$O(1)$空间复杂度。在中序遍历中，如果节点中不包含指向父节点的`parent`指针那么遍历完成左子树后无法从左子树返回到根节点继续处理。考虑任意节点的前驱节点如果存在，前驱节点的右子节点肯定是空（因为前驱节点是左子树中最大的节点），将前驱节点的右子节点设置为当前节点，那么遍历树的回溯过程中可以沿着右子节点回到上层节点。

以中序遍历为例，树遍历过程从根节点开始分为三个阶段：

1. 下降 - 左子节点不为空，将当前节点前驱节点的右子节点设置为当前节点。
1. 触底 - 左子节点为空，将当前节点设置为右子节点，向上回溯。
1. 回溯 - 左子节点不为空，将当前节点设置为右子节点，向上回溯同时将当前节点的前驱节点右子节点设置空，恢复二叉树原来的结构。

Morris 遍历的过程会暂时的改变二叉树的结构，上面是以改变前驱节点的右子节点为例，对于逆序来说对称的也可以改变**后继节点**的**左子节点**。这种二叉树结构称之为[Threaded Binary Tree](https://en.wikipedia.org/wiki/Threaded_binary_tree)。

![Threaded Binary Tree](./binary-tree-threaded.png)

考虑中序 Morris 遍历，左子节点在前，根节点在中间，右子节点在后，所以遍历的下降过程中不记录节点，直到下降到底部最左节点开始记录节点，回溯时是从左子节点到中间根节点，和中序遍历要求顺序相同所以同样添加节点即可。

![Binary Tree Inorder Morris Traversal](./binary-tree-inorder-traversal-morris.jpg)

```java
public static List<Integer> inorderMorrisTraversal(TreeNode root) {
    if (root == null) { return null; }

    List<Integer> inorderList = new ArrayList<>();

    TreeNode current = root;
    while (current != null) {
        // 2. 向左触底
        if (current.left == null) {
            inorderList.add(current.val);
            current = current.right;
        } else {
            TreeNode predecessor = current.left;
            // 获取当前节点的前驱节点，前驱节点的右子节点可能是空（对应阶段1）或者等于当前节点（对应阶段3）
            while (predecessor.right != null && predecessor.right != current) {
                predecessor = predecessor.right;
            }

            // 1. 下降
            if (predecessor.right == null) {
                predecessor.right = current;
                current = current.left;
            } else {
                // 3. 回溯
                inorderList.add(current.val);
                predecessor.right = null;
                current = current.right;
            }
        }
    }

    return inorderList;
}
```

考虑前序 Morris 遍历，中间节点在最前边，左子树在中间，右子树在后边，所以在下降阶段（阶段 1）和触底（阶段 2）将当前节点加入结果中即可。前序遍历和中序遍历处理节点的不同在于一个是在下降阶段一个是在回溯节点，因此只有一行代码的差别。

![Binary Tree Preoder Morris Traversal](./binary-tree-preorder-traversal-morris.jpg)

```java
public static List<Integer> preorderMorrisTraversal(TreeNode root) {
    if (root == null) { return null; }

    List<Integer> preorderList = new ArrayList<>();

    TreeNode current = root;
    while (current != null) {
        // 2. 向左触底
        if (current.left == null) {
            inorderList.add(current.val);
            current = current.right;
        } else {
            TreeNode predecessor = current.left;
            // 获取当前节点的前驱节点，前驱节点的右子节点可能是空（对应阶段1）或者等于当前节点（对应阶段3）
            while (predecessor.right != null && predecessor.right != current) {
                predecessor = predecessor.right;
            }

            // 1. 下降
            if (predecessor.right == null) {
                // 与中序遍历只有一行不同
                preorderList.add(current.val);
                predecessor.right = current;
                current = current.left;
            } else {
                // 3. 回溯
                predecessor.right = null;
                current = current.right;
            }
        }
    }

    return inorderList;
}
```

后续 Morris 遍历比中序和前序稍微复杂些，因为中间节点要在左子树和右子树后边，所以在下降和触底阶段都不能将节点加入结果列表，只能在回溯阶段进行处理。回溯到当前节点$A$时，才能将其前驱节点$P$到其左子节点$L$的路径上的节点加入结果队列，而且顺序是$P \rightarrow L$。另外还需要额外一个辅助节点，将这个辅助节点的左子节点设置为根节点，这样才能完成整个树的后续遍历。

![Binary Tree Postoder Morris Traversal](./binary-tree-postorder-traversal-morris.jpg)

```java
public static List<Integer> postOrderMorrisTraversal(TreeNode root) {
    if (root == null) { return null; }

    List<Integer> postOrderList = new ArrayList<>();

    TreeNode current = new TreeNode(0);
    current.left = root;

    while (current != null) {
        // 2. 触底
        if (current.left == null) {
            current = current.right;
        } else {
            TreeNode predecessor = current.left;
            while (predecessor.right != null && predecessor.right != current) {
                predecessor = predecessor.right;
            }

            // 1. 下降
            if (predecessor.right == null) {
                predecessor.right = current;
                current = current.left;
            } else {
                // 3. 回溯
                predecessor.right = null;

                // 此时将当前节点的前驱节点到左子节点路径上节点加入结果列表
                LinkedList<Integer> tempList = new LinkedList<>();
                TreeNode temp = current.left;
                while (temp != null) {
                    tempList.addFirst(temp.val);
                    temp = temp.right;
                }
                postOrderList.addAll(tempList);

                // 进入下次循环，当前节点是辅助节点时，其右子节点是空，循环会在下次结束
                current = current.right;
            }
        }
    }

    return postOrderList;
}
```

很显然 Morris 遍历只使用了节点本身和最多一个辅助节点（后续遍历情况）的空间，所以空间复杂度是$O(1)$。整个遍历过程中，每个节点会在下降和回溯阶段各碰到一次，每次进行的主要操作是寻找前驱节点复杂度是$O(l)$和路径长度有关、修改前驱节点复杂度是$O(1)$。每个节点寻找前驱节点的操作和路径长度线性相关，所有节点寻找前驱节点操作的时间成本加起来和树总路径长度线性相关，即证明时间复杂度是$O(N)$，只不过其中的常系数大致是原来的**两倍**，因为下降和回溯各找一次。

对应的逆序遍历也可以对称地解决，考虑顺序与逆序的互为逆序的关系，同样可以解决等价但是较为简单的问题。

1. Morris, Joseph M. (1979). "Traversing binary trees simply and cheaply"
1. [Morris Traversal 方法遍历二叉树（非递归，不用栈，O(1)空间）](https://www.cnblogs.com/AnnieKim/archive/2013/06/15/morristraversal.html)

### 迭代器（Iterator）

为二叉树实现一个迭代器类，与中序遍历的顺序相同，节点从小到大依次返回。直接的做法是先对二叉树做中序遍历，并保存结果，根据这个结果来实现相关函数。这个做法迭代器初始化时间复杂度是$O(N)$，`next`和`hasNext`操作是$O(1)$。如果迭代器初始化后只遍历了较少的元素，那么初始化其他部分的元素的排序操作被浪费了。可以实现一个懒惰的迭代器，只有在调用`next`和`hasNext`函数时才会去确定下一个元素。递归实现的中序遍历函数无法控制其执行和中断，但是循环形式实现的迭代器可以将循环依赖的条件保存在迭代器类中，每次调用找到一个元素，相当于中断了循环，同时更新相关状态变量以便下次调用继续执行。

懒惰的迭代器构造在常数时间内完成，`next`和`hasNext`最坏的情况下复杂度是$O(H)$，均摊时间复杂度是$O(1)$。

```java
class TreeNode {
    class BstIterator {
        private Stack<TreeNode> stack = new Stack<>();
        private TreeNode nextNode;
        private TreeNode nextTarget;

        public BstIterator(TreeNode root) {
            this.nextTarget = root;
        }

        public BstIterator() {
            this.nextTarget = TreeNode.this;
        }

        public TreeNode next() {
            if (!hasNext()) { return null; }
            TreeNode value = nextNode;
            nextNode = null;

            return value;
        }

        private void advance() {
            if (nextTarget != null || !stack.isEmpty()) {
                while (nextTarget != null) {
                    stack.add(nextTarget);
                    nextTarget = nextTarget.left;
                }

                nextNode = stack.pop();
                nextTarget = nextNode.right;
            }
        }

        public boolean hasNext() {
            if (nextNode == null) { advance(); }
            return nextNode != null;
        }
    }
}
```

## 广度遍历

前序、中序、后序属于深度优先搜索，二叉树从上到下按层进行遍历，同层的节点按照从左到右的顺序排列是广度优先搜索。跟图的广度优先搜索一样，需要借助一个队列来完成。起始状态是将根节点加入队列中，然后从队列中取出元素，将元素加入结果列表中，同时将所有子节点入队，循环执行直到队列为空，所有节点处理完成。

```java
public static List<Integer> levelOrderTraversal(TreeNode root) {
    if (root == null) { return null; }

    Queue<TreeNode> queue = new LinkedList<>();
    List<Integer> result = new ArrayList<>();

    queue.add(root);
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        result.add(node.val);

        if (node.left != null) {
            queue.add(node.left);
        }

        if (node.right != null) {
            queue.add(node.right);
        }
    }

    return result;
}
```

如果将每层的节点放一起（返回的结果是`List<List<Integer>>`类型），可以考虑用递归去做，递归函数加上一个代表节点所在层数的参数。更简单的方法是观察到每次元素出栈前，当前队列中的所有元素是同一层的，只要将这些元素放入新的`List<Integer>`即可。
Leetcode 102

```java
public static List<List<Integer>> levelOrderTraversalList(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) { return result; }

    Queue<TreeNode> queue = new LinkedList<>();
    // 初始情况是队列中只有根节点，根节点所在的层只有1个节点
    queue.add(root);

    while (!queue.isEmpty()) {
        List<Integer> nextLevelNodes = queue.stream().map(value -> value.val).collect(Collectors.toList());
        result.add(nextLevelNodes);

        // 此处需要记录当前这一层节点的个数，因为后续遍历会加入下一层节点
        int childCount = queue.size();

        // 将这一层共childCount个节点出队放到一个List中，并同时计算这一层所有节点的子节点的总数
        for (int i = 0; i < childCount; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        // 继续下一轮循环
        result.add(childValues);
    }

    return result;
}
```

在上面的基础上还可以按层遍历但是每层的顺序是交替的正序逆序（zigzag level order）。

## 递归法框架

TODO: 递归解法思考框架

1. 分解子问题
1. 子问题分解需要间接的中间数据支持，不一定直接得到答案。
   1. 求二叉树直径 https://leetcode-cn.com/problems/diameter-of-binary-tree/
   1. 二叉树坡度 https://leetcode-cn.com/problems/binary-tree-tilt/
1. 子问题的递归结束条件
1. 子问题的答案如何决定父问题的答案
1. 递归的结束条件选择空指针（null）还是叶节点

   1. 空指针的话形式统一，对于整个树为空的情况不用额外判断，
   1. 叶节点的话一般贴近原始题目的描述，但是递归情况的处理稍微复杂，对整个树为空的情况额外判断，而且递归函数要保证接受的节点参数不为 null，减少对于空指针情况的递归对于完全二叉树可以减少一半的函数调用，性能相对高

1. 注意递归函数返回值

循环相比于递归的好处

1. 递归思路相对简单
1. 循环遍历的方式可以控制遍历的终止与继续

https://leetcode-cn.com/problems/find-bottom-left-tree-value/

## 二叉搜索树

[二叉搜索树](https://algs4.cs.princeton.edu/32bst/)要求根节点键值要大于左子树中所有节点，同时小于右子树中所有节点，二叉搜索树的所有子树也必须是二叉搜索树。

### 验证二叉搜索树

LeetCode 98

使用辅助递归函数`isValidBST(TreeNode node, Integer lower, Integer upper)`，其中`lower`和`upper`是检查`node`所在子树中所有节点值的下界和上界

1. 初始情况下上下界均为空，没有限制
1. 当前节点的值应该在上下界范围内`(lower, upper)`，闭区间表示节点值与上下界相同时返回`false`。
1. 递归的情况：左子树的上界由当前节点值代替，下界不变`(lower, node.val)`；右子树的下界由当前节点值替代，上界不变`(node.val, upper)`
1. 当前节点满足界限要求，且左右子树也是二叉树时整个树才是合法的二叉树。

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return isValidBST(root, null, null);
    }

    public boolean isValidBST(TreeNode node, Integer lower, Integer upper) {
        if (node == null) { return true; }

        if ((lower != null && node.val <= lower) || (upper != null && node.val >= upper)) {
            return false;
        }

        return isValidBST(node.left, lower, node.val) && isValidBST(node.right, node.val, upper);
    }
}
```

使用栈可以将上述递归实现转化为循环实现，考虑递归调用的函数在执行时就是用栈的方式来运行，`isValidBST`每个递归实际进行判断时有当前节点`node`、节点下边界`lower`和节点上边界`upper`三个变量参与，由当前节点递归到左子树（更新上边界和节点为左子节点）或者右子树（更新下边界和节点为右子节点）。使用三个显式的栈来模拟递归调用栈的运行。

```java
class BinaryTree {
    Stack<Integer> upperBounds = new Stack<>();
    Stack<Integer> lowerBounds = new Stack<>();
    Stack<TreeNode> nodes = new Stack<>();

    public boolean isValidBstIteratively(TreeNode root) {
        pushDownStack(root, null, null);

        while (!nodes.isEmpty()) {
            TreeNode node = nodes.pop();
            Integer lower = lowerBounds.pop();
            Integer upper = upperBounds.pop();

            if (node == null) { continue; }

            if (lower != null && node.val <= lower) { return false; }
            if (upper != null && node.val >= upper) { return false; }

            pushDownStack(node.left, lower, node.val);
            pushDownStack(node.right, node.val, upper);
        }

        return true;
    }

    private void pushDownStack(TreeNode node, Integer lower, Integer upper) {
        nodes.add(node);
        upperBounds.add(upper);
        lowerBounds.add(lower);
    }
}
```

另外可以使用**中序遍历**来验证二叉树是否合法。中序遍历合法二叉树的结果是一个全局升序的序列，出现任何节点大于等于其后续节点的情况说明这个树不是合法二叉树。这种方法把二叉树转换成顺序结构并比较相邻元素的大小来验证全局有序，和检验数组全局有序的方法相同。

下面使用栈实现的中序遍历，并记录前一个节点值与当前节点对比。

```java
public List<Integer> isValidBst(TreeNode root) {
    Stack<TreeNode> stack = new Stack<>();
    TreeNode next = root;
    double prevNodeValue = - Double.MAX_VALUE;

    while (next != null || !stack.isEmpty()) {
        while (next != null) {
            stack.add(next);
            next = next.left;
        }

        TreeNode top = stack.pop();

        // 如果中序遍历中后面的元素小于等前面的元素，二叉树非法
        if (top.value <= prevNodeValue) {
            return false;
        }
        prevNodeValue = top.value;

        next = top.right;
    }

    return true;
}
```

### 前驱与后继结点（Predecessor & Successor)

TODO: 有问题

中序遍历中节点$S$的前驱节点是左子树中最大的节点，由于中序遍历全局有序，所以任意节点的前驱节点在升序数列中刚好在该节点之前。

```java
public TreeNode predecessor(TreeNode node) {
    if (node == null || node.left == null) { return null; }

    TreeNode predecessor = node.left;
    while (predecessor.right != null) {
        predecessor = predecessor.right;
    }

    return predecessor;
}
```

中序遍历中节点$P$的后继节点$S$是节点$P$右子树中最小节点，或者右子树不存在时要沿着$P$向上寻找，直到节点$S$是一个左子节点或者$S$的父节点是根节点，此时后继节点$S$不存在。

```java
/**
 * TreeNode中parent指向父节点
*/
public TreeNode successor(TreeNode node) {
    if (node == null) { return null; }

    if (node.right != null) {
        TreeNode successor = node.right;
        while (successor.left != null) {
            successor = successor.left;
        }

        return successor;
    }

    TreeNode current = node;
    while (current.parent != null && current != current.parent.left) {
        current = current.parent;
    }

    return current.parent;
}
```

### 中序

#### 求树中第$K$小节点

kth Smallest 230

由于中序遍历的序列是升序序列，所以中序遍历序列中第$K$个节点就是二叉树中第$K$小的节点。用一个变量记录节点个数，可以改造三种中序遍历的实现来求得第$K$小的节点。对称的可以使用逆中序遍历求得第$K$大的节点。

#### 恢复树

如果一个二叉树中有两个节点的值互换了，如何找出这两个节点并将树恢复原状？ Leetcode 99

还是利用二叉树的中序遍历升序性质，顺序被破坏的树在中序遍历的过程中肯定有两个连续的节点不符合升序性质。可能出现两种情况，如果互换的两个节点本身在升序序列中相邻，则出现一对违反升序性质的节点对，互换这个节点对即可将树回复原装；如果互换的两个节点不相邻，则出现两对违反升序性质的节点对，需要将第一对的第一个节点和第二对的第二个节点互换，将树恢复原状。

此处利用 Morris 中序遍历，还可以只用两个变量记录需要交换的节点对而不是用列表记录所有节点对。

```java
class Solution {
    public void recoverTree(TreeNode root) {
        if (root == null) { return; }

        List<TreeNode[]> pairs = new ArrayList<>();
        TreeNode prev = null;
        TreeNode current = root;

        while (current != null) {
            if (current.left == null) {
                if (prev != null && current.val < prev.val) {
                    pairs.add(new TreeNode[] { prev, current });
                }

                prev = current;
                current = current.right;
            } else {
                TreeNode predecessor = current.left;

                while (predecessor.right != null && predecessor.right != current) {
                    predecessor = predecessor.right;
                }

                // down
                if (predecessor.right == null) {
                    predecessor.right = current;

                    current = current.left;
                } else {
                    if (current.val < prev.val) {
                        pairs.add(new TreeNode[] { prev, current });
                    }

                    predecessor.right = null;
                    prev = current;
                    current = current.right;
                }
            }
        }

        if (pairs.size() == 1) {
            TreeNode[] pair = pairs.get(0);
            swap(pair[0], pair[1]);
        } else if (pairs.size() == 2){
            TreeNode[] firstPair = pairs.get(0);
            TreeNode[] secondPair = pairs.get(1);
            swap(firstPair[0], secondPair[1]);
        }
    }

    static void swap(TreeNode left, TreeNode right) {
        Integer temp = left.val;
        left.val = right.val;
        right.val = temp;
    }
}
```

TODO:
求众数，代码细节复杂 https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/submissions/

#### 逆中序遍历应用

LeetCode 1038

将二叉树每个节点的值（value）变换成二叉树中所有大于键（key）大于该节点的所有节点值之和。
因为要先处理右测节点，在处理根节点和左子节点，所以使用逆中序遍历。比较简单的做法是先将所有节点按照逆中序排列，然后按逆中序顺序处理即可，从第二个节点开始处理每个节点的新值时上一个节点的值与当前节点值之和。

更加高效的方法是在逆中序遍历的过程中，直接计算每个节点的新值，此时需要一个`successor`变量记录当前节点的后继节点，每个节点的新值为当前节点值和其后继节点值之和（此时后继节点已经处理完成，其值是新值）。

```java
class Solution {
    private TreeNode successor = null;

    public TreeNode bstToGst(TreeNode root) {
        if (root == null) {
            return root;
        }

        // 初始情况：后继节点和右子节点都是空的时候设置后继节点是当前节点
        // 当successor不是空的时候，successor不应该再此处更新，而是在每个节点处理完后更新
        if (successor == null && root.right == null) {
            successor = root;
            return root;
        }

        bstToGst(root.right);
        root.val += successor.val;
        successor = root;
        bstToGst(root.left);

        return root;
    }
}
```

使用一个变量`sum`记录当前的和更简单

```java
class Solution {
    int sum = 0;
    public TreeNode bstToGst(TreeNode root) {
        if (root != null){
            bstToGst(root.right);
            sum = sum + root.val;
            root.val = sum;
            bstToGst(root.left);
        }
        return root;
    }
}
```

### 插入删除节点操作

二叉树插入，删除

删除节点 450

插入节点 701

## 构造树

从中序序列和前序序列重构二叉树(Leetcode 105)，对于二叉树节点来说，中序遍历顺序是左子树、根节点、右子树，前序遍历的顺序是根节点、左子树、右子树。前序遍历的第一个节点是根节点，在中序遍历中找到该节点，其左侧元素组成左子树，右侧元素组成右子树。针对左子树部分和右子树部分递归的进行这样的处理，递归终止的条件是序列长度为零时返回空指针，序列长度为 1 时返回一个叶节点。

构造树 108

```js
var buildTree = function (preorder, inorder) {
  function build(preStart, inStart, length) {
    if (length <= 0) {
      return null
    }
    const rootVal = preorder[preStart]
    if (length === 1) {
      return new TreeNode(rootVal)
    }

    const node = new TreeNode(rootVal)
    let index
    for (let i = inStart; i < inStart + length; i++) {
      if (inorder[i] === rootVal) {
        index = i
        break
      }
    }
    const left = index - inStart
    const right = inStart + length - index - 1

    node.left = build(preStart + 1, inStart, left)
    node.right = build(preStart + 1 + left, index + 1, right)

    return node
  }

  return build(0, 0, preorder.length)
}
```

从中序遍历和后序遍历(Leetcode 106)可使用同样的方法重构二叉树，区别在于后续遍历序列中顺序是左子树、右子树、根节点，每次取最后的元素作为根节点拆分中序遍历序列。

从前序遍历和后序遍历（Leetcode 889）重构二叉树，观察下图可知

![reconstruct](./reconstruct-from-pre-post-order.jpg)

```js
var constructFromPrePost = function (pre, post) {
  function build(preStart, postStart, len) {
    if (len <= 0) {
      return null
    }
    const node = new TreeNode(pre[preStart])
    if (len === 1) {
      return node
    }

    const leftChildRoot = pre[preStart + 1]
    let leftChildRootIndex
    for (let i = postStart; i < postStart + len; i++) {
      if (post[i] === leftChildRoot) {
        leftChildRootIndex = i
        break
      }
    }

    const leftLength = leftChildRootIndex + 1 - postStart
    const rightLength = len - leftLength - 1

    node.left = build(preStart + 1, postStart, leftLength)
    node.right = build(
      preStart + 1 + leftLength,
      leftChildRootIndex + 1,
      rightLength
    )

    return node
  }

  return build(0, 0, pre.length)
}
```

1. BST reconstruction. Given the preorder traversal of a BST (not including null nodes), reconstruct the tree.
1. Level-order traversal reconstruction of a BST. Given a sequence of keys, design a linear-time algorithm to determine whether it is the level-order traversal of some BST (and construct the BST itself).
1. [binary trees](./1-s2.0-0893965989901225-main.pdf)
1. https://www.geeksforgeeks.org/construct-a-binary-search-tree-from-given-postorder/
1. https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/

## 序列化与反序列化

https://www.youtube.com/watch?v=JL4OjKV_pGE

Leetcode 使用的二叉树的序列化格式如下`[1,2,3,null,null,4,5]`

```js
function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
  const queue = [root]
  const result = []
  while (queue.length > 0 && queue.some((node) => !!node)) {
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      if (node === null) {
        result.push(null)
        queue.push(null)
        queue.push(null)
      } else {
        result.push(node.val)
        queue.push(node.left || null)
        queue.push(node.right || null)
      }
    }
  }

  return `[${result.map((val) => (val === null ? 'null' : val))}]`
}

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
  const nodeValues = JSON.parse(data)
  if (nodeValues.length === 0) {
    return null
  }

  const nodes = nodeValues.map((val) =>
    val === null ? null : new TreeNode(val)
  )
  for (let i = 0; 2 * i + 1 <= nodes.length - 1; i++) {
    if (nodes[i] !== null) {
      const left = 2 * i + 1
      const right = 2 * i + 2
      nodes[i].left = nodes[left] || null
      nodes[i].right = nodes[right] || null
    }
  }

  return nodes[0]
}

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */

const serialized = '[1,2,3,null,null,4,5]'
const nodes = deserialize(serialized)
console.log(serialize(nodes))
```

https://leetcode-cn.com/problems/serialize-and-deserialize-bst/solution/xu-lie-hua-he-fan-xu-lie-hua-er-cha-sou-suo-shu-2/

## 路径问题

TODO: 树的遍历与回溯

1. 中间状态记录的两种方式，一种是每个递归函数调用有自己的拷贝，内存消耗高；一种是统一使用一个变量，在递归开始结束维持状态数据，最终保留结果时进行拷贝。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function (root, targetSum) {
  if (!root) {
    return []
  }

  const result = []
  const path = []
  let sum = 0

  function traverse(node) {
    path.push(node.val)
    sum += node.val
    if (!node.left && !node.right) {
      if (sum === targetSum) {
        result.push([...path])
      }
      path.pop()
      sum -= node.val
      return
    }

    if (node.left) {
      traverse(node.left)
    }
    if (node.right) {
      traverse(node.right)
    }
    path.pop()
    sum -= node.val
  }
  traverse(root)

  return result
}
```

例子

1. 路径总和 https://leetcode-cn.com/problems/path-sum-ii/
1. https://leetcode-cn.com/problems/path-sum-iii/ 思路不太一样

## 公共祖先问题

236 最近公共祖先 https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/
https://leetcode-cn.com/problems/first-common-ancestor-lcci/
235 题

```js
// 返回满足条件的节点，比较简单，递归情况包含了当前节点p/q/null三种情况
var lowestCommonAncestor = function (root, p, q) {
  if (root === p || root === q || root === null) {
    return root
  }

  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)

  if (left === null) {
    return right
  }
  if (right === null) {
    return left
  }

  return root
}

// 第一种做法返回 true false比较复杂
var lowestCommonAncestor = function (root, p, q) {
  let ancestor
  function postorder(node) {
    if (!node) {
      return false
    }

    const left = postorder(node.left)
    const right = postorder(node.right)

    if (
      (left && right) ||
      ((node.val === p.val || node.val === q.val) && (left || right))
    ) {
      ancestor = node
    }

    return left || right || node.val === p.val || node.val === q.val
  }
  postorder(root)

  return ancestor
}
```

## 表达式树

表达式解析树如下图

![Binary AST](./binary-tree-ast.png)

对表达式树进行前序遍历得到前缀表达式（prefix expression）$+ * A - B C + D E$，也称为波兰表达式（Polish notation），特点在于运算符位于运算数前。

对表达式进行后序遍历得到后缀表达式（postfix expression）$A B C - * D E + +$，也称为逆波兰表达式（reverse polish notation)，特点在于运算符位于操作数之后。后缀表达式使用 Stack Machine 很方便执行。

对表达式树进行中序遍历得到中缀表达式（infix expression），是数学上通常使用的表达式书写方式，中序表达式需要用括号来区分不同运算符的优先级。

https://en.wikipedia.org/wiki/Reverse_Polish_notation

1. Postfix Expression Evaluation from left and right
1. Shunting Yard Algorithm

## 其他问题

TODO:
没有思路

1. https://leetcode-cn.com/problems/subtree-of-another-tree/
1. https://leetcode-cn.com/problems/two-sum-iv-input-is-a-bst/ 中序加上逆中序，不需要额外空间
1. https://leetcode-cn.com/problems/second-minimum-node-in-a-binary-tree/ 官方题解未充分利用条件，不需要遍历所有节点
1. https://leetcode-cn.com/problems/maximum-width-of-binary-tree/solution/er-cha-shu-zui-da-kuan-du-by-leetcode/ 树的宽度

1. https://leetcode-cn.com/problems/minimum-distance-between-bst-nodes/submissions/ 中序遍历应用
1. https://leetcode-cn.com/problems/increasing-order-search-tree/ 逆中序
1. https://leetcode-cn.com/problems/kth-largest-element-in-a-stream/ 最小二叉堆
