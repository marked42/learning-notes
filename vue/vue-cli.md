# Vue CLI

## 介绍

`vue-cli` 3.0 是`vue`官方提供的命令行工具，内部使用`webpack`作为开发打包工具，提供前端项目脚手架的集成解决方案。

React 的工具`create-react-app`使用`eject`方式存在一个比较大的问题，一旦项目`eject`后，项目配置就跟`create-react-app`完全没关系了，需要用户手动维护所有配置，后续`create-react-app`模板的更新不能方便的应用到项目上。

`vue-cli`使用插件来提供脚手架项目的所有功能，`webpack`配置和模板内置在插件中，所以通过插件升级可以方便的使用新的配置与功能。

`vue-cli` 3.0 提供的几个主要命令：

1. `vue create project` - 创建新脚手架项目
1. `vue add <plugin>` - 在当前项目安装并调用插件
1. `vue invoke <plugin>` - 在当前项目调用插件
1. `vue serve [entry]` - 零配置开发模式快速启动`[entry]`为入口的项目
1. `vue build [entry]` - 零配置快速打包`[entry]`为入口的项目项目
1. `vue inspect` - 输出当前项目最终生效的`webpack`配置
1. `vue config` - 设置当前用户`.vuerc`配置

这些命令中`vue create/add/invoke`关联紧密，`invoke`是在当前项目中调用指定名称的插件，作用是执行插件的`generator`模块，重新生成脚手架文件；`add`命令相比于`invoke`多了一步安装插件的操作，先安装后调用；`create`命令使用现有或者用户输入的预设（preset），确定要使用的插件列表及其选项，初始化项目`package.json`并且安装和调用所有插件。

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

`vue create`命令是`vue-cli`创建项目的命令，它的流程包括了`vue add`和`vue invoke`命令的执行流程，所以主要对其进行分析。

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

