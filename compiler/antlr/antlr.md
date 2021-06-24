# ANTLR

## 安装使用

1. 命令 antlr4, 下载 JAR 包

```bash
# 1. 安装JDK
https://adoptopenjdk.net/

# 下载 AR包
curl -O http://www.antlr.org/download/antlr-4.9.2-complete.jar
sudo cp antlr-4.9.2-complete.jar /usr/local/lib
```

使用

```bash
java -jar /usr/local/lib/antlr-4.0-complete.jar

# shell中配置命令别名antlr4
alias antlr4='java -jar /usr/local/lib/antlr-4.0-complete.jar'
```

或者配置 Java 类路径后，通过指定类名启动工具

```bash
export CLASSPATH=".:/usr/local/lib/antlr-4.0-complete.jar:$CLASSPATH"
java org.antlr.v4.Tool
```

测试命令工具

```bash
java org.antlr.v4.gui.TestRig

alias grun='java org.antlr.v4.gui.TestRig'
grun Hello（语法文件名称） r(parser rule) -tokens (option)
```

使用命令时必须将 Hello 语法文件编译成 Java 源代码，然后编译成 class 文件，并且保证 class 文件在 CLASSPATH 中。
这样命令执行的时候才能加载到类`HelloParser.class`。编译语法文件使用的版本必须和运行类文件的 antlr 版本一致，否则会报错，在使用编辑器插件自动编译时可能出现这种情况，插件使用的 ANTLR 版本和运行使用的版本不一致。

```bash
# 从文件data.csv获取输入，不指定的话会读取标准输入
grun CSV file -gui data.csv
```

1.  -tokens 输出 token 流，
1.  -tree 将解析树输出，类似 LISP 的语法，操作符在前边。
1.  -gui 图形化界面

编译 target，目标语言的运行时库。

## 语法

1. 小写字母开头是 parser 的规则
1. 大写字母开头是 Token，通常使用全部大写的形式例如 INT
1. fragment INT: 是 token 的匹配片段，但是不作为独立的规则，不输出对应解析函数，只能在其他 token 规则中使用。

1. 优先级顺序，按照规则的前后顺序来，排在前边的规则优先级高。
1. 同一个 Token 规则将默认匹配最长的合法字符串.
1. lexer grammar CommonLexerRules 可以将词法定义拆分到其他语法定义文件中引入使用。

## 语言模式

ANTLR 语法提供的功能

1. Sequence Sequence With Terminator/Sequence With Separator
1. Choice
1. Token Dependence
1. Nested Phrase

常见的词法结构

1. Identifier
1. Number
1. String
1. Comments
1. Whitespace
1. Keyword
1. Punctuation

需要做思维导图概括 ANTLR 的功能

## 语法中嵌套代码

生成代码的模板如下，可以嵌套代码的地方有 header, member 和每条规则中。

```txt
<header>
public class <grammarName>Parser extends Parser {
<members>
... }

<!-- 嵌套header和member -->
@header {
package tools;
import java.util.*;
}

@parser::members {
  Map<String, Integer> memory = new HashMap<>();

  int eval(int op, int left, int right) {
    switch (op) {
      case MUL: return left * right;
      case DIV: return left / right;
      case ADD: return left + right;
      case SUB: return left - right;
    }
    return 0;
  }
}

// 在规则中使用 {} 嵌套目标语言的任意合法代码语句，使用$开头的变量引用规则对应的token和子规则的数据，通过locals,return
<!-- 为规则额外的数据，通过a=e的形式为规则的组成部分另起别名，所有的数据都保存在规则对应的RuleContext对象实例中，
都可以通过$去引用。 -->
expr
   locals [int i=0]
	returns[int v]:
	ID {
    String id = $ID.text;
    $v = memory.getOrDefault(id, 0);
  }
	| NUMBER { $v = $NUMBER.int; }
	| a = expr op = (ADD | SUB) b = expr { $v = eval($a.v, $op.type, $b.v); }
	| a = expr op = (MUL | DIV) b = expr { $v = eval($a.v, $op.type, $b.v); }
	| '(' expr ')' { $v = $expr.v; };
```

## Context Sensitive Parsing

