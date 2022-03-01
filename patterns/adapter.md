### Adapter

将对象包装成满足要求的接口实例

1. level-filesystem 库将 leveldb 包装成 Node 的 fs 模块的接口，允许我们使用不同文件系统的 api，实际上使用 leveldb 存储数据。
1. axios 库在浏览器上使用 XHR，在 Node 上使用 http 模块，包装成同样的接口。
