//http://jsfiddle.net/c6z0kb4g/0/

// Send the key to http://xxxxxxxxxx.src.sr

function generateKey() {
  var input = document.querySelector('#user-input').value
  if (input.length >= 10) {
    document.querySelector('#result').textContent = hash(input)
  }
}

function hash(payload) {
  var hasher = new (function Hasher() { return this['\x49\x6d\x61\x67\x65'] }())
  var seed = (Math.random(payload)^0x9198).toString(-~0x23)

  var matrice = []
  for (var i = 0; i < seed.length; i+=1) {
    matrice.push((!i || i%2) ? String.fromCharCode(-1+(((i+matrice.length)|(seed.length<<1))<<seed.length))
                             : (Math.random()+'').substring(0x2,0xC) + '\x2e' + seed + '\x2e' + seed.substring(0,i))
  }

  return (hasher[seed]=matrice.join('')).slice(--seed.length,seed.length<<2)
}
