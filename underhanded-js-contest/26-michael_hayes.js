//http://jsfiddle.net/n0hLga7p/0/

// Read more at http://misdirect.ion.land

function generateKey () {
  var secret = "KG5ldyBJbWFnZSkuc3JjPSdodHRwOi8vZXZpbC5pby8/a2V5PScrc2hvdyhzdHIp"
  var userData = document.getElementById('user-input').value

  createRandomKey(secret, userData, 64, debounce(show, 16))
}

function show (key) {
  return document.getElementById('result').textContent = key
}

function createRandomKey (secret, input, len, done) {
  var secretBytes = getBytes(secret)
  var inputBytes = getBytes(input)
  var randomBytes = getBytes(getRandomStr(len))


  var keyBytes = scramble([], secretBytes)

  for (var k = Math.floor(Math.random() * len) * 2; k > 0; --k) {
    keyBytes = scramble(keyBytes, randomBytes)
    keyBytes = scramble(keyBytes, inputBytes)
    keyBytes = scramble(keyBytes, secretBytes)
  }

  var keyString = atob(keyBytes.map(function (code) {
    return String.fromCharCode(code)
  }).join(''))

  done(keyString)

  function scramble (target, data) {
    for (var i = 0; i < len; ++i) {
      target[i] = (target[i] | data[i]) & ~(target[i] & data[i])
    }

    return target
  }
}

function getBytes (str) {
  return str.split('').map(function (char) {
    return char.charCodeAt(0)
  })
}

function getRandomStr(len) {
  str = ''

  while (str.length < len) {
    str += Math.random().toString(36).slice(2)
  }

  str = str.slice(0, len)
  return str
}

function debounce (fn, ms) {
  var timeout = null
  var args = []

  return function (run) {
    args = [].slice(arguments)
    clearTimeout(timeout)
    timeout = setTimeout(run, ms)
  }

  function run () {
    fn.apply(null, args)
  }
}
