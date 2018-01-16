# HTTP

## **U**niform **R**esrouce **I**dentifier

**Uniform Resource Identifier (URI)** is a string of characters used to identify a resource. Most commonly used form of URI is [**Uniform Resrouce Locator (URL)**](https://url.spec.whatwg.org/#example-url-parsing), informally referred as _web address_. **Uniform Resrouce Name** is a type of URI that identifies resource by name in particular namespace.

### Syntax

```html
scheme:[//[user[:password]@]host[:port]][/path][?query][#fragment]
```

<table>
    <tr>
        <td>URL Components</td>
        <td>Explaination</td>
        <td>Default Value</td>
    </tr>
    <tr>
        <td>scheme</td>
        <td>case-insensitive</td>
    </tr>
    <tr>
        <td>//</td>
        <td>require by some schemes and not required by some others</td>
    </tr>
    <tr>
        <td>user</td>
        <td></td>
        <td>anonymous</td>
    </tr>
    <tr>
        <td>password</td>
        <td></td>
        <td>implementation defined</td>
    </tr>
    <tr>
        <td>host</td>
        <td></td>
    </tr>
    <tr>
        <td>port</td>
        <td></td>
    </tr>
    <tr>
        <td>path</td>
        <td></td>
    </tr>
    <tr>
        <td>params</td>
        <td></td>
    </tr>
    <tr>
        <td>query</td>
        <td>A group of key value pairs <code>key=value</code> separated by '&'</td>
    </tr>
    <tr>
        <td>fragment</td>
        <td>A name for part of the resource, not sent to server, used only on client-side</td>
    </tr>
</table>

1. [WHATWG URL API](https://url.spec.whatwg.org/)
1. [Node URL](https://nodejs.org/api/url.html#url_the_whatwg_url_api)
1. HTTP The Definitive Guide

## Cookie

[Simple cookie framework](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework)

1. [HTTP Cookie](https://en.wikipedia.org/wiki/HTTP_cookie#Session_cookie)

## Status Code

## Cache