检查创建项目指定的目录名称是否合法，目录名称只能包含字母、'-'、'@'、'/'且不能太长，具体规则参考[文档](https://github.com/npm/validate-npm-package-name#naming-rules)，

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
1. 交互式选择 命令行参数中未指定预设时会提示用户选择默认、之前保存的预设（.vuerc 文件中保存）或者手动选择。手动选择的过程是选择了若干个功能，每个功能对应一个插件，手动选择的结果可以保存到`.vuerc` 中再次使用。

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

解析插件完成后进行回调函数注册，回调注册时在插件的`generator`模块导出的`hooks`函数属性中进行。回调函数分为两类：

1. 通过`afterInvoke`注册的`invokeCbs`列表，对应命令行参数直接（`vue add/invoke`的插件名参数）或者预设（间接）中指定的插件列表。
1. 通过`afterAnyInvoke`注册的`anyInvokeCbs`，对应`package.json`中包含的所有插件列表。

```js
module.exports = (api, options, rootOptions) => {}

module.exports.hooks = (api, options, rootOptions, pluginIds) => {
  api.afterInvoke(() => {})

  api.afterAnyInvoke(() => {})
}
```

就是说如果想要插件的回调只在`vue create/add/invoke`令行指定（通过 preset 或者 plugin 参数）的情况下才执行，使用`afterInvoke`；如果想要插件回调任何时候任何情况下都执行使用`afterAnyInvoke`。

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

插件项目的结构如下，包括文件渲染（generator）、交互式问答（prompts）和 UI 插件部分。

```bash
.
├── README.md
├── generator.js  # generator（可选）
├── index.js      # service 插件
├── package.json
├── prompts.js    # prompt 文件（可选）
└── ui.js         # Vue UI 集成（可选）
```

`generator`提供了生成模板文件和配置`package.json`的功能； `prompts`提供了用户交互提问的功能，用来辅助`generator`模块；
`ui`模块对应了使用 Web 界面指定配置的功能。

#### generator

`generator`模块导出一个函数，通过使用`api`参数实现模板来实现具体的功能。

```ts
/**
 * options 是通过命令行或者preset指定的插件的参数
 * rootOptions 是多个插件共用，包含了项目基础信息。
 * */
interface RootOptions {
  projectName: string
  vueVersion: '2' | '3'
  router: boolean
  vuex: boolean
  cssPreprocessor: boolean
  plugins: any[]
}

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

module.exports.hooks = (api) => {
  api.afterInvoke(() => {})
  api.afterAnyInvoke(() => {})
}
```

### 模板渲染

`api.render(source, additionalData, ejsOptions)` 接受一个目录或者文件路径用来[渲染生成脚手架项目的文件](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E7%9A%84%E6%A8%A1%E6%9D%BF)，内部使用 EJS 渲染模板文件。

`api.render`的`source`参数可以是三种类型：

1. `string` 某个目录的相对路径，目录下的**所有文件**都会被作为 EJS 模板进行渲染
1. `object: { sourceTemplate: targetFile }` 属性名`sourceTemplate`代表模板文件路径，属性值`targetFile`代表模板对应的目标文件路径。
1. `(files) => void` 自定义渲染函数，接受的参数`files`是一个对象，属性名代表了生成文件的路径，值代表了生成文件的内容。

渲染函数是模板渲染的核心机制，`string`和`object`的参数也是被转换为等价逻辑的渲染函数进行处理。模板渲染对应的类`Generator`中保存了所有注册的渲染函数中间件（middleware）列表，插件的执行过程`api.render()`将所有渲染函数进行注册，完成后统一执行，最终的得到一个`files`对象代表了所有要输出的文件。

使用`api.postProcessFiles((files) => void)`可以注册后处理函数，在插件执行完成后进行额外处理。

```js
module.exports = (api) => {
  api.postProcessFiles((files) => {
    // 对模板进行新增、删除、修改的操作
    delete files['main.ts']
  })
}
```

`vue-cli`使用 EJS 引擎渲染模板，并对其进行了扩展，支持对已存在模板内容进行[更新](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E7%BC%96%E8%BE%91%E5%B7%B2%E7%BB%8F%E5%AD%98%E5%9C%A8%E7%9A%84%E6%A8%A1%E6%9D%BF)的功能。

### 文件输出优化

模板渲染完成得到`files`文件后使用`writeFileTree`函数将模板统一写入到文件系统中。在`vue create`命令执行创建新项目的情况下，所有输出的文件都是新文件，但是`vue add/invoke`针对现有项目执行时最终需要的文件之前可能是新增、需要删除、更新、不变几种情况。对于不变的这部分文件不需要重新写入到操作系统，`vue-cli`使用了代理机制对文件前后变化进行记录，避免不需要的文件写入操作。

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

代理对象拦截了对于`files`对象的访问，`set`中保存了新增和内容有更新的文件。写入文件系统时调用`writeFileTree`，将删除、新增、更新文件的操作同步到文件系统。

```js
module.exports = async function writeFileTree(dir, files, previousFiles) {
  if (process.env.VUE_CLI_SKIP_WRITE) {
    return
  }
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles)
  }
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name])
  })
}
```

### 配置文件提取

预设中`useConfigFiles: true`参数支持将各种工具的配置从`package.json`中提取出来，放到单独的配置文件中。工具的配置文件支持一种或者多种格式（js/json/yaml/lines），每种格式有一个或多个可能的配置文件名称，默认的配置如下。

```js
const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: ['babel.config.js'],
    },
  }),
  postcss: new ConfigTransform({
    file: {
      js: ['postcss.config.js'],
      json: ['.postcssrc.json', '.postcssrc'],
      yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
    },
  }),
  eslintConfig: new ConfigTransform({
    file: {
      js: ['.eslintrc.js'],
      json: ['.eslintrc', '.eslintrc.json'],
      yaml: ['.eslintrc.yaml', '.eslintrc.yml'],
    },
  }),
  jest: new ConfigTransform({
    file: {
      js: ['jest.config.js'],
    },
  }),
  browserslist: new ConfigTransform({
    file: {
      lines: ['.browserslistrc'],
    },
  }),
}
```

使用`api.addConfigTransform(key, options)`可以对更多的工具添加提取文件的转码支持。

如果配置文件已经存在，配置提取时会和新的配置进行合并，然后再输出到配置文件中。每种类型的配置文件合并策略可以参考`configTransform.js`文件。

由于工具配置数据默认保存在`package.json`文件中，所以需要通过修改`package.json`文件对应字段来修改这些工具的配置，或者使用`api.postProcessFile`在文件输出前进行后处理修改。

### 扩展`package.json`

`package.json`文件也是在`writeFileTree`函数执行过程中写入到文件系统，但是这个文件内容是单独处理的，使用`api.extendPackage`[更新](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E6%89%A9%E5%B1%95%E5%8C%85)`package.json`文件，`api.render`函数对它没有作用。

```js
module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    dependencies: {
      'vue-router-layout': '^0.1.2',
    },

    scripts: {
      dev: 'npm run serve',
    },
  })
}
```

可以添加依赖项、`scripts`脚本以及其他任意字段的更新。在`package.json`文件当前存在的情况下，新增的选项需要与已有选项进行合并，包括这些关键策略。

1. dependencies, devDependencies 版本合并策略，首先版本必须合法，然后将 range 版本替换成合法版本后，使用较新的版本
1. object 对象递归合并
1. 数组元素去重合并

### 入口文件修改

入口文件可以新增导入语句和`new Vue()`入口函数调用的选项。

```js
module.exports = (api, options, rootOptions) => {
  // 添加模块导入语句
  api.injectImports(api.entryFile, `import router from './router'`)
  // `new Vue({ router })` 中添加选项
  api.injectRootOptions(api.entryFile, `router`)
}
```

### 插件相互依赖

插件之间可能存在依赖关系，可以使用`api.hasPlugin`检查当前项目中某个插件是否存在，进行相应处理。

### 交互式问答

插件使用`prompts`模块跟用户进行命令行交互，确定插件选项等数据。`prompts`模块导出一个函数或者对象上`getPrompts`属性，函数返回一组`inquirer`包需要的问题配置。

```js
module.exports = (pkg, prompt) => {}

module.exports = {
  getPrompts: (pkg, prompt) => {},
}
```

整个`vue-cli`工具创建项目的过程中包括四种类型的交互式提问。

```js
const prompts = [
  // 预设选择
  this.presetPrompt,
  // 不适用预设，手动模式情况下进行特性(feature)选择
  this.featurePrompt,
  // 每种特性对应一个插件，有对应插件参数的选择
  ...this.injectedPrompts,
  // 交互完成后提醒是否将当前选择保存为预设
  ...this.outroPrompts,
]
```

### completion hooks

### registry 选项解析

## @vue/cli-service

核心插件`@vue/cli-service`提供了开发用的核心命令。

### 查看 webpack 配置

使用`vue inspect`命令查看当前项目的`webpack`配置。

### 开发与打包

当前项目的开发与打包命令

1. vue serve/vue-cli-service serve
1. vue build/vue-cli-service build

## vue config

对当前用户 HOME 目录中的`.vuerc`文件进行操作

```
Options:
  -g, --get <path>          get value from option
  -s, --set <path> <value>  set option value
  -d, --delete <path>       delete option from config
  -e, --edit                open config with default editor
  --json                    outputs JSON result only
  -h, --help                output usage information
```
