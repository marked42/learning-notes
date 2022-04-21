# rollup

插件不起作用

@rollup/plugin-typescript
@rollup/plugin-alias

(!) If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.
(!) Unresolved dependencies
https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
vue (imported by src/Test.vue?rollup-plugin-vue=script.ts)
(!) Missing global variable name
Use output.globals to specify browser global variable names corresponding to external modules
vue (guessing 'Vue')

https://github.com/rollup/rollup/issues/3788

# global

iife 和 umd 模块形式在不存在 module-loader 的环境下使用，通过全局变量的方式引用模块，

这种方式引用其他模块时需要使用`output.globals`为模块指定对应的全局变量名。

```js
{
    output: {
        globals: {
            vue: 'Vue',
            jquery: '$',
            underscore: '_',
        },
    }
}
```

输出为 umd 全局变量时必须使用 `output.name`指定其使用的全局变量的名称。

# default interop

什么时候输出

interopDefaultLegacy

webpack 和 rollup 分别是如何处理的？
