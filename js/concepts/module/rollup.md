# rollup

[tree-shaking ](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.jnypozs9n)

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

# 导出形式的处理

针对 commonjs 模块下的入口文件导出形式配置

output.exports: 'named' | 'auto' | 'default' | 'none'

1. named 使用 exports['default']形式，将 default 作为属性导出
1. default 只能在模块有一个 export default 语句时使用 module.exports = val
1. none 只能在模块没有导出语句时使用，打包 app 的场景
1. auto 自动推测上面三种场景

output.exports 未指定，而且只有一个 export default 时，会提示告警

(!) Entry module "src/main.ts" is implicitly using "default" export mode, which means for CommonJS output that its default export is assigned to "module.exports". For many tools, such CommonJS output will not be interchangeable with the original ES module. If this is intended, explicitly set "output.exports" to either "auto" or "default", otherwise you might want to consider changing the signature of "src/main.ts" to use named exports only.

https://www.rollupjs.org/guide/en/#outputexports

# typings

类型声明文件处理

rollup-plugin-typescript 忽略了 declaration 选项，因为 rollup 是对单个文件转换，类型需要对整个项目进行分析

https://github.com/rollup/rollup-plugin-typescript/issues/45

https://medium.com/@martin_hotell/typescript-library-tips-rollup-your-types-995153cc81c7

declarations

[declaration with output.file](https://github.com/rollup/plugins/tree/master/packages/typescript#declaration-output-with-outputfile)
https://github.com/rollup/plugins/issues/934

# rollup webpack 的差异

[The cost of all small modules](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)

syntheticNamedExport

1. https://github.com/rollup/rollup/pull/3295
1. https://www.rollupjs.org/guide/en/#synthetic-named-exports

TODO:

rollup-plugin-vue 暂时只能配合 rollup-plugin-typescript2 使用，
配合@rollup/plugin-typescript 一起用会报错 vue2.0
rollup-plugin-vue 配合 rollup-plugin-typescript2 vue 3.0 会报错 module has node exported member App

# 参考

1. [Rollup Interview Rich Harris](https://survivejs.com/blog/rollup-interview/)
1. [Webpack and Rollup: the same but different](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c)

[Rich Harris Blog](https://medium.com/@Rich_Harris)

# 模板项目

1. build lib typescript + rollup
1. build vue component lib
   1. vue 2 + vue class component + vue property decorator
   1. vue 3
1. monorepo + pnpm
1. vuepress doc
1. lodash-es 使用 babel-plugin-lodash shake 掉 rollup 不会自动把 lodash-es treeshake 掉的

[pure ESM Package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)

https://antfu.me/posts/publish-esm-and-cjs
