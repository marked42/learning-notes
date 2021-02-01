# Monaco Editor

## 项目结构

1. `esm` ESM 版本，配合`webpack`打包使用。
1. `dev` AMD 版本，未压缩。
1. `min` AMD 版本，压缩版。
1. `min-maps` `min`对应的 source-maps

各种情况的打包[例子](https://github.com/Microsoft/monaco-editor-samples)

## AMD 方式

对于 Worker 脚本文件和文档同源的情况，首先同步加载`monaco-editor/min/vs/loader.js`定义全局异步加载函数`require`，然后配置并加载`editor/editor.main.js`入口文件即可使用全局变量`monaco.editor`初始化编辑器。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
  </head>
  <body>
    <div
      id="container"
      style="width:800px;height:600px;border:1px solid grey"
    ></div>

    <script src="monaco-editor/min/vs/loader.js"></script>
    <script>
      require.config({ paths: { vs: 'monaco-editor/min/vs' } })
      require(['vs/editor/editor.main'], function () {
        var editor = monaco.editor.create(
          document.getElementById('container'),
          {
            value: [
              'function x() {',
              '\tconsole.log("Hello world!");',
              '}',
            ].join('\n'),
            language: 'javascript',
          }
        )
      })
    </script>
  </body>
</html>
```

Web Worker 禁止使用跨域名脚本创建，如果 Worker 脚本文件与 HTML 文件不同源（例如部署在 CDN 上），需要额外的配置绕过这种限制。

假设 HTML 文档在部署在`www.mydomain.com`上，Worker 文件部署在`www.mycdn.com`上。

### 同源的代理文件

使用一个与 HTML 文档同源的 JS 脚本`https://www.mydomain.com/monaco-editor-worker-loader-proxy.js` 创建 Worker。

```html
<html>
  <body>
    <script
      type="text/javascript"
      src="http://www.mycdn.com/monaco-editor/min/vs/loader.js"
    ></script>
    <script>
      require.config({
        paths: { vs: 'http://www.mycdn.com/monaco-editor/min/vs' },
      })

      // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
      // the default worker url location (used when creating WebWorkers). The problem here is that
      // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
      // a web worker through a same-domain script
      window.MonacoEnvironment = {
        getWorkerUrl: function (workerId, label) {
          return 'monaco-editor-worker-loader-proxy.js'
        },
      }

      require(['vs/editor/editor.main'], function () {
        // ...
      })
    </script>
  </body>
</html>
```

在 Worker 全局环境中定义 Worker 文件的`baseURL`指定后续 Worker 文件所在路径， 使用`importScripts`引入跨域的 Worker 文件，该文件本身需要支持跨域资源共享，否则请求会被拦截。

```js
self.MonacoEnvironment = { baseUrl: 'http://www.mycdn.com/monaco-editor/min/' }
importScripts('www.mycdn.com/monaco-editor/min/vs/base/worker/workerMain.js')
```

### `data:` URI

使用`data:` 作为 Worker 的 URL，不需要代理文件，Worker 允许使用`data:`创建，`data:`使用`text/javascript`文件类型，其中配置同上。

```html
<script
  type="text/javascript"
  src="http://www.mycdn.com/monaco-editor/min/vs/loader.js"
></script>
<script>
  require.config({ paths: { vs: 'http://www.mycdn.com/monaco-editor/min/vs' } })

  // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
  // the default worker url location (used when creating WebWorkers). The problem here is that
  // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
  // a web worker through a same-domain script
  window.MonacoEnvironment = {
    getWorkerUrl: function (workerId, label) {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'http://www.mycdn.com/monaco-editor/min/'
        };
        importScripts('http://www.mycdn.com/monaco-editor/min/vs/base/worker/workerMain.js');`)}`
    },
  }

  require(['vs/editor/editor.main'], function () {
    // ...
  })
</script>
```

## ESM 方式

### 手动配置 Webpack

引入代码处定义配置全局变量`self.MonacoEnvironment.getWorkerUrl`指定 Worker 文件路径。

