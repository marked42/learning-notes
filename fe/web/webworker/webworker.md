# WebWorker

Javascript 在宿主环境中是单线程执行，Web Worker 提供了多线程执行代码的能力。给定一个 Javascript 脚本文件的 URL 可以创建一个 Web Worker 将脚本文件在另外的线程执行，不阻塞主线程代码执行。

Web Worker 代码有自己独立的运行环境，其全局对象是`self`而不是`window`。

```js
const worker = new Worker('worker.js')

// 监听消息
worker.onmessage = function (e) {
  // e.data
}

worker.onerror = function handleError(e) {}

// 发出消息
worker.postMessage()
```

数据在主线程和 worker 线程之间传递是通过[结构化拷贝](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)的方式，因此在数据量大的时候会很慢。结构化拷贝支持基础类型，不支持函数类型`Function`。

使用[可转移的数据类型](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#transferring_data_to_and_from_workers_further_details)，数据会在主线程和 Worker 线程中间转移而不是拷贝，因此[速度非常快](https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast)。[`Transferable`](https://developer.mozilla.org/en-US/docs/Web/API/Transferable)是个空接口，只用来标记数据类型是可转移的，`ArrayBuffer`, `MessagePort`,`ImageBitmap`,`OffscreenCanvas`。

```js
// Create a 32MB "file" and fill it.
var uInt8Array = new Uint8Array(1024 * 1024 * 32) // 32MB
for (var i = 0; i < uInt8Array.length; ++i) {
  uInt8Array[i] = i
}

worker.postMessage(uInt8Array.buffer, [uInt8Array.buffer])
```

数据转移之后在之前的环境中不再可用。使用可转移数据语法稍有不同。

```js
// 主线程侧
worker.postMessage(arrayBuffer, [arrayBuffer])
window.postMessage(arrayBuffer, targetOrigin, [arrayBuffer])

// worker侧
worker.postMessage({ data: int8View, moreData: anotherBuffer }, [
  int8View.buffer,
  anotherBuffer,
])
```

关键在与`postMessage`的第二个参数必须是可转移数据类型的数组。

### 错误处理

Worker 脚本运行出错出错时会触发`error`事件，使用`worker.onerror`监听事件进行错误处理，接收一个`ErrorEvent`参数。这个`error`事件不冒泡并且可以取消，使用`preventDefault()`来避免默认行为。`ErrorEvent`包含三个字段，错误信息(`message`), 文件名（`filename`）, 行号（`lineno`）。

### 结束 worker

在创建 Worker 的代码中使用`worker.terminate()`，在 Worker 本身的环境中使用全局函数`self.close()`。

因为安全考虑，Web Worker 环境中[可用功能](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers)受到限制。使用这个[网站](https://worker-playground.glitch.me/)测试某个功能是否可用。
被限制的功能主要是 DOM 等可以直接读写所在页面数据的 API，使用消息传递`postMessage`的方式实现这些功能。

### 创建子 Worker

Web Worker 中可以创建新的 Web Worker（subworker），但是 subworker 的 URL 需要和所在文档同源，而且相对 URL 是对于所在 web worker 而不是所在文档进行解析的。

可以将 CPU 密集型任务拆分到多个 Worker 中分开执行，减少运行时间。

### 引入全局脚本

Web Worker 环境提供了全局的`importScripts(url1, ..., urln)`来倒入脚本，在 Worker 的全局环境中执行。多个脚本的下载过程是异步的，且没有顺序要求，但是脚本的执行是同步的，且按照代码顺序执行。`importScripts(urls)`语句在代码下载并同步执行完成后返回。如果一个脚本加载失败，会抛出网络错误`NETWORK_ERROR`，并且后续的代码不会继续执行。

```js
importScripts() /* imports nothing */
importScripts('foo.js') /* imports just "foo.js" */
importScripts('foo.js', 'bar.js') /* imports two scripts */
importScripts(
  '//example.com/hello.js'
) /* You can import scripts from other origins */
```

从模块脚本（module script）创建的`WorkerGlobalScope`全局环境中使用`importScripts`会直接报错，因为`importScripts`是用来引入脚本直接修改全局对象的，`module script`类型不支持这种操作。

````js
new Worker('./worker.js', { type: 'module' })
new SharedWorker('./worker.js', { type: 'module' })
``

## 内容安全策略（Content security policy）

Web Worker 在独立的环境中执行，因此不受所在文档的内容安全策略的限制。Worker 自身的内容安全策略由其脚本文件的 HTTP 返回头决定。

但是如果 Worker 脚本的源是 [opaque origin](https://html.spec.whatwg.org/multipage/origin.html#concept-origin-opaque)，生成的 Worker 环境会继承所在文档的内容安全策略。`blob:`或者`data:`（Data URI）这两种 URL 属于这种情况。

[HTML Spec](https://html.spec.whatwg.org/multipage/workers.html#creating-workers) 只明确说从`data:`创建的 Worker 是 opaque origin。实验的结果是从`blob:`创建的 Worker 继承了所在文档的源。

> Any same-origin URL (including blob: URLs) can be used. data: URLs can also be used, but they create a worker with an opaque origin.

此处存疑，`blob:`创建的 Worker 源不是 opaque origin，所以是否继承所在文档的内容安全策略？ TODO: 需要实际代码例子来验证。

## 跨域

Web Worker 只接受同源脚本(same-origin)或者`blob:`和`data:`的方法，对于非同源的脚本，可以使用`blob:`或者`data:`引入，这个脚本资源本身需要支持跨域资源访问（CORS），否则会被同源策略拦截。

```js
function getWorkerUrl(url) {
  const code = `importScripts(${url})`
  const blob = new Blob([code], { type: 'text/javascript' })
  const URL = window.webkitURL || window.URL

  return URL.createObjectURL(blob)
}

const url = 'http://other.example.com/worker.js'
const worker = new Worker(getWorkerUrl(url))
````

注意使用这种方式时`importScripts(url)`中的 URL 不能是相对 URL，否则会报错。

```js
// chrome
// Uncaught DOMException: Failed to execute 'importScripts' on 'WorkerGlobalScope': The URL '//localhost:8000/src/worker.js' is invalid.
const code = `
const url = '//localhost:8000/src/worker.js';
importScripts(url);
`
const blob = new Blob([code], { type: 'text/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
```

相对 URL 的解析是以所在 Worker 文件的 `baseURL` 进行的，从`blob:`和`data:`创建的 Worker 其完整 URL 是这样的形式。

```js
`blob:http://192.168.1.40:8081/f90124ed-2eb8-4866-97f5-30526ca63a2b `，
`data:text/javascript;charset=utf-8,console.log('location: ', self.location)`
```

看下面两个不使用`importScripts`但是使用了相对 URL 的例子，会抛出同样的错误。

`blob:`的例子

```js
// worker中self.location如下
// {
//   hash: ''
//   host: ''
//   hostname: ''
//   href: 'blob:http://192.168.1.40:8081/fc39015f-2c27-49c4-9d75-5d9de3fb4b88'
//   origin: 'http://192.168.1.40:8081'
//   pathname: 'http://192.168.1.40:8081/fc39015f-2c27-49c4-9d75-5d9de3fb4b88'
//   port: ''
//   protocol: 'blob:'
//   search: ''
// }
const code = `
const url = '//localhost:8000/src/worker.js';
console.log(new URL(url, self.location.href));
`
const blob = new Blob([code], { type: 'text/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
```

`data:`的例子

```js
// worker 中self.location是这样的形式
// {
//   hash: ''
//   host: ''
//   hostname: ''
//   href: "data:text/javascript;charset=utf-8,console.log('location: ', self.location)"
//   origin: 'null'
//   pathname: "text/javascript;charset=utf-8,console.log('location: ', self.location)"
//   port: ''
//   protocol: 'data:'
//   search: ''
// }
const code = `
const url = '//localhost:8000/src/worker.js';
console.log(new URL(url, self.location.href));
`
const worker = new Worker(`data:text/javascript;charset=utf-8,${code}`)
```

原因在于相对 URL 相对于`http/https/ws/wss/ftp`之外的 baseURL 解析会报错。

```js
// TODO:
new URL('//localhost/test.com', 'blob://test.com')
new URL('//localhost/test.com', 'data://test.com')
```

## 嵌套脚本

可以将脚本内容直接写到 HTML 文档中，并利用`blob:`或者`data:`的方式创建 Worker，实现嵌套式的 Worker。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>MDN Example - Embedded worker</title>
    <script type="text/js-worker">
      // This script WON'T be parsed by JS engines because its MIME type is text/js-worker.
      var myVar = 'Hello World!';
      // Rest of your worker code goes here.
    </script>
    <script type="text/javascript">
      // This script WILL be parsed by JS engines because its MIME type is text/javascript.
      function pageLog(sMsg) {
        // Use a fragment: browser will only render/reflow once.
        var oFragm = document.createDocumentFragment()
        oFragm.appendChild(document.createTextNode(sMsg))
        oFragm.appendChild(document.createElement('br'))
        document.querySelector('#logDisplay').appendChild(oFragm)
      }
    </script>
    <script type="text/js-worker">
      // This script WON'T be parsed by JS engines because its MIME type is text/js-worker.
      onmessage = function(oEvent) {
        postMessage(myVar);
      };
      // Rest of your worker code goes here.
    </script>
    <script type="text/javascript">
      // This script WILL be parsed by JS engines because its MIME type is text/javascript.

      // In the past...:
      // blob builder existed
      // ...but now we use Blob...:
      var blob = new Blob(
        Array.prototype.map.call(
          document.querySelectorAll("script[type='text\/js-worker']"),
          function (oScript) {
            return oScript.textContent
          }
        ),
        { type: 'text/javascript' }
      )

      // Creating a new document.worker property containing all our "text/js-worker" scripts.
      document.worker = new Worker(window.URL.createObjectURL(blob))

      document.worker.onmessage = function (oEvent) {
        pageLog('Received: ' + oEvent.data)
      }

      // Start the worker.
      window.onload = function () {
        document.worker.postMessage('')
      }
    </script>
  </head>
  <body>
    <div id="logDisplay"></div>
  </body>
</html>
```

## 本地 Web Worker

Chrome 浏览器默认限制从本地文件`file:`创建 worker，可以使用`--allow-file-access-from-files`开启，其他浏览器暂无此限制。

## Shared Worker

使用`new Worker()`创建的是实现了`DedicateWorkerGlobalScope`接口的专用型 Worker，只能在创建的页面使用，且每次调用都会创建新的具有独立执行环境的 Worker 实例。同一个 Shared Worker 可以在多个同源的文档或者嵌套`iframe`中共享使用，与普通的 Worker 区别在与使用不同的构造函数和通信方式。

```js
// 构造函数不同，在多个页面中分别创建
const worker = new SharedWorker('worker.js')

// 在main.js中使用worker的port处理监听消息
myWorker.port.onmessage = function (e) {
  result2.textContent = e.data
  console.log('Message received from worker')
}

myWorker.port.onmessageerror = function (e) {
  result2.textContent = e.data
  console.log('Error message received from worker')
}

// 在worker.js 中使用onconnect监听连接，并使用onmessage监听消息
onconnect = function (e) {
  var port = e.ports[0]

  port.onmessage = function (e) {
    var workerResult = 'Result: ' + e.data[0] * e.data[1]
    port.postMessage(workerResult)
  }
}
```

[SharedWorkerGlobalScope](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#shared_workers)

## ServiceWorker

ServiceWorkerGlobalScope

## WorkerGlobalScope

scope 有关联的

```ts
// https://w3c.github.io/webappsec-referrer-policy/#referrer-policy
type ReferrerPolicy =
|  '',
|  'no-referrer',
|  'no-referrer-when-downgrade',
|  'same-origin',
|  'origin',
|  'strict-origin',
|  'origin-when-cross-origin',
|  'strict-origin-when-cross-origin',
|  'unsafe-url',


// https://html.spec.whatwg.org/multipage/origin.html#embedder-policy-value
type EmbedderPolicyValue = 'unsafe-none' | 'require-corp'

interface EmbedderPolicy {
  value: EmbedderPolicyValue,
  reportingEndpoint: string,
  reportOnlyValue: EmbedderPolicyValue,
  reportOnlyReportingEndpoint: string,
}

interface Related {
  // 一个SharedWorker可以有多个owner，所以是set类型
  owner: Set<WorkerGlobalScope | Document>
  worker: Set<WorkerGlobalScope>
  type: 'classic' | 'module'
  // 通过名称可以获取同一个SharedWorker， ServiceWorker不支持此属性
  name: string
  url: URL
  referrerPolicy: ReferrerPolicy
  embedderPolicy: EmbedderPolicy
  cspList: CspList
  // 记录加载脚本的状态 ModuleScript (成功加载) null (失败) fetching加载中
  moduleMap: Map<URL, ModuleScript | null | 'fetching'>
  crossOriginIsolated: boolean,
}
```

```ts
// https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-objects
interface EnvironmentSettings {
  realmExecutionContext
  moduleMap
  responsibleDocument
  urlCharacterEncoding
  baseUrl
  referrerPolicy
  embedderPolicy
  crossOriginIsolatedCapability: boolean
}
```

## Lifetime

https://html.spec.whatwg.org/multipage/workers.html#the-worker's-lifetime

active needed worker [fully active document](https://html.spec.whatwg.org/multipage/browsers.html#fully-active) traceable
permissible worker
protected worker
suspendable worker

## Processing Model

## Libs

webpack worker-loader
https://github.com/nolanlawson/promise-worker
https://github.com/dumbmatter/promise-worker-bi
monaco-editor 的 worker 封装

## 参考资料

1. [The Basics of Web Workers](https://www.html5rocks.com/en/tutorials/workers/basics/)
1. [Using Web Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
1. [HTML Spec Web Workers](https://html.spec.whatwg.org/multipage/workers.html#workers)
1. [Web Workers W3C](https://www.w3.org/TR/workers/)
