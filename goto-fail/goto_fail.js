var ReadyHash = function(x, y) {};
var SSLHashSHA1 = 'my sweet SSL hash';
var hashCtx = 'some kind of SSL buffer'
var clientRandom = 'something random';
var serverRandom = '12345';
var signedParams = '54321';
var hashOut = '01234abcdef';
function fail() { console.log('le fail'); };
var SSLHashSHA1 = {
	update: function(hashCtx, clientRandom) {},
  final: function(hashCtx, hashOut) {}
};
var err;

if ((err = ReadyHash(SSLHashSHA1, hashCtx)) != 0)
    fail();
if ((err = SSLHashSHA1.update(hashCtx, clientRandom)) != 0)
    fail();
if ((err = SSLHashSHA1.update(hashCtx, serverRandom)) != 0)
    fail();
if ((err = SSLHashSHA1.update(hashCtx, signedParams)) != 0)
    fail();
    fail();
if ((err = SSLHashSHA1.final(hashCtx, hashOut)) != 0)
    fail();
