# Webpack Dev Server

```js
{
    proxy: {
        target: 'http://www.example.org',
    },
}

{
    proxy: {
        'context1': 'http://www.example.com/path,
        'context2': {
            target: 'http://www.example.org',
        },
        'context3': {
            target: 'http://www.example.org',
            bypass(req, res, proxyConfig) {

                // 1. boolean set url to null
                // 1. string used to set url
                // 1. use middleware
                // 1. other return value
            },
        }
    },
}

// context: default to '/'
// target is required

{
    proxy: [
        {
            // context or path prop
            context: [],
            target: '',
        },
        {
            context: [],
            target: '',
        },
        function() {
            return {
                {
                    context: [],
                    target: '',
                },
            }
        }
    ]
}
```

context

1. 字符串 - path 以字符串开头
1. glob - path 匹配 glob micromatch is-glob
1. 字符串数组或者 glob 数组 - 路径与数组中一个匹配即可，数组中不能混合字符串和 glob
1. 函数 - 自定义匹配

## 热更新

## 日志

```js
module.exports = {
  plugins: [new FriendlyErrorsWebpackPlugin()],
  stats: 'errors-only',
}
```
