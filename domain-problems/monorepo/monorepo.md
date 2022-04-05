# 为什么要使用 Monorepo

volta

1. typescript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html)
1. monorepo lerna [version](https://cloud.tencent.com/developer/article/1883133),[publish](https://cloud.tencent.com/developer/article/1883132)

选择一个包安装在 workspace level 还是 package level，尽量使用 workspace level，这样只需要安装一份。
只在目标包可能每个包需要同时存在不同的版本时选择 package level。

# jsonc

配置文件的格式选取，JSON 文件不支持注释，可以修改 VSCode 的 file-association 选项，但是某些工具本身支持严格的 json 格式。

# workspaces

包管理器

yarn/pnpm/npm

1. pnpm https://zhuanlan.zhihu.com/p/404784010
1. https://pnpm.io/motivation
1. https://pnpm.io/npmrc
1. https://zhuanlan.zhihu.com/p/448058464

介绍 workspace 的概念

```json
{
  "workspaces": ["packages/*"]
}
```

# Typescript

TODO: 需要一篇文章专门解释 typescript 的 tsconfig 文件配置，包括 extends/composite/references 等选项。
references 引用的几个项目之间是否共享 typing？

tsc --showConfig 显式当前路径下使用的 tsconfig.json 配置。

.ts 文件使用的类型信息来自于最近的 tsconfig.json 文件所使用的配置，

单个文件使用`extends`字段继承公共配置，使用`composite`字段表示组合项目

```json
{
  "extends": "../tsconfig.settings.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

另外一个`tsconfig.json`配置文件引用所有项目，使用`tsc -b .`会打包所有引用项目

```json
{
  // 设置files为空，否则默认包含packages目录下所有*ts文件作为输入，test中的文件也会被打包
  "files": [],
  "references": [{ "path": "utils" }, { "path": "types" }]
}
```

使用`tsc --showConfig`可以查看当前项目的最终配置

位于组合项目中的两个项目共享 type 信息

使用 tsconfig.json#references 功能进行 incremental build？

# .gitignore

https://github.com/lerna/lerna/tree/main/commands/version#--conventional-commits

# 格式问题

## EditorConfig

## Prettier

# 调试

## VSCode Debugger

调试技巧

# ESLint

安装一个 eslint 包，但是每个 package 使用的.eslintrc 配置不相同

编辑器 vscode 要求.eslintrc 位于项目的根目录，对应的

```bash
yarn add -WD eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

eslint 配置如下，其中@typescript-eslint/parser 会使用 ts 进行类型信息检查

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "ecmaVersion": 12
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "prefer-const": "error",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"]
  }
}
```

vscode 的 ESLint 插件配置选项 eslint.validate 中不要包含.json，否则 package.json 文件被 eslint 检查并报错

https://eslint.org/docs/user-guide/integrations#source-control

[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 将 eslint 配置中与 prettier 冲突的规则关闭
[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 将 prettier 错误当成 eslint 错误

# prettier

# Jest

typescript 配合 jest 使用 ts-jest
https://kulshekhar.github.io/ts-jest/docs/26.5/guides/using-with-monorepo/
https://jestjs.io/docs/next/configuration#projects-arraystring--projectconfig

如何只为`*.test.ts` 文件引入 jest 类型，全局禁用 jest

为 test 文件夹和配置单独的 tsconfig，引入 types: jest

1. jest 支持 typescript， @types/jest 包为提供类型声明，如何为指定文件添加类型声明，因为只有测试文件才需要，普通文件中不需要 test 相关的类型声明。

TODO: 如何配置 jest

jest 对于 ts 文件默认使用 babel 进行处理

1. babelrc + typescript-jest https://www.bilibili.com/video/BV1X34y1674y?p=6 而不是 ts-jest

```bash
yarn add -D @babel/preset-env @babel/preset-typescript
```

测试文件中最好使用`../src`相对路径的方式引用依赖包，这样包名发生变化不需要代码，使用绝对路径的方式引入需要当前源码包有打包产物，否则获取不到对应的 types 文件产生报错。

```ts
import { isChannel, isMessage, isTeam, isTypedArray } from '@shlack/types'
```

```js
export default {
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
}
```

## 测试覆盖率

code coverage

https://egghead.io/lessons/javascript-releasing-a-version-to-github

# scripty

两个 level 的 script

packages workspace

yarn lint ok, npm run lint error ? eva

# 提交

commitlint

使用[Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/)规范定义的提交规范，格式如下。

```txt
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

