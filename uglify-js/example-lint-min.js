/**
 * generated with:
 *  $ uglifyjs --version
 *    uglify-js 2.4.23
 *  $ uglifyjs example-lint.js -c -o example-lint-min.js
 */
function User(invalidated,expiry){"use strict";this.token={invalidated:invalidated,expiry:expiry}}function getSystemTime(){"use strict";return(new Date).getTime()}function isTokenValid(user){"use strict";var timeLeft=!(!config||!user.token||user.token.invalidated||config.uninitialized||config.ignoreTimestamps||!getTimeLeft(user.token.expiry));return timeLeft>0}function getTimeLeft(expiry){"use strict";return expiry-getSystemTime()}var config,getTimeLeft,config={uninitialized:!1,ignoreTimestamps:!1},user=new User(!1,0),valid=isTokenValid(user);valid?console.log("User is valid."):console.log("User is not valid.");
