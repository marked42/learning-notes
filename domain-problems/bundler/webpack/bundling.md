# 打包原理

1. treeshaking
1. scope hoisting
1. code split chunks 加载原理

```js
module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    library: 'MyLib',
    libraryTarget: 'var',
    // TODO: 此处default处理
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['vue', 'js'],
  },
  module: {
    rules: [],
  },
}
```
