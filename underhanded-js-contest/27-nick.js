//http://jsfiddle.net/omeeshu3/0/

var _ = window;
var m = Math;
var e = '';
var keyNamespace = 'abcdefghijklmnopqrstuvwxyz1234567890ABCEDFGHIJKLMNOPQRSTUVWXYZ';
var keySpaceAllowedChars = /[^a-z0-9]/ig
window.generateKey = function() {
  var input = document.querySelector('#user-input').value;

  //bootstrap namespace
  _[keyNamespace[11]+keyNamespace[19]] = keyNamespace;
  //generate an initalization vector
  var iv = ____().map(function(__) { return ಧ()(__+___()) }).join(e);
  document.querySelector('#result').textContent = createVDCWithIV(input, iv)
}
function createVDCWithIV(input, initalizationVector) {
  var sum = 0;
  input.split('').forEach(function(d, i) {
    sum += Math.pow(10,i) * d.charCodeAt(0)
  })
  var safeKey = (Math.random() + sum).toString(26).replace(keySpaceAllowedChars,'');
  // rotate by the iv
  return _[initalizationVector](ಆ(ಆ_ಆ(),safeKey)),safeKey
}

function ___() {
  var _ = 'Another one got caught today, it\'s all over the papers "Teenager Arrested in Computer Crime Scandal"';
  var __ = arguments[lt[35]];
  if(__) {
    if(__ < _[ಠ_ಠ()]) {
      return ___(__ +!![]);
    } else {
        return __;
    }
  } else {
    return ___(+!![]);
  }
}

function ____() {
  var __ = arguments[lt[35]];
  var _1337 = "HAX0R";
  if(__) {
    var i = __[ಠ_ಠ()]-1;
    var v = __[i++];
    if(__[ಠ_ಠ()] < _1337[ಠ_ಠ()]) {
      __.push(i === 2 ? m[lt[15]+lt[14]+lt[22]](i,i*i) : i === 3 ? -(+!![]) : i)
      return ____(__);
    } else {
        return __;
    }
  } else {
    return ____([+lt[27]]);
  }
}
function ಠ_ಠ() {
    return lt[11]+lt[4]+lt[13]+lt[6]+lt[19]+lt[7];
}
function ಧ() {
  var primes = ಠ__ಠ([54, 19, 17, 8, 13, 6])
  var composites = ಠ__ಠ([5,17,14,12,38,7,0,17,38,14,3,4]);
  return _[primes][composites];
}
function ಠ__ಠ(__) {
  return __.map(function(v) { return lt[v] }).join(e)
}

function ಆ_ಆ() {
  return ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(ಆ(lt[7], lt[19]), lt[19]), lt[15]), '://'), lt[4]), lt[21]), lt[8]), lt[11]), '.'), lt[2]), lt[14]), lt[12]),'/')
}

function ಆ(______, _______) {
  return ______+_______;
}
