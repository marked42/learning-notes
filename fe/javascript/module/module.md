# 模块化

1. https://github.com/xitu/gold-miner/blob/master/TODO1/stop-using-default-exports-javascript-module.md
1. https://zhuanlan.zhihu.com/p/40733281

default导出不利于treeshaking

https://webpack.docschina.org/guides/tree-shaking/


CommonJS的默认导出

```js
// linked-list.js
class LinkedList {}
module.exports = LinkedList;
```

导入时的命名是随意的

```js
const LinkedList = require('./linked-list');
```

1. 默认导入的命名是随意的，不经意的拼写错误不会有任何提示。命名导出能够保证名称在多个文件中的一致性，即使使用重命名的命名导出，二者之间的关系也比较清楚。
1. ES Module的静态模块机制下，命名导出的名称如果不存在会报错，默认导出则不会。IDE还可以提示可导入的名称。
1. 命名导出有利于重构，改变导出名称时自动完成。
1. 在**默认导出意图非常明显**的情况下可以使用，例如单个React组件默认导出。


动态导入

```js
const HighChart = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js');
Highcharts.default.chart('container', { ... }); // Notice `.default`
```
