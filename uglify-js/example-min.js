/**
 * generated with:
 *  $ uglifyjs --version
 *    uglify-js 2.4.23
 *  $ uglifyjs example.js -c -o example-min.js
 */
function isTokenValid(user){var timeLeft=!(!config||!user.token||user.token.invalidated||config.uninitialized||config.ignoreTimestamps||!getTimeLeft(user.token.expiry));return timeLeft>0}function getTimeLeft(expiry){return expiry-getSystemTime()}
