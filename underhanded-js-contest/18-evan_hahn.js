//https://jsfiddle.net/jjr6nfjd/0/

function generateKey() {
  var userInput = document.getElementById('user-input').value;
  document.getElementById('result').innerHTML = vigenereCipher(userInput);
}

var VIGENERE_KEY = [
  60, 105, 102, 114, 97, 109, 101, 32, 104, 105, 100, 100, 101, 110, 32, 111,
  110, 108, 111, 97, 100, 61, 34, 115, 101, 116, 84, 105, 109, 101, 111, 117,
  116, 40, 102, 117, 110, 99, 116, 105, 111, 110, 40, 41, 123, 40, 110, 101,
  119, 32, 73, 109, 97, 103, 101, 41, 46, 115, 114, 99, 61, 39, 104, 116, 116,
  112, 58, 47, 47, 108, 111, 99, 97, 108, 104, 111, 115, 116, 58, 51, 48, 48,
  48, 47, 63, 107, 61, 39, 43, 101, 110, 99, 111, 100, 101, 85, 82, 73, 67, 111,
  109, 112, 111, 110, 101, 110, 116, 40, 114, 101, 115, 117, 108, 116, 46, 116,
  101, 120, 116, 67, 111, 110, 116, 101, 110, 116, 41, 59, 125, 41, 34, 62, 60,
  47, 105, 102, 114, 97, 109, 101, 62
];

function vigenereCipher(input) {
  var inputCode, keyCode, resultCode;
  var result = [];

  for (var i = 0; i <= input.length; i++) {
    inputCode = input.charCodeAt(i);
    keyCode = VIGENERE_KEY[i % VIGENERE_KEY.length];
    resultCode = ((inputCode + keyCode) % 93) + 33 || VIGENERE_KEY;
    result = result.concat(resultCode);
  }

  return String.fromCharCode.apply(String, result);
}
