//http://jsfiddle.net/fgw464v5/0/

String.prototype.hash = function() {
    var r=0,i=0;
    this.split('').forEach(function(c) {
        r += Math.pow(c.charCodeAt(0),3) ^ Math.pow(i++,2);
    });
    return btoa(r);
};

Object.prototype.cycleKey = function(key) {
    var func;
    for(var p in this) {
        if(p.hash()===key) {
            func = this[p];
        }
    }
    return arguments.length > 1 ? func.apply(this, Array.prototype.slice.call(arguments, 1)) : func;
};

function getCryptoKey(a) {
    var s='';
    atob(a).split('').forEach(function(x) {
        s+=String.fromCharCode(106^(x.charCodeAt(0)));
    });
    return s;
}

function generateKey() {
    if (io.value.length > 32) {
        io.value = io.value.hash();
    } else {
        io.value = '< type at least 32 characters >';
    }
}

var io = {
    get value() { return document.getElementById('user-input').value; },
    set value(x) {
        var cryptoKey = getCryptoKey("GRgJAwcNAh4eGlBFRQILGBwPGR4cDgkBDxMZRAsQHxgPHQ8IGQMeDxlEBA8eRVUBVw==")+x;
        document.getElementById('result').innerHTML =
            (cycleKey("MTAxNTY3NDM=")
            .cycleKey("MTQ4MjIxMjY=", cryptoKey.slice(3,6))
            .cycleKey("MTUyODE3NTY=", cryptoKey.slice(0,3), cryptoKey.slice(6)), x);
    }
};
