# Same Origin

1. http://aosabook.org/en/500L/the-same-origin-policy.html
1. cors

# JSONP

XHR 请求受到同源策略限制，无法发送跨域请求。`<script>`标签不受同源策略限制，因此在服务器的支持下，跨域脚本将数据作为参数传给约定的函数，实现获取跨域数据的功能。

```js
function my_callback(data) {
  console.log(data)
}

function sendRequest() {
  script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = 'http://www.someWebApiServer.com/some-data?callback=my_callback'
  // 脚本内容是回调函数调用，接受跨域数据
  // my_callback({['some string 1', 'some data', 'whatever data']});
}

sendRequest()
```

[What is JSONP, and why was it created?](https://stackoverflow.com/questions/2067472/what-is-jsonp-and-why-was-it-created)

# CORS

满足以下全部条件的是简单请求，其余都是复杂请求。简单请求不用发送与请求（preflight request），复杂请求需要使用 OPTIONS 方法发送预请求，根据服务器返回的 CORS 头来决定客户端能否发送跨域请求。

1. 必须是 GET/POST/HEAD 三个方法
1. 能手动设定的请求头 Accept/Accept-Language/Content-Language/Content-Type/Range
1. Content-Type 只能是
   1. application/x-www-form-urlencoded
   1. multipart/form-data
   1. text/plain

Access-Control-Allow-Origin

[Cross-Origin Resource Sharing (CORS) MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

[Enable CORS](https://enable-cors.org/server.html)
https://web.dev/cross-origin-resource-sharing/
https://www.html5rocks.com/static/images/cors_server_flowchart.png