1. 一个字符串可能符合多个 Token，例如保留字（Reserved Keyword）也是标识符（Identifier）。

   1. 保留字列表动态初始化或者可以统一解析成 Identifier，然后在 Parser 阶段监听并根据保留字列表修改 Token 的类型。
   1. 保留字列表不是固定的，可以在解析时变化，例如 Javascript 的 strict 模式支持 implement 等更多保留字。
   1. Java 5 之前 enum 是 Identifier，之后是 Keyword

1. 解析一串数字 2 1 2 10 1 3 13，第一个数字代表后续读入几个数字作为一组， Chap4 Page 51

1. 遍历语法树，JSON 转换为 XML。
1. 作用域构建，和变量使用（变量不存在）、函数调用检查（不是函数）。
1. 嵌入语法的代码执行顺序，parser 规则、lexer 规则
1. 一个源码位置接下来要处理的字符输入，可能符合多个 Token，注意与上面的例子区别之处在于不同 Token 类型匹配的字符串可能不同，，需要根据语法环境决定，例如在函数调用中第一个参数要解析为标识符，之后的参数需要解析为字符串类型。Token 类型需要从 Parser 获取信息。

1. 同一个 Token 在不同的语句中语意不同，例如 T(0) 在标识符 T 是函数时表示函数调用，在 T 时类名时表示类型转换。 使用 parser predicate 激活或者关闭规则。
1. 空白字符 Token 丢弃处理，这样不用在语法规则中任意可能出现空白的地方显示使用空白 Token。
1. 忽略但不丢弃空白或注释信息，因为后续还可能会需要这些信息，例如 ESLint 使用注释开启关闭某些规则。将空白 Token 发送到不同的通道 Channel 中，所有 Token 默认发送到 Default 通道。
1. 根据条件激活或者关闭一个 Parser Rule 或者 Token。
1. 使用模式功能，将若干个 Token 规则划分到一个模式中，只有模式激活时这些 Token 规则才生效。这种方式只能从 Token 阶段获取信息，即出现某个 Token 时进入某个模式或者退出当前模式，无法从 Parser 阶段获取信息，例如在某个语法结构出现时进入某个模式。XML 的解析，标签内外属于不同环境，使用不同的模式。
1. C++中 List<List<int>>的 '>>'解析问题，拆分成两个'>' '>'，然后在语法分析时根据上下文合并成一个 Token。
1. 一个 Token 有时需要接受有时需要被忽略，Python 换行问题 NEWLINE
1. 显示声明需要识别的错误 Token 形式

1. 完全的 Context Sensitive，Lexer 和 Parser 各自拥有自己的状态，根据这些状态激活不同的 Lexer 和 Parser 规则，Lexer 和 Parser 可以互相修改对方的状态，Parser 进入到一个特定语法结构时调用 Lexer 公开方法修改其状态，Lexer 根据更新的状态获取下一个 Token，Parser 或得到新 Token 后继续解析，也可能进入新的状态。这样 Lexer 和 Parser 两个阶段的信息互相依赖，应该可以对应解析上下文相关的语法。

## 典型问题

1. ANTLR 给出一个计算器的语法与实现，包括基本的四则运算、括号表达式、变量赋值、运算符结合性、优先级等问题。

   1. 使用 visitor 模式完成表达式求值 EvalVisitor
   1. 使用 Listener 和 TokenStreamWriter 重新改写 Token 输入流。
      1. 使用 Listener 模式与直接将代码嵌入到语法中的方式对比。
      1. 使用栈和 Listener 实现求值
      1. 在 Node 节点上保存状态

1. Semantic Predicates / Embed Code Action
1. JSON 解析
1. DOT Cyboml R
1. 遍历语法树，JSON 转换为 XML。
1. 作用域构建，和变量使用（变量不存在）、函数调用检查（不是函数）。
1. 解析 XML Chapter 12.4， 分词的 Mode 功能和 Channel 功能

Tutorial 《ANTLR By Examples》

## 错误处理的策略

antlr Chapter 9

1. single-token insertion 当前不匹配的 token 是多余的，下一个 token 是预期的 token，删除当前 token 继续解析。
1. 当前处理的 token 位置，需要在一个或者多个规则中选取合适的使用，如果没有任何一个规则匹配，可以报错 no viable rule.
