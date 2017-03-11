# Social Login Demos
Demonstrating Facebook and Google sign-in on websites via client-side JavaScript APIs.

This code is provided alongside my [blog article](http://eusebius.tech/blog/social-logins/) on social logins. This code is live online at http://eusebius.tech/social-login-demos ([permalink](http://eugenius1.github.io/social-login-demos)).

Basics:

1. Load social SDKs
2. Request user details
3. Update HTML page (through id's) with details received.

HTML simplified overview:

```html
<head>
  <link rel="stylesheet">
  <meta property="fb:app_id" content="..." />
  <meta name="google-signin-client_id" content="..." />
</head>

<body>
  <header>...</header>
  <article>
    <!-- Facebook login button -->
    <fb:login-button scope="public_profile,email,user_friends" onlogin="facebookCheckLoginState();"></fb:login-button>

    <!-- Facebook info card -->
    <div class="row">
      <div class="jumbotron">
        <h3 class="text-center" id="facebook-card-title">Facebook's minimum</h3>
        <div class="row" id="facebook-cover"></div>
        ...
      </div>
    </div>

    <!-- Google login button -->
    <div class="g-signin2">

    <!-- Google info card -->
    <div class="row">...</div>

  </article>
  <footer>...</footer>

  <script src="index.js"></script>

  <!-- Google Analytics -->
  <script></script>
</body>
```

## Cloning and playing with this

Origin domains that work with my Facebook App and Google Web Client:

- http://eusebius.tech
- http://local.host

You will need to add `local.host` to your [hosts file](https://en.wikipedia.org/wiki/Hosts_(file)#Location_in_the_file_system), usually this is `/etc/hosts` on UNIX-like machines (Linux, Mac OS X 10.2 and newer); something like adding the following line:

```
127.0.0.1       local.host
```

## Production

You may wish to include your own Facebook App ID in `window.fbAsyncInit` function of [index.js](index.js) and your own `google-signin-client_id` meta in [index.html](index.html).

For my website, JavaScript code is minified using Google's [Closure Compiler](http://closure-compiler.appspot.com/) ([docs and API](https://developers.google.com/closure/compiler/)).