# Browser

1 Page building—Set up the user interface.
2 Event handling —Enter a loop F waiting for events to occur G, and start invoking event handlers.

浏览器构建页面的过程包括两个步骤：

1. 解析HTML源码构建DOM树
1. 执行HTML源码中的Javascript代码，`<script>`标签中的全局Javascript代码是同步执行的，浏览器在解析到`script`标签时会停止构建DOM树，转而去执行Javascript代码。

浏览器在构建页面的过程中可以在这两个过程根据需要切换执行，直到页面构建完成。

1. [浏览器渲染机制](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-tree-construction

2. https://developers.google.cn/web/fundamentals/performance/critical-rendering-path/render-tree-construction

[HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
