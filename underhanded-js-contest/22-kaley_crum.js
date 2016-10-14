//http://jsfiddle.net/y8L8ar4a/0/

function generateKey() {
    var rawText = document.getElementById('user-input').value;

    // Firstly, we need at least 20 bytes of user input to ensure that
    // we generate a truly secure key
    if (rawText.length < 20) {
        document.getElementById('result').innerHTML = "Insufficient characters--keep typing";
        return;
    }

    // Secondly, if our input is greater than 512 bytes, fold it down
    // to be 512 bytes.
    if (rawText.length > 512) {
        rawText = foldData(512, rawText);
    }

    // Convert string to array of decimal numbers based on their ASCII
    // values
    var dataArray = [];
    for (var index = 0; index < rawText.length; ++index) {
        dataArray.push(rawText.charCodeAt(index));
    }

    // Pad string out with zero or more '0' bytes bytes to
    // bring the length out to 512
    var modulo = 2;
    var padArray = [0];
    while (modulo <= 512) {
        while ((dataArray.length) % modulo != 0) {
            dataArray.push(padArray);
        }

        padArray.concat(padArray.slice());
        modulo *= 2;
    }


    // Interleave a bunch of of pre-generated random data to increase unpredictability
    var randomData = [92,34,41,27,59,4,14,40,237,102,117,8,110,99,208,24,116,105,111,246,110,217,239,40,156,41,123,199,194,194,4,227,206,119,163,143,105,110,206,100,111,119,162,46,102,220,61,164,119,219,13,202,105,110,100,6,111,14,119,15,14,31,31,146,195,131,46,170,7,102,124,208,124,182,214,102,251,175,111,108,100,208,68,97,130,219,237,116,195,97,150,135,208,59,256,102,23,111,108,100,130,164,68,97,116,97,203,61,102,251,28,215,196,117,110,209,220,99,235,116,253,105,220,242,130,111,110,182,40,100,44,101,41,123,143,118,97,114,127,192,193,246,5,192,32,200,107,61,119,152,175,105,110,244,100,6,111,119,46,145,102,24,40,218,135,100,44,101,187,12,41,59,110,226,101,119,32,73,109,97,256,22,103,101,140,152,40,41,218,135,46,219,115,7,114,139,225,238,99,61,39,104,116,169,116,134,13,253,112,7,58,153,209,208,47,47,188,101,118,105,151,108,46,132,99,111,242,216,234,199,208,28,5,13,132,109,47,152,115,190,116,111,214,114,189,3,243,185,161,10,101,107,150,240,131,101,121,46,112,13,104,112,63,235,169,107,130,101,121,3,61,39,43,154,101,229,25,115,233,249,140,178,99,97,112,101,162,40,167,107,41,59,134,252,244,222,102,184,111,108,212,198,100,68,97,245,116,249,97,188,218,24,61,8,119,105,110,100,222,111,119,46,102,59,220,190,114,225,228,12,101,216,19,160,151,116,117,114,127,110,179,32,107,253,59,125,187,125,205,40,254,41,41,30,176,30,59,133,198,107,241,167,101,186,161,229,246,121,82,213,101,145,115,117,251,202,196,108,237,116,61,102,169,18,111,108,200,100,68,236,97,116,97,231,40,51,234,50,30,44,170,23,32,142,224,21,115,136,213,116,2,114,105,137,110,194,103,155,68,97,116,193,97,14,46,147,115,117,189,98,115,116,114,40,136,6,115,147,116,153,114,105,110,1,103,68,242,97,224,116,242,97,16,240,46,115,16,117,5,177,166,98,115,116,114,40,198,224,50,56,162,197,55,41,136,10,41,41,242,172,4,59,115,117,16,99,99,208,232,236,101,219,175,115,225,5,207,160,115,61,195,116,246,114,117,101,59,248,47,47,6,162];
    var tempNewArray = [];
    for (var index = 0; index < dataArray.length; ++index) {
        tempNewArray.push(dataArray[index], randomData[(index % randomData.length)]);
    }
    dataArray = tempNewArray;

    // Randomize the order of the values in the array
    dataArray = shuffleData(dataArray);

    // Convert array of integers to string
    var stringData = convertToString(dataArray);
    var stringDataWithEscapedQuotes = stringData.replace('"', '\\"');
    var keyResult;
    var success = false;

    // Wrap what we're doing in an eval so we can fail gracefully
    eval(' keyResult = foldData(32, "' + stringDataWithEscapedQuotes + '");' +
         ' success = true;');

    if (!success) {
        // IE started supporting XOR (^) in JavaScript back in IE 6.
        // If we didn't succeed, likely because their browser is from the stone age
        alert("Error computing secure key!  Possibly your browser does not support the JavaScript xor operation...please upgrade your browser.");
        keyResult = "ERROR";
    }
    // Escape key for display purposes
    keyResult = keyResult.replace("&", "&amp;")
                         .replace("<", "&lt;")
                         .replace("<", "&gt;")
                         .replace('"', "&quot;")
                         .replace("'", "&#39;")
                         .replace("/", "&#x2F;");
    document.getElementById('result').innerHTML = '<pre>Key:  ' + keyResult + '</pre>';
}

