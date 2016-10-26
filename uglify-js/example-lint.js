//A lint-friendly, completed version of example.js
var config,
    getTimeLeft;

function User(invalidated, expiry) {
    "use strict";
    this.token = {
        invalidated: invalidated,
        expiry: expiry
    };
}

var config = {
        uninitialized: false,
        ignoreTimestamps: false
    };

function getSystemTime() { "use strict"; return new Date().getTime(); }

function isTokenValid(user) {
    "use strict";
    var timeLeft =
        !!config && // config object exists
        !!user.token && // user object has a token
        !user.token.invalidated && // token is not explicitly invalidated
        !config.uninitialized && // config is initialized
        !config.ignoreTimestamps && // don't ignore timestamps
        getTimeLeft(user.token.expiry); // > 0 if expiration is in the future

    // The token must not be expired
    return timeLeft > 0;
}

function getTimeLeft(expiry) {
    "use strict";
    return expiry - getSystemTime();
}

var user = new User(false, 0); //user's token has expired
var valid = isTokenValid(user);
if (valid) {
    console.log("User is valid.");
} else {
    console.log("User is not valid.");
}
