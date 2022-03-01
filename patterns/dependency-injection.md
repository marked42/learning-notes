1. Inversion of Control
1. [依赖注入](https://zhuanlan.zhihu.com/p/60228431)

依赖注入，控制反转（vscode）

1. 构造注入 Constructor Injection，必须所有依赖都满足条件才能成功进行依赖注入。
1. 属性注入 Property Injection，单个属性依赖注入时，对象处于未完全初始化的中间状态，但是可以用来绕过相互依赖的问题。

   ```js
   function Afactory(b) {
     return {
       foo: function () {
         b.say()
       },
       what: function () {
         return 'Hello!'
       },
     }
   }
   function Bfactory(a) {
     return {
       a: a,
       say: function () {
         console.log('I say: ' + a.what)
       },
     }
   }

   var b = Bfactory(null)
   var a = Afactory(b)
   a.b = b
   ```

越顶层的模块越具体而不可复用，越底层的模块越通用，顶层模块由底层模块逐层聚合而来，所以顶层模块对底层模块存在依赖关系，传统的写法是模块中手动引入底层依赖模块，这是一个自底向上的聚合过程。
手动依赖注入的方式将所有的模块改造成函数工厂的形式，接受模块依赖作为参数，返回需要的模块。在最顶层模块中同样按照自底向下的顺序，先初始化最底层无依赖的模块，然后初始化依赖这些模块的模块，直到最顶层完成就完成了手动注入依赖的过程。

好处在于函数工厂模块通过参数指明了依赖的模块类型而不是具体模块，实现解耦，可以方便替换不同同一个模块类型的不同具体实现，可单独测试。

所有依赖注入的过程被统一到最顶层模块中，这部分逻辑可能会非常复杂，可以考虑将其拆分为多个顶层模块，降低一个模块的复杂度。

考虑使用依赖注入容器（Dependency Injection Container）。

### service locator

Service Locator 是依赖的一个注册中心，所有依赖初始化是注册到其中，具体的模块中使用到某个依赖时可以从 Service Locator 中获取。

一个模块如果使用了 Service Locator 也是引入了对 Service Locator 的依赖，这个依赖本身同样可以使用手动注入、依赖注入容器、全局依赖的方式提供。

Service Locator 和依赖注入容器都作为一个依赖注册中心，向使用方提供需要的依赖，区别在于使用 Service Locator 时，模块明确引入了对于 Service Locator 本身的依赖，通过 Service Locator **间接**获取所有需要的依赖。而依赖注入容器的方式模块是**直接**指明所有需要的依赖，由依赖注入容器提供依赖。

1. 可复用性（reusability）多引入了一个 Service Locator 的依赖，相比于依赖注入容器复用性降低
1. 可读性（readability）Service Locator 内置了所有模块的依赖关系，对于用户来说这部分逻辑理解成本较高。

依赖注入容器（Dependency Injection Container）相比于 Service Locator 多了一个功能，就是在初始化模块的时候分析确定所有的依赖，并准备好依赖，然后正常初始化对象。

依赖声明有几种方式：

1. 通过函数的参数名`function (person, country)`，这种方法存在一个问题在于代码做混淆或者压缩后函数参数名会变化。`args-list`
1. 使用函数的参数名注释`function (/* person */ p, /* counter */ c)`
1. 使用模块导出注入依赖名

```js
module.exports = function (p, c) {}
module.exports._inject = ['person', 'country']

// 或者这样
module.exports = ['person', 'country', function (p, c) {}]
```
