# 入门

1. what babel 单词是什么？
1. how babel 怎么用？ api 用法，命令行工具，webpack 插件，纯 web 端用法。
1. 插件的概念 babel 的原理，如何用一个官方的语法转换插件为例子，介绍以 ast 为媒介的转换过程。 parse -> transform -> generate
1. preset 的概念
1. 能用 babel 做些什么？

## 在浏览器环境使用

TODO: 分析 babel 的 standalone 版本逻辑

1. 查询得到 `<script type="text/jsx">`或者`text/babel`类型的标签，
1. 同步或者使用 XHR 异步获取标签内容
1. 读取标签上附加的 data-plugins,data-presets 属性，确定 babel 使用的配置
1. 对代码内容按照设定配置进行转码
1. 新建 script 标签，并添加到 DOM 树种执行转码得到的代码。

`@babel/standalone`库

```js

```

## 基本用法

Babel 在前端生态中用来对 JS 进行语法转换、代码迁移、增加垫片（polyfill）等操作。 [官方使用手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md)

## 配置

配置文件

1. 项目级别，对整个项目中的所有文件都生效
   1. `babel.config.json`或者其他后缀（`.js`，`.cjs`，`.mjs`）
1. 文件级别，对文件所在目录及所有子目录中文件生效
   1. `.babelrc.json`或者其他后缀(.babelrc, .js, .cjs, .mjs)
   1. `package.json`中的`babel`字段

配置文件与配置合并策略 include/exclude/test/only/overrides/env, 插件 plugin/preset name normalization

版本 6 7 的不同

安装方法如下：

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

其中`@babel/cli`提供了最常用的使用方法，在命令行中使用`babel`。

```bash
./node_modules/.bin/babel src --out-dir lib
```

也可以直接使用代码的方式使用。

```js
const babel = require('@babel/core')

babel.transformSync('code', optionsObject)
```

## 配置方式

babel 的[配置文件](https://babeljs.io/docs/en/config-files)分为整个项目级别和文件级别。通过配置文件可以定制`babel`的行为，所有参数都可以通过配置文件支持。

使用 JS 配置文件`babel.config.js`可以进行动态配置，导出一个配置对象或者返回配置对象的函数。

```js
const presets = [
  [
    '@babel/env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1',
      },
      useBuiltIns: 'usage',
      corejs: '3.6.4',
    },
  ],
]

module.exports = { presets }
```

参考[API](https://babeljs.io/docs/en/config-files#config-function-api)

```js
module.exports = function (api) {
  return {}
}
```

## 垫片（Polyfill）

7.4.0 之前，babel 通过`@babel/polyfill`库提供所有的功能[垫片](https://babeljs.io/docs/en/usage#polyfill)实现，之后废弃这种方式转而推荐。

```js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

1. [Babel 官网视频](https://www.babeljs.cn/videos) [搬运视频](https://www.bilibili.com/medialist/play/5701903?from=space&business=space_series&business_id=592817&desc=1)
