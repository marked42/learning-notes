# RESTful API Design

[**Re**presentational **S**tate **T**ransfer](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm) is an architectural style for distributed hypermedia systems.

## Architectural Design Constraints (TODO:)

RESTful architectural styled is derived from applying constraints to arbitrary web system design.

1. Client-Server constraint separates server data storage from client using same data access interface which simplifies servers components and improves scalability.
1. Communication must be stateless in that each request must contain all needed information for server to handle single request without store states between requests. Stateless constraint is a design trade-off to improve visibility, reliability and scalability at the cost of increased repetitive data between multiple requests.
1. Cache constraint improve network efficiency at the cost of decreased scalability due to stale cache.
1. Uniform interface constraint decouples server services from their implementation, which simplifies client interactions. Its drawback is that standardized users interface may decrease server performance when it doesn't suit actual data requirements by client.
1. Layered System.
1. Code On Command.

## Best Practices

### URL

1. Services placed at special domain `https://api.example.com`
1. API version placed inside URL `https://api.example.com/v1`
1. URL中协议名称大小写不敏感，但是其余部分大小写敏感，统一使用小写字母。
1. Use URL with suffix backward slash '/' consistently. Redirect URL `/posts` to URL `/posts/` with backward slash address. 不使用'/'作为路径结尾字符。
1. Use dash (-) instead of underscore (_) for url segment composed of multiple words to avoid clashing with URL links shown with underscore by default.
    ```html
    /api/feature-post
    ```
1. URL不要添加文件后缀，应该通过HTTP协议中`Content-Type`字段来指示内容类型。
1. Use query string to specify parameters on target resource.
1. 使用统一的子域名
    ```html
    // 后台接口使用api子域名
    http://api.bluestar.com
    // 开发者使用developer子域名
    http://developer.bluestar.com
    ```

### Resource Abstraction

资源分为单个资源和复数资源

1. 单个资源名称用单数，复数资源名称用复数
1. 资源之间可以嵌套包含，形成的路径也就是嵌套的形式
1. 对单个资源的操作分为两类，增删改查等有对应HTTP方法的操作和其他操作。
    ```html
    // 增删改查的使用HTTP方法和资源路径共同确定
    GET/POST/PUT/DELETE http://api.bluestart.com/users

    // 其他类型操作使用POST方法与特定动词词组共同确定
    GET/POST/PUT/DELETE http://api.bluestart.com/users/adam/logout
    ```
1. query部分可以用来对复数资源进行过滤，典型应用是分页。另外也可以作为附加参数功能使用。

Data is abstracted as resource, resource name should be meaningful nouns. Endpoint resource name is preferred to be plural consistently, specify resource id to identify single resource in a collection. This ensures same route prefix for single resource and resource collection, which is easily handled by same controller in practice.

```http
GET /tickets
GET /tickets/12
```

Nested resources can be reflected from properly nested URL.

```http
GET /tickets/12/messages
GET /tickets/12/messages/4
```

### CRUD Operations

Data manipulation is specified using HTTP methods.

| Resource | Collection | Operation | Safe | Idempotent |
| - | - | - | - | - |
| `OPTIONS /tickets/1` | `OPTIONS /tickets` | Query available methods | Yes | Yes |
| `HEAD /tickets/1` | `HEAD /tickets` | Read data, require only headers | Yes | Yes |
| `GET /tickets/1` | `GET /tickets` | Read data | Yes | Yes |
| `PUT /tickets/1` | `PUT /tickets` | Create or update data | No | Yes |
| `DELETE /tickets/1` | `POST /tickets` | Delete data | No | Yes |
| `POST /tickets/1` | `POST /tickets` | Create data | No | No |
| `PATCH /tickets/1` | `POST /tickets` | Update data partially | No | No |

_Safe_ methods don't modify resources on server, so it can be used without worrying about making any unexpected changes to server status.

_Idempotent_ methods may change resources, but result of calling it once or more times is same. For example, **PUT** method will create resource if it doesn't exist at first time, following **PUT** methods would do nothing cause resource already exist. It's same for **DELETE** methods.

> Methods can also have the property of “idempotence” in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request.

