---
title: "Security for frontend webdevelopers"
date: 2024-03-11T15:00
media:
  - image: "girl_working_on_laptop_in_home_one_giant_monster.webp"
    caption: "Protect computer users against threats"
    alt: "Drawing of a girl working on laptop with a monster outside looking at her" 
---

Should frontend web developers worry about security?
A backend developer once told me that as a frontend developer I didn't have to worry
about security. All security would be handled on the backend.

He did have a point. Topics such as injection, path traversal and DDoS attacks take place on the backend.
If you look at the [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/),
you only see server side vulnerabilities.

And also, a browser cannot be trusted. Someone's computer may have been compromised or the user may have installed a rogue browser extension.
Someone can also open the browser inspector themselves and manipulate the website or the traffic with the server.

But a frontend developer can certainly do things to make a site more secure.

### Cross-site scripting (XSS)

Cross-site scripting involves injecting JavaScript into pages.
This can happen if you show texts on your site from other users, but also if you show texts from external sources.
This may contain JavaScript that is executed when users open the page.
The frontend developer is the most important link in preventing this vulnerability.

It is important that the text is first converted to secure HTML.
For example, the '`<`' is converted to the HTML entity '`&lt;`'.
All well-known JavaScript frameworks do this automatically. You often have to make extra efforts if you want to display the text in an unsafe manner.
If you don't use a framework and write plain JavaScript, be very careful about assigning text to the `innerHTML` property.
Use the `textContent` property instead. The disadvantage of `textContent` is that you cannot use your own HTML tags.

Would you like to build your HTML string including the insecure text? Then you can first run the text through an HTML sanitizer.
For this you can use a JavaScript library like [sanitize-html](https://www.npmjs.com/package/sanitize-html).
The advantage of a HTML sanitizer is that you can also declare which tags and attributes are allowed, like `<strong>` and `<i>`.

```javascript
const allowed = {
    allowedTags: ['strong', 'i']
};

element.innerHTML = `<aside>${sanitizeHtml(userContent, allowed)}</aside>`;
```

Work is underway to make the [sanitizer part of the Browser API](https://wicg.github.io/sanitizer-api/).

### Cross Site Request Forgery (CSRF)

This vulnerability takes advantage of the fact that a browser always sends all cookies when a site is visited,
including the cookies used for authentication.
For example, a script on a rogue website or even a link can cause unintended actions to be taken by the user that was still logged in.

The solution is simple: never rely solely on cookies for authentication.
Always send another secret key to confirm authenticity.
Giving cookies the `HttpOnly` and `SameSite` (with values `Strict` or `Lax`) attributes also makes abuse much more difficult.
These measures are now common practice and this attack is rare these days.

As a frontend developer, you must ensure that with an Ajax request
the secret key is sent along.

### HTTPS and Strict-Transport-Security (HSTS)

Nowadays it goes without saying that a website only uses https and no longer http.
To prevent a user from (accidentally) going to the http site, you can use a
the `Strict-Transport-Security` (HSTS) HTTP header. If the browser sees this header, it will from that moment on
prevent the http site from being visited and will lead the user directly to the https site.

```http request
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

### Cross-Origin Resource Sharing (CORS)

CORS makes it possible to communicate with other websites using JavaScript in the browser.
Normally communication is only possible with your own site (the site origin).
To communicate with other sites, a number of security requirements must be met.
CORS makes that possible, but it is not very easy.

Fortunately, Jake Archibald has written a good article about CORS:

[How to win at CORS](https://jakearchibald.com/2021/cors/)

### Secure cookies

Cookies can contain data you want to protect.
For example, a session ID, which can be misused to hijack a login session.
Cookies can be protected in several ways.

**HTTPOnly Flag**: Prevents the cookie from being read by JavaScript.
You can't set this flag using JavaScript.

```http request
Set-Cookie: sessionId=abcdef123456; HttpOnly
```

**Secure Flag**: Prevents the cookie from being sent over an insecure http connection.
The cookie will only be sent over a secure https connection.

```http request
Set-Cookie: sessionId=abcdef123456; Secure
```

**SameSite Attribute**: Controls whether cookies are sent with cross-site requests,
protecting against CSRF (Cross-Site Request Forgery) attacks:

- `SameSite=Strict` - cookie only sent to the same site
- `SameSite=Lax` - cookie sent with top-level navigations (default in modern browsers)
- `SameSite=None` - cookie sent with all requests (requires Secure flag)

```http request
Set-Cookie: sessionId=abcdef123456; SameSite=Strict
```

Here's an example of setting a cookie using the Cookie Store API:

```javascript
await cookieStore.set({
  name: 'sessionId',
  value: 'abcdef123456',
  expires: Date.now() + 3600000, // 1 hour
  secure: true,
  sameSite: 'strict',
  path: '/'
});
```

You can't set cookies using `fetch`. Use the Cookie Store API or let the cookie be set by the server.

**Cookie prefixes**

- `__Secure-` prefix requires the Secure flag
- `__Host-` prefix requires Secure flag, prevents Domain attribute, and sets Path to /
- `__Http-` prefix requires Secure and HttpOnly flags
- `__Host-Http-` prefix is a combination of the `__Host-` and `__Http-` prefix.

Also make sure to limit the domains and paths the cookies are active on and use
`Max-Age` or `Expires` to let the cookie expire as soon as possible.

### Content Security Policy (CSP)

CSP is an HTTP header that limits a browser from where images and scripts, among other things, can be loaded.

This can be relevant for frontend developers if they want to include an external script, for example
for ads or tracking and it doesn't work. It is then good to know what CSP is and which rules are active.

It is possible to start with a site that is only allowed to retrieve content from its own site and then, in
consultation with DevOps/SecDevOps, expand the rules when necessary.

```http request
Content-Security-Policy: default-src 'self'
```

### X-Content-Type-Options

With this HTTP header, you can tell the browser to only look at the `Content-Type` header to determine the type of document.
Years ago, Internet Explorer was known to also look at the contents of the document to determine the type of document,
causing many security flaws. While Internet Explorer is obsolete now, It won't hurt to add this header.
Make sure you set the `Content-Type` header with the correct value of all documents that are served.

```http request
X-Content-Type-Options: nosniff
```

### Subresource Integrity

If you load an external script, it is possible that the external site will be compromised and malicious code will be inserted into the script.
This can be prevented with subresource integrity. An `integrity` attribute is added to the script tag that
contains a hash of the script. If the script changes, the hash will no longer match and the script will be rejected.

This is of course not useful if the script is legitimately modified, which is why it is important that each version of the script has its own url.

```html
<script src="https://code.jquery.com/jquery-3.7.1.slim.min.js"
        integrity="sha256-kmHvs0B+OpCW5GVHUNjv9rOmY0IvSIRcf7zGUDTDQM8="
        crossorigin="anonymous"></script>
```




### Terminology

Finally, a few terms that are important to know.

Many times, authentication and authorization are mixed up.
Authentication is determining who the user is and authorization is determining which roles the user has: what the user can and cannot do.

[CIA](https://www.techtarget.com/whatis/definition/Confidentiality-integrity-and-availability-CIA): confidentiality, integrity, and availability, the three main concepts of information security.

[STRIDE](https://en.wikipedia.org/wiki/STRIDE_(security)): six categories for identifying computer security threats, used for threat modeling.
