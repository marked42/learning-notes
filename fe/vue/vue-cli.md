# Vue CLI

## 介绍

`vue-cli` 3.0 是`vue`官方提供的命令行工具，内部使用`webpack`作为开发打包工具，提供前端项目教授架的集成解决方案。

React 的工具`create-react-app`使用`eject`方式存在一个比较大的问题，一旦项目`eject`后，项目配置就跟`create-react-app`完全没关系了，需要用户手动维护所有配置，后续`create-react-app`模板的更新不能方便的应用到`eject`后的项目。

`vue-cli`使用插件来提供脚手架项目的所有功能，`webpack`配置和模板内置在插件中，所以通过插件升级可以方便的使用新的配置与功能。

`vue-cli` 3.0 提供的几个主要命令：

1. `vue create project` - 创建新脚手架项目
1. `vue add <plugin>` - 在当前项目安装并调用插件
1. `vue invoke <plugin>` - 在当前项目调用插件
1. `vue serve [entry]` - 零配置开发模式启动某个`.js`或者`.vue`为入口的项目，内部使用`vue-cli-service serve`实现。
1. `vue build [entry]` - 零配置打包项目
1. `vue inspect` - 输出当前项目最终生效的`webpack`配置
1. `vue config` - 设置当前用户`.vuerc`配置

这些命令中`vue create/add/invoke`关联紧密，`invoke`是在当前项目中调用指定名称的插件，作用是执行插件的`generator`模块，重新生成脚手架文件；`add`命令相比于`invoke`多了一步安装插件库的操作，先安装后调用；`create`命令使用现有或者用户输入的预设（preset），确定要安装的插件列表和对应插件选项，初始化项目`package.json`并且安装和调用所有插件。

`vue-cli`包含的库分类如下：

1. `@vue/cli` 命令行工具
1. `@vue/cli-service` 内置插件库，提供`vue-cli-service serve/build/lint`三条命令。
1. `@vue/cli-plugin-*` 插件库
1. `@vue/cli-init` 桥接 vue-cli 2.0 版本的库，3.0 中命令`vue init`和 2.0 行为保持一致。
1. `@vue/cli-shared-utils` 公用工具库
1. `@vue/cli-test-utils` 测试工具库
1. `@vue/ui-*` UI 工具库，`vue-cli`提供的本地页面配置项目的方式。

### 插件（Plugin）

一个插件可以为`vue-cli`创建的项目提供以下[功能](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html)：

1. 新增、删除、修改 JS 代码、HTML 文档、CSS 样式、图片、字体、工具配置等文件。
1. 修改项目`webpack`配置
1. 扩展项目的配置`package.json`
1. 在命令行中提示用户选择插件选项
1. 提供`vue-cli-service`命令

插件可以接受不同的配置来定制其行为。

```js

```

### 预设（Preset）

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

## `vue create`

项目初始化流程

### preset 解析

### 插件列表 解析

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

## 插件机制

### 项目结构

插件项目的结构如下

```bash
.
├── README.md
├── generator.js  # generator（可选）
├── index.js      # service 插件
├── package.json
├── prompts.js    # prompt 文件（可选）
└── ui.js         # Vue UI 集成（可选）
```

`generator`提供了生成模板文件和配置`package.json`的功能，`prompts`提供了用户交互提问的功能，用来辅助`generator`模块。
`ui`模块对应了使用 Web 界面指定配置的功能。

#### generator

一个`generator`模块就是一个函数，通过使用提供的插件`api`来实现所有的插件功能。

```js
module.exports = (api, options, rootOptions) => {
  api.render('./template')

  api.extendPackage({
    dependencies: {
      'vue-router-layout': '^0.1.2',
    },
  })

  api.injectImports(api.entryFile, `import router from './router'`)

  api.injectRootOptions(api.entryFile, `router`)
}

module.exports.hooks = () => {}
```

`api.render(source, additionalData, ejsOptions)` 接受一个目录或者文件路径用来[生成脚手架项目的文件](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E7%9A%84%E6%A8%A1%E6%9D%BF)，内部使用 EJS 渲染模板文件。

`api.extendPackage`用来[扩展](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E6%89%A9%E5%B1%95%E5%8C%85)`package.json`文件的内容，包括添加依赖项、`scripts`脚本命令。因为 babel、postcss、eslintConfig、jest、browsers-list、lint-staged、vue、babel 等工具配置项可以使用`package.json`文件的对应字段，所以`api.extendPackage`也可以用来设置这些工具的配置。预设参数`useConfigFiles`为`true` 时可以将这些工具配置从`package.json`中提取出来，放到各自的配置的文件中。其中`vue`的配置文件`vue.config.js`和`babel`的配置文件`babel.config.js`总是会单独抽取出来，因为`vue.config.js`可以让用户自己进行更多自定义配置，`babel.config.js`是因为 Babel 7 开始只有这种方式是对整个项目有效的 Babel 配置。

`api.injectImports`用来在文件入口文件添加模块导入语句，`api.injectRootOptions`在入口文件`new Vue()` 中添加选项。

`api.hasPlugin`检查当前项目中某个插件是否存在

### 模板渲染

postProcessFile

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

### 配置提取

addConfigTransform
