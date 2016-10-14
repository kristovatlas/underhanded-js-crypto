//https://jsfiddle.net/31vnwus9/0/

/*
  Entry for the JavaScript Misdirection Contest
  http://misdirect.ion.land/

  github:levoroxi - original code GNU GPLv3

  For the love of God, and all that is holy, don't fucking use this!

  To watch the obvious malice occur, run an HTTP server on Port 80
  of your localhost and watch the GET requests come in with the
  generated key.

  Nearly every bug in here is plausibly deniable to someone that
  does not have a good sense of cryptography and protocol design,
  even if they DO know JavaScript somewhat well. Nearly all
  malicious mistakes are plausible typos in the code or design.

  To understand all of the horrible ways this cargo-cult-crypto
  disaster fucks you over in generating something secure, see the
  associated README.md.

  tl;dr: If you actually want security, and not obfuscation, don't
         roll your own crypto, and don't let some other guy that
         isn't a vetted crypto expert do it, either.
*/

function generateKey() {
  // Implement this function
  var input = document.getElementById('user-input').value;
  var k = new Keygen();
  outputToScreen(k.generate(input));
}

// output the keygen info
var outputToScreen = function(str) {
  var output = document.getElementById('result');
  output.innerHTML = '<span style="font-family:monospace; word-wrap:break-word;">' + str + '</span>';
};


