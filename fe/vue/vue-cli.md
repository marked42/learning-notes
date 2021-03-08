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

插件可以接受不同的选项来定制其行为，例如插件`@vue/cli-plugin-eslint`。

```json
{
  "lintOnSave": false
}
```

### 预设（Preset）

`vue-cli`生成的项目是由一组插件组合确定的，所有插件及其选项组合起来形成一个预设，典型的预设内容如下。

```json
{
  "vueVersion": "2" | "3",
  // 生成的HelloWorld组件中是否只包含最基础的信息
  "bare": true,
  // 配置是否抽取到单独文件
  "useConfigFiles": true,
  // legacy support，等同于使用 @vue/cli-plugin-vuex插件
  "vuex": true,
  "router": true,
  "routerHistoryMode": true,
  "cssPreprocessor": "sass",
  "plugins": {
    "@vue/cli-plugin-babel": {},
    "@vue/cli-plugin-eslint": {
      // 使用version字段指定插件版本，可以是package.json中任何合法的版本号形式
      // 例如本地插件包，file:开头
      "version": "^3.0.0",
      "config": "airbnb",
      "lintOn": ["save", "commit"],
      // 允许插件prompts
      "prompts": true
    },
    "@vue/cli-plugin-router": {},
    "@vue/cli-plugin-vuex": {}
  },
  // 不同工具的配置
  "configs": {
    "vue": {},
    "postcss": {},
    "eslintConfig": {},
    "jest": {}
  }
}
```

## `vue create`

`vue create`命令是`vue-cli`创建项目的主要命令，它的流程包括了`vue add`和`vue invoke`命令的执行流程，所以主要对其进行分析。

`vue create`命令支持的参数列表如下供参考。

```
Options:
  -p, --preset <presetName>       Skip prompts and use saved or remote preset
  -d, --default                   Skip prompts and use default preset
  -i, --inlinePreset <json>       Skip prompts and use inline JSON string as preset
  -m, --packageManager <command>  Use specified npm client when installing dependencies
  -r, --registry <url>            Use specified npm registry when installing dependencies (only for npm)
  -g, --git [message]             Force git initialization with initial commit message
  -n, --no-git                    Skip git initialization
  -f, --force                     Overwrite target directory if it exists
  --merge                         Merge target directory if it exists
  -c, --clone                     Use git clone when fetching remote preset
  -x, --proxy <proxyUrl>          Use specified proxy when creating project
  -b, --bare                      Scaffold project without beginner instructions
  --skipGetStarted                Skip displaying "Get started" instructions
  -h, --help                      output usage information
```

### 1. 准备工作

