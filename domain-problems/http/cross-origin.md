# Same Origin

1. http://aosabook.org/en/500L/the-same-origin-policy.html
1. cors

# Cookie

Cookie 是存储在客户端（浏览器）中的一小段文字，包含若干个键值对。HTTP 协议本身是无状态的，包括用户登陆态等信息的 Cookie 随着请求发送给服务器端可以用来识别用户身份。在识别用户身份的基础上可以实现会话管理、自动登陆、个性化设置、用户追踪、记录分析、针对性广告等功能。

Cookie 可以存储一小段信息，但是不鼓励用 Cookie 来作为单纯的存储使用，因为 Cookie 会跟随 HTTP 请求发送给服务器，这样会造成请求报文体积较大，减缓请求速度，浪费带宽。客户端存储推荐使用 Web Storage API（`localStorage` and `sessionStorage`）和 `IndexedDB`。

Cookies are divided as two types according to their lifetime.
Cookies 从生命周期上划分为两类：

1. 会话 Cookie - 只在一个会话中有效的 Cookie，会话结束（即网页 tab 关闭）后 Cookie 被清除。会话 Cookie 不包括`Expires`和`Max-Age`头。
1. 永久性 Cookie - 设置了有效时长的 Cookie 被存储在本地，可以在生命周期内横跨多个会话使用。

### 完整流程

1. 客户端首次发送请求到服务器，服务器为该客户端生成一个唯一标识并存储在服务器端。
1. 服务器发送响应给客户端，客户端根据 HTTP 响应头`Set-Cookie`来创建 Cookie。
   ```http
   Set-Cookie2: Coupon="handvac103"; Version="1"; Path="/tools/cordless"
   ```
1. 客户端再次请求相同网站时，和网站同源的 Cookie 会被附带在请求头`Cookie`，`Cookie2`中发送给服务器。
   ```http
   Cookie: session-id=002-1145265-8016838; session-id-time=1007884800
   Cookie2: $Version="1"
   ```
1. 服务器接收到带有 Cookie 的请求后，根据 Cookie 中的信息识别客户端，并作出对应响应。

### 创建 Cookies

`Set-Cookie`和`Set-Cookie2`响应头用来指示客户端创建 Cookie，多个`Set-Cookie`和`Set-Cookie2`头指示生成多个 Cookie。

#### Version 0 (Netscape) Cookies

Value of `Set-Cookie` header is multiple directives separated by semi-colon (;). Available `Set-Cookie` directives are listed below.
`Set-Cookie`值是分号隔开的多个键值对或者关键字，关键字用来设置 Cookie 的属性信息。

```http
Set-Cookie: <cookie-name>=<cookie-value>; Domain=<domain-value>; Secure; HttpOnly
```