```js
import * as monaco from 'monaco-editor'

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './json.worker.bundle.js'
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './css.worker.bundle.js'
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js'
    }
    return './editor.worker.bundle.js'
  },
}

monaco.editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
})
```

为每个 worker 文件配置入口(entry)和输出文件名称，将每个 worker 打包输出到单独的文件中，并部署到 HTML 文件同一服务器上。输出文件名称需要和上面全局环境中`getWorkerUrl`中一致。

### 使用 monaco-editor-webpack-plugin 插件

手动配置需要为每种语言（Language）和特性（Feature）的 Worker 文件添加配置，并保证一致。使用`monaco-editor-webpack-plugin`插件自动可以自动根据使用到的语言和特性按需配置、打包，并且允许 Worker 文件部署到与 HTML 文档不同的服务器上。

业务代码直接导入并使用。

```js
import * as monaco from 'monaco-editor'

monaco.editor.create(document.getElementById('container'), {
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
  language: 'javascript',
})
```

webpack 配置使用插件。

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['html', 'json'],
      features: ['find'],
      publicPath: 'http://www.mycdn.com',
    }),
  ],
}
```

注意这里存在一个问题，`MonacoWebpackPlugin`的`publicPath`参数指定的话，必须使用包含协议的完整 URL，缺少协议(`//www.mycdn.com`)会导致 URL 无法正确解析，Web Worker 创建失败。

## `monaco-editor-webpack-plugin`插件分析

### 参数配置

1. `filename: string` - 打包 Worker 文件的名称，默认`[name].worker.js`。
1. `languages: string[]` - 指定支持的语言列表，[默认](https://github.com/microsoft/monaco-editor-webpack-plugin)包括了所有支持的语言。
1. `features: string[]` - 指定支持的功能列表，可以使用感叹号前缀`!feature`禁用某个[默认](https://github.com/microsoft/monaco-editor-webpack-plugin)的功能。
1. `publicPath` - Worker 文件的部署 URL，不指定的话使用 webpack 的`output.publicPath`或者动态`__webpack_public_path__`。

### 按需加载

找到指定语言和特性对应的入口文件，在插件中为每个文件添加入口配置。

```js
// TODO: need more detail
export const featuresArr: IFeatureDefinition[] = [
  {
    label: 'accessibilityHelp',
    entry: 'vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp',
  },
]

export const languagesArr: IFeatureDefinition[] = [
  {
    label: 'abap',
    entry: 'vs/basic-languages/abap/abap.contribution',
  },
]
```

### Blob URL 解决跨域问题

使用定制的`include-loader`加载 Worker 文件，在 Worker 文件中添加全局对象，`MonacoEnvironment.getWorkerUrl`中利用 Blob Url 和`importScripts`绕过跨域问题。

```js
// TODO: need more detail
const globals = {
  MonacoEnvironment: `(function (paths) {
      function stripTrailingSlash(str) {
        return str.replace(/\\/$/, '');
      }
      return {
        getWorkerUrl: function (moduleId, label) {
          var pathPrefix = ${pathPrefix};
          var result = (pathPrefix ? stripTrailingSlash(pathPrefix) + '/' : '') + paths[label];
          if (/^((http:)|(https:)|(file:)|(\\/\\/))/.test(result)) {
            var currentUrl = String(window.location);
            var currentOrigin = currentUrl.substr(0, currentUrl.length - window.location.hash.length - window.location.search.length - window.location.pathname.length);
            if (result.substring(0, currentOrigin.length) !== currentOrigin) {
              var js = '/*' + label + '*/importScripts("' + result + '");';
              var blob = new Blob([js], { type: 'application/javascript' });
              return URL.createObjectURL(blob);
            }
          }
          return result;
        }
      };
    })(${JSON.stringify(workerPaths, null, 2)})`,
}
```

注意不能使用省略协议的方式`//localhost:8080/doWork.js`，这种相对 URL 解析时在`blob:`代表的 JS 文件中会失败，原因在于`blob:`无法作为`baseURL`使用。
