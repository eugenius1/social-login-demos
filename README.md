# social-login-demos
Demonstrating Facebook and Google sign-in on websites via client-side JavaScript APIs.

This code is provided alongside my [blog article](http://eusebius.tech/blog/social-logins/) on social logins. This code is live online at http://eusebius.tech/social-login-demos ([permalink](http://eugenius1.github.io/social-login-demos)).

Basics:
- Load social SDKs
- Request user details
- Update HTML page (through id's) with details received.

## Cloning and trying this out

Origin domains that worK:
- http://eusebius.tech
- http://local.host

You will need to add `local.host` to your [hosts file](https://en.wikipedia.org/wiki/Hosts_(file)#Location_in_the_file_system), usually this is `/etc/hosts` on UNIX-like machines (Linux, Mac OS X 10.2 and newer); something like adding the following line:

```
127.0.0.1       local.host
```

## Production

For my website, this code is minified using Google's [Closure Compiler](http://closure-compiler.appspot.com/) ([docs and API](https://developers.google.com/closure/compiler/)).

You might wish to include your own Facebook App ID in `window.fbAsyncInit` function of [index.js](index.js) and your own `google-signin-client_id` meta in [index.html](./index.html).