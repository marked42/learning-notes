# 闭包

## 闭包和对象是等价的

对象和闭包的关系有一个有趣的[小故事](https://www.iteye.com/blog/rednaxelafx-245022)，其中关键的描述如下。

> Objects are merely a poor man's closures. Closures are a poor man's object.

假设需要将数据和一组操作数据的行为封装在一起，很自然地可以使用面向对象的形式，下面的例子中使用类`Person`将两个数据字段`name`、`age`和两个方法（行为）`growOneYearOld`、`introduce`封装在一起。

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  growOneYearOld() {
    this.age += 1
  }

  introduce() {
    console.log(`${this.name} is ${this.age} years old.`)
  }
}

const tom = new Person('tom', 3)
```

函数式编程中使用闭包可以达到相同的效果。

```js
function newPerson(name, age) {
  const person = { name, age }

  return {
    growOneYearOld() {
      person.age += 1
    },
    introduce() {
      console.log(`${person.name} is ${person.age} years old.`)
    },
  }
}
```

因此类和闭包在封装一组数据和关联行为上是等价的，可以用闭包来模拟实现类机制，也可以用类来模拟实现闭包。

## 变量分类

函数调用特性

1. 递归
1. 嵌套
1. 嵌套但是被嵌套函数只能在外围函数尚未返回时才能被调用，使用 static link 方式实现非局部变量的访问 Pascal 嵌套函数的实现
1. 嵌套但是支持外围函数返回后还可以被调用，非局部变量的生命周期需要被延长，就必须分配在堆上，闭包

函数定义嵌套结构是静态决定的，运行时函数调用的激活记录是动态的，栈帧上可能存在多份激活记录。

函数可以嵌套、函数可以递归调用、函数不能重入（non-reentrant）不支持一个线程上递归调用，也不支持多线程并发调用，同一时间只能有一份活跃调用（Activation Record），局部变量就可以就能静态分配。

1. https://www.zhihu.com/question/48850636/answer/113181336
1. https://www.zhihu.com/question/27416568/answer/36565794
1. https://blog.mozilla.org/luke/2012/10/02/optimizing-javascript-variable-access/
1. https://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html
1. http://www.lua.org/pil/27.3.3.html
1. http://www.lua.org/pil/6.1.html
1. https://www.zhihu.com/question/34499262/answer/59415153
1. https://www.zhihu.com/question/31208722/answer/51050003
1. https://www.zhihu.com/question/33920941/answer/57597076

1. Compilers Principles, Techniques & Tools Chapter 7 Run-Time Environments
1. Modern Compiler Implementation In C Chapter 6.1 Stack Frames
1. Programming Language Pragmatics Chapter 3.6 The Binding of Referencing Environments
1. Concepts of Programming Languages Chapter 5 Names, Bindings, and Scopes
1. Engineering a Compiler Chapter 6 The Procedure Abstraction
1. Advanced Compiler Design And Implementation Chapter 5.4 Run-Time Support
1. Advanced Compiler Design And Implementation Chapter 3 Symbol-Table Structure
1. Closures in Lua