命令行工具[commitlint](https://www.google.com/search?q=commitlint&oq=commitlint&aqs=chrome..69i57j69i59j69i60l2.3343j0j4&sourceid=chrome&ie=UTF-8)用来对提交信息的格式进行检查，使用库 husky 来注册`commit-msg`钩子，在提交时自动进行信息格式检查。

```bash
yarn add -W -D commitlint @commitlint/cli @commitlint/config-conventional @commitlint/config-lerna-scopes husky
yarn add -W -D commitizen cz-conventional-changelog
```

配置文件

```js
// commmitlint.config.js
module.exports = {
  extends: [
    "@commitlint/config-conventional"
    // lerna monorepo增加每个包名作为合法的scope
    "@commitlint/config-lerna-scopes"
  ]
};
```

根据官网的[指导](https://typicode.github.io/husky/#/?id=automatic-recommended)安装 husky 的钩子，[新版的配置方式有变化](https://blog.typicode.com/husky-git-hooks-javascript-config/)，不再使用 husky.config.js 或者 package.json 进行配置，而是使用.husky 文件夹。

需要配置 husky hook

```bash
yarn add -WD husky
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

# 发布

## 日志配置

[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
[conventional changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)
[lerna conventional commits](https://github.com/lerna/lerna/tree/main/commands/version#--conventional-commits)

## 正式发布

```bash
# 手动选择版本
lerna version

# 自动选择版本
lerna version --conventional-commits

# 正式发布
lerna publish
```

发布失败如何处理？

```bash
lerna publish from-git
```

lerna 并不支持[单独只发布一个包](https://github.com/lerna/lerna/issues/1691)因为这会破坏 lerna 判断哪些包应该发布的机制。

## vodeciso

# .npmrc

1. 添加删除依赖不要使用单独的 npm 命令，会破坏模块之间的软链接，造成问题。

# lerna

workspace level dependency

rush/lerna

```json
{
  // use workspaces by yarn
  "useWorkspaces": true
}
```

## 启动环境

```bash
yarn install
# 或者
lerna bootstrap --npm-client yarn --use-workspaces
```

## 安装、删除依赖

1. 但个包
1. 所有包
1. 根目录安装，一般是公共的开发依赖

```sh
yarn workspace packageB add packageA
yarn workspaces add packageA
yarn add -W -D packageA

yarn workspace packageB remove packageA
yarn workspaces remove lodash
yarn remove -W -D typescript
```

## 清理环境

删除掉所有的 node_modules 文件以及每个包的打包产物

```bash
lerna clean # 清理所有的node_modules
yarn workspaces run clean # 执行所有package的clean操作
```

## 打包

使用 lerna 按照包的依赖顺序打包

```js
lerna run --stream --sort build
```

# Rush

1. https://github.com/microsoft/rushstack
1. https://rushjs.io/

# CI/CD

# 文档编写

## Badges

https://shields.io/

# 参考资料

TODO:

1. 参考大型开源项目的配置 babel/react/jest
1. monorepo typescript starter

1. [All in one：项目级 monorepo 策略最佳实践](https://fed.taobao.org/blog/taofed/do71ct/uihagy/?spm=taofed.homepage.article-section.1.42c35ac8iKoJ2K)
1. [Monorepos - A Beginner's Guide](https://www.bilibili.com/video/BV1vq4y1w7Qe)
1. [Javascript and Typescript Monorepos](https://www.bilibili.com/video/BV1X34y1674y)
1. [在 GitHub 上构建 Monorepos【中英字幕】](https://www.bilibili.com/video/BV1GL4y1G7Yg) 使用 Rush

1. https://zhuanlan.zhihu.com/p/354649322
