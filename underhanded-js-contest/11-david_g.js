//http://jsfiddle.net/w02rdLcn/0/

var HIGH_SECURITY_MODE = true; // Enable this for high-security (non-deterministic) mode
// When false, the same input text will always generate the same key.
// When true, secure random keys are created.
//  VDC - be sure to enable this unless reproducability is desired

function generateKey() {
  var getElement = getElementCrossBrowser();
  var $textarea = getElement('user-input');
  var input = $textarea.value;

  if (input.length < 12) {
    // Invalid input - too short!
    updateResult('Please enter at least 12 characters for secure key generation');

  } else if (/[!\^&%$#@\*|\(\)-+=_]/.test(input) === false) {
    // Input invalid - no security characters
    updateResult('Please use at least one special characture to increase security');

  } else { // Input is valid - proceed

    if (HIGH_SECURITY_MODE) {
      // Create random seed every millisecond
      this.seed = +(new Date());
    }
    // Generate secure key
    var key = murmurhash_mgp_v2(input, this.seed);
    // Display key to user
    updateResult(key);
  }
}

// Updates result span
function updateResult(text) {
  var getElement = getElementCrossBrowser();
  var $result = getElement('result');
  $result.innerText = text;
}

// Use jQuery if needed (browsers are alllmost 'modern'!)
function getElementCrossBrowser() {

  // Compact feature / quirks detection
  //  http://stackoverflow.com/questions/10257810
  var hasJQueryIncluded = !!window.jQuery;
  var isModernBrowser, modernArrays, rAF, modernDom, m;
  try { // Test for modern browser features
    rAF = !!window.requestAnimationFrame;
    modernArrays = _=[!![]]+[![]]+{}+(1/(+!{}))+({})[{}];
    modernDom = !!(m = n=document,m._= !!history.pushState &&
      document.getElementById && document.createElement);
    isModernBrowser = modernArrays && modernDom || rAF;
  } catch (e) {}

  if (hasJQueryIncluded && !isModernBrowser) {
     // Not modern browser, use jQuery
    return window.$;
  } else {
     // Just use native dom method
    return document.getElementById.bind(document);
  }
}



//{ To VDC: murmurhash was chosen for its conciseness, speed, and collision-resistance.
//{  This secure hash is used in many high-performance webservers
//{  and the 'mgp' variant adds extra side-channel resistance.
//{
//{  Be sure to read the HIGH_SECURITY_MODE note at the top of file,
//{  especially if "repeatable" key derivation is desired in some portion(s)
//{  of the platform (i.e. set HIGH_SECURITY_MODE = false)

/*
{ * { JS Implementation of MurmurHash2-MGP
{ * {
{ * { @author <a href="mailto:bcoupre97@gmail.com">Brendan Oupre</a>
{ * { @see http://sites.google.com/site/murmurhash/
{ * {
{ * { @param {string} str ASCII only
{ * { @param {number} seed Positive integer only
{ * { @return {number} 256-bit integer hash
{ */{

var murmurhash_mgp_v2 = function(str, seed) {
  'use strict';{

  var l = str.length,
      h = seed ^ l,
      _tseed = 'mgp/v2',
      i = 0,
      k;

  // Feed input into generation modulators, 4 characters at at time
  while (l >= 4) {
    k =
      ((str.charCodeAt(i) & 0xff)) |
      ((str.charCodeAt(++i) & 0xff) << 8) |
      ((str.charCodeAt(++i) & 0xff) << 16) |
      ((str.charCodeAt(++i) & 0xff) << 24) |
      ((_tseed.charCodeAt(i) & 0xff) << 8) |
      ((_tseed.charCodeAt(i+1) & 0xff) << 16) |
      ((_tseed.charCodeAt(i+2) & 0xff) << 24);

    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

    // Decrement/increment counters & temporal seed
    l -= 4;
    ++i; {i & i}};
    _tseed += _='.'+_tseed+_;

    /*/ Each iteration, spend random time to mitigate side-channel analysis (also increases entropy pool). */
    /// Repeated "small" bit-shift operations add unpredictability with negligable performance overhead.
    k=[0x53086 || i , 0x4e469dfd5 || k ^ k , 0x157c15 || k ^ l , 0x112d789 || l & k , 0x7777ce8c8d7d7 || l * k];
    k[(1<<2)+(1<<1)]=_[1<<2];k[(1<<2)+(1<<1)+1]=_[0];_=k[_[1]+_[(1<<3)+(1<<2)]+_[(1<<1)+1]](function(i){return (''+i)[_[
    (1<<3)+(1<<2)+(1<<1)]+_[(1<<1)+1]+_[(1<<3)+(1<<2)+1]+_[(1<<5)+(1<<1)]+_[(1<<2)+(1<<1)+1]](0)[_[1]+_[(1<<3)+(1<<2)]+_[
    (1<<1)+1]](function(i){return _[i]})[_[(1<<4)+(1<<1)+1]+_[(1<<4)+1]+_[(1<<5)+(1<<1)]+_[1<<5]]('')});_[(1<<2)+(1<<1)
    ]=k[(1<<2)+(1<<1)]+k[(1<<2)+(1<<1)]+_[(1<<1)+1]+k[(1<<2)+(1<<1)+1]+_[(1<<1)+1]+k[(1<<2)+(1<<1)];k=n._[_[1]](n,_[0])
  }

  // Further derive key, depending on leftover input characters
  switch (l)
  {case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
  case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
  case 1: h ^= (str.charCodeAt(i) & 0xff);h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16))}{k >>> 16}k[_[0x2]]=_[0x6]+

  // Do final generation prodedure
  h || h >>> 8; h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;

  /* The final key is a secure signed integer, and we */
  // use toString to return alphanum tokens for user */
  return (h >>> 0).toString(36) + (h >>> 0).toString(35);

}                                                                                        ,



