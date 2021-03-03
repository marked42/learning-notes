# Vue CLI

pkg context/package.json

```json
{
      name,
      version: '0.1.0',
      private: true,
      // plugins
      devDependencies: {},
      resolvePkg(context),
}
```

resolvePlugins

1. preset plugins
   1. 按照 preset plugins 的顺序，但是@vue/cli-service 在最前
   1. 每个 plugin 如果`prompts: true`，则提示 prompt 获取 option
   1. 最终得到 plugins 数组 Array<{ id, apply: generator, options }>
1. all plugins (from dependencies/devDependencies)
1. 收集 invokeCbs 和 anyInvokeCbs

提取 configFiles resolveFiles

1. render
1. injectImports(file, imports: string | string[]) 自动去重
1. injectRootOptions(file, options: string | string[]) new Vue({ router, vuex })
1. postProcess

render(o: string | object | Function, )

`vue create my-project` 创建项目，内置的 plugins 。

`@vue/cli-service`

EJS 模板渲染时的数据，

```json
{
  // 额外的参数 api.render('file-path', {})
  // 插件参数
  "options": {},
  // 全局参数
  "rootOptions": {
    "projectName ": "my-project ",
    "vueVersion ": "2 ",
    "router ": true,
    "vuex ": true,
    "cssPreprocessor ": "node-sass ",
    "plugins ": {
      "@ai/vue-cli-plugin-flow": {},
      "@vue/cli-plugin-babel ": {},
      "@vue/cli-plugin-eslint ": {},
      "@vue/cli-plugin-router ": {},
      "@vue/cli-plugin-typescript ": {},
      "@vue/cli-plugin-vuex ": {}
    }
  },
  // 当前插件信息
  "plugins": [
    {
      "name ": "flow",
      "link ": "https://www.npmjs.com/package/@ai%2Fvue-cli-plugin-flow"
    }
  ]
}
```

1. 新增文件
1. 修改现有文件
1. 覆盖现有文件
1. 删除文件 ?

## extendPackages

1. 修改现有配置文件，例如 .eslintrc.js

## completion hooks

## registry 选项解析

## vue add 命令

1. 包名（NPM 包目录名称）只能小写字母、'-'、'@'、'/'且不能太长，具体规则参考[文档](https://github.com/npm/validate-npm-package-name#naming-rules)，

```js
const validatePackageName = require('validate-npm-package-name')
const result = validatePackageName('@scope/some-package')
const expectedResult = {
  // 是合法的新包名 errors, warnings为空
  validForNewPackages: false,
  // 是合法的旧包名 errors为空，可以有warning
  validForOldPackages: true,
  errors: [
    'name cannot contain leading or trailing spaces',
    'name can only contain URL-friendly characters',
  ],
  warnings: [
    'name can no longer contain capital letters',
    'name can no longer contain more than 214 characters',
  ],
}
```

1. 目标文件夹已经存在时，提醒用户选择合并（merge）、或者覆盖方式（overwrite），分别对应命令行参数`--merge`和`-f, --force`。

1. --preset --inlinePreset --default
1. 交互式选择 preset

   1. 首先获取 preset 的列表
   1. .vuerc 文件中的 preset
   1. Default
   1. Default (Vue 3)
   1. 手动模式

1. 交互式问答提醒用户输入参数。

四种类型 prompt

```js
const prompts = [
  this.presetPrompt,
  // 手动模式开启，feature是checkbox类型
  this.featurePrompt,
  ...this.injectedPrompts,
  ...this.outroPrompts,
]
```

环境检测 lru-cache https://www.npmjs.com/package/lru-cache

1. 获取本地或者远程的 preset。 download-git-repo

默认的 preset 的格式

```js
{
  useConfigFiles: boolean,
  "vueVersion": '2' | '3'
  bare: boolean,
  router: boolean,
  routerHistoryMode: boolean,
  vuex: boolean,
  cssPreprocessor: 'sass'| 'dart-sass'| 'less'| 'stylus',
  plugins: {},
  configs: {},
}
```

preset 需要经过处理

1. 注入 @vue/cli-service { bare: true } 是内置的第一个 plugin，名称不需要符合 vue-cli 模式。
1. router -> @vue/cli-plugin-router { historyMode: true } 必须在@vue/cli-plugin-typescript 之前执行。
1. vuex -> @vue/cli-plugin-vuex
1. cssProcessor -> @vue

1. router, routerHistoryMode @vue/cli-plugin-router
1. vuex @vue/cli-plugin-vuex
1. @vue/cli-plugin-typescript 要在@vue/cli-plugin-router 后面

preset 中的指定的 plugin 使用指定的版本，否则官方的 plugin 自动获取最新版本 ~minorVersion?，第三方 plugin 版本使用 latest。

根据 plugins 生成 package.json 数据，merge 现有 package.json 的内容，devDependencies 根据 plugins 生成。

1. 初始化 git
1. 根据 package.json 安装依赖

1. invoking generators 下面的步骤等同于 vue invoke
1. 执行 package.json 中的 plugins
1. package.json 可能新增以来，进行安装。
1. 执行 generator 的 completion-hooks 回掉
1. 生成 README.md
1. git 提交首个 commit
