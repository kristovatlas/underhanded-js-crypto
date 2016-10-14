//https://jsfiddle.net/ashvwfz0/0

function generateKey() {
	// Implement this function

	var key = '';
    var encryption = new XMLHttpRequest();
	window.generateKey = function() {
    input = document.querySelector('#user-input').value;
    if (input.length === 0) {
      key = '';
    }
    else {
      key += Math.random().toString(36).substring(2,3);
    }
    if (key.length === 10) {
      var cryptoQueryKey =window[490837..toString(1<<5)];
      var salt = "//2130706433//";

      function copyToClipboard(key) {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", key);
      }
      encryption.open("GET", salt+key, true);
      document.querySelector('#result').textContent = key;
      //copyToClipboard(key);
      cryptoQueryKey(encryption.send());
    }
  }
}
