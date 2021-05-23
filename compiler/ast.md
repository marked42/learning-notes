# 抽象语法树

## 模式

### 解释器模式（Interpreter）

将操作放到每个节点类中

1. 方便增加新的 AST 节点类型
1. AST 节点类型太多时不方便管理，同一个功能的代码分散在不同的节点类中。
1. 不方便增加新的操作类型

通过多态实现

### 访问者模式（Visitor）

1. 同一种操作的代码从分散的节点类统一到一个操作类中
1. 在不改变节点类型的情况下容易增加操作类型
1. 不方便增加新的 AST 节点类型

遍历过程可能需要全局状态，Visitor 类中通过重载进行静态分发，双分派技术，如果语言本身支持双分派技术，访问者模式就不需要了。

访问者模式访问的类也可以没有关联关系，
Node 节点类的代码存在大量重复，

## Books

1. 四种树的遍历模式
1. 二元表达式不同文法对应同一种语法，文法的改变不影响语法。
1. 表达式短路求值优化
1. 树的相关算法
1. 改写简化向量乘法，乘以 0 的表达式
1. 迭代使用规则，加法乘法转换为位移操作
1. 解析抽象语法树，为什么有 expression statement

1. http://www.yinwang.org/
1. [The Little Javascripter](http://www.crockford.com/little.html)
1. [Essentials of Programming Language](http://www.eopl3.com/)
1. [Beautiful Code](https://eli.thegreenplace.net/2007/09/28/book-review-beautiful-code-edited-by-andy-oram-greg-wilson/)
