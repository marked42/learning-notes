# Vue CLI 模板项目

`vue create my-project` 创建项目，内置的 plugins 。

`@vue/cli-service`

## Generator

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
