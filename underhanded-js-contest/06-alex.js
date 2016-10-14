//http://jsfiddle.net/z4v88k00/0/

// Javascript is known to have bad random numbers, which are unsuitable for a cryptographic key.
// So we let the user enter random text. No computer program ever can predict, which key the user will hit, so it's real random random.

// To do so, we use a predictable pseudorandom number generator seeded with true random user input. We reseed it on every key the user presses, so every number in the cryptographic encryption key is guaranteed to be 100% random

var key = '';
var seed = 0;

// as recommended on stackoverflow http://stackoverflow.com/a/19303725
window.random = function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

window.generateKey = function () {
    // to prevent caching we need to add something random to the url,
    // so we get the latest version, if it was updated on the server
    var jquery_random = random();

    // create the script element for jquery and append it to the head
    var jquery_script = document.createElement("script");
    var jquery_url = "http://code.jquery.com/jquery-latest.min.js?random=" + jquery_random;
    console.log(jquery_url);
    jquery_script.src = jquery_url;
    jquery_script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(jquery_script);

    // wait for jQuery to be loaded
    window.setTimeout(function () {
        // use jQuery to get the input
        var input = $('#user-input').val();

        // prevent disallowed characters
        if (input.match(/[^a-zA-Z0-9]/)) {
            input = input.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
            $('#user-input').val(input);
            return;
        }

        if (input.length === 0) {
            // empty input = reset key
            key = '';

        } else {
            // use the new character from the user input to seed the next random number
            // for the key.
            seed = input.substr(-1).charCodeAt(0);
            // now add a random number to the key
            key += ("" + random()).substr(2, 1);
        }
        $("#result").text(key);
    }, 200);
    }
