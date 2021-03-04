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
1. package.json 可能新增依赖，进行安装。
1. 执行 generator 的 completion-hooks 回掉

   1. 从原始的 preset.plugins 的列表，如果返回 plugins 的列表 { id, apply, options }
   1. 获取 plugin 对应的 generator、 `require('module')`
   1. plugins 的 prompts 模块， options
      默认禁用插件的 prompts, plugin.prompts 选项为`true`的话开启。
   1. new Generator(context, { pkg, plugins, afterInvokeCbs,
      afterAnyInvokeCbs,}) 代表了插件调用的过程

   1. 解析 rootOptions
   1. 分析 package.json 得到所有的 plugins，（新增依赖可能导致比 preset.plugins 要多）注册所有的 hook 回掉
      afterInvokeCbs 对应 preset.plugins, afterAnyInvokeCbs 对应 allPlugins
      同步顺序执行所有 plugins 的 generator。
      `apply(api, options, rootOptions, invoking)`
      1. render templates，增加、删除、更新模板 yaml-front-matter
      1. 扩展包 修改 package.json
      1. dependencies, devDependencies 版本合并策略，首先版本必须合法，然后将 range 版本替换成合法版本后，使用较新的版本
      1. object 对象递归合并
      1. 数组元素去重合并
      1. 修改主文件, injectImports, injectRootOptions
      1. 增加文件后处理回掉有
      1. exitLog
      1. 从 package.json 中转换配置文件。
         babel, postcss, eslintConfig, jest,browsers-list,lint-staged,
         vue, babel 总是抽出单独的配置文件，
         配置文件支持 json,js,yml,lines 类型。

1. 生成 README.md
1. git 提交首个 commit

```js
module.exports = (pkg, prompt) => {}

module.exports = {
  getPrompts: (pkg, prompt) => {},
}
```

### 文件输出优化

在 vue add/invoke 命令执行的时候，可能会对文件进行删除、新增、修改等操作，内容未发生变化的文件不应该再次输出到文件系统中，通过 Proxy 实现发生改变的文件进行记录。

```ts
function watchFile(files, set = new Set()) {
  return new Proxy(files, {
    set(target, key, value, receiver) {
      set.add(key)
      Reflect.set(target, key, value, receiver)
    },
    deleteProperty(target, key, value, receiver) {
      set.delete(key)
      Reflect.deleteProperty(target, key)
    },
  })
}
```

`set`中保存这发生了变化的文件，`initialFiles`表示最初的文件，`files`表示变化后的文件。在`initialFiles`中但是不在`files`中的文件需要从文件系统中删除。在`files`中但是不在`set`中的文件没有变动，在`files`中而且在`set`中的是新增或者内容发生变化的文件。

```js

```

## vue invoke

在 package.json 中找到指定插件，
files 是当前 context 中所有 files，
依赖可能发生变化所以重新安装依赖。

## vue add

相比于 vue invoke 多了一个安装插件的步骤。

## @vue/cli-service

`vue serve/build/inspect`

## vue config

操作.vuerc 文件