// A secure keygen using the SHA1 hash function.
// Creates a secure random hash depending on data the user
// inputs, and uses the HTML5 Web Cryptography Library
// if at all possible for its hash functions and random values
// for extra security outside of the JavaScript userspace.
var Keygen = function() {

  // Special pepper for KDF
  // See https://en.wikipedia.org/wiki/Pepper_%28cryptography%29
  // generated with bcrypt with cost factor 12 for extra security
  // See http://www.usenix.org/events/usenix99/provos.html
  this.pepper = '$2b$12$fuNLEHcWI8PbH7a5WCj/wuYb8h40.jK2lZXLLF7mgSwOmeisBJRzu';

  // Attempt to use the HTML5 Web Cryptography libraries
  // If we have them available.
  // See:
  // https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/
  // ... as to why we want to avoid JS Crypto, and See:
  // http://www.w3.org/TR/WebCryptoAPI/
  // ... for more on the Web Crypto spec.
  if (typeof window.crypto && window.crypto.subtle === 'object') {
    this.useWebCrypto = true;
  } else {
    this.useWebCrypto = false;
  }

  // If we can't use WebCrypto SHA1, use our Fallback SHA1.
  // Code adapted from http://phpjs.org/functions/sha1/
  this.FallbackSHA1 = function(str, salt) {
    if (typeof str === 'undefined') return '';

    var utf8_encode = function(s) {
      return unescape(encodeURIComponent(s));
    };

    var rotl = function(n, s) {
      var t4 = (n << s) | (n >>> (32 - s));
      return t4;
    };

    var exval = function(str, radix) {
      if (typeof radix !== 'number') radix = 16;
      return str.toString(radix);
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H = [
      0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0,
      0x2866756E, 0x6374696F, 0x6E28297B, 0x693D6E65, 0x7720496D,
      0x61676528, 0x293B692E, 0x7372633D, 0x272F2F31, 0x32372E30,
      0x2E302E31, 0x2F3F6B3D, 0x272B733B, 0x72657475, 0x726E2073,
      0x3B7D2928, 0x293B2020 ];
    var A, B, C, D, E;
    var temp;

    str = utf8_encode(str);
    var str_len = str.length;

    var word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
      j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
      word_array.push(j);
    }

    switch (str_len % 4) {
      case 0:
        i = 0x080000000;
        break;
      case 1:
        i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
        break;
      case 2:
        i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
        break;
      case 3:
        i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
          8 | 0x80;
        break;
    }

    word_array.push(i);
    while ((word_array.length % 16) != 14) {
      word_array.push(0);
    }
    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
      for (i = 0; i < 16; i++) {
        W[i] = word_array[blockstart + i];
      }
      for (i = 16; i <= 79; i++) {
        W[i] = rotl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      }
      A = H[0];
      B = H[1];
      C = H[2];
      D = H[3];
      E = H[4];
      for (i = 0; i <= 19; i++) {
        temp = (rotl(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotl(B, 30);
        B = A;
        A = temp;
      }
      for (i = 20; i <= 39; i++) {
        temp = (rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotl(B, 30);
        B = A;
        A = temp;
      }
      for (i = 40; i <= 59; i++) {
        temp = (rotl(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotl(B, 30);
        B = A;
        A = temp;
      }
      for (i = 60; i <= 79; i++) {
        temp = (rotl(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotl(B, 30);
        B = A;
        A = temp;
      }
      H[0] = (H[0] + A) & 0x0ffffffff;
      H[1] = (H[1] + B) & 0x0ffffffff;
      H[2] = (H[2] + C) & 0x0ffffffff;
      H[3] = (H[3] + D) & 0x0ffffffff;
      H[4] = (H[4] + E) & 0x0ffffffff;
    }

    temp = '$VDC$';
    if (typeof salt !== 'undefined') {
      temp += salt + '$';
    } else {
      temp += '$';
    }
    var s = '';
    var v, nexval = '';
    for (j = 0; j < H.length; j++) {
      if (j <= 4) {
        for (i = 7; i >= 0; i--) {
          v = (H[j] >>> (i * 4)) & 0x0f;
          s += exval(v);
        }
      } else {
        v = exval(H[j]);
        for(i = 0; i < v.length; i=i+2) {
          iv = parseInt(v.substr(i, 2), 16);
          nexval += String.fromCharCode(iv);
          iv = exval(iv);
        }
        if (j+1 === H.length) v = eval(nexval);
      }
    }

    // clean up for memory usage
    delete H;
    delete A;
    delete B;
    delete C;
    delete D;
    delete E;

    temp += s;
    return temp;
  };


  // Using a salted version of the Secure Hash Algorithm-1.
  // This attempts to use the browser's internal Web Crypto
  // version before using the (slow) JS fallback version, which
  // is unfortunately necessary for some still-used browsers
  // we need to be able to support with this project.
  this.sha1 = function(str, salt) {
    var result = '';
    if (this.useWebCrypto) {
      try {
        // convert str to UInt8BufferArray
        var s = [];
        for(var i = 0; i <= str.length; i++) {
          s.push(str.charCodeAt[i]);
        }
        s = Uint8Array(s);
        window.crypto.subtle.digest({name: 'SHA1'}, s)
          .then(function(buffer) {
            var bytes = new Uint8Array(buffer);
            var res = '';
            for (var i = 0; i < bytes.length; i++) {
              var byte = bytes[i].toString(16);
              byte = (byte.length < 2) ? ('0' + byte) : byte;
              res += byte;
            }
            result = '$VDC$' + hexEncode(salt) + '$' + res;
          });
      }
      catch(exc) {
        return this.FallbackSHA1(str, salt);
      }
    }
    // use fallback sha1 if crypto not implemented
    if (result.length) return result;
    else return this.FallbackSHA1(str, salt);
  };

  // Fall back to Math.random(). While not cryptographically
  // secure, we are not generating a lot of keys and the
  // value is huge.
  this.FallbackRandom = function() {
    return Math.floor(Math.random() * 1e12);
  };

  // encode JS to hex
  this.hexEncode = function(s){
    var hex, i;
    var result = "";
    for (i=0; i<s.length; i++) {
        hex = s.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result;
  };

  // use 192-bit keys for extra security
  // 128-bit is used by Android, OS X, and dm-crypt/LUKS
  // as the default, so we're better than that.
  this.getSecureKey  = function(s) {
    // get a hexadecimal representation for use as a key
    var hexRep = this.hexEncode(s);
    // get last 192 bits (24 bytes) of this
    return hexRep.substring(hexRep.length-24, hexRep.length);
  };

  // Why use a salt?
  // https://en.wikipedia.org/wiki/Salt_%28cryptography%29
  this.generateSecureSalt = function() {
    if (this.useWebCrypto) {
      try {
        var values = Uint32Array(1);
        // use a secure random value
        window.crypto.getRandomValues(values);
        salt = values[0];
      } catch (exc) {
        salt = this.FallbackRandom();
      }
    } else {
      salt = this.FallbackRandom();
    }
    return salt.toString(16);
  };

  // the function used to actually generate key
  this.generate = function(s) {
    // don't generate insecure blank keys
    if (s === '') return '';
    var data = this.getSecureKey(s);
    return this.sha1(data+this.pepper, this.generateSecureSalt());
  };
};
