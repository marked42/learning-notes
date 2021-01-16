# 构建优化

1. 打包速度

   1. 速度 speed-measure-webpack-plugin
   1. 缓存 cache-loader, babel-loader, terser-webpack-plugin, hard-source-webpack-plugin
   1. thread-loader

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

1. 打包大小 webpack-bundle-analyzer

   1. scope hoisting
   1. Tree Shaking js/css
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
