# Security

1. https://www.zhihu.com/question/35720092
1. CSP Content Security Policy

https://html.spec.whatwg.org/multipage/browsers.html#groupings-of-browsing-contexts
https://www.davidairey.com/google-gmail-security-hijack

同源策略、CSP 和 CORS 之间的关系：

同源策略就是说同源页面随你瞎搞，但是不同源之间想瞎搞只能通过浏览器提供的手段来搞

比如说

1. 读取数据和操作 DOM 要用跨文档机制
2. 跨域请求要用 CORS 机制
3. 引用第三方资源要用 CSP

## XSS

https://time.geekbang.org/column/article/152807

1. 存储型 XSS 攻击 服务器端
1. 反射型 XSS 攻击 服务器端
1. 基于 DOM 的 XSS 攻击 浏览器端

CSP
实施严格的 CSP 可以有效地防范 XSS 攻击，具体来讲 CSP 有如下几个功能：限制加载其他域下的资源文件，这样即使黑客插入了一个 JavaScript 文件，这个 JavaScript 文件也是无法被加载的；禁止向第三方域提交数据，这样用户数据也不会外泄；禁止执行内联脚本和未授权的脚本；还提供了上报机制，这样可以帮助我们尽快发现有哪些 XSS 攻击，以便尽快修复问题。

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP

Content-Security-Policy: default-src 'self'; img-src \*; media-src media1.com media2.com; script-src userscripts.example.com

Content-Security-Policy: default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi
Content-Security-Policy-Report-Only: policy

1. https://developers.google.com/web/fundamentals/security/csp

1. <meta> tag (report-uri not allowed ?)
1. `Content-Security-Policy: directives`

1. https://research.google/pubs/pub45542/
1. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
1. https://www.w3.org/TR/2018/WD-CSP3-20181015

web security

1. https://infosec.mozilla.org/guidelines/web_security#Examples_5

## CSRF

https://time.geekbang.org/column/article/154110

1. Same Site Strict Lax None https://web.dev/samesite-cookies-explained/
1. Referer 包含路径信息 Origin 不包路径信息， 服务端验证 Referer 和 Origin 来屏蔽恶意网站伪造的请求
1. CSRF Token
