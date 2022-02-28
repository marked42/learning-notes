# 命名

1. 表达意图
1. 尽量简短 brevity expressiveness 的矛盾，使用比喻 Metaphor 来寻找简短准确的命名，比喻的环境本身提供了丰富的信息。
1. 同一个概念使用同一个名称，所有 api 定义之前，先抽离业务和功能语义的关键字，统一关键字库; 可以更好的让多人协作看起来如出一辙, 而且关键字库 更能够让调用者感觉到 符合直觉、语义清晰; 关键字库也是项目组新同学 PREDO 的内容之一, 很有带入感；
1. 使用同一个层次的抽象 same level of abstraction，
1. 使用抽象的概念，而不是具体的实现
1. use long names for long scopes，使用范围越广泛，名字可以越长
1. 函数名、类名、变量名，反应副作用，函数名 modifier 动词+名词 干了什么事情，强调副作用， query 无副作用函数，返回一个值 查询语句 is

pick one word for single concept

概念配对

accepted -> unaccepted

父类的名称尽量简短，使用一到两个单词组成，子类

程序是会发生变化的，因此需要一定的灵活性，引入灵活性需要对应的成本，同时某些变化是不可预测的，不希望在变化的可能性尚未出现时就引入灵活性。

也就是不要过度设计，Patterns Happy。这不意味着程序本身不需要设计，而是需要准备把握当前可能的变化，只引入必要的灵活性。

## 不要拼写错误

HTTP 中 referer 请求头，一个出名的例子，正确的拼写 referrer

spell checker

```js
class User {
  // good
  setName() {}

  // bad
  setUserName() {}
}
```

准确使用反义词、近义词 show/hide 配对，open/close 配对

```js
pageShowModal
pageCloseModal
```

单复数

```js
// 应该是shopItems
const shopItem = []

// 应该是itemList
const itemLists = []
```

词性，success 是名词，fail 是动词，应该 success/failure，succeed/fail 配对使用

```js
request({
  success: () => {}
  fail: () => {}
})
```

更好的选择使用

```js
request({
  onSuccess: () => {}
  onFailure: () => {}
})
```

时态

```js
function componentWillMount() {}
function componentDidMount() {}
function componentWillUpdate() {}
function componentDidUpdate() {}
function componentWillUnmount() {}

// vue的生命周期函数名设计 vue2/vue3
```

主动与别动，肯定与否定，选用主动、肯定的形式。

```js
object.beDoneSomethingBy(subject)
subject.doSomething(subject)

// or better

subject.finishSomething(object)

if (isValid) {
}
if (isNotInValid) {
}
```

缩写如何处理

```js
function getDOMNode() {}
```

公开 API 命名倾向于使用抽象概念而不是具体实现，
