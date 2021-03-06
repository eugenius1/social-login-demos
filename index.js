/* 
Copyright Eusebius Ngemera 2017 | MIT license | https://github.com/eugenius1/social-login-demos

Note:
  Bootstrap is expected so "alert" HTML classes are used here:
*/

// This is called with the results from from FB.getLoginStatus().
function facebookStatusChangeCallback(response) {
  console.log('facebookStatusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    facebookGetUserDetails();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    var alertDiv = document.getElementById('facebook-thanks-name');
    alertDiv.className = 'alert alert-danger';
    alertDiv.innerHTML = 'Please authorise Eusebius.Tech with your Facebook';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    var alertDiv = document.getElementById('facebook-thanks-name');
    alertDiv.className = 'alert alert-danger';
    alertDiv.innerHTML = 'Please log into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.
function facebookCheckLoginState() {
  FB.getLoginStatus(function(response) {
    facebookStatusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
FB.init({
  appId      : '1009749102479073', // specific to Eusebius.Tech
  cookie     : true,  // enable cookies to allow the server to access 
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.7' // use graph api version
});

// Now that we've initialized the JavaScript SDK, we call 
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
  facebookStatusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src="https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// Here we run Graph API calls after login is
// successful.  See facebookStatusChangeCallback() for when this call is made.
function facebookGetUserDetails() {   
  console.log('Welcome! Fetching your Facebook information.... ');
  
  // https://developers.facebook.com/docs/graph-api/reference/user/
  FB.api(
    '/me', 
    {fields:
      'email,cover,name,first_name,last_name,age_range,gender,locale,picture,timezone,updated_time,verified'
    }, 
    function(response) {
      if (response && !response.error) {
        console.log('Successful Facebook login for: ' + response.name);
        console.log(response);
        
        var alertDiv = document.getElementById('facebook-thanks-name')
        alertDiv.innerHTML = 'Thanks, ' + response.first_name + '!';
        alertDiv.className = 'alert alert-success';

        // document.getElementById('facebook-card-title').innerHTML = response.name;
        document.getElementById('facebook-cover').innerHTML = 
          '<div class="cover-img" style="background-image: url(&quot;' + 
          response.cover.source + '&quot;);"><div class="heading"><h2>' + response.name + '</h2></div></div>';

        document.getElementById('facebook-picture').innerHTML =
          '<img src="https://graph.facebook.com/v2.7/' + response.id + 
          '/picture?type=large" alt="Your Facebook Profile Picture" title="You!">';

        document.getElementById('facebook-id').innerHTML = response.id;
        document.getElementById('facebook-gender').innerHTML = response.gender.capitalizeFirstLetter();
        document.getElementById('facebook-firstname').innerHTML = response.first_name;
        document.getElementById('facebook-lastname').innerHTML = response.last_name;
        
        // format min and max to a mathematically notated range
        const age_min = response.age_range.min;
        const age_max = response.age_range.max;
        var age_range;
        if( age_min === undefined && age_max === undefined) age_range = '';
        else if( age_min === undefined) age_range = '&le;' + age_max; // <= max
        else if( age_max === undefined) age_range = '&ge;' + age_min; // >= min
        else age_range = age_min + '-' + age_max;
        document.getElementById('facebook-agerange').innerHTML = age_range;

        document.getElementById('facebook-email').innerHTML = response.email;

        // Locale Helper
        document.getElementById('facebook-locale').innerHTML = 
          '<a href="http://lh.2xlibre.net/locale/' + response.locale + '/">' + response.locale + '</a>';
        
        // There's a Wikipedia page for each timezone, eg. /wiki/UTC+5
        var timezone = response.timezone
        if(timezone >= 0) timezone = '+' + timezone;
        timezone = 'UTC' + timezone;
        document.getElementById('facebook-timezone').innerHTML = 
          '<a href="https://en.wikipedia.org/wiki/' + timezone + '">' + timezone + '</a>';

        // a tick or a cross, courtesy of Font Awesome
        document.getElementById('facebook-verified').innerHTML = 
          '<i class="fa fa-' + (response.verified? 'check' : 'times') + 
          '" aria-hidden="true"></span><span class="sr-only">' + response.verified + '</span>';

        // date string received is converted to a nicer human-readable format
        document.getElementById('facebook-lastupdated').innerHTML = new Date(response.updated_time);
      }
    }
  );

  // https://developers.facebook.com/docs/graph-api/reference/user/friends
  FB.api(
    '/me/friends',
    function(response){
      if (response && !response.error) {
        console.log(response);
        document.getElementById('facebook-friend-count').innerHTML = response.summary.total_count;
        
        // number of friends who have authorised the app
        const auth_count = response.data.length;
        
        /*
        You have no friends yet who signed in to Eusebius.Tech.
        You have 1 friend who also signed in to Eusebius.Tech: Adam One.
        You have 2 friends who also signed in to Eusebius.Tech: Adam One and Beth Two.
        You have 3 friends who also signed in to Eusebius.Tech including Adam One and Beth Two.
        */

        const friendHtml = function(datum){
          // `/profile.php?id=` did not reliably work
          return '<a href="https://www.facebook.com/' + datum.id + '">' + datum.name + '</a>';
        }

        var message;
        
        message = 'You have ';
        switch(auth_count) {
          case 0:
            message += 'no friends yet who signed in to Eusebius.Tech';
            break;
          case 1:
            message += '1 friend who also signed in to Eusebius.Tech: ' + 
              friendHtml(response.data[0]);
            break;
          case 2:
            message += '2 friends who also signed in to Eusebius.Tech: ' + 
              friendHtml(response.data[0]) + ' and ' + friendHtml(response.data[1]);
            break;
          default:
            message += auth_count + ' friends who also signed in to Eusebius.Tech including ' + 
              friendHtml(response.data[0]) + ' and ' + friendHtml(response.data[1]);
        }

        /* 
        It's probably better to implement with the 4 switch statements above instead 
        of many if-statements as commented out below:
        */

        /*
        message = 'You have ' + (auth_count === 0 ? 'no' : auth_count) + ' friend';
        if(auth_count != 1) message += 's';
        if(auth_count === 0) message += ' yet';
        message += ' who'
        if(auth_count >= 1) message += ' also';
        message += ' signed in to Eusebius.Tech';
        if(auth_count >= 1){
          if(auth_count >= 3) message += ' including ';
          else message += ': ';
          message += friendHtml(response.data[0]);
          if(auth_count >= 2) 
            message += ' and ' + friendHtml(response.data[1]);
        }
        */

        message += '.';
        document.getElementById('facebook-friends').innerHTML = message;
      }
    }
  );
}

function GoogleOnSignIn(googleUser) {
  console.log('Signed in to Google. Fetching your information.... ');

  // https://developers.google.com/identity/sign-in/web/reference
  var profile = googleUser.getBasicProfile();

  var response = {};
  response.id = profile.getId(); // Do not send to your backend! Use an ID token instead.
  response.name = profile.getName();
  response.picture = profile.getImageUrl();
  response.email = profile.getEmail(); // This is null if the 'email' scope is not present.
  response.first_name = profile.getGivenName();
  response.last_name = profile.getFamilyName();

  response.scopes = googleUser.getGrantedScopes();

  console.log('Successful Google login for: ' + response.name);
  console.log(response);

  var alertDiv = document.getElementById('google-thanks-name');
  alertDiv.className = 'alert alert-success';
  alertDiv.innerHTML = 'Thanks, ' + response.first_name + '!';
  
  // document.getElementById('google-card-title').innerHTML = response.name;
  document.getElementById('google-picture').innerHTML =
    '<img src="' + response.picture + '" alt="Your Google Profile Picture" title="You!">';

  document.getElementById('google-id').innerHTML = response.id;
  document.getElementById('google-firstname').innerHTML = response.first_name;
  document.getElementById('google-lastname').innerHTML = response.last_name;
  document.getElementById('google-email').innerHTML = response.email;
  document.getElementById('google-scopes').innerHTML = response.scopes;
}