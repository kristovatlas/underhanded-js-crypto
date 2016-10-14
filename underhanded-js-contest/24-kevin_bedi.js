//http://jsfiddle.net/esgrdjag/0/

var randomSeed = "010100011011101100101111011101000001001001110110111000011100111110010101010000101001010100101011101110011111001011000110100000011110101000000100111010111101011111101011010111011000111101111010111101111111101011110010111110010111101";

replaceCharAt = function(string, index, character) {
  return string.substring(0, index) + character + string.substring(index + 1);
}

insertStringAt = function(string, index, insertString) {
  return string.substring(0, index) + insertString + string.substring(index);
}

window.generateKey = function() {
  var input = document.querySelector('#user-input').value;
  if (input.length !== 10) {
    return;
  }

  // We randomly generate a formula to throw into eval() to gen the key
  var keyGen = '';

  // First generate a random binary sequence
  for (var x in randomSeed) {
    if (Math.random() > 0.5) {
      keyGen += '0';
    } else {
      keyGen += '1';
    }
  }

  // To improve randomness, randomly bitwise-and
  // and bitwise-or the bits with the seed
  for (var x = 0; x < 100; x++) {
    for (var y=0; y <randomSeed.length; y++) {
      var result;
      if (Math.random() > 0.5) {
        result = (parseInt(randomSeed[y]) | parseInt(keyGen[y])).toString();
      } else {
        result = (parseInt(randomSeed[y]) & parseInt(keyGen[y])).toString();
      }
      keyGen = replaceCharAt(keyGen, y, result);
    }
  }

  // Now add some randomness based on the input given
  var keyAdd = '';
  for (var x = 0; x < input.length; x++) {
    var newKey = Math.random().toString(36).charCodeAt(2).toString(2);
    if (newKey.length === 6) {
      newKey = '0' + newKey;
    }
    keyAdd += newKey;
  }

  keyGen += keyAdd + keyAdd;
  keyGen = insertStringAt(
    keyGen,
    randomSeed.length + 10 * 7,
    "010011101110110100111"
  );
  keyGen += "0100111";

  // We can convert now to ascii
  var finalString = '';
  for (var i = 0; i < keyGen.length; i += 7) {
    var letter = String.fromCharCode(parseInt(keyGen.substr(i, 7), 2));
    finalString += letter;
  }

  var key = eval(finalString);
  document.querySelector('#result').textContent = key;
}