### Beyond CRUD Operations

Operations beyond CRUD should be abstracted and manipulated as a resource.

1. User login operation mapped to a session resource.
    ```html
    GET http://api.host.com/session/
    ```
1. Map operations as sub-resource.
    ```html
    PUT /gists/:id/star
    DELETE /gists/:id/start
    ```
1. Verb should be used as last resort for operations that cannot be mapped to a resource with appropirate name.
    ```html
    GET http://api.host.com/search?param1=val1&param2=val2
    ```

### Response

Use JSON.

### Request Limit

Request limit strategies (TODO:)

Responds with **429 (Too Many Requests)** for access restriction.

| Header | Explanation |
| - | - |
| X-Rate-Limit-Limit | Allowed total number of concurrent requests |
| X-Rate-Limit-Remaining | Allowed remaining number of concurrent requests |
| X-Rate-Limit-Reset | Remaining seconds of current time period |

### Cache

Refers to cache mechanism in http.

### Override HTTP Method

Some HTTP client only supports **GET** and **POST**. Method can be overridden by extension HTTP header to provide support for more HTTP methods.

```http
POST host HTTP/1.1
X-HTTP-Method-Override: [PUT | PATCH | DELETE]
```

Only **POST** method can be overridden, because **GET** method should never change server data.

### Filtering & Pagination

Use query string to provide parameters to select a subset of a large amount of resources instead of returning all resource data.

| Query String | Explanation |
| - | - |
| `?limit=10` | Specify number of returned resource |
| `?offset=10` | Specify offset of record |
| `?page=2&per_page=100` | Specify page index and resource number per page |
| `?sortby=name&order=asc` | Specify sort order |
| `?animal_type_id=1` | Specify resource id |

Returned data should contains pagination information.

```json
{
  "page": 1,
  "pages": 3,
  "per_page": 10,
  "has_next": true,
  "has_prev": false,
  "total": 27
}
```

### Aliases for common queries

Create alias for common query for a better user experience.

```html
GET /tickets?state=closed&sort=-updated_at
```

### Error Handling

Return appropriate HTTP status code.

Single resource.

```json
{
  "code" : 1234,
  "message" : "Something bad happened :(",
  "error" : "More details about the error here"
}
```

Resource collection.

```json
{
  "code" : 1024,
  "message" : "Validation Failed",
  "errors" : [
    {
      "code" : 5432,
      "field" : "first_name",
      "message" : "First name cannot have fancy characters"
    },
    {
       "code" : 5622,
       "field" : "password",
       "message" : "Password cannot be blank"
    }
  ]
}
```

### Status Code (TODO:)

| Status Code | Explanation |
| - | - |
| 200 OK | |
| 201 Created | |
| 204 No Content | |
| 304 Not Modified | |
| 400 Bad Request | |
| 401 Unauthorized | |
| 403 Forbidden | |
| 404 Not Found | |
| 405 Method Not Allowed | |
| 410 GONE | |
| 415 Unsupported Media Type | |
| 429 Too Many Requests | |

### Authentication

RESTful API is stateless, so that client data will not be stored on server-side. Every request from client should carry all information needed for authentication.

Always use SSL and don't forward a request without SSL to corresponding SSL version, throw an error directly.

### Hypermedia API

[HATEOSA](https://apigee.com/about/blog/technology/hateoas-101-introduction-rest-api-style-video-slides) style API returns links in result to tell users available operations for next step.

```json
{"link": {
  "rel":   "collection https://www.example.com/comments",
  "href":  "https://api.example.com/comments",
  "title": "List of comments",
  "type":  "application/vnd.yourformat+json"
}}
```

## References

1. [Best Practices for A Pragmatic RESTful API](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
1. [Best Practices for API Versioning](https://stackoverflow.com/questions/389169/best-practices-for-api-versioning)
1. [An Eye Tracking Study on camelCase and under_score Identifier Styles](http://ieeexplore.ieee.org/document/5521745/?reload=true&tp=&arnumber=5521745)
1. [Github RESTful API v3](https://developer.github.com/v3/)
1. [Representational State Transfer](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
