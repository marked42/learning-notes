# 预设 preset

### 顺序

1. Plugins run before Presets.
1. Plugin ordering is first to last.
1. Preset ordering is reversed (last to first).

preset 倒序

```js
module.exports = () => ({
  presets: [require('@babel/preset-env')],
  plugins: [
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    require('@babel/plugin-proposal-object-rest-spread'),
  ],
})
```
