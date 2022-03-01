## EJS

模板引擎

1. <%= name %> 转义字符串，使用 HTML Entity 方式编码不安全字符<,>,&。
1. <%- name %> 未经转义原始字符串，存在 XSS 攻击隐患，需要人为保证安全。
1. <% %> scriplet tag 其中的内容被认为是 JS 脚本，其中可以任何合法的 JS 代码。

注释

支持三种形式的注释，这些注释时 EJS 的模板的注释，模板渲染时被忽略，不会输出到结果中。

```ejs
<%# comment %>
<%/* comment */%>
<%// comment %>
```

如果想要在数据结果中添加 JS 的注释，使用`<%= %>`的形式

```ejs
<%= '// this is a line of comment' %>
```

空白与换行处理

下面的一个换行符指得是`\r`,`\n`,`\r\n`这三种情况。空白符不包括换行符。

1. `<%_` 如果标签之前紧接着一个换行符，渲染时去掉这个换行符。scriptlet tag
1. `_%>` 如果标签之后紧接着一个换行符，渲染时去掉这个换行符。
1. `-%>` 如果标签之后紧接着一个或者多个空白符，渲染时去掉这些空白符。

```html
<p>Hello, <%- myMaliciousHtml %>.</p>
<p>Hello, <%= myMaliciousHtml %>.</p>
```

```js
{
, "myMaliciousHtml": "</p><script>document.write()</script><p>"
}
```

```
<p>Hello, </p><script>document.write()</script><p>.</p>
<p>Hello, &lt;/p&gt;&lt;script&gt;document.write()&lt;/script&gt;&lt;p&gt;.</p>
```

### 标签中换行

Line breaks inside a tag

https://github.com/mde/ejs/blob/main/docs/syntax.md#line-breaks-inside-a-tag

### literal tags

使用`<%%`输出`<%`，使用`%%>`输出`%>`

### 引入其他模板文件

`include` 命令，为了与 EJS1 兼容的方式，只能用在转义标签`<% %>`中，效果等同于 C 头文件展开，而且不能给引入的模板传递数据，但是可以使用当前模板的数据。由于这种方式是静态的，在模板编译的阶段就完成了嵌入模板的引入和展开，所以如果后续嵌入模板内容发生变化，之前已经编译过的模板是不会更新的。

```ejs
// included.ejs
<li><%= pet.name %></li>

// main.ejs
<ul>
<% pets.forEach(function (pet) { -%>
  <% include included %>
<% }) -%>
</ul>
```

`include` 函数是 EJS2 提供的动态引入模板方式，最大的区别在于可以通过参数为子模板提供数据，父模板的数据此时不在可见，需要显式传入。由于模板是在运行时动态解析，所以子模板内容发生的变化可以反应到父模板渲染结果中。理论上来说动态解析模板的方式比静态方式会慢一些，但是缓存手段会缩小这二者直接的性能差异。

```js
include(filename, [locals])
```

两种方式嵌入子模板文件时，如果没有指定子模板文件后缀，默认为`.ejs`。指定的路径如果是绝对路径可以直接使用，相对路径根据符模板所在位置进行定位，文件查找行为可以通过`ejs.resolveInclude`函数配置。

### API

```
ejs.render(template, data, options)
ejs.renderFile(filePath, data, options)
ejs.compile(filePath, data)
```

完整的参数选项参考[文档](https://github.com/mde/ejs#options)。

1. `fileLoader` 读取模板内容，默认是`fs.readFileSync`。
1. `cache` 缓存策略
1. `resolveInclude` 查找模板文件方法

TODO: 源码 939 行
