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
            - [POST](#post)
            - [PUT](#put)
            - [DELETE](#delete)
            - [HEAD](#head)
            - [TRACE](#trace)
            - [OPTIONS](#options)
            - [CONNECT](#connect)
        - [Headers](#headers)
        - [Status Code](#status-code)
    - [Media Types](#media-types)
    - [Cookie](#cookie)
    - [Cache](#cache)
        - [Basic Terminology](#basic-terminology)
        - [Cache Lifecycle](#cache-lifecycle)
            - [Cache or Not Cache](#cache-or-not-cache)
            - [Cache Creation & Expiration](#cache-creation-expiration)
                - [Explicit Expiration](#explicit-expiration)
                - [Heuristic Expiration](#heuristic-expiration)
                - [Stale Cache](#stale-cache)
            - [Cache Revalidation](#cache-revalidation)
            - [Force Refresh](#force-refresh)
        - [Cache Topologies](#cache-topologies)
        - [Algorithm (TODO)](#algorithm-todo)
        - [Setting Caches in Apache Sever(TODO)](#setting-caches-in-apache-severtodo)
        - [Cache and Advertising (TODO)](#cache-and-advertising-todo)
    - [Connection Management (TODO:)](#connection-management-todo)
    - [Client Identification (TODO:)](#client-identification-todo)
    - [HTTPS (TODO:)](#https-todo)
    - [Authentication (TODO:)](#authentication-todo)
    - [Architectural Components (TODO:)](#architectural-components-todo)
        - [Web Servers (TODO:)](#web-servers-todo)
        - [Proxies (TODO:)](#proxies-todo)
        - [Gateways, Tunnels and Relays (TODO:)](#gateways-tunnels-and-relays-todo)
    - [HTTP-NG & HTTP2.0 (TODO:)](#http-ng-http20-todo)
    - [Lib & Tools](#lib-tools)

## **U**niform **R**esrouce **I**dentifier

**Uniform Resource Identifier (URI)** is a string of characters used to identify a resource. Most commonly used form of URI is [**Uniform Resrouce Locator (URL)**](https://url.spec.whatwg.org/#example-url-parsing), which identifies a resource by its address on the web, URL is informally referred as _web address_. **Uniform Resrouce Name** is a type of URI that identifies resource by name in particular namespace without implying its location or how to access it.

### Syntax

```html
<scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag>
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
            Separated from preceding components by a slash(/), consisted of multiple path segments separated by slash (/). Each path segment can may have its own param. Param is a list of key-value pairs separated from preceding part by semicolor(;)
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
<a href="./hammers.html">
```

Base URL can be specified implicitly or explicitly.

1. Explicit Base URL - Use `<base>` tag `href` attribute to specify explicitly.
   ```html
   <base target="_blank" href="http://www.example.com/page.html">
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

Both request and reponse message is composed of three parts: start line, headers and body.

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

### HTTP Methods

| Methods | HTTP Version | Explaination |
| ------- | ------------ | ------------ |
| GET     | 1.0/1.0      |              |
| POST    | 1.0/1.1      |              |
| HEAD    | 1.0/1.1      |              |
| PUT     | 1.1          |              |
| DELETE  | 1.1          |              |
| TRACE   | 1.1          |              |
| OPTIONS | 1.1          |              |
| CONNECT | 1.1          |              |

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

#### PUT

1. Create or update specified resource on server.
1. Create resource and return **201 (Created)** when resource doesn't exist, update resource and return **200 (OK)** or **204 (No Content) if resource exist.
1. `method` attribute of HTML `<form>` tag supports only **GET** and **POST**, not *PUT** method.

#### DELETE

1. Delete specified resource on server, returned **200 (OK)** doesn't means it's deleted.

> It merely indicates that the server's intent is to delete the content. This exception allows for human intervention as a safety precaution.

#### HEAD

1. Same as **GET** method, but response contains only headers.

#### TRACE

1. Used to trace all nodes that HTTP message passes.
1. Every intermediary server append its addres to `Via` header.

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

### Headers

### Status Code

## Media Types

**Multipurpose Internet Mail Extensions (MIME)** was originally designed for email. It worked so well that HTTP protocol adopted it to describe and label type of media content.

## Cookie

[Simple cookie framework](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework)

1. [HTTP Cookie](https://en.wikipedia.org/wiki/HTTP_cookie#Session_cookie)

## Cache

### Basic Terminology

Caches are copies of visited resrouce stored on local machine or proxy server. It's used to save users from requesting same resource from server again.

1. Prevent redundant resource request, reduce transport load, improve bandwidth bottleneck.
1. Balance traffic spike by flash crowds using mutliple cache servers.
1. Reduce distance delays by setting up multiple cache servers around the globe.

Cache Hit & Miss

1. Cache hit - A request arrives at a cache, and resource is severed with cache.
1. Cache miss - A request arrives at a cache, but cache is not fresh and resource is served by server.

Cache Revalidate

1. Revalidate hit - A request arrives at a cache, but not sure if cache is fresh, cache is confirmed by server to be fresh and resource is served with cache. A http reponse of status code **304(Not Modified)** will be sent back and cache freshness is updated.
1. Revalidate miss - A request arrives at a cache, but not sure if cache is fresh, cache is confirmed by server to be unfresh and resource is served by server. A http reponse of status code **200(Ok)** with full content of resource is sent back and cache is updated.
1. Resource deleted - A response of status code **404(Not Found)** is sent back and cache should be deleted.

> The fraction of requests that are served from cache is called the cache hit rate (or cache hit ratio), or sometimes the document hit rate (or document hit ratio).

> The byte hit rate represents the fraction of all bytes transferred that were served from cache.

### Cache Lifecycle

#### Cache or Not Cache

`Cache-Control` header is used by server to specify directives for caching mechanisms used for resource. `Cache-Control` can have a list of comma separated values.

```html
<meta http-equiv='Cache-Control' content='no-cache'>
```

HTML meta tag can also be used to specify cache control, but it's only supported in few browsers, since most browers don't parse content of html document.

<table>
    <tr>
        <th>Header</th>
        <th>Explaination</th>
        <th>Request/Response</th>
    </tr>
    <tr>
        <td><code>Cache-Control: public</code></td>
        <td>Resource in response may be cached by client or proxy server</td>
        <td>Response</td>
    </tr>
    <tr>
        <td><code>Cache-Control: private</code></td>
        <td>Resource in response may be cached by client but not by proxy server</td>
        <td>Reponse</td>
    </tr>
    <tr>
        <td><code>Cache-Control: no-store</code></td>
        <td>Request and response are not allowed to be stored as cache, any existing ones should be delted. This header must be forwared by intermediary servers.</td>
        <td>Both</td>
    </tr>
    <tr>
        <td><code>Cache-Control: no-cache</code></td>
        <td>Request or response may be cached, but cache is always considered as expired and should request server for revalidation before serving cache. When request arrives at a proxy server, it must forward the header and revalidate the cache on behalf of client, otherwise an expired cache in intermediary server may be served inappropriately. Meaningfully equivalent to <code>Cache-Control: max-age=0, must-revalidate</code></td>
        <td>Both</td>
    </tr>
    <tr>
        <td><code>Pragma: no-cache</code></td>
        <td>Same as above, included in HTTP/1.1 for backward compatibility.</td>
        <td>Both</td>
    </tr>
    <tr>
        <td><code>Cache-Control: only-if-cached</code></td>
        <td>Indicates that client only wishs to obtain a cached resource and should not contact origin-server and retrieve new data.</td>
        <td>Request</td>
    </tr>
</table>

#### Cache Creation & Expiration

An expiration mechanism must be specified explicitly or implicitly for cache to prevent it from being fresh forever.

##### Explicit Expiration

Specifies that cache is fresh before an absolute date or during a relative period of time.

<table>
    <tr>
        <th>Header</th>
        <th>Explaination</th>
        <th>Request/Response</th>
    </tr>
    <tr>
        <td><code>Cache-Control: max-age=&lt;seconds&gt;</code></td>
        <td>Specifies maximum seconds a resource is considered fresh. Specify seconds as 0 to indicate that a cache should not be created or should be refreshed on every access by setting maximum age to zero.</td>
        <td>Both</td>
    </tr>
    <tr>
        <td><code>Cache-Control: s-maxage=&lt;seconds&gt;</code></td>
        <td>Same as above, but only applies to public caches and ignored by a private cache.</td>
        <td>Response</td>
    </tr>
    <tr>
        <td><code>Expires: &lt;http-date&gt;</code></td>
        <td>Specifies resource expiration date. Invalid date means that resource is already expired. It requires client and server clocks to be synchronized to work correctly. Ignored if <code>Cache-Control: max-age</code> or <code>Cache-Control: s-maxage</code> exist.</td>
        <td>Response</td>
    </tr>
</table>

##### Heuristic Expiration

When reponse contains no `Cache-Control: max-age` or `Expires` header, a heuristic expiration strategy is used. Any heuristic expiration algorithm may be used, however it's required to add a `Warning` header if calculated maximum age is greater than 24 hours.

A popular one is _LM-Factor_ algorithm, which utilizes last modfied date of a resource to determine appropriate expiration date.

![LM-Factor Expiration Algorithm](lm_factor_heuristic_expiration_algorithm.png)

```javascript
const calculateFreshnessLimit = (
  server_date,
  server_last_modification_date
) => {
  // an hour or a day
  const default_freshness_limit = 60 * 60;
  if (
    !Number.isInteger(server_date) &&
    !Number.isInteger(server_last_modification_date)
  ) {
    return default_freshness_limit;
  }

  const seconds_since_last_modification = Math.max(
    0,
    server_date - server_last_modication_date
  );

  // a day or a week
  const server_freshness_limit_upper_bound = 24 * 60 * 60;

  const lm_factor = 0.2;
  const server_freshness_limit_by_factor =
    lm_factor * seconds_since_last_modification;

  const server_freshness_limit = Math.min(
    server_freshness_limit_upper_bound,
    server_freshness_limit_by_factor
  );

  return server_freshness_limit;
};
```

##### Stale Cache

Client might tighten cache expiration constraint for applications that need the very freshest resource. On the other hand, client might loosen cache expiration date as comproimse to improve performance. When a cache is expired, client have the option to contact server to revalidate cache freshness.

<table>
    <tr>
        <th>Header</th>
        <th>Explaination</th>
        <th>Request/Response</th>
    </tr>
    <tr>
        <td>
            <code>Cache-Control: min-fresh=&lt;seconds&gt;</code>
        </td>
        <td>Specifies that client wants a cache that will still be fresh for at least specified number of seconds.</td>
        <td>Request</td>
    </tr>
    <tr>
        <td>
            <code>Cache-Control: max-stale[=&lt;seconds&gt;]</code>
        </td>
        <td>Specifies that client is willing to accept a stale cache. When a number is provided, it indicates that a stale cache is acceptable if it's been expired for specified number of seconds at maximum.</td>
        <td>Request</td>
    </tr>
</table>

#### Cache Revalidation

<table>
    <caption><strong>Last-Modified Date Revalidation</strong></caption>
    <tr>
        <th>Header</th>
        <th>Explaintion</th>
        <th>Request/Response</th>
    </tr>
    <tr>
        <td>
            <code>Cache-Control: must-revalidate</code>
        </td>
        <td>A stale cache is not acceptable and must pass revalidation before being served.</td>
        <td>Response</td>
    </tr>
    <tr>
        <td>
            <code>Cache-Control: proxy-revalidate</code>
        </td>
        <td>Same as above, only applies to public caches, ignored by private cache.</td>
        <td>Response</td>
    </tr>
    <tr>
        <td>
            <code>Last-Modified: &lt;date&gt;</code>
        </td>
        <td></td>
        <td>Response</td>
    </tr>
    <tr>
        <td>
            <code>If-modified-since: &lt;date&gt;</code>
        </td>
        <td>If resource is modified since specified date, modified version of resource will be sent back from server and cache content and expiration date should be updated. Otherwise, a 304 Not Modified reponse message without body is returned, only headers that need updating like expiration date are needed to be sent back.</td>
        <td>Request</td>
    </tr>
    <tr>
        <td>
            <code>If-Unmodified-since: &lt;date&gt;</code>
        </td>
        <td></td>
        <td>Request</td>
    </tr>
    <tr>
        <td>
            <code>Cache-Control: immutable</code>
        </td>
        <td>Indicates that a resource on serve will not change before a cache expires and therefore the client should not send a condiational revalidation even when users refreshes the page. <a href="https://bitsup.blogspot.jp/2016/05/cache-control-immutable.html">See this blog</a></td>
        <td>Response</td>
    </tr>
</table>

There're cases where last-modified date revalidation isn't adequate.

1. Some documents may be rewritten periodically but contains same data.
1. Some documents may have minor content change that isn't important enough to enforce a cache update.
1. Some servers cannot determine last modification date accurately.
1. For documents that may change within a second, its content changes but last modification date remains the same.

So content validation by a _entity tags_(ETags) is used.

<table>
    <caption><strong>Resource Content Revalidation</strong></caption>
    <tr>
        <th>Header</th>
        <th>Explaintion</th>
        <th>Request/Response</th>
    </tr>
    <tr>
        <td>
            <code>ETag: [W/]&lt;tags&gt;</code>
        </td>
        <td>'W' or 'w' means that this tag is a weak validator that remains the same when resource has minor content change. Strong validators are same when resource remains exactly same.</td>
        <td></td>
    </tr>
    <tr>
        <td>
            <code>If-Match: &lt;tag&gt;</code>
        </td>
        <td>
            <ul>
                <li>
                <strong>GET</strong> or <strong>HEAD</strong> method,
                used in combination with <strong>Range</strong> header to ensure range request responded by same resource. If it doesn't match, a 416 (Range Not Satisfiable) reponse is returned.
                </li>
                <li>
                <strong>PUT</strong> method,
                '*' is used to ensure resource not existed when uploading a file.
                </li>
            </ul>
        </td>
        <td>Request</td>
    </tr>
    <tr>
        <td>
            <code>If-None-Match: &lt;tags&gt;</code>
        </td>
        <td>
            <ul>
                <li>
                <strong>GET</strong> or <strong>HEAD</strong> method,
                If no tag matches specified tags, new resource will be sent back from server and caches should be updated.
                </li>
                <li>
                <strong>PUT</strong> method,
                '*' is used to ensure resource not existed when uploading a file.
                </li>
            </ul>
        </td>
        <td>Request</td>
    </tr>
</table>

1. [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match)
1. [Lost Update Problem](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) (TODOS)

#### Force Refresh

Browsers usually provides buttons or keyboard shortcuts for users to refresh page. In Chrome, when page is refreshed by **F5**, `Cache-Control: max-age=0` is used to expire current cache; `Cache-Control: no-cache` is used to force retrieving resource from server.

### Cache Topologies

Private caches refers to exclusive caches stored on single client, it's usually implemented by browsers. Public caches, also known as shared caches, refers to caches stored on intermediary proxy servers called _caching proxy server_. Public caches are accessible to multiple users.

<table>
    <tr><th>By Location</th><th>Explaination</th><th>public/private</th></tr>
    <tr>
        <td>Browser Caches</td>
        <td>Implemented by browsers.</td>
        <td>private</td>
    </tr>
    <tr>
        <td>Proxy Caches</td>
        <td>Also known as <em>intermediaries</em>. Specify proxy explicitly or use <em>interception proxy</em>.</td>
        <td>public</td>
    </tr>
    <tr>
        <td>Gateway Caches</td>
        <td>Also known as <em>reverse proxy caches</em> or <em>surrogate caches</em>. Content delivery network (CDN) is typical one.</td>
        <td>public</td>
    </tr>
</table>

Multiple levels of public caches could build _cache hirarchies_, inside which cache request will be forward to parent _caching proxy server_ when it's not found in current _caching proxy server_.

![Cache Hirarchy](./cache_hirarchy.png)

Mulitple caches could build complex _cache mesh_ instead of tree-shaped _cache hirarchy_ in practice. It's much more complicated and effective for storing cache. [Internet Cache Protocol (ICP)](https://en.wikipedia.org/wiki/Internet_Cache_Protocol) and HyperText [Caching Protocol (HTCP)](https://en.wikipedia.org/wiki/Hypertext_caching_protocol) extends HTTP protocol involving _sibling cache_ support.

![Cache Processing Flowchart](./cache_processing_flowchart.png)

> 1. Receiving—Cache reads the arriving request message from the network.
> 1. Parsing—Cache parses the message, extracting the URL and headers.
> 1. Lookup—Cache checks if a local copy is available and, if not, fetches a copy (and stores it locally).
> 1. Freshness check—Cache checks if cached copy is fresh enough and, if not, asks server for any updates.
> 1. Response creation—Cache makes a response message with the new headers and cached body.
> 1. Sending—Cache sends the response back to the client over the network.
> 1. Logging—Optionally, cache creates a log file entry describing the transaction.

<table>
    <tr>
        <th>Header</th>
        <th>Explaintion</th>
        <th>Request/Response</th>
    </tr>
    <tr>
        <td>
            <code>Cache-Control: no-transform</code>
        </td>
        <td>No transformations or convertions should be made to the resource. Content-Encoding, Content-Range, Content-Type headers should not be modfied by proxy. A non-transparent proxy migth convert between image formats to reduce network traffic, disallowed by <code>no-transform</code></td>
        <td>Both</td>
    </tr>
</table>

### Algorithm (TODO)

### Setting Caches in Apache Sever(TODO)

### Cache and Advertising (TODO)

## Connection Management (TODO:)

## Client Identification (TODO:)

## HTTPS (TODO:)

## Authentication (TODO:)

## Architectural Components (TODO:)

### Web Servers (TODO:)

### Proxies (TODO:)

### Gateways, Tunnels and Relays (TODO:)

## HTTP-NG & HTTP2.0 (TODO:)

## Lib & Tools

1. Libs: minihttpd
1. Tools: whois, telnet, [httpie](https://httpie.org/)