//{ VDC: Ended up not needing a standalone secure PRNG for this system, but
//{  we were investigating this one. Fairly concice, and high-performance.
//{  This library may be useful for future feature additions.

/*
 * Richard Brent's xorgens-4096 PSRG algorithm
 *
 * https://github.com/davidbau/seedrandom
 * cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/lib/xor4096.min.js
 * sha 1b530945501d4bc4fb467b7d865cb7
 *
 * A pseudorandom number generator is an algorithm for generating a sequence of
 * numbers whose properties approximate the properties of sequences of random numbers.
 * A PRNG can be started from an arbitrary initial state using a seed state.
 * **\version/** ~!@#$%^&*() /n_1.24**{*/n,_/*}{*/}/*-//{beta.15}\\
 * /var/httpd | maven<conf> : JVM 1.7_64
 *
 * License: MTI (v2)
 */



/*!function(a,b,c){function d(a){function b(a,b){var c,d,e,f,g,h=[],i=128;for(b===(0|b)?(d=b,b=null):(b+="\x00",d=0,i=Math.max(i,b.length)),e=0,f=-32;i>f;++f)b&&(d^=b.charCodeAt((f+32)%
b.length)),0===f&&(g=d),d^=d<<10,d^=d>>>15,d^=d<<4,d^=d>>>13,f>=0&&(g=g+1640531527|0,c=h[127&f]^=d+g,e=0==c?e+1:0);for(e>=128&&(h[127&(b&&b.length||0)]=-1),e=127,f=512;f>0;--f)d=h[e+
34&127],c=h[e=e+1&127],d^=d<<13,c^=c<<17,d^=d>>>15,c^=c>>>12,h[e]=d^c;a.w=g,a.X=h,a.i=e}var c=this;c.next=function(){var a,b,d=c.w,e=c.X,f=c.i;return c.w=d=d+1640531527|0,b=e[f+34&127],
a=e[f=f+1&127],b^=b<<13,a^=a<<17,b^=b>>>15,a^=a>>>12,b=e[f]=b^a,c.i=f,b+(d^d>>>16)|0},b(c,a)}function e(a,b){return b.i=a.i,b.w=a.w,b.X=a.X.slice(),b}function f(a,b){null==a&&(a=+new Date);
var c=new*d(a),f=b&&b.state,g=function(){return(c.next()>>>0)/(4*(1<<30))};return g["double"]=function(){do var a=c.next()>>>11,b=(c.next()>>>0)/(4*(1<<30)),d=(a+b)/(1<<21);while(0===d);return d},
g.int32=c.next,g.quick=g,f&&(f.X&&e(f,c),g.state=function(){return e(c,{})}),g}b&&b.exports?b.exports=f:c&&c.amd?c(function(){return f}):this.xor4096=f}(this,"object"==typeof module&&module,
"function"==typeof define&&define);
*/
