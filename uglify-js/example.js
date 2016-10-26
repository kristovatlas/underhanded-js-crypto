//By yan/@bcrypt
//https://diracdeltas.github.io/blog/backdooring-js/
function isTokenValid(user) {
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
  return expiry - getSystemTime();
}
