# Loader

## 配置 Loader

webpack 可以使用绝对路径或者名称配置 loader。

```js
const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('path/to/loader.js'),
            options: {},
          },
          {
            // 在resolveLoader.modules路径下查找loader模块
            loader: 'some-loader',
          },
        ],
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
}
```

## 同步或者异步

### 同步 Loader

```js
// 直接返回
module.exports = function (result) {
  return `result - sync`
}

// 同步抛出错误
module.exports = function (result) {
  throw `error`
}

// 使用callback提前返回，此时返回值没有作用
module.exports = function (result) {
  const callback = this.callback
  callback(null, `result - async`)
}

// callback抛出错误
module.exports = function (result) {
  const callback = this.callback
  callback('error')
}
```

### 异步 Loader

```js
// 使用this.async()
module.exports = function (result) {
  // this.async()标记为async
  const callback = this.async()
  callback(null, 'result - async')
}

module.exports = function (result) {
  // this.async()标记为async
  const callback = this.async()
  callback('error')
}

// 返回Promise代表异步
module.exports = function (result) {
  return Promise.resolve(`result - async`)
}

// 返回Promise代表异步
module.exports = function (result) {
  return Promise.reject('error')
}
```

同步或者异步使用`callback(err, result)`时遵循 NodeJS 回调函数的约定。

1. `callback(err)` 表示回调失败，第一个参数代表错误对信息。
1. `callback(null, arg1, arg2, ...)` 表示回调成功，因此第一个参数是`null`，后续可以跟任意个数的参数表示成功时的数据。

### Loader 执行流程

Pitching Phase

post inline normal pre

Normal Phase

pre normal inline post

Rule.enforce: 'pre' | 'post'

pre: eslint-loader

```js
// Disable normal loaders
import { a } from '!./file1.js'

// Disable preloaders and normal loaders
import { b } from '-!./file2.js'

// Disable all loaders
import { c } from '!!./file3.js'
```

Inline loaders and ! prefixes should not be used as they are non-standard. They may be use by loader generated code.

```js
// PitchingLoader的参数类型
module.exports.pitch = function (request, previousRequest, data) {}
```

loader1.pitch -> loader2 -> ... -> loaderN
resource file
loader1.normal -> loader2 -> ... -> loaderN

Pitching Loaders 顺序执行，Normal Loaders 在逆序执行，每个 normal loader 接受的参数是上一个 loader 的返回值,
Pitching Loaders 返回值有不是 undefined 时终止执行，逆序执行 normal loader。
正常的第一个 normal loader 接受的参数 result 代表文件内容。

Pitching Loaders 和 Normal Loaders 执行流程中任何一个 Loader 抛出错误则整个流程结束

1. 同步 loader
   1. 使用`this.callback`作为回调，成功`callback(null, result)`，失败`callback(err)`
   1. 正常返回非 Promise 的值或者不返回任何值（相当于返回 undefined）
1. 异步 loader

   1. 返回 Promise，resolved 状态代表成功，reject 状态代表失败
   1. 使用`this.async`

1. normal loader 成功执行时，接受的 result 参数是 string 或者 Buffer 类型时，raw: true 选项自动转换为 Buffer 类型，raw:false 自动转换为 string 类型，其他类型保持不变。
   loader 函数执行出错调用`callback(err)`,成功`callback(null, result)`

### Raw Loader

Loader 函数成功调用时接受的第一个参数类型可以是`String`、`Buffer`或这其他任何类型，第一个正常 Loader 接受一个 String 类型参数，对应资源文件内容，有时候需要使用 Buffer 类型变量。Loader 的 Raw 字段方便指定第一个参数的类型，值为`true`时`String`类型会被转换为`Buffer`传入 Loader；值为`false`时`Buffer`类型会被传入`String`类型传入 Loader；其他类型数据不做转换。

定义 Loader 函数时`Raw`字段表示

```js
module.exports = function (content) {
  assert(content instanceof Buffer)
  return someSyncOperation(content)
  // return value can be a `Buffer` too
  // This is also allowed if loader is not "raw"
}
module.exports.raw = true
```

1. context resource, query, data, request, previousRequest, currentRequest, remainingRequest

https://webpack.js.org/configuration/module/#ruleenforce
https://webpack.js.org/api/loaders/

## 编写

写一个插件 https://webpack.js.org/contribute/writing-a-loader/

### 测试

使用 webpack compiler

或者 RunLoaders

## 依赖与缓存

### 文件依赖

loader 功能依赖文件时需要将文件添加为文件依赖，方便 Watch Mode 下缓存功能生效，依赖文件发生变化时缓存被标记为无效（invalidate）。

### [模块依赖](https://webpack.js.org/contribute/writing-a-loader/#module-dependencies)

css-loader

less-loader

