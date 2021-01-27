# 构建优化

## 打包速度

1.  速度 speed-measure-webpack-plugin
1.  缓存 cache-loader, babel-loader, terser-webpack-plugin, hard-source-webpack-plugin
1.  thread-loader

```js
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
      }),
    ],
  },
  plugins: [
    new HappyPack({
      loaders: ['babel-loader?cacheDirectory=true'],
    }),
  ],
}
```

## 打包大小

1. webpack-bundle-analyzer
1. 图片压缩

```js
{
    test: /\.(png|svg|jpg|gif|blob)$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: `${filename}img/[name]${hash}.[ext]`
        }
    }, {
        loader: 'image-webpack-loader',
        options: {
            mozjpeg: {
                progressive: true,
                quality: 65,
            },
            optipng: {
                enabled: false,
            },
            pngquant: {
                quality: '65-90',
                speed: 4,
            },
            gifsicle: {
                interlaced: false,
            },
            webp: {
                quality: 75
            },
        }
    }]
}
```

1. 使用 polyfill-service，访问https://polyfill.io/v3/polyfill.min.js?features=es2015%2Ces2016加载所需的polyfill实现。这个服务会根据HTTP请求`user-agent`头来判断该浏览器的环境，将需要的polyfill代码返回。考虑到官网的的速度问题，可以使用其开源的NPM包polyfill-service自建服务。
1. css 资源压缩 optimize-css-assets-webpack-plugin
1. html-webpack-plugin minify 参数

## Scope hoisting

```js
module.exports {
  plugins: [
    new webpack.ModuleConcatenationPlugin()
  ]
}
```

## Tree Shaking

Tree Shaking 指的是通过对 JS 代码分析，将其中未使用到的代码（dead code elimination）在打包时移除的优化手段。基于 ES 模块的的[静态结构特性](.https://exploringjs.com/es6/ch_modules.html#static-module-structure)，如果一个模块中导出多个对象，如果其中一些导出对象未被其他任何模块使用到，那么这些导出对象的相关代码也是死代码，可以移除。CommonJS 模块不支持这种优化方式，因为模块被整体导出到`module.exports`对象上，无法区分导出对象上单个属性是否用到。

babel-plugin-lodash

对于只提供了 commonjs 模块代码的库，可以通过`package.json`的`sideEffects: false`将库标记为无副作用（改变全局变量，引入 css 等其他资源被认为是副作用）。如果该库被引入，但是引入对象并没有在其他模块使用，则该库可以被删除。

Webpack 的 Tree Shaking 优化

1. ES 模块被默认为是无副作用的`sideEffects: false`，
   ```js
   // esm模块这两种形式的倒入代码会被tree shaking优化掉，
   // 但是会存在修改全局变量等副作用代码，这个时候不能被优化掉，这种情况webpack没有正确处理
   import { NotUsed } 'esm';
   import 'esm';
   ```
1. commonjs 模块默认为有副作用的，可以配置`sideEffects: false`表明模块没有副作用，这样在未被其他模块饮用的情况下可以被优化掉。
1. `sideEffects`字段支持数组配置，相对路径、绝对路径和 glob 模式，表示对应文件有副作用。
   ```js
   {
     "name": "your-project",
     "sideEffects": [
       "./src/some-side-effectful-file.js",
       "*.css"
     ]
   }
   ```

Webpack 中的 Tree Shaking 优化由`terser-webpack-plugin`或者`uglifyjs-webpack-plugin`进行，默认或者`development`模式下这些插件没有使用，设置`production`模式启用插件开启优化。

`terser-webpack-plugin`对应的优化配置字段

```js
// 开启副作用优化
optimization: {
  sideEffects: true
}

// 只使用人工的无副作用标记，不对代码进行副作用分析。
optimization: {
  sideEffects: 'flag'
}
```

https://webpack.js.org/configuration/optimization/#optimizationsideeffects

1. https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
1. https://github.com/webpack/webpack/issues/6065#issuecomment-351060570
1. https://github.com/webpack/webpack/issues/6065#issuecomment-351060570

## 分包

1. 分包 code splitting externals, SplitChunksPlugin, split 字段，动态代码

使用`import(chunkName)`或者`require.ensure(chunkName)`异步加载组建，内部使用`document.createElement('script')`和`JSONP`实现。

1. import 一次，不重复发送异步代码请求

## hash

1. hash 整个项目
1. chunkhash 每个模块入口对对应的所有 chunk，js 文件使用，公共代码不变的话 chunkhash 不变
1. contenthash 单个文件内容 css 文件使用
