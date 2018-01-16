# Web

## Same Origin Policy

An origin is defined as a combination of protocol, host name and port number. Same origin policy allows data of one webpage to be accessible to pages inside same origin only.

Example of same origin checking against `http://www.example.com/dir/page.html`

| Compared URL | Outcome | Reason |
|:- |:-| :-|
|`http://www.example.com/dir/page2.html`|Success|Same protocol, host and port
|`http://www.example.com/dir2/other.html`|Success|Same protocol, host and port
|`http://username:password@www.example.com/dir2/other.html`|Success|Same protocol, host and port
|`http://www.example.com:81/dir/other.html`|Failure|Same protocol and host but different port
|`https://www.example.com/dir/other.html`|Failure|Different protocol
|`http://en.example.com/dir/other.html`|Failure|Different host
|`http://example.com/dir/other.html`|Failure|Different host (exact match required)
|`http://v2.www.example.com/dir/other.html`|Failure|Different host (exact match required)
|`http://www.example.com:80/dir/other.html`|Depends|Port explicit. Depends on implementation in browser.

## Cross Origin Methods

### `document.domain` property

Same origin policy is relaxed for two windows with same value for `document.domain` property. Documents with same value for `document.domain` property can read each other's properties. This might not always work due to acutal implementation.

### [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)

**Cross-origin resource sharing (CORS)** is a mechanism that controls whether certain resources (images, stylesheets, scripts, iframes, video etc.) are accessbile from other domain. Browser and server communicate with each other to achieve **CORS** in a fine-grained way.

**CORS** requests are divided as [simple requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests) and [preflighted requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests) according to whether a **OPTIONS** request must be sent first to determine whether actual request is safe to send.

Simple request is safe, which means it does not has any side effect (changing server's data). Preflighted request is unsafe, so it must be preflighted first, hence the name.

![CORS XHR Flowchart](./cors_xhr_flowchart.png)

#### [Simple Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests)

Example of simple request to `http://service.example.com` from `http://www.example.com`.

1. Browser sends **OPTIONS** request with `Origin` HTTP header.
    ```http
    Origin: http://www.example.com
    ```
1. Server responds according to target resource cross-origin authority.
    1. Target resrouce is allowed to be accessed from specific origin. Response contains `Access-Control-Allow-Origin` header whose value is an allowed origin.
        ```http
        Access-Control-Allow-Origin: http://www.example.com
        ```
    1. An error page if server does not allow the cross-origin request.
    1. Target resource is allowed be accessed from any origin. It's often used when resource is intended to be completely public and accessible to everyone.
        ```http
        Access-Control-Allow-Origin: *
        ```

#### [Preflighted Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests)

1. Request.
    ```http
    OPTIONS /
    Host: service.example.com
    Origin: http://www.example.com
    Access-Control-Request-Method: PUT
    Access-Control-Request-Headers: X-Custom-Header
    ```
1. If server accepts request, respond with following headers:
    ```http
    Access-Control-Allow-Origin: http://www.example.com
    Access-Control-Allow-Methods: PUT, DELETE
    ```

<table>
    <caption>Access Controls Headers</caption>
    <tr>
        <th>Type</th>
        <th>Header</th>
        <th>Explaination</th>
    </tr>
    <tr>
        <td rowspan='3'>Request Headers</td>
        <td>Origin</td>
        <td></td>
    </tr>
    <tr>
        <td>Access-Control-Request-Method</td>
        <td>comma separated list of methods that maybe used in <strong>CORS</strong> request</td>
    </tr>
    <tr>
        <td>Access-Control-Request-Headers</td>
        <td>comma separated list of custom headers that <strong>CORS</strong> requests will send</td>
    </tr>
    <tr>
        <td rowspan='6'>Response Headers</td>
        <td>Access-Control-Allow-Origin</td>
        <td></td>
    </tr>
    <tr>
        <td>Access-Control-Allow-Credentials</td>
        <td></td>
    </tr>
    <tr>
        <td>Access-Control-Allow-Expose-Headers</td>
        <td></td>
    </tr>
    <tr>
        <td>Access-Control-Allow-Max-Age</td>
        <td></td>
    </tr>
    <tr>
        <td>Access-Control-Allow-Methods</td>
        <td></td>
    </tr>
    <tr>
        <td>Access-Control-Allow-Headers</td>
        <td></td>
    </tr>
</table>

**CORS** is a modern alternative to **JSONP**.

<table>
    <tr>
        <th>Test</th>
        <th><strong>CORS</strong></th>
        <th><strong>JSONP</strong></th>
    </tr>
    <tr>
        <td>Supporting HTTP Methods</td>
        <td>All HTTP Methods</td>
        <td><strong>GET</strong> only</td>
    </tr>
    <tr>
        <td>Error Handling</td>
        <td>Good</td>
        <td>Bad</td>
    </tr>
    <tr>
        <td>Browsers</td>
        <td>Legacy Browsers</td>
        <td>Modern Browsers</td>
    </tr>
    <tr>
        <td>Security</td>
        <td>Able to defend XSS</td>
        <td>Susceptible to XSS</td>
    </tr>
</table>

1. [MDN CROS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
1. [Cross-Origin Resource Sharing Standard](https://www.w3.org/TR/cors/)

### [Web Messaging (Cross-document messaging)](https://en.wikipedia.org/wiki/Web_Messaging)

Web messaging allows scripts inside documents across origins to send text messages to each other. It relaxed security policy related to cross-site scripting a little bit for non-hostile pages.

If `postMessage()` method of `window` object is called, an _message_ event will be fired and handler scripts on other documents will be called. `postMessage()` is non-blocking call, messages are processed asynchronously.

Message event interface.

- data - Actual incoming text message.
- origin - Origin of source document, including protocol, hostname and port.
- source - `WindowProxy` of source window.

Post message to target document `contentWindow` and origin `http://example.com`

```javascript
var o = document.getElementsByTagName('iframe')[0];
o.contentWindow.postMessage('Hello B', 'http://example.com/');
```

Handles message event and post some messsage back to event source.

```javascript
function receiver(event) {
  if (event.origin == 'http://example.net') {
    if (event.data == 'Hello B') {
      event.source.postMessage('Hello A, how are you?', event.origin);
    }
    else {
      alert(event.data);
    }
  }
}
window.addEventListener('message', receiver, false);
```

Origins must be carefully checked to prevent cross-site scripting.

1. [Web Messaging Standard](https://html.spec.whatwg.org/multipage/web-messaging.html#web-messaging)

### [**JSONP**](https://en.wikipedia.org/wiki/JSONP)

### [**WebSocket**](https://en.wikipedia.org/wiki/WebSocket)