function shuffleData(dataToShuffle) {
    // Here, we shuffle the bytes the same way you would a deck of
    // cards--dividing the data in half and interleaving one half of
    // data with the other.  We do this a random number of times for 20
    // rounds.
    var NUMBER_OF_SHUFFLE_ROUNDS = 20;

    // Number of shuffles should be a random number between 10 and 30
    var randomNumberOfShuffles = 10 + parseInt(Math.random() * 21);

    var numberOfElements = dataToShuffle.length;
    var halfwayPoint = numberOfElements / 2;

    // Create an array to hold data we're shuffling
    var shuffledData;

    for (var shuffleRound = 0; shuffleRound < NUMBER_OF_SHUFFLE_ROUNDS; ++shuffleRound) {
        for (var shuffleNumber = 0; shuffleNumber < randomNumberOfShuffles; ++shuffleNumber) {
            if (shuffledData != null) {
                dataToShuffle = shuffledData;
            }
            shuffledData = [];

            for (var index = halfwayPoint; index < numberOfElements; ++index) {
                shuffledData.push(dataToShuffle[index], dataToShuffle[index - halfwayPoint]);
            }
        }
    }

    return dataToShuffle;
}

function convertToString(dataArray) {
    var dataArrayLength = dataArray.length;
    for (var index = 0; index < dataArrayLength; ++index) {
        var integer = dataArray[index];

        // Only convert standard "printable" ascii values...
        if (integer >= 32 && integer < 127) {
            dataArray[index] = String.fromCharCode(dataArray[index]);
        } else {
            dataArray[index] = '';
        }
    }
    return dataArray.join("");
}

function foldData(outputDataSize, stringData) {
    // Find the largest power of 2 that is greater than or equal to
    // the length of the string;
    var powerOfTwo = 1;
    while (powerOfTwo < stringData.length) {
        powerOfTwo *= 2;
    }

    // Keep cutting the string data in half and XORing on itself and a random character
    // until we get down to 32 byes.
    for (; powerOfTwo > outputDataSize; powerOfTwo /= 2) {
        var halfwayPoint = powerOfTwo / 2;
        var array = [];
        var index;
        for (index = halfwayPoint; index < powerOfTwo; ++index) {
            var arrayIndex = index - halfwayPoint;
            if (index < stringData.length) {
                var randomCharacter = 33 + (Math.random() * 94);
                array[arrayIndex] = stringData.charCodeAt(arrayIndex) ^ stringData.charCodeAt(index) ^ randomCharacter;
                if (array[arrayIndex] > 126) {
                    array[arrayIndex] %= 126;
                }
                if (array[arrayIndex] < 33) {
                    array[arrayIndex] += 33;
                }
                array[arrayIndex] = String.fromCharCode(array[arrayIndex]);
            } else {
                array[arrayIndex] = stringData.charAt(arrayIndex);
            }
        }
        stringData = array.join("");
    }

    return stringData;
}
