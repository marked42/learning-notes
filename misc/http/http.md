# HTTP

- [HTTP](#http)
  - [**U**niform **R**esrouce **I**dentifier](#uniform-resrouce-identifier)
    - [Syntax](#syntax)
    - [Absolute and Relative URLs](#absolute-and-relative-urls)
    - [Percent Encoding (URL Encoding)](#percent-encoding-url-encoding)
  - [HTTP Message](#http-message)
    - [Terminology](#terminology)
    - [Message Syntax](#message-syntax)
    - [HTTP Methods](#http-methods)
      - [GET](#get)
      - [HEAD](#head)
      - [PUT](#put)
      - [DELETE](#delete)
      - [POST](#post)
      - [TRACE](#trace)
      - [OPTIONS](#options)
      - [CONNECT](#connect)
      - [Extension Methods](#extension-methods)
    - [Headers](#headers)
      - [General Headers](#general-headers)
      - [Request Headers](#request-headers)
      - [Response Headers](#response-headers)
      - [Entity Headers](#entity-headers)
      - [Extension Headers](#extension-headers)
    - [Status Code](#status-code)
      - [100-199 Informational Status Code](#100-199-informational-status-code)
        - [100 Continue](#100-continue)
      - [200-299 Success Status Code](#200-299-success-status-code)
      - [300-399 Redirect Status Code](#300-399-redirect-status-code)
      - [400-499 Client Error Status Code](#400-499-client-error-status-code)
      - [500-599 Server Error Status Code](#500-599-server-error-status-code)
  - [Connection Management](#connection-management)
    - [TCP Handshake Delay](#tcp-handshake-delay)
      - [Delayed Acknowledgement](#delayed-acknowledgement)
      - [TCP Slow Start](#tcp-slow-start)
      - [Nagle's Algorithm & TCP_NODELAY](#nagles-algorithm--tcpnodelay)
      - [TIME_WAIT Accumulation & Port Exhaustion](#timewait-accumulation--port-exhaustion)
    - [Connection](#connection)
      - [Serial Connection](#serial-connection)
      - [Parallel Connection](#parallel-connection)
      - [Persistent Connection](#persistent-connection)
      - [Pipelined Connection](#pipelined-connection)
      - [Connection Header](#connection-header)
  - [Media Types](#media-types)
  - [Cookie](#cookie)
    - [完整流程](#%e5%ae%8c%e6%95%b4%e6%b5%81%e7%a8%8b)
    - [创建 Cookies](#%e5%88%9b%e5%bb%bacookies)
      - [Version 0 (Netscape) Cookies](#version-0-netscape-cookies)
    - [客户端存储格式](#%e5%ae%a2%e6%88%b7%e7%ab%af%e5%ad%98%e5%82%a8%e6%a0%bc%e5%bc%8f)
  - [Cache](#cache)
    - [Basic Terminology](#basic-terminology)
    - [Cache Life Cycle](#cache-life-cycle)
    - [Cache Storage Strategy](#cache-storage-strategy)
    - [Cache Expiration Strategy](#cache-expiration-strategy)
      - [Time Limit Expiration](#time-limit-expiration)
        - [Explicit Expiration](#explicit-expiration)
        - [Heuristic Expiration (Implicit Expiration)](#heuristic-expiration-implicit-expiration)
      - [Resource Content Expiration](#resource-content-expiration)
      - [Revalidation](#revalidation)
        - [Cache Revalidation Directives](#cache-revalidation-directives)
        - [Revalidation By ETag](#revalidation-by-etag)
        - [Revalidation By Time](#revalidation-by-time)
      - [Request Stale Cache](#request-stale-cache)
      - [Hitting Proxy Cache](#hitting-proxy-cache)
      - [Manual Page Refresh](#manual-page-refresh)
    - [Serving Request with Cache](#serving-request-with-cache)
    - [Which Cache Strategy Should I Use](#which-cache-strategy-should-i-use)
    - [Resource Cache and Version (TODO:)](#resource-cache-and-version-todo)
    - [Cache Topologies](#cache-topologies)
    - [Algorithm (TODO)](#algorithm-todo)
    - [Setting Caches in Apache Sever(TODO)](#setting-caches-in-apache-severtodo)
  - [Client Identification (TODO:)](#client-identification-todo)
  - [HTTP-NG & HTTP2.0 (TODO:)](#http-ng--http20-todo)
  - [Lib & Tools](#lib--tools)

## **U**niform **R**esrouce **I**dentifier

**Uniform Resource Identifier (URI)** is a string of characters used to identify a resource. Most commonly used form of URI is [**Uniform Resrouce Locator (URL)**](https://url.spec.whatwg.org/#example-url-parsing), which identifies a resource by its address on the web, URL is informally referred as _web address_. **Uniform Resrouce Name** is a type of URI that identifies resource by name in particular namespace without implying its location or how to access it.

### Syntax

```html
<scheme
  >://<user
    >:<password
      >@<host
        >:<port
          >/<path
            >;<params
              >?<query
                >#<frag
                ></frag></query></params></path></port></host></password></user
></scheme>
```

<table>
    <tr>
        <td>URL Components</td>
        <td>Explaination</td>
        <td>Default Value</td>
    </tr>
    <tr>
        <td>scheme</td>
        <td>Case-insensitive. Usually corresponding to a protocol, but not necessary, <em>file</em> corresponds to none. Begins with a letter, followed by a combination of letters, digits, plus(+), period(.) or hyphen(-).</td>
        <td>None</td>
    </tr>
    <tr>
        <td>//</td>
        <td>require by some schemes and not required by some others</td>
        <td>-</td>
    </tr>
    <tr>
        <td>user</td>
        <td rowspan='2'>User and password are separated by ":", followed by an at symbol (@)</td>
        <td>anonymous</td>
    </tr>
    <tr>
        <td>password</td>
        <td>implementation defined</td>
    </tr>
    <tr>
        <td>host</td>
        <td>A hostname or dotted ipv4, ipv6 address in brackets ([ ])</td>
        <td>None</td>
    </tr>
    <tr>
        <td>port</td>
        <td>Many schemes have default port number, 80 for HTTP</td>
        <td>Scheme-specific</td>
    </tr>
    <tr>
        <td>path</td>
        <td rowspan='2'>
            <p>
            Separated from preceding components by a slash(/), consisted of multiple path segments separated by slash (/). Each path segment can may have its own param. Param is a list of key-value pairs separated from preceding part by semicolon(;)
            </p>
            <code>http://www.joes-hardware.com/hammers;sale=false/index.html;graphics=true</code>
        </td>
        <td>None</td>
    </tr>
    <tr>
        <td>params</td>
        <td>None</td>
    </tr>
    <tr>
        <td>query</td>
        <td>A group of key value pairs <code>key=value</code> separated by delimeter separated from preceding part by question mark (?). '&' is the most common delimeter, ';' also used in some rare case.</td>
        <td>None</td>
    </tr>
    <tr>
        <td>fragment</td>
        <td>A name for part of the resource, not sent to server, used only on client-side, separated from preceding part by hash (#). Fragment is usually an <code>id</code> attribute of specific element, and web broswers will scoll that element into view.</td>
        <td>None</td>
    </tr>
</table>

### Absolute and Relative URLs

URLs are divided into _absolute_ and _relative_ ones. _Absolute_ URL is complete and contains all information needed to locate a resource. _Relative_ URL is imcomplete and must be interpreted relative to a **base** URL to locate a resource.

Relative URL example below is interpreted as `http://www.joes-hardware.com/hammers.html`.

```html
<!--
Document(base): http://www.joes-hardware.com/tools.html
Relative URL Below
-->
<a href="./hammers.html"></a>
```

Base URL can be specified implicitly or explicitly.

1. Explicit Base URL - Use `<base>` tag `href` attribute to specify explicitly.
   ```html
   <base target="_blank" href="http://www.example.com/page.html" />
   ```
1. Implicit Base URL - Use URL of current document or resource as base URL.

![Convert Relative URL to Absolute URL](./relative_url_to_absolute_url.png)

Most browsers will try to expand URL into complete ones when users are typing or submitting URL. Two types of expandomatic URL are used usually.

1. Hostname expansion - User can type hostname `yahoo` only, browsers expand it into `www.yahoo.com`.
1. History expansion. When users are typing `http://www.youtube`, history URLs are used to expand it completely `http://www.youtube.com`.

Reference

1. [WHATWG URL API](https://url.spec.whatwg.org/)
1. [Node URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api)

### Percent Encoding (URL Encoding)

URLs are designed to be portable, so that only a subset of most commonly used characters in ASCII can be used in URL directly. Other characters (special character, nonprintable character, 8 bit character) in URL must be represented with _escape sequence_ to avoid confusion. An _escape sequence_ is a percent sign (%) followed by two hexdecimal digits that represents the ASCII code of the encoded character.

[Percent Encoding](https://en.wikipedia.org/wiki/Percent-encoding) Reserved and Restricted characters.

| Character          | Reservation/Restriction                                                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| %                  | Reserved as escape token for encoded characters                                                                                                     |
| /                  | Reserved for delimiting splitting up path segments in path component                                                                                |
| .                  | Reserved in path component                                                                                                                          |
| ..                 | Reserved in path component                                                                                                                          |
| #                  | Reserved as fragment delimiter                                                                                                                      |
| ?                  | Reserved as query-string delimeter                                                                                                                  |
| ;                  | Reserved as params delimeter                                                                                                                        |
| :                  | Reserved to delimit scheme, user/password and host/port components                                                                                  |
| $ +                | Reserved                                                                                                                                            |
| @ & =              | Reserved because they've special meaning in the context of some schemes                                                                             |
| { } \| \ ^ ~ [ ] ' | Restricted because of unsafe handling by various transport agents, such as gateways                                                                 |
| <>"                | Unsafe; should be encoded because these characters often have meaning outside the scope of the URL, such as delimiting the URL itself in a document |
| 0x00-0x1F, 0x7F    | Restricted; characters within these hex ranges are nonprintable                                                                                     |
| >0x7F              | Restricted; characters not representable with 7 bit ASCII                                                                                           |

When all unsafe characters are escaped, URL is in a _canonical form_ that can be shared between application without worrying other applications being confused by any characters with special meanings.

On the other hand, safe characters should not be escaped. Attackers could use this to cause pattern matching on URLs by some applications to fail.

## HTTP Message

### Terminology

_Inbound_ http message travels from client to server, _outbound_ http message travels from server to client.

![HTTP Message Inbound Outbound](./http_message_inbound_outbound.png)

All messages flow downstream, intermediate nodes closer to message sender are upstream of those closer to message reciever.

![HTTP Message Downstream Upstream](./http_message_downstream_upstream.png)

### Message Syntax

Both request and response message is composed of three parts: start line, headers and body.

- Request

  ```http
  <method> <request-URL> <version>
  <headers>

  <entity-body>
  ```

- Response

  ```http
  <version> <status> <reason-phrase>
  <headers>

  <entity-body>
  ```

![HTTP Message Example](./http_message_syntax.png)

<table>
    <tr>
        <th>Parts</th>
        <th>Explaination</th>
    </tr>
    <tr>
        <td>method</td>
        <td>One of HTTP Methods</td>
    </tr>
    <tr>
        <td>request-URL</td>
        <td>Complete URL of target resource or absolute path component of the URL</td>
    </tr>
    <tr>
        <td>&lt;version&gt;</td>
        <td>HTTP version in a format <code>HTTP/&lt;major&gt;.&lt;minor&gt;</code>, major and minor are integers.
        </td>
    </tr>
    <tr>
        <td>status-code</td>
        <td>A three-digit number representing response status</td>
    </tr>
    <tr>
        <td>reason-phrase</td>
        <td>A human-readable string corresponding to status-code.</td>
    </tr>
    <tr>
        <td>headers</td>
        <td>A list of headers, each of which starts with a name, followed by a colon(:), followed by optional whitespace, followed by a value, followed by a CRLF. Headers and bodies are separated by a blank line represented by a CRLF.</td>
    </tr>
    <tr>
        <tr>Entity body contains a block of arbitrary data. It's terminated by a CRLF and it's optional./td>
    </tr>
</table>

### HTTP Methods

| Methods | HTTP Version | Safe | Idempotent |
| ------- | ------------ | ---- | ---------- |
| GET     | 1.0/1.1      | Yes  | Yes        |
| HEAD    | 1.0/1.1      | Yes  | Yes        |
| PUT     | 1.1          | No   | Yes        |
| DELETE  | 1.1          | No   | Yes        |
| POST    | 1.0/1.1      | No   | No         |
| PATCH   | 1.1          | No   | No         |
| TRACE   | 1.1          | Yes  | Yes        |
| OPTIONS | 1.1          | Yes  | Yes        |
| CONNECT | 1.1          | Yes  | Yes        |

_Safe_ methods should not change any server data. _Idempotent_ method may change server data, but the result of calling it more than one time should have no difference with calling it once.

#### GET

1. query string appears as part of URL.
1. Bookmarkable.
1. Almost all web servers supports URL of 1024 characters, standard prefers not using URL longer than 255 characters.
1. Unsafe plain text.

```http
GET /search?hl=en&q=HTTP&btnG=Google+Search HTTP/1.1
Host: www.google.com
User-Agent: Mozilla/5.0 Galeon/1.2.0 (X11; Linux i686; U;) Gecko/20020326
Accept: text/xml,application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8, video/x-mng,image/png,image/jpeg,image/gif;q=0.2, text/css,*/*;q=0.1
Accept-Language: en
Accept-Encoding: gzip, deflate, compress;q=0.9
Accept-Charset: ISO-8859-1, utf-8;q=0.66, *;q=0.66
Keep-Alive: 300
Connection: keep-alive
```

#### HEAD

HEAD method should be treated like **GET** method, only its response should not contains body. It's often used to find out information (existence, type, last modification time...) about a resource without getting its content.

#### PUT

1. Create or update specified resource on server.
1. Create resource and return **201 (Created)** when resource doesn't exist, update resource and return **200 (OK)** or **204 (No Content)** if resource exist.
1. `method` attribute of HTML `<form>` tag supports only **GET** and **POST**, not \*PUT\*\* method.

#### DELETE

1. Delete specified resource on server, returned **200 (OK)** doesn't means it's deleted.

> It merely indicates that the server's intent is to delete the content. This exception allows for human intervention as a safety precaution.

#### POST

1. Query string appears as in message body, so length is not limited.
1. Unsafe plain text.

```http
POST /search HTTP/1.1
Host: www.google.com
User-Agent: Mozilla/5.0 Galeon/1.2.5 (X11; Linux i686; U;) Gecko/20020606
Accept: text/xml,application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,video/x-mng,image/png,image/jpeg,image/gif;q=0.2, text/css,*/*;q=0.1
Accept-Language: en
Accept-Encoding: gzip, deflate, compress;q=0.9
Accept-Charset: ISO-8859-1, utf-8;q=0.66, *;q=0.66
Keep-Alive: 300
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 31

hl=en&q=HTTP&btnG=Google+Search
```

#### TRACE

1. Used to trace all nodes that HTTP message passes.
1. Every intermediary server append its address to `Via` header.

```http
TRACE / HTTP/1.1
Host: webserver.localdomain
```

```http
TRACE / HTTP/1.1
Host: webserver.localdomain
Via: 1.1 proxya.localdomain
```

```http
TRACE / HTTP/1.1
Host: webserver.localdomain
Via: 1.1 proxya.localdomain, 1.1 proxyb.localdomain
```

```http
HTTP/1.1 200 OK
Date: Tue, 21 May 2002 12:34:56 GMT
Server: Apache/1.3.22(Unix)
Content-Type: message/http

TRACE / HTTP/1.1
Host: webserver.localdomain
Via: 1.1 proxya.localdomain, 1.1 proxyb.localdomain
```

```http
HTTP/1.1 200 OK
Date: Tue, 21 May 2002 12:34:56 GMT
Server: Apache/1.3.22(Unix)
Content-Type: message/http
Via: 1.1 proxyb.localdomain

TRACE / HTTP/1.1
Host: webserver.localdomain
Via: 1.1 proxya.localdomain, 1.1 proxyb.localdomain
```

```http
HTTP/1.1 200 OK
Date: Tue, 21 May 2002 12:34:56 GMT
Server: Apache/1.3.22(Unix)
Content-Type: message/http
Via: 1.1 proxyb.localdomain, 1.1 proxya.localdomain

TRACE / HTTP/1.1
Host: webserver.localdomain
Via: 1.1 proxya.localdomain, 1.1 proxyb.localdomain
```

#### OPTIONS

1. Query server for supported HTTP methods, result contained in `Allow` header of response.

```http
OPTIONS * HTTP/1.1
Host: 127.0.0.1
```

```http
HTTP/1.1 200 OK
Date: Tue, 21 May 2002 12:34:56 GMT
Server: Apache/1.3.22 (Unix) (Red-Hat/Linux) mod_python/2.7.8 Python/1.5.2 mod_ssl/2.8.5 OpenSSL/0.9.6b DAV/1.0.2 PHP/4.0.6 mod_perl/1.26 mod_throttle/3.1.2
Content-Length: 0
Allow: GET, HEAD, OPTIONS, TRACE
Connection: close
```

#### CONNECT

1. Intermediary servers setup tunnel with server, it doesn't check or transform request, only transports messages between client and server.
1. Tunnel should be transparent to servers and clients.

Most common use case is setting up a **S**ecure **S**ockets **L**ayer or **T**ransport **L**ayer **S**ecurity for encryption.

#### Extension Methods

Some WebDAV extension methods.

| Method | Description                               |
| ------ | ----------------------------------------- |
| LOCK   | Allows user to lock a resource            |
| MKCOL  | Allows user to create a resource          |
| COPY   | Facilitates copying resources on a server |
| MOVE   | Moves a resource on a server              |

### Headers

#### General Headers

General headers are generic headers that can appear both in request and in response message.

<table>
    <tr>
        <th colspan='2'>Header</th>
        <th>Description</th>
    </tr>
    <tr>
        <td rowspan='8'>Informational</td>
        <td>Connection</td>
        <td></td>
    </tr>
    <tr>
        <td>Date</td>
        <tr></tr>
    </tr>
    <tr>
        <td>MIME-Version</td>
        <td></td>
    </tr>
    <tr>
        <td>Trailer</td>
        <td></td>
    </tr>
    <tr>
        <td>Transfer-Encoding</td>
        <td></td>
    </tr>
    <tr>
        <td>Upgrade</td>
        <td></td>
    </tr>
    <tr>
        <td>Via</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='2'>Cache</td>
        <td>Cache-Control</td>
        <td></td>
    </tr>
    <tr>
        <td>Pragma</td>
        <td></td>
    </tr>
</table>

#### Request Headers

Request headers provide extra information to servers. They appears only in request messages.

<table>
    <tr>
        <th colspan='2'>Header</th>
        <th>Description</th>
    </tr>
    <tr>
        <td rowspan='11'>Informational</td>
        <td>Client-IP</td>
        <td></td>
    </tr>
    <tr>
        <td>From</td>
        <tr></tr>
    </tr>
    <tr>
        <td>Host</td>
        <td></td>
    </tr>
    <tr>
        <td>Referer</td>
        <td></td>
    </tr>
    <tr>
        <td>UA-Color</td>
        <td></td>
    </tr>
    <tr>
        <td>UA-CPU</td>
        <td></td>
    </tr>
    <tr>
        <td>UA-Disp</td>
        <td></td>
    </tr>
    <tr>
        <td>UA-OS</td>
        <td></td>
    </tr>
    <tr>
        <td>UA-Pixels</td>
        <td></td>
    </tr>
    <tr>
        <td>User-Agent</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='5'>Accpet</td>
        <td>Accept</td>
        <td></td>
    </tr>
    <tr>
        <td>Accept-Charset</td>
        <td></td>
    </tr>
    <tr>
        <td>Accept-Encoding</td>
        <td></td>
    </tr>
    <tr>
        <td>Accept-Language</td>
        <td></td>
    </tr>
    <tr>
        <td>TE</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='7'>Conditional Request</td>
        <td>Expect</td>
    </tr>
    <tr>
        <td>If-Match</td>
        <td></td>
    </tr>
    <tr>
        <td>If-Modified-Since</td>
        <td></td>
    </tr>
    <tr>
        <td>If-None-Match</td>
        <td></td>
    </tr>
    <tr>
        <td>If-Range</td>
        <td></td>
    </tr>
    <tr>
        <td>If-Unmodified-Since</td>
        <td></td>
    </tr>
    <tr>
        <td>Range</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='3'>Security</td>
        <td>Authorization</td>
        <td></td>
    </tr>
    <tr>
        <td>Cookie</td>
        <td></td>
    </tr>
    <tr>
        <td>Cookie2</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='3'>Proxy</td>
        <td>Max-Forwards</td>
        <td></td>
    </tr>
    <tr>
        <td>Proxy-Authorization</td>
        <td></td>
    </tr>
    <tr>
        <td>Proxy-Connection</td>
        <td></td>
    </tr>
</table>

#### Response Headers

Response headers provide extra information to clients. They appears only in response messages.

<table>
    <tr>
        <th colspan='2'>Header</th>
        <th>Description</th>
    </tr>
    <tr>
        <td rowspan='7'>Informational</td>
        <td>Age</td>
        <td></td>
    </tr>
    <tr>
        <td>Public</td>
        <tr></tr>
    </tr>
    <tr>
        <td>Retry-After</td>
        <td></td>
    </tr>
    <tr>
        <td>Server</td>
        <td></td>
    </tr>
    <tr>
        <td>Title</td>
        <td></td>
    </tr>
    <tr>
        <td>Warning</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='2'>Negotiation</td>
        <td>Accept-Ranges</td>
        <td></td>
    </tr>
    <tr>
        <td>Vary</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='4'>Security</td>
        <td>Proxy-Autheticate</td>
        <td></td>
    </tr>
    <tr>
        <td>Set-Cookie</td>
        <td></td>
    </tr>
    <tr>
        <td>Set-Cookie2</td>
        <td></td>
    </tr>
    <tr>
        <td>WWW-Authenticate</td>
        <td></td>
    </tr>
</table>

#### Entity Headers

Entity headers refers to headers that deal with entity body.

<table>
    <tr>
        <th colspan='2'>Header</th>
        <td>Description</td>
    </tr>
    <tr>
        <td rowspan='2'>Informational</td>
        <td>Allow</td>
        <td></td>
    </tr>
    <tr>
        <td>Location</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='8'>Content</td>
        <td>Content-Base</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-Encoding</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-Language</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-Length</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-Location</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-MD5</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-Range</td>
        <td></td>
    </tr>
    <tr>
        <td>Content-Type</td>
        <td></td>
    </tr>
    <tr>
        <td rowspan='3'>Cache</td>
        <td>ETag</td>
        <td></td>
    </tr>
    <tr>
        <td>Expires</td>
        <td></td>
    </tr>
    <tr>
        <td>Last-Modified</td>
        <td></td>
    </tr>
</table>

#### Extension Headers

Extension headers are nonstandard headers that have been created by application developers for but not yet added to HTTP specification. HTTP programs should be tolerant and ignores or forward unknown extension headers.

Extension headers usually should start with 'X' like `X-Rate-Limit` to be distinguished from standard headers.

### Status Code

#### 100-199 Informational Status Code

##### 100 Continue

<table>
    <tr>
        <td>Status code</td>
        <td>Reason phrase</td>
        <td>Explaination</td>
    </tr>
    <tr>
        <td>100</td>
        <td>Continue</td>
        <td></td>
    </tr>
    <tr>
        <td>101</td>
        <td>Switching Protocoles</td>
        <td></td>
    </tr>
</table>

#### 200-299 Success Status Code

<table>
    <tr>
        <td>Status code</td>
        <td>Reason phrase</td>
        <td>Explaination</td>
    </tr>
    <tr>
        <td>200</td>
        <td>OK</td>
        <td></td>
    </tr>
    <tr>
        <td>201</td>
        <td>Created</td>
        <td></td>
    </tr>
    <tr>
        <td>202</td>
        <td>Accepted</td>
        <td></td>
    </tr>
    <tr>
        <td>203</td>
        <td>Non-Authoritative</td>
        <td></td>
    </tr>
    <tr>
        <td>204</td>
        <td>No Content</td>
        <td></td>
    </tr>
    <tr>
        <td>205</td>
        <td>Reset Content</td>
        <td></td>
    </tr>
    <tr>
        <td>206</td>
        <td>Partial Content</td>
        <td></td>
    </tr>
</table>

#### 300-399 Redirect Status Code

<table>
    <tr>
        <td>Status code</td>
        <td>Reason phrase</td>
        <td>Explaination</td>
    </tr>
    <tr>
        <td>300</td>
        <td>Multiple Choices</td>
        <td></td>
    </tr>
    <tr>
        <td>301</td>
        <td>Created</td>
        <td>Moved Permanently</td>
    </tr>
    <tr>
        <td>302</td>
        <td>Accepted</td>
        <td>Found</td>
    </tr>
    <tr>
        <td>303</td>
        <td>See Other</td>
        <td></td>
    </tr>
    <tr>
        <td>304</td>
        <td>Not Modified</td>
        <td></td>
    </tr>
    <tr>
        <td>305</td>
        <td>Use Proxy</td>
        <td></td>
    </tr>
    <tr>
        <td>306</td>
        <td>(Unused)</td>
        <td></td>
    </tr>
    <tr>
        <td>307</td>
        <td>Temporary Redirect</td>
        <td></td>
    </tr>
</table>

#### 400-499 Client Error Status Code

<table>
    <tr>
        <td>Status code</td>
        <td>Reason phrase</td>
        <td>Explaination</td>
    </tr>
    <tr>
        <td>400</td>
        <td>Bad Request</td>
        <td></td>
    </tr>
    <tr>
        <td>401</td>
        <td>Unauthorized</td>
        <td>Chanllenge user for authorization</td>
    </tr>
    <tr>
        <td>402</td>
        <td>Payment Required</td>
        <td></td>
    </tr>
    <tr>
        <td>403</td>
        <td>Forbidden</td>
        <td>Not allowed to access</td>
    </tr>
    <tr>
        <td>404</td>
        <td>Not Found</td>
        <td></td>
    </tr>
    <tr>
        <td>405</td>
        <td>Method Not Allowed</td>
        <td></td>
    </tr>
    <tr>
        <td>406</td>
        <td>Not Acceptable</td>
        <td></td>
    </tr>
    <tr>
        <td>407</td>
        <td>Proxy Authentication</td>
        <td></td>
    </tr>
    <tr>
        <td>408</td>
        <td>Request Timeout</td>
        <td></td>
    </tr>
    <tr>
        <td>409</td>
        <td>Conflict</td>
        <td></td>
    </tr>
    <tr>
        <td>410</td>
        <td>Gone</td>
        <td></td>
    </tr>
    <tr>
        <td>411</td>
        <td>Length Required</td>
        <td></td>
    </tr>
    <tr>
        <td>412</td>
        <td>Precondition Failed</td>
        <td></td>
    </tr>
    <tr>
        <td>413</td>
        <td>Request Entity Too Large</td>
        <td></td>
    </tr>
    <tr>
        <td>414</td>
        <td>Request URI Too Long</td>
        <td></td>
    </tr>
    <tr>
        <td>415</td>
        <td>Unsupported Media Type</td>
        <td></td>
    </tr>
    <tr>
        <td>416</td>
        <td>Requested Range Not Satisfiable</td>
        <td></td>
    </tr>
    <tr>
        <td>417</td>
        <td>Expectation Failed</td>
        <td></td>
    </tr>
</table>

#### 500-599 Server Error Status Code

<table>
    <tr>
        <td>Status code</td>
        <td>Reason phrase</td>
        <td>Explaination</td>
    </tr>
    <tr>
        <td>500</td>
        <td>Internal Server Error</td>
        <td></td>
    </tr>
    <tr>
        <td>501</td>
        <td>Not Implemented</td>
        <td></td>
    </tr>
    <tr>
        <td>502</td>
        <td>Bad Gateway</td>
        <td></td>
    </tr>
    <tr>
        <td>503</td>
        <td>Service Unavailable</td>
        <td></td>
    </tr>
    <tr>
        <td>504</td>
        <td>Gateway Timeout</td>
        <td></td>
    </tr>
    <tr>
        <td>505</td>
        <td>HTTP Version Not Supported</td>
        <td></td>
    </tr>
</table>

## Connection Management

### TCP Handshake Delay

A TCP connection is distinguished by four values

```txt
<source-IP-address, source-port, destination-IP-address, destionation-port>
```

Sockets API hide all the detail of underlying network protocol handshaking and the segmentation and reassembly of the TCP data stream to and from IP packets.

Before any data can be sent with HTTP protocol, TCP protocol is used to set up a connection between client and server.

TCP handshake takes 3 steps.

1. Client request a new TCP connection, sends a small TCP packet (40-60 bytes) with a special "SYN" flag set which means it's a connection request.
1. Server accpets the connection, send a TCP packet with both "SYN" and "ACK" flag set, which means the connection is accepted.
1. Client send acknowledgement back to server, notifying server that the connection is established. Mordern TCP stacks allow client to sent data in this acknowledgement packet.

![TCP Connection Handshake Delay](./tcp_connection_handshake_delay.png)

#### Delayed Acknowledgement

To increase network efficiency, most TCP implementations will hold acknowledgement packets for a fraction of a second (100ms~200ms), in prospect of any message with same direction as acknowledgement packet. Same direction message data will be packed together with acknowledgement packet to increase network efficiency by avoiding small-sized (40-60 bytes) bare acknowledgement packet. If no same direction message data is found, acknowledgement packet is sent anyway.

#### TCP Slow Start

TCP slow start is a congestion-control feature which increases number of allowed packets to send each time gradually. Each time a packet is received, sender has permission to send two more packets. So TCP connection is tuned to send more and more packets until it reaches maximum network overload. A tuned TCP connection is more efficient than a new one, so it's better to reuse existed connection than creating a new one.

#### Nagle's Algorithm & TCP_NODELAY

Each TCP segment carries at least 40 bytes of flags and headers, network efficiency is quite low when a lot of small-sized TCP segments are transmitted. Nagle's algorithm tries to increase network efficiency by discouraing the sending of non full-size (1500 bytes for LAN, a few hundred bytes for internet) packets. Data must be buffered to complete a full packet before sending. Or if all other packets are sent and acknowledged, non full-size packet can be sent.

Nagle's algorithm causes HTTP performance problems.

1. Small HTTP messages may not fill a packet, so they may be delayed waiting for additional data that will never arrive.
1. Partial data is held until acknowledgement arrives, which themselves are delayed by the delayed acknowledgement algorithm.

#### TIME_WAIT Accumulation & Port Exhaustion

When a TCP connection is closed, new connection with exact same parameter is not allowed to be used for a period of time (2 **m**aximum **s**egment **l**ife, 2mins usually). This prevents new connection from getting packets of old connection, which would corrupt data of current TCP connection. And there's a limited number of connections available for a specific client and server. If there're 60000 ports available, `60000 / (2 * 60) = 500` connections at maximum are available in a second.

### Connection

#### Serial Connection

![Serial Connection](./http_serial_transaction_delay.png)

#### Parallel Connection

1. Parallel connections may make pages load faster.
1. Parallel connections may not be faster when multiple connections are competing for network bandwidth.
1. Parallel connections are perceived to be faster by users compared with serial connections.
1. Too many parallel connections have the problem of exhausting system ports and resources. So a limited number (4) of parallel connections are allowed in practice.

![Parallel Connection](./http_parallel_connections.png)

#### Persistent Connection

#### Pipelined Connection

#### Connection Header

## Media Types

**Multipurpose Internet Mail Extensions (MIME)** was originally designed for email. It worked so well that HTTP protocol adopted it to describe and label type of media content.

## Cookie

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
