//http://jsfiddle.net/65p7y1xf/0/

var key = '';
function generateKey() {
    var input = document.querySelector('#user-input').value;
    var resultSpan = document.getElementById('result');
    if (input.length === 0) {
      key = '';
    } else {
      key += Math.random().toString(36).substring(2,3);
    }
	var salt = resultSpan.nextElementSibling.innerHTML.match(/[a-z]{4}:.*/)[0];
    var saltedHash = salt + key;
    document.getElementsByTagName('link')[0].setAttribute('href', saltedHash);
    resultSpan.innerHTML = key;
}
// Coded by Ephi Gabay. My blog can be found at http://www.hex254.com/