1. cacheable
1. dependency 处理过的资源文件自动加载为 Loader 的依赖（Dependency）
1. contextDependency
1. missingDependency

## RunLoaders

## loader-utils

stringifyRequest 将绝对路径转化为相对路径，

## css-loader

url 的处理

将`url('./relative-path.png')`语句(`image-set`等 css 文件中所有包含`url(path)`语句的地方)中资源进行模块解析，用解析完成后模块的导出对象替换原来的资源路径得到`url(require('./relative-path.png'))`。

对应选项默认为`true`表示进行转换，`false`表示不进行转换，`function(url, resourcePath) => boolean`使用可以根据`url`路径和对应 css 文件资源路径对每个`url`表达式单独开启或关闭转换。

`url(~path)`中绝对路径(https 开头的)不进行转换，相对路径按照当前项目进行处理，使用前缀`~`引用项目`node_modules`路径下的资源，模块路径支持使用别名（alias）。

import 处理类似 url，但是需要考虑到 media-query（可能出现嵌套）。

modules 按照 CSS Modules 的规范处理 css 文件，将类型和动画名称转换为添加了 hash 的本地名称，并且在模块中导出。

importLoaders: number, css-loader 之前生效的 Loader 个数。

esModule 导出使用 ES Module 的语法。

## Output

outputPath
publicPath
动态的 publicPath，使用 `__webpack_public_path__`

存在一个问题，ES Module 的模块导入方式顶层`import`会被在模块加载时首先执行，

```js
__webpack_public_path__ = 'https://cdn.example.com'

import image from './image.png'

console.log('image: ', image)
```

相当于这样

```js
import image from './image.png'

__webpack_public_path__ = 'https://cdn.example.com'
console.log('image: ', image)
```

因此`__webpack_public_path__`在初始化之前就使用，无法正确生效。

使用以下两种正确的形式。

```js
__webpack_public_path__ = 'https://cdn.example.com'

// require是commonjs形式，不会被提升
const image = require('./image.png')

console.log('image: ', image)
```

或者将其放入单独的模块中保证顺序。

```js
// public_path.js
__webpack_public_path__ = 'https://cdn.example.com'

// index.js
import './public_path'
import image from './image.png'

console.log('image: ', image)
```

开启`modules`选项的话 css-loader 加载模块导出对象中包含`locals`字段，是本地类名的 hash。

```js
// 是一个数组，其中每个元素也是数组，对应一个css文件，内嵌数组内容以此对应文件的名称，转换后的css内容
const css = [
  [
    './src/style.less',
    "._1AGPRhpeWaXK-w4Q45HRq2 { border-radius: 10px; color: red; }"
    '',
  ],
]
// 开启css-modules功能后导出hash过的本地类名（选项modules: true)
css.locals = {
  appText: '_1AGPRhpeWaXK-w4Q45HRq2',
}
// 辅助函数，用于处理@import('./other.css')
css.i = function () { /* */}
css.toString = function () { /* 数组 */ }
```

## style-loader

配合`css-loader`使用，生成的 js 模块副作用是利用`document.createElement('style')`在文档中自动插入`<style>`标签，内容是转换完成的 css，并且将
css modules 的本地类名导出（注意不在`locals`字段下了，且不包含`css-loader`其他的字段了，单纯的一个本地类名字典）。

## mini-css-extract-loader

配合`css-loader`使用，将 css 内容输出到单独的 css 文件中，并且对应的 js 模块和`style-loader`一样将 css modules 的本地类名导出。

注意配合使用的版本，可能会报错 `compilation.getAsset` is not a function

## postcss-loader

用在`less/sass/stylus`等 loader 之后，`css-loader`之前，用来对 css 做后处理。

## px -> rem

移动端适配

https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html

## 资源内联

初始化脚本、上报打点代码、css 内联避免闪动，减少请求

1. js 在 ejs 模板中使用 raw-loader 加载 js 模块（可以是任意模块），将其源码插入到指定位置。
1. style-loader/ html-inline-css-webpack-plugin 依赖 mini-css-extract-plugin 提取 css 文件内容。

## html-webpack-plugin

html 模板生成 ejs 模板

```ejs
<!DOCTYPE html>
<html>
  <head>
    <%= require('raw-loader!./meta.html') %>
    <title><%= htmlWebpackPlugin.options.title %></title>
    <title><%= process.env.NODE_ENV %></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>

```

定义环境变量时，使用字符串类型会被替换到 ejs 模板中当作 js 执行，所以变量`fuck`不存在会报错，需要额外一层包装，显式的转换成字符串的值。

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // error, variable fuck not defined
      'process.env.NODE_ENV': 'fuck',
      'process.env.NODE_ENV': '"fuck"',
      'process.env.NODE_ENV': JSON.stringify('fuck'),
    }),
  ],
}
```
