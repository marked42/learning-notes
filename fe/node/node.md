# Node

## Node 模块

### 使用

1. 全局对象 globals，打包引入的副作用 monkey patching 不推荐

```js
//file patcher.js
// ./logger is another module require('./logger').customMessage = function() {
console.log('This is a new functionality'); };
```

1. module.exports 和 exports 的区别
1. 导出方式 命名导出、命名空间、默认导出（导出单个函数、类、类实例、值）

### 机制

[CommonJS 模块机制 Wiki](https://zh.wikipedia.org/wiki/CommonJS#cite_note-7)
[Official Spec](https://github.com/commonjs/commonjs)
[Modules 1.1.1](http://wiki.commonjs.org/wiki/Modules/1.1.1)

1. require
   1. 使用`require(module-name)`函数导入模块
   1. `require.main` 只读，等同于`module`
   1. `require.paths`
1. module context
   1. 使用`exports`导出,`module`代表模块本身，`module.id`是模块的 id，`require(module.id)`返回同一个模块
   1. module.id
   1. module.uri
1. module identifiers
   1. 驼峰式，'.' '..'
   1. 可以没有文件后缀`.js`
   1. `/`分隔
   1. 相对路径模块`.`,`..`开头，其他形式是顶层模块，相对模块相对于`require`所在的文件进行解析，顶层模块相对于项目根目录解析

```js
function loadModule(filename, module, require) {
  var wrappedSrc =
    '(function(module, exports, require) {' +
    fs.readFileSync(filename, 'utf8') +
    '})(module, module.exports, require);'
  eval(wrappedSrc)
}

var require = function (moduleName) {
  console.log('Require invoked for module: ' + moduleName)
  var id = require.resolve(moduleName)
  if (require.cache[id]) {
    return require.cache[id].exports
  }
  //module metadata
  var module = {
    exports: {},
    id: id,
  }
  require.cache[id] = module
  //load the module
  loadModule(id, module, require)
  //return exported variables
  return module.exports
}
require.cache = {}
require.resolve = function (moduleName) {
  /* resolve a full module id from the moduleName */
}
```

### Node 模块实现机制

核心模块和文件模块，核心模块直接编译执行。

1. 路径分析
1. 文件定位
1. 编译执行

#### 路径分析与文件定位

Node 有四种类型路径

1. 核心模块
1. `.`/`..`的相对路径文件模块
1. `.`/`..`的绝对路径文件模块
1. 非路径形式的文件模块，使用`module.paths`路径，从当前目录中`node_modules`子目录中查找，逐层向上

对于不存在扩展名的情况依次尝试`.js`、`.json`、`.node`

1. 可能找到一个文件
1. 目录 -> 尝试查找 package.json 文件的 main 字段指定的入口文件，不存在的话依次使用`index.js`，`index.json`，`index.node`。
   1. 使用本地 node_modules，逐层向上，
   1. 使用 NODE_PATH 环境变量指定的全局 node_modules 目录
1. 不存在的情况抛出错误

[require](http://nodejs.cn/api/modules.html#modules_all_together)

```js
interface Require {
  (id: string): any;
  resolve: RequireResolve;
  cache: Dict<NodeModule>;
  /**
   * @deprecated
   */
  extensions: RequireExtensions;
  main: Module | undefined;
}
```

#### 模块编译

每个模块都是一个对象

```js
function Module(id, parent) {
  this.id = id
  this.exports = {}
  this.parent = parent
  if (parent && parent.children) {
    parent.children.push(this)
  }
  this.filename = null
  this.loaded = false
  this.children = []
}
```

如果想要整体导出，使用`module.exports = value`，因为`exports`是一个函数形参，无法改变外部的变量

核心模块分为 JS 模块和 C/C++模块

```js
function NativeModule(id) {
  this.filename = id + '.js'
  this.id = id
  this.exports = {}
  this.loaded = false
}
NativeModule._source = process.binding('natives')
NativeModule._cache = {}
```

#### 缓存与循环依赖

模块加载第一次就会进行缓存，再次加载时从缓存中读取，因此允许循环依赖的情况出现。

使用`require`的模块会被缓存，缓存使用模块被解析的**文件名**作为 key，所以使用不同的路径名，但是路径经过解析后相同的话，是同一个模块。

```js
// 同一个模块
const mod1 = require('./test')
const mod1 = require('./test.js')

// 在不区分大小写的文件系统上，这两个模块指向同一个文件，但是使用的解析得到的路径名不同，所以同一个文件会被加载两次。
const mod1 = require('./test')
const mod1 = require('./TEST')
```

使用`new Module`创建模块可以使每个模块实例都是独立的

`require.main` 入口模块

#### 内建 C/C++模块

1.  Node.js：来一打 C++ 扩展

### 其他模块

AMD

```js
define(id?, dependencies?, factory);

// 兼容commonjs的写法
define(function (require, exports, module){
  var someModule = require("someModule");
  var anotherModule = require("anotherModule");

  someModule.doTehAwesome();
  anotherModule.doMoarAwesome();

  exports.asplode = function (){
    someModule.doTehAwesome();
    anotherModule.doMoarAwesome();
  };
});
```

UMD

```js
;(function (name, definition) {
  var hasDefine = typeof define === 'function'
  var hasExports = typeof module !== 'undefined' && module.exports

  // amd
  if (hasDefine) {
    define(name, definition)
    // commonjs
  } else if (hasExports) {
    module.exports = definition()
    // 全局
  } else {
    this[name] = definition()
  }
})('hello', function () {
  var hello = function () {}
  return hello
})
```

### Cross Platform Code Sharing

1. UMD 模块写法
1. 运行时的环境判断
1. 打包时环境判断，`package.json#browser`字段

## 模块 DI

依赖注入，控制反转（vscode）

1. 构造注入 Constructor Injection，必须所有依赖都满足条件才能成功进行依赖注入。
1. 属性注入 Property Injection，单个属性依赖注入时，对象处于未完全初始化的中间状态，但是可以用来绕过相互依赖的问题。

   ```js
   function Afactory(b) {
     return {
       foo: function () {
         b.say()
       },
       what: function () {
         return 'Hello!'
       },
     }
   }
   function Bfactory(a) {
     return {
       a: a,
       say: function () {
         console.log('I say: ' + a.what)
       },
     }
   }

   var b = Bfactory(null)
   var a = Afactory(b)
   a.b = b
   ```

越顶层的模块越具体而不可复用，越底层的模块越通用，顶层模块由底层模块逐层聚合而来，所以顶层模块对底层模块存在依赖关系，传统的写法是模块中手动引入底层依赖模块，这是一个自底向上的聚合过程。
手动依赖注入的方式将所有的模块改造成函数工厂的形式，接受模块依赖作为参数，返回需要的模块。在最顶层模块中同样按照自底向下的顺序，先初始化最底层无依赖的模块，然后初始化依赖这些模块的模块，直到最顶层完成就完成了手动注入依赖的过程。

好处在于函数工厂模块通过参数指明了依赖的模块类型而不是具体模块，实现解耦，可以方便替换不同同一个模块类型的不同具体实现，可单独测试。

所有依赖注入的过程被统一到最顶层模块中，这部分逻辑可能会非常复杂，可以考虑将其拆分为多个顶层模块，降低一个模块的复杂度。

考虑使用依赖注入容器（Dependency Injection Container）。

### service locator

Service Locator 是依赖的一个注册中心，所有依赖初始化是注册到其中，具体的模块中使用到某个依赖时可以从 Service Locator 中获取。

一个模块如果使用了 Service Locator 也是引入了对 Service Locator 的依赖，这个依赖本身同样可以使用手动注入、依赖注入容器、全局依赖的方式提供。

Service Locator 和依赖注入容器都作为一个依赖注册中心，向使用方提供需要的依赖，区别在于使用 Service Locator 时，模块明确引入了对于 Service Locator 本身的依赖，通过 Service Locator **间接**获取所有需要的依赖。而依赖注入容器的方式模块是**直接**指明所有需要的依赖，由依赖注入容器提供依赖。

1. 可复用性（reusability）多引入了一个 Service Locator 的依赖，相比于依赖注入容器复用性降低
1. 可读性（readability）Service Locator 内置了所有模块的依赖关系，对于用户来说这部分逻辑理解成本较高。

依赖注入容器（Dependency Injection Container）相比于 Service Locator 多了一个功能，就是在初始化模块的时候分析确定所有的依赖，并准备好依赖，然后正常初始化对象。

依赖声明有几种方式：

1. 通过函数的参数名`function (person, country)`，这种方法存在一个问题在于代码做混淆或者压缩后函数参数名会变化。`args-list`
1. 使用函数的参数名注释`function (/* person */ p, /* counter */ c)`
1. 使用模块导出注入依赖名

```js
module.exports = function (p, c) {}
module.exports._inject = ['person', 'country']

// 或者这样
module.exports = ['person', 'country', function (p, c) {}]
```

## V8 内存管理

设置新生代老生代内存限制。

```bash
node --max-old-space-size=2048 --max-new-space-size=64
```

新生代 - Scavenge 算法，新生代内容空间划分为两个 semi-space 各占一半，一个是 from 空间，一个是 to 空间，from 空间大小不够分配新内存时触发 minor gc，将 from 空间的对象复制到 to 空间，然后 from 空间和 to 空间互换角色。

老生代 - 对象生存时间比较久，内存占用比较大，使用标记清除算法（mark & sweep），将不在需要的对象内存释放，会存在较多内存碎片，可能存在剩余空间总的尺寸足够，但是不存在连续的内存可以分配；改进的使用标记整理算法（mark & compact），触发 full gc 的时候将所有存活的对象复制到空间的一边，剩余空间留在另一边，避免空间碎片。

老生代 full gc 时 javascript 执行线程必须暂停(stop the world)，防止垃圾回收造成数据不一致。一次 full gc 可能造成秒级别的停顿，增量式标记(incremental marking)方法一次只对老生代部分进行标记，将一次较长停顿的 full gc 替换为若干次较短时间的 full gc。
一次标记完成后，所有需要被清理的内存可以被确定，懒清理（lazy sweep）策略只根据需要清理部分内存，而不是清理全部。

新生代对象到可能会被提升到老生代中

1. 该对象已经被 scavenge 回收过一次
1. to space 已分配的内存占了其 25%的大小，后续 to 空间分配内存可能会比较紧张，可以直接提升到老生代中。

命令行输出 gc 日志。

```bash
node --trace_gc -e "var a = [];for (var i = 0; i < 1000000; i++) a.push(new Array(100));" > gc.log
```

查看内存使用情况。

```js
// 进程的内存占用情况
//  process.memoryUsage()
{
   // resident set size 常驻内存
   rss: 13852672,
   // v8 总的堆内存
   heapTotal: 6131200,
   // v8 已使用的堆内存
   heapUsed: 2757120
}

// 操作系统内存占用
os.totalmem()
os.freemem()
```

node 的常驻内存除了 v8 的堆内存，另外的部分称作堆外内存，不受 v8 的内存分配大小限制，例如 Buffer。

`EventEmitter`的使用需要注意添加的监听函数（listener）在使用完成后需要主动移除，否则会导致`EventEmitter`本身不会被垃圾回收。

使用内存作为缓存时需要注意过期机制，例如 LRU，限制缓存大小无限增长。

内存泄漏查看工具 v8-profiler,chrome 的性能工具， node-heapdump, node-memwatch

## 事件循环

Reactor 模式

Hollywood Principle Don't call us, we will call you.

1. 核心是一个事件循环(Event Queue)，任务来源（IO、用户交互）等产生事件 Event，每个任务有对应的事件和回调函数（handler），一个事件可以对应一个或者多个 handler。
1. 产生的事件添加到事件队列中（event queue），这些异步任务的集合通过多路复用机制（Event Demultiplexer 操作系统提供）可以**同步**的等待直到任何任务完成后触发对应事件，这个过程在另外一个线程？。
1. 事件触发后控制权转移回主线程，依次处理所有被触发的事件，执行事件对应的回调函数，直到事件队列被清空。这个过程中回调函数可能产生新的任务并向事件队列中添加对应事件。
1. 事件队列清空后进入空闲状态（idle），结束一次事件循环的处理。

不同的操作系统提供各自不同的多路复用机制，linux 提供`epoll`，macos 使用`kqueue`，windows 使用 IO Completion Port API (IOCP)，同一个操作系统上不同类型的资源 I/O 行为也可能不一致，例如 macos 不支持非阻塞式的文件操作，所以必须使用另外一个线程来模拟，libuv 提供了同一个的抽象，屏蔽痛不同操作系统的细节。

1. https://zhuanlan.zhihu.com/p/93612337
1. pattern oriented Software Architecture
1. https://github.com/ppizarro/coursera/tree/master/POSA/Books/Pattern-Oriented%20Software%20Architecture
1. http://www.laputan.org/pub/sag/reactor.pdf
1. [A introduction to libuv](http://nikhilm.github.io/uvbook/)

## 异步模式

### 场景

1. 异步顺序执行 callback/promise/event emitter
   ```js
   // 利用递归函数的办法控制异步任务顺序执行callback
   function iterate(index) {
     if (index === tasks.length) {
       return finish()
     }
     var task = tasks[index]
     task(function () {
       iterate(index + 1)
     })
   }
   function finish() {
     //iteration completed
   }
   iterate(0)
   ```
1. 并行执行
   ```js
   var tasks = []
   var completed = 0
   tasks.forEach(function (task) {
     task(function () {
       if (++completed === tasks.length) {
         finish()
       }
     })
   })
   function finish() {
     //all the tasks completed
   }
   ```
1. 带有数量限制的并行

   ```js
   // 同时使用EventEmitter和callback
   class ParallelTasks {
     constructor() {
       super()
     }

     // 每个任务开始，成功，失败可以触发像相应事件
   }
   ```

代表一个异步过程的几种形式

1. callback
1. promise
1. generator co
1. 相关的库 async, tapable

### callback

1. callback 是最后一个参数
1. callback 函数的第一个参数代表 error，如果没有错误发生，error 是 null。

同步方式使用`throw`提升（propagating）错误到外层函数，异步的方式在回调函数中调用外层函数的回调函数`callback(err)`，直接抛出错误会导致错误提升到最外层，成为 UncaughtException。

```js
var fs = require('fs')
function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', function (err, data) {
    var parsed
    if (err)
      //propagate the error and exit the current function
      return callback(err)
    try {
      //parse the file contents
      parsed = JSON.parse(data)
    } catch (err) {
      //catch parsing errors
      return callback(err)
    }
    //no errors, propagate just the data
    callback(null, parsed)
  })
}
```

可以使用

```js
process.on('uncaughtException', function (err) {
  console.error(
    'This will catch at last the ' + 'JSON parsing exception: ' + err.message
  )
  //without this, the application would continue
  process.exit(1)
})
```

### promise

### EventEmitter

### 不要混合使用同步与异步

例如一个带有缓存的读取文件实现，有缓存时同步返回，无缓存时 callback 形式异步返回。使用者无法确定到底是同步还是异步，应该统一包装成异步的形式。

参考 https://blog.izs.me/2013/08/designing-apis-for-asynchrony/

```js
var fs = require('fs')
var cache = {}
function inconsistentRead(filename, callback) {
  if (cache[filename]) {
    //invoked synchronously
    callback(cache[filename])
  } else {
    //asynchronous function
    fs.readFile(filename, 'utf8', function (err, data) {
      cache[filename] = data
      callback(data)
    })
  }
}
```

统一成异步的形式

```js
var fs = require('fs')
var cache = {}
function consistentReadAsync(filename, callback) {
  if (cache[filename]) {
    process.nextTick(function () {
      callback(cache[filename])
    })
  } else {
    //asynchronous function
    fs.readFile(filename, 'utf8', function (err, data) {
      cache[filename] = data
      callback(data)
    })
  }
}
```

## 文件系统

### 异步 IO 的机制

异步 IO 的机制 libuv

轮询技术

1. read
1. select
1. poll
1. epoll
1. kqueue

线程池与阻塞 IO 模拟单个线程的异步 IO

性能测试 ApacheBench

```bash
ab -n 1000 -c 100 'http://localhost:3000'
```

https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/

1. AIO
1. libuv \*nix 自定义线程池 windows IOCP

异步 IO 不仅仅指文件，硬件、套接字所有计算机资源都可以被抽象成文件。

1. process.nextTick idle 观察者
1. setTimeout/setInterval IO 观察者
1. setImmediate check 观察者

事件循环

process.stdin 默认是 default 状态，无法读取数据，进程执行完会自动退出，使用`process.stdin.resume()`可以恢复 flowing mode 可以读取数据。

argv, argv0, cwd, env, exit, on('signal'), ansi escape code

### 监控文件变化

watch file api

fs.watch 性能高，使用操作系统提供的功能，但是存在兼容性问题
fs.watchFile 使用`stat`方法轮询实现，性能低，兼容性好。

### 递归的文件操作

1. 递归创建目录或者文件
1. 正则匹配目录下所有文件，递归形式的实现由于 Javascript 不支持尾递归在嵌套层次很深的情况下可能会爆栈

### 文件锁

[文件锁机制](https://www.perlmonks.org/?node_id=7058)，操作系统提供的[强制文件锁](https://www.kernel.org/doc/Documentation/filesystems/mandatory-locking.txt)或者协议机制的文件锁。`flock`三方模块`node-fe-ext`提供的机制。

例如要对`config.json`文件加锁，协议机制有两种做法。

1. 使用文件`config.lock`代表`config.json`被锁定。所有进程在读写`config.json`之前必须首先检测`config.lock`是否存在，已经存在的话代表文件`config.json`被锁定，不进行任何操作；如果不存在的话通过独占模式创建`config.lock`文件进行锁定。必须使用独占模式（O_EXCL）打开文件`config.lock`，保证此操作的原子性。

   ```js
   // x代表O_EXCL
   fs.writeFile('config.lock', process.pid, { flags: 'wx' }, (err) => {
     if (err) {
       return console.error(err)
     }
   })
   ```

1. 锁文件存在于网络设备上的话存在兼容性问题，某些系统在网络设备上不支持`O_EXCL`标志，可以使用`mkdir`创建文件夹，这个操作是原子性的，且没有兼容性问题。
   ```js
   fs.mkdir('config.lock', (err) => {
     if (err) {
       return console.error(err)
     }
     fs.writeFile('config.lock/' + process.pid, (err) => {
       if (err) {
         return console.error(err)
       }
     })
   })
   ```

对于文件操作完成后和进程退出时需要解除文件锁，删除掉对应的锁文件（夹）。

### 创建临时目录

```js
// 获取系统的临时目录路径 /var/folders/pt/_nynw_z11xx2fvyq8p8qs0fc0000gn/T
const temp = os.tmpdir()

// 路径前缀后边添加临时的6位字母数字组成
fs.mkdtemp(temp + '-back', (err, directory) => {
  if (err) {
    throw err
  }

  // 成功创建临时目录 /var/folders/pt/_nynw_z11xx2fvyq8p8qs0fc0000gn/T-backVg7E4P
  console.log('directory', directory)
})
```

需要创建临时文件的话在临时目录继续创建即可。

### API 的形式

1. 参数是文件路径 stat
1. 参数是文件路径 lstat 返回软链接文件本身的文件信息
1. 参数是文件描述符 fstat 返回文件对应的文件，软链接文件被展开找到最终指向的文件

同步

1. 异步 `fs.stat(path[, options], callback)`
1. 同步 `fs.statSync(path[, options])`
1. Promise `fsPromises.stat(path[, options])`

## Buffer

二进制字节流

Buffer  占用的内存不在 v8 的堆内存中，而是有 Node 的 C++层面实现内存申请与分配，采用 slab 分配机制，8KB 以下是小对象，以上是大对象。

小对象分配时会首先共用一个 `Buffer.poolsize`(默认为 8KB) 大小的 Slab，如果 Slab 中还有剩余空间则直接分配，Buffer 记录对象 parent 记录了所在 slab, offset 和 length 记录位置和偏移。当前 slab 空间不够时会申请新的 slab。

大对象直接分配指定大小的 slab。

```js
// 不使用pool，分配新内存，初始化fill
Buffer.alloc(size[, fill[, encoding]])

// 使用内置的pool,不初始化
Buffer.allocUnsafe(size)

// 不使用pool，不初始化
Buffer.allocUnsafeSlow(size)
```

Buffer 创建或者写入字符串数据是必须指定编码，同一个 Buffer 不同的位置可以使用不同的编码。

默认情况下新建的 Buffer 对应内存中不重置为 0，可以使用 `--zero-fill-buffers`参数启动 node，强制清空，但是性能影响较大。

`Buffer.allocUnsafe()` `Buffer.allocUnsafeSlow`。

内置支持的字符串编码，可以使用`Buffer.isEncoding(encoding)`判断是否支持编码，中文编码不支持，需要使用其他包`iconv`/`iconv-lite`实现。

ASCII
UTF-8
UTF-16LE/UCS-2
Base64
Binary
Hex

对于存储多字节文本编码的两个 Buffer 进行拼接时，可能存在读取的字节长度刚好将一个字符的编码截断的情况，解码为字符串时就会出现乱码，对于 utf-8 编码可以`buffer.setEncoding('utf-8')`，内部解码器保证不会截断编码，而将剩余不能构成一个字符的数据保存下来和后面的数据连在一起。这种方式支持内置的多字节编码 utf-8,utf-16,ucs-2。

也可以使用`Buffer.concat`将多个 Buffer 拼接后统一进行解码，这种方式支持任意类型的多字节编码。

Blob, TypedArray, ArrayBuffer, DataView, Buffer

## Stream

相比于 Buffer 空间更节省，时间上更快，可组合（composable）

```js
// non-flowing mode
process.stdin
  .on('readable', () => {
    process.stdin.read()

    // 内部buffer没有更多可读取的数据时返回null
    while ((chunk = process.stdin.read()) !== null) {
      console.log(`Chunk Read: length ${chunk.length}, ${chunk.toString()}`)
    }
  })
  // EOF  Ctrl+D on linux, Ctrl+Z on windows
  .on('end', () => {})

// flowing mode
process.stdin.on('data', (buffer) => {})
```

\_read()
read()
push()
readable

\_write()
write()
end

duplex

transform: transform flush 跨多个 chunk

```js
// callback是异步调用的结束回调
_transform(chunk, encoding, callback)
_flush(callback)
```

如何维持 chunk 的顺序

stream.PassThrough

readable.pipe(writable, [options])，

1. stream1 的数据自动写入到 stream2，
1. pipe 返回 stream2 本身，如果 stream2 同时又是 readable 的话可以形成链式调用。
1. stream1 的错误不会传递给 stream2，error 事件回调只会处理 stream2 本身产生的错误
1. 如果 stream2 本身出错，抛出 error 事件，pipe 会自动断开

```js
stream1.pipe(stream2).on('error', function () {})
```

1. from2-array
1. through2
1. readable-stream

作为流程控制的手段

1. sequential 多个文件顺序异步写入一个文件
1. parallel 多个文件并行异步写入一个文件 类似于 `Promise.all()`
1. limited parallel
1. ordered parallel 多个文件并行异步写入一个文件，且保持文件原有顺序 through2-parallel

控制流

1. combined stream 包 `multipipe`/ `combine-stream`，所有错误提升出来，pipe 不处理错误
1. forking stream
1. merging stream create tarball from multiple directories
1. multiplexing/multiplexer/mux demultiplexing/ demultiplexer/demux 实现一个 远程日志的多路复用案例，第一个字节代表 channelID，后四个代表长度，在后边是内容的 packet 格式，packet switching。

https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/

## 多进程

### 进程创建

默认异步方式创建子进程

1. `spawn` 创建子进程
1. `exec` 衍生 shell，在 shell 中执行命令
1. `fork` 衍生 Node 子进程，自动建立 IPC 通道

命令的定位

绝对路径、相对路径和名称，使用 PATH 环境变量列出的目录中寻找命令。

1. ENOENT 命令不存在
1. EACCES, EPERM 没有执行权限

#### spawn

输出类型 Buffer 缓存后提供数据多的话占用大量内存，或者使用 Stream（大量数据），数据产生后立马消费，响应更及时。

```js
var cp = require('child_process')
var child = cp.spawn('echo', ['hello', 'world'])
child.on('error', console.error)
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
```

#### execFile

`execFile` 直接衍生命令，由于没有衍生 shell，因此不支持 I/O 重定向和文件通配等行为，异步回掉参数中 stdout, stderr 是字符串类型。

默认 shell: false，不使用 shell。

#### exec

超时机制 timeout、缓存机制 maxBuffer，异步回掉函数参数

shell 参数默认是`/bin/sh`(unix) 或者`process.env.ComSpec` (Windows)

command 参数指定的命令在 shell 中执行，所以特殊字符需要转义，shell 的重定向文件通配符等所有功能都支持。
pipes, redirects, file blobs

```js
exec('echo "The \\$HOME variable is $HOME"')
```

同步版本

1.  `spawnSync`
1.  `execSync`
1.  `execFileSync`

#### detach

`detached: true `子进程与父进程脱离，父进程结束时子进程还可以独立运行。主进程仍然保留有子进程的引用，所以不会自动结束，需要

1. 需要手动结束 process.exit()
1. 等待子进程结束后自动结束
1. 使用`child.unref()`使的子进程从父进程的引用中删除，父进程不用等待子进程可以直接结束。

```js
var fs = require('fs')
var cp = require('child_process')
var outFd = fs.openSync('./longrun.out', 'a')
var errFd = fs.openSync('./longrun.err', 'a')
var child = cp.spawn('./longrun', [], {
  detached: true,
  stdio: ['ignore', outFd, errFd],
})
child.unref()
```

#### IO 处理

https://nodejs.org/api/child_process.html#child_process_options_stdio

#### 环境变量

#### shell

#### 事件

1. spawn 子进程初始化成功
1. message 子进程调用 process.send()时
1. error 子进程无法被复制、杀死、发送消息
1. exit 正常或者异常退出
1. close 输入输出流
1. disconnect IPC 通道关闭 主进程中调用`subprocess.disconnect()`或者子进程中调用`process.disconnect()`。

#### ChildProcess

### 进程间通信

父进程首先创建并监听 IPC 通道，然后创建子进程，通过环境变量 NODE_CHANNEL_FD 告诉子进程 IPC 通道的文件标识符，子进程创建时监听这个 IPC 通道，从而实现父子进程通信。

IPC 通道在不同操作系统下具体实现不同，被抽象为 Stream 对象。

只有创建的子进程时 Node 子进程时，子进程才会根据环境变量链接 IPC 通道，其他类型进程如果遵循相同的约定也可以实现 Node 父进程通信。

```js
const child = child
process.on('message', function (m) {})
```

#### 消息序列化

#### 发送句柄（handle）

http://nodejs.cn/api/child_process.html#child_process_subprocess_send_message_sendhandle_options_callback`

```js
const child_process = require('child_process')
const http = require('http')
const child = child_process.fork('./child.js')

const server = http.createServer()

process.send('msg', server)

process.on('message', function (msg, server) {})
```

句柄类型

1. `net.Socket`
1. `net.Server`
1. `net.Native`
1. `dgram.Socket`
1. `dgram.Native`

句柄类型消息发送到 IPC 通道被封装成消息

```js
{
   handle: FD,
   message: {
      cmd: 'NODE_HANDLE',
      type: 'net.Server',
      msg: message
   },
}
```

消息类型`NODE_`开头，触发内部事件`internalMessage`，子进程用相同的文件句柄（FD）和消息类型`net.Server`构建新的`net.Server`实例，并监听文件句柄。

### 集群稳定性

稳定性

1. message, exit, error 事件处理，error 后主动结束子进程
1. 子进程异常处理 自杀信号、断开连接超时限制
1. 子进程自动重启 限量重启
1. 进程池
1. 负载均衡，平均分配计算任务 Round-Robin
1. 日志

### cluster 模块

封装了 child_process 和 net 模块功能

## Networking

### TCP

#### 数据帧格式

传输二进制字节流，数据帧 packet， 固定 20 个字节的头部和数据部分

1. 2 个字节 源端口 port ，2 \*\* 16，端口号范围 0 ~ 65535
1. 2 个字节 目标端口
1. 4 个字节 序号
1. 4 个字节，确认号
1. 2 个字节
   1. 数据偏移 数据部分到数据帧起始处的偏移量，也就是报文头部的长度，20 个字节。
   1. ACK 建立连接后的所有数据帧 ACK 都必须设置为 1
   1. 同步 SYN， SYN=1,ACK=0 是请求建立连接保温，SYN=1,ACK=1 同意建立连接的响应报文。
   1. FIN, FIN=1
1. 2 个字节 窗口
1. 2 个字节 校验和

1. 面向连接 connection，保证数据的顺序
1. 流量控制 flow control
1. 拥塞控制 congestion control

nagle's algorithm socket.setNoDelay(true)

三次握手

1. 客户端将 SYN 设置为 1，产生随机值 seq=J，将请求发送个服务器端，客户端进入 SYN_SENT 状态
1. 服务器端收到请求 SYN 为 1 客户端希望建立连接，将 SYN,ACK 都设置为 1，ack=J+1，产生 seq=K 随机值，发给客户端，服务器进入 SYN_RCVD 状态
1. 客户端收到数据，检查 ack 是否为 J+1，是的话讲 ACK 设置为 1，ack=K+1 发送给服务器，服务器确认 ack=K+1，完成三次握手，都进入 ESTABLISHED 状态。

服务器在第三次握手后才确认与客户端建立连接，防止客户端在第一次请求滞留网络导致超时后自动发起第二次连接请求，这样会到造成服务器与客户端重复建立连接。

四次挥手

1. 第一次 客户端设置 seq 和 ACK，向服务器发送 FIN，客户端进入 FIN_WAIT_1
1. 第二次 服务端收到 FIN，向客户端发送 ACK
1. 第三次 服务端在剩余数据传输完成后向客户端发送 FIN，进入 LAST_ACK
1. 第四次 客户端收到 FIN，向服务器端发送 ACK 进入 TIME_WAIT，服务端收到 ACK 后关闭连接。客户端等待 2MSL（数据帧在网中的最大存活时间）没有收到回复，表明服务端正常关闭，客户端关闭连接。

1. 面向连接 connection，保证数据的顺序
1. 传输二进制字节流
1. 流量控制 flow control
1. 拥塞控制 congestion control

收到代表数据流结束 FIN 数据帧会触发 `end`事件；如果 TCP 连接发生错误，触发`error`事件，两种情况都会触发`close`事件，代表连接被关闭。

及其简单的聊天示例

```js
const net = require('net')
const chalk = require('chalk')

const users = {}

net
  .createServer((conn) => {
    conn.setEncoding('utf-8')

    console.log(chalk.green('new connection'))

    conn.write(
      [
        `welcome to ${chalk.green('node-chat')}`,
        `${Object.keys(users).length} other people are connected at this time.`,
        'please write your name and press enter: ',
      ]
        .map((e) => `> ${e} \n`)
        .join('')
    )

    conn.on('data', (data) => {
      const nickname = data.replace('\r\n', '')
      if (Object.keys(users).includes(nickname)) {
        conn.write(`name ${chalk.yellow(nickname)} already in use.`)
        return
      } else {
        users[nickname] = conn

        console.log('users: ', Object.keys(users))
        for (const user in users) {
          users[user].write(`user ${chalk.green(nickname)} joined the room\n`)
        }
      }
    })

    conn.on('close', () => {
      let leavingUser = ''
      for (const user in users) {
        if (users[user] === conn) {
          leavingUser = user
          delete users[user]
          break
        }
      }

      for (const user in users) {
        users[user].write(`user ${chalk.yellow(leavingUser)} leaved chat room`)
      }
    })
  })
  .listen(3000, () => {
    console.log('\033[96m   server listening on *:3000\033[39m')
  })
```

socket = IP + Port

1. Ethernet Packet Receiver Mac + Sender Mac + Data
1. IP Packet Receiver Address + Sender Address + Data
1. TCP Packet Receiver Port + Sender Port + Data

### UDP

datagram

### HTTP

1. llhttp https://github.com/nodejs/llhttp
1. https://developer.mozilla.org/zh-CN/docs/Web/HTTP

事件

1. connection TCP 链接建立触发，多个 HTTP 请求可能通用一个 TCP 连接 Keep-Alive
1. request 在服务器端 server 对象上触发
1. close
1. checkContinue
1. connect
1. upgrade
1. clientError

http.ClientRequest
http.Server
http.ServerResponse
http.Agent
http.IncomingMessage
http.OutgoingMessage

默认有一个全局的客户端代理对象 http.globalAgent 对所有发出请求进行管理，默认允许最多 5 个 TCP 连接。

`CONNECT`方法由客户端发起，代理服务器接收后应当直接或者通过其他代理服务器间接将请求转发给目标服务器，如果客户端接收到成功的响应，则认为与服务器建立的隧道 tunnel，
所有代理服务器进入隧道模式，将后续客户端与目标服务器之间的请求只进行转发，不做任何额外处理。

如果服务器直接接收到`CONNECT`请求，则返回 2xx 响应表示隧道建立成功。

```HTTP
CONNECT server.example.com:80 HTTP/1.1
Host: server.example.com:80
Proxy-Authorization: basic aGVsbG86d29ybGQ=
```

隧道模式的意图是在客户端与服务器之间直接传递二进制数据，所以服务器的返回不应该含有 Transfer-Encoding 和 Content-Length 头，客户端接也应该忽视这两个头。

### DNS

dns module

### HTTP2

### HTTPS

### websocket

Smashing NodeJs Javascript Everywhere Ch10, Ch10

## 数据库

1. Smashing NodeJs Javascript Everywhere 12/13/14
1. NodeJs In Action 5

## 设计模式

# NodeJs Design Patterns 4

### HTTP

llhttp https://github.com/nodejs/llhttp

## Design Patterns

设计模式

A design pattern is a reusable solution to a recurring problem.

### plugins

插件设计机制 webpack/eslint/rollup/

程序预留的可以扩展的功能点叫做 extension point，插件都是针对 extension point 进行扩展。

### Factory

工厂函数、封装隔离内部变量和具体实现，只通过参数确定结果，面向接口编程。一些库只导出一个工厂函数，内部实现类不导出，例如`http.createServer()`。

### Proxy

1. Data Validation
1. Security
1. Caching
1. Lazy initialization
1. Logging
1. Remote Object
1. Vue Reactive Object Proxy

实现 Proxy 可以直接修改原有对象属性（object augmentation、monkey patching），也可以使用组合方式（composition）。这里的组合指面向对象编程中类 A 中成员 b 是类 B 的实例，A 以组合的方式使用 B，组合是相对于继承的方式而言的。JS 中可以使用组合，更直接的可以使用闭包将对象封装到函数作用中，直接使用对象。

```js
function Proxy(object) {
  const proto = Object.getPrototypeOf(object)

  const proxiedObject = Object.create(proto)

  ;[
    ...Object.getOwnPropertySymbols(object),
    ...Object.getOwnPropertyNames(object),
  ].forEach((key) => {
    Object.defineProperty(proxiedObject, key, {
      get() {
        return object[key]
      },
      set(value) {
        object[key] = value
      },
    })
  })

  return proxiedObject
}
```

### Decorator

Proxy 模式强调对于原有对象添加中间层，在中间层中做拦截、限制；修饰器强调对于对象做功能增强。[代理与修饰器模式区别](https://stackoverflow.com/questions/18618779/differences-between-proxy-and-decorator-pattern)

> 1. Decorator informs and empowers its client.
> 2. Proxy restricts and disempowers its client.

这两种模式实现的手段是相同的，可以使用组合或者对象增强，强调的目的是不同的。

### Adapter

将对象包装成满足要求的接口实例

1. level-filesystem 库将 leveldb 包装成 Node 的 fs 模块的接口，允许我们使用不同文件系统的 api，实际上使用 leveldb 存储数据。
1. axios 库在浏览器上使用 XHR，在 Node 上使用 http 模块，包装成同样的接口。

### Strategy

针对同一个问题存在一系列不同解决策略，根据外在条件决定具体需要使用的策略，所有这些策略实现为相同接口的对象。

### State

与 Strategy 模式类似，区别在与策略根据内部状态确定后不能够再改变。

### Template

Template 定义了一个**固定的处理流程模板**，模板中存在某些步骤是可以有不同的实现，某个步骤可以采取 Strategy 模式实现不同的策略。

例如 NodeJS 中的 Stream，暴露出`_write()/_reader()/_transform()/_flush()`等方法待实现，流本身的处理逻辑是一个固定的模板。

### Middleware

代表一个处理流程（pipeline）中的一个步骤 Middleware

1. connect/express/koa 等 web 框架的请求处理流程
1. zeromq 库的 middleware

### Command

命令模式

1. 文本编辑器中、浏览器中实现粘贴、拷贝等动作

### 异步模块加载

通过一个队列记录回调函数，在异步操作完成后触发，使用方只需正常调用 API 即可，回调保证自动触发，不用关心异步操作何时完成。

1. promise 的回调函数
1. leveldb 数据的读写操作，需等待数据库连接建立，这是个异步过程。

### Caching & Batching

批处理（batching）将几个连续的相同请求合并为一个，完成后统一触发回调。缓存在请求完成对结果进行保存，对相同请求直接返回已有结果，不触发再次处理。Caching 需要配合批处理使用，因为可能在没有缓存的情况下，可能有多个相同请求并行存在，会造成缓存在多个请求完成后被多次设置。

缓存策略

1. Least Recently Used 确保常量大小的缓存
1. 分布式缓存 Redis Memcached
1. 缓存失效策略
1. https://coolshell.cn/articles/20793.html

https://coolshell.cn/articles/17416.html

### CPU Bound Tasks

1. 使用`setImmediate()`将运行时间很长的同步任务拆分成多个短任务，穿插（interleave）到 I/O 请求中。任务串行
1. 使用子进程`child_process`或者`WebWorker`执行任务，任务可以并行，可以使用和 CPU 核心数相同的进程来最大程度利用 CPU 的并行能力。
1. 使用子线程拆分任务`webworker_threads`

## 数据库

1. levelup leveldb
1. mysql
1. mongo

## 高性能

1. NodeJs High Performance

## Scalability

1. 《NodeJs Design Patterns》Chapter 7: Scalability and Architectural Patterns 321

## Messaging System

1. The book, Enterprise Integration Patterns, by Gregor Hohpe and Bobby Woolf
1. 《NodeJs Design Patterns》Chapter 8: Messaging and Integration Patterns
