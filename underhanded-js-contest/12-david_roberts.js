//https://jsfiddle.net/4nqnhrpp/0/

/*

=== README.TXT ===
    While I know nothing about cryptography, I thought I'd have a crack at the misdirect.ion.land
contest.

    Officially, this entry works by hashing a string composed some user input, the time, and a salt
value. (See renderKey().) User input is read by generateKey(), and the time is just a call to
Date(). The salt value is a little more roundabout, but is ultimately just an array of the pixel
values of a small image. PNG compression helps speed page load, but the transfer method is not very
important.

    Everything is legitimate, if misguided, except for line two of getHashKey(). Here, we
"accidentally" assign to s.src instead of hashing it for more randomness. This causes the browser
to fetch the new image. This looks accidental because the new value is just our salt, which is
random noise from the salt image. However, the salt image contains with almost* no misdirection the
ASCII values of the URL we will fetch. These are transformed by unbuffer() to a string, which is
then assigned to s.src. This loads the URL in the salt, appended by the user's random input, at the
time of generation, which gives us the information we need to recreate the key. The value is then
xor'd to hide the url for the rest of the function.

    I hope you enjoyed the entry, basic as it was. I'm sure you could work up something better with
getters and setters and shared typed array buffers, but I couldn't come up with any sort of
justification why any of that should be in a random key generator. You can find me at ddr0.ca. I'm
currently looking for part-time or contract work, remote or in Vancouver BC. Thanks for reading!

Footnote:
* The green channel is ignored via buf[i]&0xFF, so it is used to increase the innocent look of
  our image. (There's an ignored alpha channel too, but it's not in the source image.)

*/

window.generateKey = generateKey;
function generateKey(e) {
	var userRandom = document.getElementById('user-input').value;
	if(userRandom.length == 8) { //8 characters ought to provide enough randomness, when taken with the date.
		getHashKey();
	}

	//Generate a cryptographic hash from all available random data.
	function getHashKey() {
		var hash='', s=saltImg, rand=Math.random();
		//combine our random sources (salt may not have loaded?)
		hash += (!salt?s.src+(rand*1000000)+xor(userRandom):xor(s.src=unbuffer(salt)+userRandom)) + xor(Date());
		Math.random(); //don't leak randomness
		hash = renderKey(hash);

		document.querySelector('#result').textContent = hash;
	}

	function unbuffer(buffer) {
		var chars = '';
		var buf = new Uint16Array(buffer);
		for (var i=0; i<buf.length; i++) {
			chars += String.fromCharCode(buf[i]&0xFF); //ignore alpha channel
		}
		return chars;
	}

	//Xor the input string with our salt for additinoal randomness. People type predictable things.
	function xor(str) {
		var key = unbuffer(salt); //pick a random bit from our salt to xor with.
		var out = '';
		for(var i=0; i<str.length; i++) {
			out += String.fromCharCode(str.charCodeAt(i)^0x70);
		}
		return out;
	}

	//Generate a key from our random entropy.
	//Returns a typed array castable to a string.
	function renderKey(hash) {
		var keyLength = 32;
		var iterations = 10000;

		keyLength = keyLength/2; //internal state expands to two characters in the end
		var out = new Uint8Array(keyLength);
		for(var i=0; i<hash.length*iterations; i++) {
			out[i%keyLength] += out[(i+1)%keyLength] + hash.charCodeAt(i%hash.length);
		}
		out.toString = function() {
			var out = '';
			[].forEach.call(this, function(i) {out += ' '+('00'+i.toString(16)).slice(-2);});
			return out.toLocaleUpperCase();
		};
		return out;
	}
}

//Load the salt from the server. This prevents a "rainbow table"-based attack.
//Salt is stored as a png file, we'll read it in to a typed array buffecr so it's easy to work with later.
function getsaltData(callback) {
	saltImg = document.createElement('img');
	saltImg.addEventListener('load', function() {
		var canvas = document.createElement('canvas');
		canvas.width = 10, canvas.height = 10;
		var c = canvas.getContext('2d');
		c.drawImage(saltImg, 0,0);
		salt = c.getImageData(0,0,10,10).data.buffer;
	});
	//TODO: Host the salt image at a URL we own.
	saltImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wkBABoPuoLmBAAAAUFJREFUGNMBNgHJ/gNo13RAtTYAOvcSnxoiGSAY2BsYQx4fCxQX0hfn8ekBZNEThxMWAf4PI78wBTO+/eUyM1EQLeG/Cyq0WiYSA5tJCilp/gkM5M5JQdQNmF/K4oFlNMZ4xxks17R/9QTqBA5Hu51TJr5vzE06Ko3rJG0Caex0Gy8GK2hmI38A7kqE1KAUBkQmTBkY6Bag7k6wihTU1BRqErXEVT3NAJwU1JjwYukfMlnv2CQTzQ8xCQyELsja+B68gunp6QIZP8Ax/Njr9euXlohmAQe3/wkagOgu6rQsGJLR6A8AFNSKF6gQGemnjvS+1BQq7VY9w+MV9ZW5OxFLBglGARS31HPVYDnx3lVgN78SDmNbhC3Ev1bK5v4cFFV5zwCqm/W5ESG9ehELd00Rtx0AAADCfhLuUuls5lg8B0u1ooTydmAsJgAAAABJRU5ErkJggg==";
	}
getsaltData();
