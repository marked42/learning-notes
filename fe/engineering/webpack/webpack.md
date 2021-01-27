# Webpack

1. 默认配置 `node_modules/webpack/lib/WebpackOptionsDefaulter.js`
1. HtmlWebpackPlugin

```config
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <% if(htmlWebpackPlugin.options.config.header) { %>
      <link rel="stylesheet" type="text/css" href="//common/css/header.css">
      <% } %>
      <title><%= (htmlWebpackPlugin.options.config.title) %></title>
  </head>

  <body>
  </body>
  <% if(htmlWebpackPlugin.options.config.header) { %>
  <script src="//common/header.min.js" type="text/javascript"></script>
  <% } %>
  </html>
```

```js
modue.exports = {
  //...
  mode: isDev ? 'development' : 'production'
  plugins: [
      new HtmlWebpackPlugin({
          template: './public/index.html',
          filename: 'index.html', //打包后的文件名
          config: config.template
      })
  ]
}
```

```js
{
  "scripts": {
      "dev": "cross-env NODE_ENV=development webpack",
      "build": "cross-env NODE_ENV=production webpack"
  }
}
```

## 代码拆分

问题：

1. 分离业务代码和第三方代码，业务代码频繁更新，三方代码较为稳定，将三方代码拆分出来可以利用缓存机制减少请求。
1. 按需加载，将组建按照路由进行拆分，只加载当前路由所需的代码模块，减少首屏代码尺寸，降低加载时间。

1. 配置多个 entry 并使用`CommonsChunkPlugin`或者`SplitChunksPlugin`将公共代码拆分输出到指定名称的 chunk 中。缺点在于需要手动维护多个 vendor entry。

```js
module.exports = {
  entry: {
    app: './src/main.js',
    vendor: [
      'vue',
      'axio',
      'vue-router',
      'vuex',
      'element-ui',
      // 很长很长
    ],
  },
  plugins: [
    // 将来自于node_modules目录下的模块拆分到vendor中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) =>
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/),
    }),

    // 将异步模块中共同使用到的axios模块拆分到 common-in-lazy模块
    new webpack.optimize.CommonsChunkPlugin({
      async: 'common-in-lazy',
      minChunks: ({ resource } = {}) =>
        resource && resource.includes('node_modules') && /axios/.test(resource),
    }),

    // 将所有异步模块中引用到至少2次的模块拆分到used-twice中
    new webpack.optimize.CommonsChunkPlugin({
      async: 'used-twice',
      minChunks: (module, count) => count >= 2,
    }),
  ],
}
```

## 动态导入

1. https://www.zhihu.com/question/41922432/answer/93346223
1. https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.1ndfj9dqd

1. `prefetch`空闲状态下载，调出空闲状态时下载中断，部分(Content-Range)或者全部文件内容缓存起来供未来使用。
1. `preload`中等优先级下载，不阻塞布局(non layout-blocking)
1. 所有的`prefetch`资源在一个队列中强占带宽，使用数字调整资源下载的优先级，`true`相当于`0`。
   `import(/* webpackPrefetch: true */ "...")`
   `import(/* webpackPrefetch: 10 */ "...")`
   `import(/* webpackPreload: true */ "...")`
1. 区别

   1. A preloaded chunk starts loading in parallel to the parent chunk. A prefetched chunk starts after the parent chunk finish.
   1. A preloaded chunk has medium priority and instantly downloaded. A prefetched chunk is downloaded in browser idle time.
   1. A preloaded chunk should be instantly requested by the parent chunk. A prefetched chunk can be used anytime in the future.
   1. Browser support is different.

1. https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c
1. https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content

## 问题

webpack resolve 配置

```js
module.exports = {
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
    // 必须加前缀.，否则解析模块会失败，对于常见的文件类型写到extensions中，其他类型书写完整的后缀名称，提高查找速度
    extensions: ['.vue', '.js'],
    // 指定查找目录，提高速度
    modules: [path.resolve(__dirname, 'node_modules')],
    mainFields: ['main'],
  },
}
```

解析模块时指定`package.json`中使用哪个字段代表模块的入口文件，默认配置和`target`的值有关。

1. `target`是`webworker`,`web`或者未指定，`mainFields: ['browser', 'module', 'main']`
1. `target`是`node`，`mainFields: ['module', 'main']`

按数组顺序找到第一个存在的字段使用。

### Entry

webpack 配置文件中路径配置使用相对路径时，解析为绝对路径时不是以配置文件所在路径进行，而是以当前进程工作路径`process.cwd()`，所以如果当前工作路径与配置文件所在路径不一致而且错误地使用配置文件路径进行相对路径配置的话会造成文件无法正确找到的问题。可以考虑使用`entry.context`选项指定某个路径而不是使用当前工作路径进行配置文件中相对路径的解析。考虑每个模块需要唯一的模块 id，使用相对目录是一个直接的选择。
