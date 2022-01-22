# 创建过程

直接使用构造函数创建新对象

1. 名称固定，意味着没法使用更有意义的名称
1. 返回值只能是该类的实例，无法返回子类或者一个代理对象 Proxy
1. 必须使用 new 运算符
1. 多个构造函数易混淆，参数多了易用错

相关的重构手法 Replace Constructor with Factory Function

## 构造函数

1. raw constructor -> 原始数据需要转换处理，得到构造函数所需要的数据
1. 构造函数名称通常是固定的，无法使用有意义的名称
1. 多个重载的构造函数无法很好区分

```js
class Point {
  // Cartesian
  constructor(x: number, y: number) {
  }

  // Polar
  constructor(rho: number, radius: number) {

  }
}
```

## 创建方法(Creation Method)

A Creation Method is simply a static or nonstatic method on a class that instantiates new instances of the class.

一个独立的函数或者类静态函数，封装创建逻辑。

```js
function createSomeThing() {}

class Factory {
  static createSomeThing() {}
}
```

## 简单工厂 (Simple Factory)

简单工厂指一个类中有一个创建方法的模式，是[Head First Design Pattern](https://www.oreilly.com/library/view/head-first-design/0596007124/)中的术语。

创建过程需要修改多处，存在 creation sprawl/solution sprawl/shotgun surgery 问题，封装到类实例中。

```js
class UserFactory {
    public static function create($type) {
        switch ($type) {
            case 'user': return new User();
            case 'customer': return new Customer();
            case 'admin': return new Admin();
            default:
                throw new Exception('Wrong user type passed.');
        }
    }
}

class SimpleFactory {
  createSomeThing() {}
}
```

```java
    if ("json".equalsIgnoreCase(configFormat)) {
      parser = new JsonRuleConfigParser();
    } else if ("xml".equalsIgnoreCase(configFormat)) {
      parser = new XmlRuleConfigParser();
    } else if ("yaml".equalsIgnoreCase(configFormat)) {
      parser = new YamlRuleConfigParser();
    } else if ("properties".equalsIgnoreCase(configFormat)) {
      parser = new PropertiesRuleConfigParser();
    }
```

解决两个问题

1. 代码中写死的 if/else 分支，无法运行时动态添加分类问题
1. 每个分类的代码逻辑可能很长，不是一句简单的 new 语句，如何将不同分支代码拆分
1. 添加新分类会修改代码，违反开放、封闭原则。
1. 代码中分支不多，不需要频繁添加新分类时不用重构

## 工厂方法 (Factory Method)

使用多态替代条件判断（Replace Conditional with Polymorphism）将简单工厂重构为工厂方法。

1. factory 指一个 class, factory method 指一个创建了目标类的实例方法，单一 factory 可以通过多个 factory method 对应创建不同的类，可以将返回值修改为接口类型，这样隐藏具体的类，
1. abstract factory 指一个 interface，用来创建一系列类

## 抽象工厂(Abstract Factory)

抽象工厂的作用

1. 创建逻辑中的差异部分，也就是根据不同逻辑的条件选择可以拆分到不同的工厂类
1. 创建逻辑中的相同部分可以实现共用，放到抽象工厂类中，模板方法模式

1. 对参数进行封装，用户不知道如何使用构造函数
1. 构造函数种类很多，使用参数支持，而不是为每类都创建对应函数
1. 构造函数太多，干扰类本身的 public api，使用专门的 Factory

## 建造者模式(Builder)

针对单一对象创建过程复杂的情况。
focuses on constructing complex objects step by step
针对复杂的对象 composite，建造者模式可以返回不同的类实例

1. 直接使用构造函数，构造函数的缺点
1. 使用构造函数加上手动的 getter/setter 调用
1. 建造者模式，避免中间状态，封装校验逻辑，创建不可变对象。

创建对象逻辑比较复杂时会遇到哪些问题？

1. 类数据特别多，造成构造函数参数特别多，逻辑太长需要拆分
1. 创建一系列的对象，对象有共同的基类? 对象组合造成子类个数非常多
1. 对象之间没有关联

```js
class HtmlBuilder {}

// 对象复杂，一个Builder需要拆分成不同的子Builder创建不同的部分。
class BuilderFacets {}
```

## 依赖容器（Dependency Injection Container）

## 原型模式（Prototype）

## 单例模式（Singleton）

和全局数据有类似的确定，多处使用同一数据，互相干扰，不方便 mock 测试， 不推荐使用

## 参考

1. [Factory Comparison](https://refactoring.guru/design-patterns/factory-comparison)
