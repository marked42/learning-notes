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

默认的 preset

```json
{
  "useConfigFiles": boolean
}
```

1. router, routerHistoryMode @vue/cli-plugin-router
1. vuex @vue/cli-plugin-vuex
1. @vue/cli-plugin-typescript 要在@vue/cli-plugin-router 后面

哪里来的 options.\_\_isPreset ?

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
