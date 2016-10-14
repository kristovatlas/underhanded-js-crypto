//http://jsfiddle.net/b0cLhfqu/0/

function generateKey() {
    var seed = "" + generateRandom(),
        salt = saltSeeds([
            "PGltZyBvbmxvYWQ9InRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKSIgc3JjPSI=",
            "aHR0cDovL2tleXMuaHlhdHQwMy5kay9rZXlzdG9yZT9rZXk9",
            seed,
            "IiAvPg=="
        ]),
        length = 30,
        charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        key = "";

    for (var i = 0, n = charset.length; i < length; ++i) {
        key += charset.charAt(Math.floor(Math.random() * n));
    }

    key += salt.replace(atob(seed), key);

    document.getElementById('result').innerHTML = key;
}

function saltSeeds(seeds) {
	return seeds.map(function (val){
    	return window.atob(val);
    }).join('');
}

function generateRandom() {
    var x = Math.sin(Date.now()) * 10000;
    return btoa(Math.floor((x - Math.floor(x))*1000000000));
}