<table>
    <tr>
        <th>Set Cookie Directive</th>
        <th>Explaination</th>
    </tr>
    <tr>
        <td><code>&lt;cookie-name&gt;=&lt;cookie-value&gt;</code></td>
        <td>被存储的键值对</td>
    </tr>
    <tr>
        <td><code>Domain=&lt;domain-value&gt;</code></td>
        <td>Specifies a domain to which the cookie can be sent, including subdomains, leading dots in doman-value are ignored. If not specified, defaults to host portion of current document location excluding subdomains.</td>
    </tr>
    <tr>
        <td><code>Path=&lt;path-value&gt;</code></td>
        <td>Indicates a URL path that must exist in the requested resource to be allowed to send this cookie. <code>path=/docs</code> matches "/docs", "/docs/web".</td>
    </tr>
    <tr>
        <td><code>Expires=&lt;date&gt;</code></td>
        <td>The maximum lifetime of the cookie specified with HTTP-date timestamp.</td>
    </tr>
    <tr>
        <td><code>Max-Age=&lt;non-zero-digit&gt;</code></td>
        <td>Number of seconds until cookie expires. A zero on negative number will expire cookie immediately. If both <code>Max-Age</code> and <code>Expires</code> are set, <code>Max-Age</code> has higher precendence.</td>
    </tr>
    <tr>
        <td><code>Secure</code></td>
        <td>安全cookie必须通过HTTPS协议发送，这种方式不代表Cookie被加密，不应当用来传送敏感信息</td>
    </tr>
    <tr>
        <td><code>HttpOnly</code></td>
        <td>cookies不能被<code>Document.cookie</code>, <code>XMLHttpRequest</code>和<code>Request</code>获取</td>
    </tr>
    <tr>
        <td><code>SameSite</code></td>
        <td>
            <dl>
                <dt><a href="https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html">Strict</a></dt>
                <dd>域名a当前页面发送请求到非同源地址b时，永远不附带属于域名b的SameSite=Strict的Cookie</dd>
            </dl>
            <dl>
                <dt>Lax</dt>
                <dd>
                    域名a当前页面发送请求到非同源地址b时，大部分请求不附带属于域名b的SameSite=Lax的Cookie。但是导航到目标网站的Get请求例外。例如登陆态等不那么敏感的信息，可以获得b网站自动登陆的效果。
                    <table>
                        <tr>
                            <th scope="col">请求类型</th>
                            <th scope="col">示例</th>
                            <th scope="col">None</th>
                            <th scope="col">Lax</th>
                        </tr>
                        <tr>
                            <td>链接</td>
                            <td><code>&lt;a href="..."&gt;&lt;/a&gt;</code></td>
                            <td>发送Cookie</td>
                            <td>发送Cookie</td>
                        </tr>
                        <tr>
                            <td>预加载</td>
                            <td><code>&lt;link rel="prerender" href="..." /&gt;</code></td>
                            <td>发送Cookie</td>
                            <td>发送Cookie</td>
                        </tr>
                        <tr>
                            <td>GET表单</td>
                            <td><code>&lt;form method="GET" action="..."&gt;</code></td>
                            <td>发送Cookie</td>
                            <td>发送Cookie</td>
                        </tr>
                        <tr>
                            <td>POST表单</td>
                            <td><code>&lt;form method="POST" action="..."&gt;</code></td>
                            <td>发送Cookie</td>
                            <td>不发送Cookie</td>
                        </tr>
                        <tr>
                            <td>iframe</td>
                            <td><code>&lt;iframe src="..."&gt;&lt;/iframe&gt;</code></td>
                            <td>发送Cookie</td>
                            <td>不发送Cookie</td>
                        </tr>
                        <tr>
                            <td>链接</td>
                            <td><code>$.get("...")</code></td>
                            <td>发送Cookie</td>
                            <td>不发送Cookie</td>
                        </tr>
                        <tr>
                            <td>链接</td>
                            <td><code>&lt;img href="..."&gt;</code></td>
                            <td>发送Cookie</td>
                            <td>不发送Cookie</td>
                        </tr>
                    </table>
                </dd>
            </dl>
            <dl>
                <dt>None</dt>
                <dd></dd>
                <dd>域名a当前页面发送请求到非同源地址b时，请求附带属于域名b的SameSite=None的Cookie，cookie包含敏感信息的话会造成CSRF攻击</dd>
            </dl>
        </td>
    </tr>
</table>

### 客户端存储格式

客户端存储 Cookie 方式各有不同，Netscape 浏览器存储在本地文本文件 _cookies.txt_ 中。

```txt
# Netscape HTTP Cookie File
# http://www.netscape.com/newsref/std/cookie_spec.html
# This is a generated file! Do not edit.
#
# domain          all  path   secure  expires    name value
www.fedex.com     FALSE /      FALSE   1136109676 cc /us/
.cnn.com          TRUE  /      FALSE   1035069235 SelEdition www
www.reformamt.org TRUE  /forum FALSE   1033761379 LastVisit 1003520952
www.reformamt.org TRUE  /forum FALSE   1033761379 UserName Guest
```

1. [Simple cookie framework](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework)
1. [HTTP Cookie](https://en.wikipedia.org/wiki/HTTP_cookie#Session_cookie)

# JSONP

# CORS