检查创建项目指定的目录名称是否合法，目录名称只能小写字母、'-'、'@'、'/'且不能太长，具体规则参考[文档](https://github.com/npm/validate-npm-package-name#naming-rules)，

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

创建项目的目标目录是当前项目时提醒用户确认，防止意外覆盖文件。

目标目录已经存在时提醒用户选择合并、覆盖或者取消操作，对应命令行参数中的`--merge`和`--force`选项。

### 2. 解析预设

`vue-cli`的预设有多种来源

1. 默认预设 `vue create --default`
1. 命令行指定选项 `vue create --preset preset-name` 可以指定[远程](https://cli.vuejs.org/zh/guide/plugins-and-presets.html#%E8%BF%9C%E7%A8%8B-preset)或者本地的预设。
1. 行内预设 `vue create --inlinePreset {}` 直接使用 JSON 对象指定预设
1. 交互式选择 命令行参数中未指定预设时会提示用户选择默认、之前保存的预设（.vuerc 文件中保存）或者手动选择。手动选择的过程是选择了若干个功能，引入相应的插件，并确定插件的选项，手动选择的结果可以保存到.vuerc 中再次使用。

预设解析完成后需要做一些额外处理。

1. 添加`@vue/cli-service`作为第一个插件，这个插件是内置的，提供脚手架项目的基础模板。
1. 对`vuex`/`router`/`routerHistoryMode`等旧参数兼容处理，引入对应插件。
1. 调整插件顺序，确保`@vue/cli-plugin-typescript`在`@vue/cli-plugin-router`后执行，这两个之间存在依赖关系。
1. 插件版本未指定时，官方插件使用最新的`~minorVersion`，三方插件使用`latest`。

### 3. 生成`package.json`

根据使用的预设中插件列表生成`package.json`文件的内容，插件列表作为开发依赖添加到`package.json`中。

```json
{
  "name": "project-name",
  "version": "0.1.0",
  "private": true,
  "devDependencies": {}
}
```

如果项目中已经存在`package.json`文件，采取合并的策略进行更新。

之后根据`package.json`文件使用包管理器（npm、yarn、pnpm）安装依赖，并且初始化项目为 Git 仓库。

### 4. 运行插件

#### 再次解析插件

预设中指定了原始插件列表，但是项目在安装依赖的过程中`package.json`中可能安装了自定义插件，所以需要从中解析出一个完整的插件列表。

`vue-cli`的插件命名遵循`vue-cli-plugin-<name>`或者`@scope/vue-cli-plugin-<name>`的规则，符合规则的插件才能被`vue-cli-service`、`vue add/invoke`发现。

解析插件时如果`prompts: true`，会再次提醒用户手动输入对应插件的选项。

解析插件完成后进行回调函数注册，回调注册时在插件的`generator`模块到处的`hooks`函数属性中进行。回调函数分为两类：

1. 通过`afterInvoke`注册的`invokeCbs`列表，对应命令行参数直接（`vue add/invoke`的插件名参数）或者预设（间接）中指定的插件列表。
1. 通过`afterAnyInvoke`注册的`anyInvokeCbs`，对应`package.json`中包含的所有插件列表。

```js
module.exports = (api, options, rootOptions) => {}

module.exports.hooks = (api, options, rootOptions, pluginIds) => {
  api.afterInvoke(() => {})

  api.afterAnyInvoke(() => {})
}
```

就是说如果想要插件的回调只在`vue create/add/invoke`命令行指定的情况下才执行，使用`afterInvoke`；如果想要插件回调任何时候任何情况下都执行使用`afterAnyInvoke`。

#### 插件运行

命令行指定的插件列表解析完成后是一个对象列表。

```ts
Array<{
  id: string;
  // 选项
  options: any;
  // generator模块导出的函数
  apply: (api, options, rootOptions) => void;
}>
```

顺序执行插件列表生成项目的所有文件，包括 EJS 模板渲染普通组件文件、工具配置文件（vue、eslint、babel 等）和`package.json`。

这个过程中文件列表就是一个普通的 JS 对象（`api.files`），所有文件确定后才会通过`writeFileTree`统一输出到文件系统中。

### 5. 收尾工作

1. 生成 README 文件
1. 自动提交第一个 commit
1. 提示用户使用`npm run serve`命令启动开发环境、`npm run build`进行打包。

## `vue add/invoke`

`vue create`命令是创建一个新项目，`vue add/invoke`是在现有项目上执行插件。`vue add`会安装插件并执行，`vue invoke`只执行项目中已有的插件。

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

1. render templates，增加、删除、更新模板 yaml-front-matter
1. 增加文件后处理回掉有 postProcessFile

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

环境检测 lru-cache https://www.npmjs.com/package/lru-cache

### 配置文件提取

1. addConfigTransform
1. 从 package.json 中转换配置文件。
   babel, postcss, eslintConfig, jest,browsers-list,lint-staged,
   vue, babel 总是抽出单独的配置文件，
   配置文件支持 json,js,yml,lines 类型。

### extendPackages

1. 修改现有配置文件，例如 .eslintrc.js
1. 扩展包 修改 package.json
1. dependencies, devDependencies 版本合并策略，首先版本必须合法，然后将 range 版本替换成合法版本后，使用较新的版本
1. object 对象递归合并
1. 数组元素去重合并

1. 修改主文件, injectImports, injectRootOptions

### 交互式问答

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

1.  生成 README.md
1.  git 提交首个 commit

```js
module.exports = (pkg, prompt) => {}

module.exports = {
  getPrompts: (pkg, prompt) => {},
}
```

## @vue/cli-service

`vue serve/build/inspect`

## vue config

操作.vuerc 文件

## completion hooks

## registry 选项解析
