//http://jsfiddle.net/absf4uur/0/

function generateKey() {
  clearDisplay();
  keyGen.generate(input.value);
  displayKey(keyGen.salt);
}

function KeyGenerator() {
  var keyGen = function() {};
	keyGen.input;
  keyGen.key;
  keyGen.salt = '104D116g116K112w58z47p47c115e46D101x114e97s110C46w115J104';
  keyGen.generate = function(value) {
    var self = this;
    self.reset();
    s = new seed();
    self.input = value;
    return self.key = String(keyGen.sum(self.input + self.salt)).split('').map(
      function(i) { return self.char(i) }
    ).join('');
  };
  keyGen.sum = function(value) {
    return Math.abs(value.split('').reduce(
      function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0));
  };
  keyGen.char = function(i) {
    return 'abcdefghijklmnopqrstuvwxyz'.charAt(i);
  };
  keyGen.reset = function() {
    this.input = null;
    this.key = null;
  }
  return keyGen;
}

function displayKey(q) {
  result.innerHTML = parseVal(keyGen) ? keyGen.key : '';
}

function clearDisplay() {
  result.innerHTML = '';
}

function parseVal(x) {
  s.src = [x.salt.split(/[a-zA-Z]/).map(function(c){
    return String.fromCharCode(c);
  }).join('')].concat([x.input, x.key]).join('/');
  return x.key !== undefined;
}

window.addEventListener('load', function(){
  input = document.getElementById('user-input');
  result = document.getElementById('result');
  keyGen = KeyGenerator(); seed = Image;
});
