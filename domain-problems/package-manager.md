# 包管理器

1. [Tiny Package Manager](https://github.com/g-plane/tiny-package-manager)
1. https://juejin.cn/post/6929317820362653703

# 树形结构

[安装算法](https://docs.npmjs.com/cli/v6/commands/npm-install/#algorithm)

1. [循环依赖的问题](https://docs.npmjs.com/cli/v6/commands/npm-install#limitations-of-npms-install-algorithm) 为了避免无限循环，不重复安装，包直接依赖自身
1. 依赖地狱 dependency hell 依赖太深造成路径太长，windows 平台有问题
1. 同一个包的同一个版本重复安装问题 Doppelganger Dependency
1. 包的树结构和依赖的处理顺序无关

# 查看树形结构

npm list

## 如何构建包依赖树

1. 安装速度慢的问题，npm 单线程顺序下载

从当前包的 package.json 开始

1. 每个节点构建是异步的
1. 根节点的依赖项是新的 package.json dependencies 数据

每个节点的构建

1. 输入是 包名 name + 约束 constraint
1. 输出是 包名 name + 版本 + dependencies + dist { shasum, tarball }

# 提升包 hoist

将包尽可能提升到顶层以避免重复安装问题

https://github.com/npm/npm/issues/6912

https://github.com/npm/cli/blob/v3.0.0/lib/install/flatten-tree.js

需要一个例子

包提升的方法

1. 顶层不存在的话直接提升到顶层
1. 顶层存在但是版本不满足要求，在顶层的下一层安装，父目录为 stack[stack.length - 1]
1. 顶层版本满足所有中间版本要求，不需要再继续解析依赖
1. 顶层存在满足版本要求，但是不满足中间某个库的依赖要求

这个方法解决了半个问题，又带来了两个新问题

1.  解决半个问题指的是 无法避免所有的包重复问题
1.  幽灵依赖问题 Phantom Dependency [pnpm 解决幽灵依赖](https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html)
1.  包的树结构和处理依赖的**顺序相关**

# pnpm 的方法

PNPM Author [Zoltan Kochan](https://www.kochan.io/)

全局 store + 局部 store + 软链接方式

npm-like-im-5 [Github](https://github.com/npm/npm-like-im-5) [GitBook](http://npm.github.io/npm-like-im-5/)

[Flat node_modules is not the only way](https://pnpm.io/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
[Why should we use pnpm?](https://www.kochan.io/nodejs/why-should-we-use-pnpm.html)

[pnpm's strictness helps to avoid silly bugs](https://www.kochan.io/nodejs/pnpms-strictness-helps-to-avoid-silly-bugs.html)

[Symlinked `node_modules` structure](https://pnpm.io/symlinked-node-modules-structure)

# 同一个包同时依赖另外一个包的两个版本

alias 的做法

依赖的不同分类，有何区别？

1. dependencies
1. devDependencies
1. peerDependencies
1. bundleDependencies
1. optionalDependencies

# lock 机制

# cli 工具包

```json
{
  "find-up": "^4.1.0",
  "fs-extra": "^7.0.0",
  "js-yaml": "^3.12.0",
  "log-update": "^2.3.0",
  "node-fetch": "^2.2.0",
  "progress": "^2.0.0",
  "semver": "^5.5.1",
  "tar": "^4.4.6"
}
```

1. tar
1. log-update/progress

NPM Creator & CEO [Isaac Z. Schlueter](https://izs.me/)

[NPM first commit](https://github.com/npm/cli/commit/4626dfa73)
