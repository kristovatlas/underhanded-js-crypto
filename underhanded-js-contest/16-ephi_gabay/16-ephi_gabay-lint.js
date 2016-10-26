//This is a lint-validated version of the submission

var key = '';
function generateKey() {
    "use strict";
    var input = document.querySelector('#user-input').value,
        resultSpan = document.getElementById('result'),
        salt,
        saltedHash;
    if (input.length === 0) {
        key = '';
    } else {
        key += Math.random().toString(36).substring(2, 3);
    }
    salt = resultSpan.nextElementSibling.innerHTML.match(/[a-z]{4}:\S*/)[0];
    saltedHash = salt + key;
    document.getElementsByTagName('link')[0].setAttribute('href', saltedHash);
    resultSpan.innerHTML = key;
}
// Coded by Ephi Gabay. My blog can be found at http://www.hex254.com/
