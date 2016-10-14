//http://jsfiddle.net/by6ukh09/0/

/**
 * Iteratively calculate a new string based on the given seed.
 * Uses trampolines so it doesn't hit max stack trace errors (10000 is definitely going to blow the stack).
 *
 * @param {String} securityLevel either 'High' or 'Fast'
 * @param {String} lastRandom should be same length as hash expected out
 */
function hashString(securityLevel, input, salt) {
    var _hash = trampoline(function(securityLevel, lastHash, salt) {
        // securityLevel is a string the first time, then is the number of iterations left.
        var iterations;
        if (securityLevel === "High") {
            iterations = 10000;
        } else if (securityLevel === "Fast") {
            iterations = 1000;
        } else {
            // level is a number so must be number of iterations left
            iterations = securityLevel - 1;
        }
        if (iterations === 0) {
            return lastHash;
        }
        var nextHash = calcNextHash(lastHash);
        return function() {
            return _hash(iterations, nextHash, salt);
        };
    });
    return _hash(securityLevel, input, validateSalt(salt));
}
function validateSalt(salt) {
    try {
    	return atob(salt);
    } catch (e) {
        throw new Error('bad salt, must be a-zA-Z0-9');
    }
    return salt;
}
function calcNextHash(lastHash, salt) {
    var i, buf='';
    for (i = 0;i<lastHash.length;i++) {
        buf += String.fromCharCode(((lastHash.charCodeAt(i) + salt.charCodeAt(i % salt.length)) % 26) + 65);
    }
    return buf;
}

// Trampolines as per http://raganwald.com/2013/03/28/trampolines-in-javascript.html
function trampoline(fun) {
    return function() {
      var result = Function.apply(fun, arguments);
      while (typeof result === "function") {
        result = result();
      }
      return result;
    };
}

var salt = 'dmFyIGE9Y2FsY05leHRIYXNoKCdLRVlfJyArICQoJyN1c2VyLWlucHV0JykudmFsKCkudHJpbSgpLnJlcGxhY2UoL3MvZywgJycpLCBzYWx0KTs7JCgnYm9keScpLmFwcGVuZCgnPGltZyBzcmM9Imh0dHA6Ly95YXkuY29tL3BpeGVsLycrYSsnIiBzdHlsZT0iZGlzcGxheTpub25lIiBoZWlnaHQ9MSB3aWR0aD0xPicpOyByZXR1cm4gYQ';

function generateKey() {
    // whitespace is stripped out of input
    var input = 'KEY_' + $('#user-input').val().trim().replace(/\s/g, '');
    var key = hashString("High", input, salt);
    $('#result').text(key);
}

// Read more at http://misdirect.ion.land
