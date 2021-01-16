# babel

## 配置

配置文件

1. 项目级别，对整个项目中的所有文件都生效
   1. `babel.config.json`或者其他后缀（`.js`，`.cjs`，`.mjs`）
1. 文件级别，对文件所在目录及所有子目录中文件生效
   1. `.babelrc.json`或者其他后缀(.babelrc, .js, .cjs, .mjs)
   1. `package.json`中的`babel`字段

## 其他

1. 编译 babel https://github.com/jamiebuilds/the-super-tiny-compiler
1. 配置文件与配置合并策略 include/exclude/test/only/overrides/env, 插件 plugin/preset name normalization
1. 编译阶段 语法插件 syntax plugin, 转换阶段 transform plugin
1. ast 类型定义 @babel/types @babel/template，ast 转换 @babel/traverse 遍历机制 dfs
1. babel 项目之间的依赖关系
   1. @babel/core @babel/parser @babel/traverse @babel/cli @babel-node @babel plugins @babel presets
1. https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/user-handbook.md
1. https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
