# Style

## 渲染树的构建

渲染树节点类型跟 DOM 节点 display 属性和节点类型有关

1. Block
1. Inline
1. ListItem

渲染树节点和 DOM 树节点不完全是一一对应的。

1. select 节点对应展示区、按钮、下拉框三个渲染节点
1. list 对应列表项符号和内容两个渲染节点
1. inline 元素超出父容器宽度时发生断行，每行文字对应一个渲染节点。
1. 混合 inline 和 block 时产生的匿名盒子

样式计算和渲染树的构建面临的问题

1. 样式数据非常大，内存问题
1. 样式匹配问题，为 DOM 树种每个节点对所有样式进行遍历找到匹配的规则（Rule）十分复杂耗时
1. 匹配到的样式应用到 DOM 节点上需要遵循复杂的 cascading 规则

https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#Style_Computation
