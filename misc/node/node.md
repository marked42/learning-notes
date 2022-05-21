# Node

## 文件系统

### 异步 IO 的机制

异步 IO 的机制 libuv

node EventLoop
https://www.youtube.com/watch?v=zphcsoSJMvM
https://www.youtube.com/watch?v=P9csgxBgaZ8

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

# Materials

1. [child-process](https://jscomplete.com/learn/node-beyond-basics/child-processes)
1. [event-driven](https://jscomplete.com/learn/node-beyond-basics/node-events)
1. [stream](https://jscomplete.com/learn/node-beyond-basics/node-streams)
