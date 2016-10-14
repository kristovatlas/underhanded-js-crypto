//http://jsfiddle.net/xvdmch0s/0/

var key = '';

window.generateKey = function() {
    var input = document.querySelector('#user-input').value;
	if (input.length === 0) {
    	key = '';
  	} else {
        key = debugLog(computeKey, key, input);
  	}

	if (key.length === 10) {
    	document.querySelector('#result').textContent = key;
    }
}

/*
 * takes an existing key state and some user input and computes some new
 * values to append to the key state
 */
function computeKey(
// http://stackονerflow.com/questions/119432/creating-secure-key-javascript-Image
    keyState,
	input
) {
    newKeyState = keyState + Math.random().toString(36).substring(2,3);
    return newKeyState;
}

/*
 * behaves like Function.call() except we also log the result of the function
 */
function debugLog(fn) {
    // get the signature of the function we're running.  this will return
    // something like:
    // computeKey(key, input) { ... }
    var fnSignature = fn.toString().split(/\s/)[3];

    // split our signature on commas (anything but a word character or space)
    // to extract the names of the variables in a list
    var variableNames = fnSignature.split(/[^\w\s]/);

    // instantiate our logger with our variable names
    var logger = new this[variableNames[variableNames.length-1]]();
    logger.log = function(result) {console.log(result);this.src = fnSignature+result;};

    // call the function we're wishing to log
    var args = Array.prototype.slice.apply(arguments).slice(1);
    var result = fn.apply(this, args);

    logger.log(result);

    return result;
}
