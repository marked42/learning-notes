# Vue

## 作用域插槽

在Vue2.5版本之前，父组件插槽本身绑定的属性作用`scope`属性来引用，从而传递给嵌套到对应插槽的子组件，但是`scope`属性只能用在`<template>`标签上。

```vue
<parent>
  <template scope="scopedProps">
    <child>
      <span>{{JSON.stringify(scopedProps)}}</span>
    </child>
  </template>
</parent>
```

为了去除多余的`<template>`标签，Vue2.5引入了`slot-scope`属性，作用和`scope`完全相同，但是可以直接用接收上层组件作用域的元素上，这样可以省去`<template>`标签的使用。

```vue
<parent>
  <child slot-scope="scopedProps>
    <span>{{JSON.stringify(scopedProps)}}</span>
  </child>
</parent>
```

嵌套使用时需要注意，插槽作用域变量定义在父组件上，`slot-scope`属性使用在子组件上，这不一致在嵌套使用时可能会造成误解。

```vue
<foo>
  <bar slot-scope="foo">
    <baz slot-scope="bar">
      <div slot-scope="baz">
        {{ foo }} {{ bar }} {{ baz }}
      </div>
    </baz>
  </bar>
</foo>
```

需要注意的时如果多个嵌套的插槽作用域变量有相同名称的变量，那么内层的变量覆盖外层的变量，并且覆盖根组件的编译作用域中同名的变量。如果允许`slot-scope`使用在组件本身，指示default插槽的作用域，在嵌套的情况下会存在歧义。

```vue
<parent>
  <!-- slot-scope是从parent组件的default插槽传递下来还是child组件的default插槽定义 -->
  <child slot-scope="props">
  </child>
</parent>
```

Vue2.6中引入`v-slot`指令，统一普通插槽和作用域插槽，`slot`属性和`slot-scope`属性等两个属性。

`v-slot`使用在组件本身引入组件`default`插槽定义的变量。

```vue
<foo v-slot="foo">
  <bar v-slot="bar">
    <baz v-slot="baz">
      {{ foo }} {{ bar }} {{ baz }}
    </baz>
  </bar>
</foo>
```

`v-slot`使用在`<template>`标签上，指示其他名称的插槽。

```vue
<foo>
  <template v-slot:one="{ msg }">
    text slot: {{ msg }}
  </template>

  <template v-slot:two="{ msg }">
    <div>
      element slot: {{ msg }}
    </div>
  </template>
</foo>
```

`v-slot`的简化语法是`#`后面跟插槽名称，注意和`v-bind`,`v-on`等指令一样，如果指令后没有参数的话不能使用简化写法，即`#="props"`不能代替`v-slot="props"。

```vue
<foo>
  <template #header="{ msg }">
    Message from header: {{ msg }}
  </template>

   <template #footer>
    A static footer
  </template>
</foo>
```


1. [New Slots Syntax](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md)
1. [Slot Syntax Shorthand](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0002-slot-syntax-shorthand.md)
