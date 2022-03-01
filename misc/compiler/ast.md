# 语法树

## 解析树与抽象语法树

代码中的语句之间有顺序和嵌套的关系，树适合来表示这样的结构，常用的有解析树和抽象语法树。

解析树和语言文法定义一一对应，对应于递归下降解析过程中逐条选用的文法规则。解析树的问题在于详细记录了每条文法规则，但是对于后续语义分析过程来说，有些信息并不需要。

抽象语法树对解析树进行简化，不拘泥于文法规则，省略中间无用的文法规则节点，只保留能够代表代码结构的最简洁的节点树形式。抽象语法树的定义应该做到独立于文法定义，与语法无关的文法变更不能影响抽象语法树的结构。

使用根节点表示语法结构的类型，子节点作为语法结构的具体元素的形式构造抽象语法树。语句的优先级顺序由树节点的嵌套顺序决定，具有更高优先级的语句作为低优先级语句的子节点存在。同一层级的语句作为同一个树的兄弟节点存在，保持原有的先后顺序。

```cpp
x = 1 + 2;
  =
 / \
x   +
   / \
  1   2
```

某些语句可能不执行具体的操作，所以根节点没有对应的操作符，需要使用虚词法单元，例如变量声明语句。

```cpp
int a = 1;
// var是自定的虚词法单元，在文法中没有对应token。
  var
 /   \
a     1
```

## AST 的结构

### 同型树

使用一个`AST`类代表所有不同类型的语句对应的语法树，`token`代表树的类型，`children`代表所有子节点。结构简单，容易构建，但是对于不同子节点只能使用下标进行区分使用，比较麻烦。

```java
public class AST {
	Token token;
	List<AST> children;
	public AST(Token: token) {
		this.token = token;
	}

	public void addChild(AST t) {
		if (children == null) { children = new ArrayList<>(); }
		children.add(t);
	}
}
```

### 异型树

以`AST`为基类，使用不同的子类代表不同类型的语句，构建稍微复杂，使用起来比较清晰方便。

```java
public class AST {
	Token token;
}
public class ExprNode extends AST {}
public class AddNode extends ExprNode {
	// 具名子节点
	ExprNode left, right;

	// 使用构造函数创建AddNode子节点可以限制节点的只能是ExprNode类型
	public AddNode(ExprNode left, ExprNode right) {

	}
}
```

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
