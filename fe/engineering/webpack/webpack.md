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

1. 配置多个entry并使用`CommonsChunkPlugin`或者`SplitChunksPlugin`将公共代码拆分输出到指定名称的chunk中。缺点在于需要手动维护多个vendor entry。
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
      minChunks: ({ resource }) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      ),
    }),

    // 将异步模块中共同使用到的axios模块拆分到 common-in-lazy模块
    new webpack.optimize.CommonsChunkPlugin({
      async: 'common-in-lazy',
      minChunks: ({ resource } = {}) => (
        resource &&
        resource.includes('node_modules') &&
        /axios/.test(resource)
      ),
    }),

    // 将所有异步模块中引用到至少2次的模块拆分到used-twice中
    new webpack.optimize.CommonsChunkPlugin({
      async: 'used-twice',
      minChunks: (module, count) => (
        count >= 2
      ),
    })
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