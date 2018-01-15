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