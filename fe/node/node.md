# Node

TOC

书籍

1. 深入浅出 Nodejs
1. Smashing NodeJs Javascript Everywhere
1. NodeJs Design Patterns
1. NodeJs High Performance
1. NodeJs In Action
1. NodeJs In Practice
1. NodeJs 开发指南

专题

1. Node 模块机制
   1. ch 1.2
   1. Node.js：来一打 C++ 扩展
   1. 2.4/2.15/3.1/3.5/3.6 sharing code with browser
   1. 6.13
   1. 7.3.1/7.3.3/7.4.1/7.6.1
1. File System fs/path
   [x]. ch 1.3
   [x]. 2.3/2.5
   1. 6.6
   1. 7.4.4
1. 异步编程
   1. 1.4
   1. 3.2
   1. 5.3
   1. 7.6.2
1. v8 内存管理
   1. 1.5
   1. 4.3
1. Buffer
   1. 1.6
   1. 6.3
1. Events
   1. 6.4
   1. 7.4.3
1. Stream
   1. 3.3
   1. 6.5
1. 多进程 Child Process
   1. 1.9
   1. 6.8
1. Networking TCP/HTTP
   1. 1.7
   1. 2.6/2.7/2.10/2.11
   1. 5.13
   1. 6.7
1. web 服务
   1. 1.8
   1. 2.8/2.9
   1. 5
   1. 6.9
   1. 7.5
1. 性能
   1. 3.7/3.8
   1. 4
1. 数据库
   1. 2.12/2.13/2.14
   1. 5.5
1. 测试
   1. 1.10
   1. 2.16
   1. 5.10
   1. 6.10
   1. 7.3.4
1. 产品化
   1. 1.11
   1. 6.12
   1. 7.6.3
1. 设计模式
   1. 3.4

## 文件系统

异步 IO 的机制

轮询技术

1. read
1. select
1. poll
1. epoll
1. kqueue

线程池与阻塞 IO 模拟单个线程的异步 IO

1. AIO
1. libuv \*nix 自定义线程池 windows IOCP

异步 IO 不仅仅指文件，硬件、套接字所有计算机资源都可以被抽象成文件。

1. process.nextTick idle 观察者
1. setTimeout/setInterval IO 观察者
1. setImmediate check 观察者

process.stdin 默认是 default 状态，无法读取数据，进程执行完会自动退出，使用`process.stdin.resume()`可以恢复 flowing mode 可以读取数据。

watch file api

事件循环

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
