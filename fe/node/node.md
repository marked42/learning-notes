# Node

TOC

1. Node 模块
   1. Node.js：来一打 C++ 扩展
1. Buffer
1. Events
1. Stream
1. Child Process
1. Networking TCP/HTTP
1. File System fs/path

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

## Books

1. [Process](https://nodejs.org/api/process.html)
1. [Child Process](https://nodejs.org/api/child_process.html#child_process_class_childprocess)
1. _Node.js In Action_
1. _Node.js In Practice_
1. _Node.js 开发指南_
1. _Web Development with Node and Express_
1. _Node.js Design Patterns_
