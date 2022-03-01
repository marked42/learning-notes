# 分析 babel 项目

1. 分析项目结构
1. ast 节点类型定义 builder 如何构造节点
1. 使用 make build

## 包分类

`babel`的[仓库](https://github.com/babel/babel/tree/main/packages)使用 Monorepo 的方式组织，所有包统一发布到`@babel`前缀下。

| 包                | 功能                                                     |
| ----------------- | -------------------------------------------------------- |
| @babel/core       | 核心功能                                                 |
| @babel/cli        | 命令行工具                                               |
| @babel/preset-\*  | 预设                                                     |
| @babel/plugin-\*  | 插件                                                     |
| @babel/parser     | 语法分析                                                 |
| @babel/traverse   | AST 遍历                                                 |
| @babel/generator  | AST 生成 JS 代码                                         |
| @babel/types      | AST 节点功能                                             |
| @babel/runtime    | 运行时                                                   |
| @babel/polyfill   | 功能垫片                                                 |
| @babel/standalone | 运行在浏览器上的版本，不能使用文件操作等 Node 提供的功能 |
| @babel/register   | 动态编译                                                 |

TODO: 分析 babel/register 实现
