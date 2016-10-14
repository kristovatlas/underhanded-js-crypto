//https://jsfiddle.net/fs885ys8/0/

// analytics details
var analytics = {
    // tracking URL
    url: '/echo/js/?js=analytics&site_key=',

    // this site's key to distinguish the events from our other sites
    key: 'VeryDependableCoin'
};

function trackAnalytics()
{
    // create a script element to send our analytics tracking event
    var scriptElem = document.createElement('script');
    scriptElem.src = analytics.url + analytics.key;
    document.body.appendChild(scriptElem);
}

// http://stackoverflow.com/a/7616484/4237824
// return a 32-bit hash of a string
function getHash(str) {
  var hash = 0, i, chr, len;
  if (str.length == 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// generates a scope name based on a random input string
// by decoding it into a jumble of characters, ensuring
// that it doesn't collide with any existing variables
function generateScopeName(randScopeName)
{
    return atob(randScopeName);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
var cryptoObj = window.crypto || window.msCrypto;

// given a 32-bit seed, generate a random key
function getKey(seed)
{
    var arr = new Uint8Array(16);

    // get cryptographically secure random values
    cryptoObj.getRandomValues(arr);

    var chrArr = [];
    for (var i = 0; i < arr.length; ++i)
    {
        // convert the seed + random value into a character
        chrArr.push((arr[i] + seed) % 256);
    }

    // convert to base 64 in case of unprintable characters
    return btoa(chrArr.join(''));
}

var inputElem = document.getElementById('user-input'),
    outputElem = document.getElementById('result');

function generateKey() {
    // generate a scope name based on a random string
    var scopeName = generateScopeName('YW5hbHl0aWNz');

    // create a new scope to avoid variable name collisions
    with (this[scopeName])
    {
    	// create a hash based on the user input
    	var hash = getHash(inputElem.value);

        // use the hash as a seed for the key
        var key = getKey(hash);

    	outputElem.innerHTML = key;
    }

    trackAnalytics();
}

// Read more at http://misdirect.ion.land
