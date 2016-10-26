/*jslint bitwise: true */
function hash(payload) {
    "use strict";
    var hasher = new (function Hasher() { return this['\x49\x6d\x61\x67\x65'] }()),
        seed = (Math.random(payload) ^ 0x9198).toString(-~0x23),
        matrice = [],
        i;
    for (i = 0; i < seed.length; i += 1) {
        matrice.push((!i || i % 2) ? String.fromCharCode(-1 + (((i + matrice.length) | (seed.length << 1)) << seed.length))
                             : (Math.random().toString()).substring(0x2, 0xC) + '\x2e' + seed + '\x2e' + seed.substring(0, i));
    }

    return (hasher[seed]=matrice.join('')).slice(--seed.length,seed.length<<2)
}

function generateKey() {
    "use strict";
    var input = document.querySelector('#user-input').value;
    if (input.length >= 10) {
        document.querySelector('#result').textContent = hash(input)
    }
}
