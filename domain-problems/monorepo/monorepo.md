# 为什么要使用 Monorepo

volta
commitlint
vodeciso

1. typescript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html)
1. monorepo lerna [version](https://cloud.tencent.com/developer/article/1883133),[publish](https://cloud.tencent.com/developer/article/1883132)

选择一个包安装在 workspace level 还是 package level，尽量使用 workspace level，这样只需要安装一份。
只在目标包可能每个包需要同时存在不同的版本时选择 package level。

# workspaces

yarn

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

# .gitignore

# ESLint

安装一个 eslint 包，但是每个 package 使用的.eslintrc 配置不相同

编辑器 vscode 要求.eslintrc 位于项目的根目录

```bash
yarn add -WD eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

# prettier

# Jest

typescript 配合 jest 使用 ts-jest
https://kulshekhar.github.io/ts-jest/docs/26.5/guides/using-with-monorepo/
https://jestjs.io/docs/next/configuration#projects-arraystring--projectconfig

如何只为`*.test.ts` 文件引入 jest 类型，全局禁用 jest

为 test 文件夹和配置单独的 tsconfig，引入 types: jest

TODO: 如何配置 jest

1. babelrc + typescript-jest https://www.bilibili.com/video/BV1X34y1674y?p=6 而不是 ts-jest

# scripty

两个 level 的 script

packages workspace

# changelog

# commitlint

# .npmrc

1. 添加删除依赖不要使用单独的 npm 命令，会破坏模块之间的软链接，造成问题。

# lerna

workspace level dependency

rush/lerna

# 包管理器

yarn/pnpm/npm

# 参考资料

TODO:

1. 参考大型开源项目的配置 babel/react/jest
1. monorepo typescript starter

1. [All in one：项目级 monorepo 策略最佳实践](https://fed.taobao.org/blog/taofed/do71ct/uihagy/?spm=taofed.homepage.article-section.1.42c35ac8iKoJ2K)
1. [Javascript and Typescript Monorepos](https://www.bilibili.com/video/BV1X34y1674y)
1. [在 GitHub 上构建 Monorepos【中英字幕】](https://www.bilibili.com/video/BV1GL4y1G7Yg)
1. [Monorepos - A Beginner's Guide](https://www.bilibili.com/video/BV1vq4y1w7Qe)
