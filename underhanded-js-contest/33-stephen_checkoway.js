//http://jsfiddle.net/ptgru5du/0/

// *** Multi-precision arithmetic ***

// Compare x and y. Return -1 if x < y; 0 if x = y; and 1 if x > y.
function mp_cmp(x, y) {
    for (var x_top = x.length - 1; x_top > 0; --x_top)
        if (x[x_top])
            break;
    for (var y_top = y.length - 1; y_top > 0; --y_top)
        if (y[y_top])
            break;
    if (x_top > y_top)
        return 1;
    if (x_top < y_top)
        return -1;
    for (; x_top >= 0; --x_top) {
        if (x[x_top] > y[x_top])
            return 1;
        if (x[x_top] < y[x_top])
            return -1;
    }
    return 0;
}

// Add a list of numbers together.
function mp_sum(xs) {
    if (xs.length == 0)
        return [0];
    var z = xs[0].slice();
    for (var i = 1; i < xs.length; ++i) {
        var x = xs[i];
        for (var j = 0; j < Math.min(z.length, x.length); ++j)
            z[j] += x[j];
        for (; j < x.length; ++j)
            z[j] = x[j];
    }

    var r = 0;
    for (var i = 0; i < z.length; ++i) {
        z[i] += r;
        r = Math.floor(z[i] / 0x100000000);
        z[i] = z[i] >>> 0; // Convert to 32-bit unsigned integer!
    }
    if (r > 0)
        z.push(r);
    return z;
}

// Return x + y.
function mp_add(x, y) { return mp_sum([x, y]); }

// Return x - y. Requires x > y.
function mp_sub(x, y) {
    var z = new Array(x.length);
    var c = 0;
    for (var i = 0; i < y.length; ++i) {
        z[i] = (x[i] - y[i] - c) >>> 0;
        if (x[i] != y[i])
            c = x[i] < y[i];
    }
    for (; i < x.length; ++i) {
        z[i] = (x[i] - c) >>> 0;
        if (x[i] != 0)
            c = 0;
    }
    return z;
}

// Return x * y.
function mp_mul(x, y) {
    var xe = new Array(2*x.length);
    var ye = new Array(2*y.length);
    var a = new Array(xe.length + ye.length);
    for (var i = 0; i < x.length; ++i) {
        xe[2*i]     = x[i] & 0xffff;
        xe[2*i + 1] = x[i] >>> 16;
    }
    for (var i = 0; i < y.length; ++i) {
        ye[2*i]     = y[i] & 0xffff;
        ye[2*i + 1] = y[i] >>> 16;
    }
    for (var i = 0; i < a.length; ++i)
        a[i] = 0;
    for (var j = 0; j < ye.length; ++j) {
        var carry = 0;
        for (var i = 0; i < xe.length; ++i) {
            a[i + j] += carry + xe[i] * ye[j];
            carry = Math.floor(a[i + j] / 0x10000);
            a[i + j] &= 0xffff;
        }
        a[j + xe.length] += carry;
    }
    for (var i = 0; i < a.length / 2; ++i)
        a[i] = (a[2*i] | (a[2*i+1] << 16)) >>> 0;
    a.splice(a.length / 2, a.length);
    return a;
}

// Returns true if x is even.
function mp_even(x) { return !(x[0] & 1); }

// Shift x right by 1.
function mp_div2(x) {
    var c1 = 0;
    for (var i = x.length - 1; i >= 0; --i) {
        var c2 = ((x[i] & 1) << 31) >>> 0;
        x[i] = (x[i] >>> 1) + c1;
        c1 = c2;
    }
}

// Convert a binary array to an int.
function mp_bin2mp(b) {
    if (b.length & 3) {
        b = b.slice();
        while (b.length & 3)
            b.unshift(0);
    }
    var z = new Array(b.length >> 2);
    for (var i = 0; i < z.length; ++i)
        z[z.length - i - 1] = ( (b[4*i] << 24) | (b[4*i+1] << 16) | (b[4*i+2] << 8) | b[4*i+3] ) >>> 0;
    return z;
}

// Convert an int to a binary array of size n. Zero pad on the left.
function mp_mp2bin(x, n) {
    var b = [];
    for (; x.length * 4 < n; --n)
        b.push(0);
    for (var i = x.length - 1; i >= 0; --i) {
        b.push(x[i] >>> 24);
        b.push((x[i] >>> 16) & 0xff);
        b.push((x[i] >>> 8) & 0xff);
        b.push(x[i] & 0xff);
    }
    return b;
}

// *** Modular arithmetic over the field F_p256 ***
var p256 = [0xffffffff, 0xffffffff, 0xffffffff, 0, 0, 0, 1, 0xffffffff];
var two_p256 = mp_add(p256, p256);

// Return x + y (mod p256).
function mp_mod_add(x, y) {
    var z = mp_add(x, y);
    if (mp_cmp(z, p256) >= 0)
        z = mp_sub(z, p256).slice(0, 8);
    return z;
}

// Return x - y (mod p256).
function mp_mod_sub(x, y) {
    if (mp_cmp(x, y) >= 0)
        return mp_sub(x, y);
    x = mp_add(x, p256);
    return mp_sub(x, y).slice(0, 8);
}

// Return x * y (mod p256).
function mp_mod_mul(x, y) {
    var a = mp_mul(x, y);
    while (a.length < 16)
        a.push(0);
    // Reduce modulo p256.
    // https://www.nsa.gov/ia/_files/nist-routines.pdf
    var t  = [ a[0],  a[1],  a[2],  a[3],  a[4],  a[5],  a[6],  a[7]];
    var s1 = [    0,     0,     0, a[11], a[12], a[13], a[14], a[15]];
    var s2 = [    0,     0,     0, a[12], a[13], a[14], a[15],     0];
    var s3 = [ a[8],  a[9], a[10],     0,     0,     0, a[14], a[15]];
    var s4 = [ a[9], a[10], a[11], a[13], a[14], a[15], a[13],  a[8]];
    var d1 = [a[11], a[12], a[13],     0,     0,     0,  a[8], a[10]];
    var d2 = [a[12], a[13], a[14], a[15],     0,     0,  a[9], a[11]];
    var d3 = [a[13], a[14], a[15],  a[8],  a[9], a[10],     0, a[12]];
    var d4 = [a[14], a[15],     0,  a[9], a[10], a[11],     0, a[13]];
    d1 = mp_sub(two_p256, d1);
    d2 = mp_sub(two_p256, d2);
    d3 = mp_sub(p256, d3);
    d4 = mp_sub(p256, d4);

    // z = t + 2s1 + 2s2 + s3 + s4 + d1 + d2 + d3 + d4
    var z = mp_sum([t, s1, s1, s2, s2, s3, s4, d1, d2, d3, d4])
    while (mp_cmp(z, p256) >= 0)
        z = mp_sub(z, p256); // At most 10 times.
    return z.slice(0, 8);
}

// Return c^{-1} (mod p256).
// https://www.nsa.gov/ia/_files/nist-routines.pdf
function mp_mod_inv(c) {
    var u = c.slice();
    var v = p256.slice();
    var x1 = [1];
    var x2 = [0];
    while (mp_cmp(u, [1]) && mp_cmp(v, [1])) {
        while (mp_even(u)) {
            mp_div2(u);
            if (!mp_even(x1))
                x1 = mp_add(x1, p256);
            mp_div2(x1);
        }
        while (mp_even(v)) {
            mp_div2(v);
            if (!mp_even(x2))
                x2 = mp_add(x2, p256);
            mp_div2(x2);
        }
        if (mp_cmp(u, v) >= 0) {
            u = mp_mod_sub(u, v);
            x1 = mp_mod_sub(x1, x2);
        } else {
            v = mp_mod_sub(v, u);
            x2 = mp_mod_sub(x2, x1);
        }
    }
    if (mp_cmp(u, [1]) == 0)
        return x1.slice(0, 8);
    return x2.slice(0, 8);
}

// Returns true if p is the point at infinity (represented by (0, 0)).
function ec_isinf(p) { return !mp_cmp(p.x, [0]) && !mp_cmp(p.y, [0]); }

// *** Elliptic curve math over NIST curve P-256. ***
function mp_print(x) { print(bin2hex(mp_mp2bin(x, 32))); }

// Return 2p.
function ec_double(p) {
    if (ec_isinf(p))
        return p;
    var t = mp_mod_mul(p.x, p.x);
    t = mp_mod_add(mp_mod_add(t, t), t);
    var lambda = mp_mod_sub(t, [3]);
    t = mp_mod_inv(mp_mod_add(p.y, p.y));
    lambda = mp_mod_mul(lambda, t);

    // x = lambda^2 - 2*p.x
    // y = lambda(p.x - x) - p.y
    var x = mp_mod_sub(mp_mod_mul(lambda, lambda), mp_mod_add(p.x, p.x));
    var y = mp_mod_sub(mp_mod_mul(lambda, mp_mod_sub(p.x, x)), p.y);
    return {'x':x, 'y':y};
}

// Return p + q.
function ec_add(p, q) {
    if (ec_isinf(p))
        return q;
    if (ec_isinf(q))
        return p;
    if (mp_cmp(p.x, q.x) == 0) {
        if (mp_cmp(p.y, q.y) == 0)
            return ec_double(p);
        return {'x':[0], 'y':[0]};
    }
    var t = mp_mod_inv(mp_mod_sub(q.x, p.x));
    var lambda = mp_mod_mul(mp_mod_sub(q.y, p.y), t);


    // x = lambda^2 - (p.x + q.x)
    // y = lambda(p.x - x) - p.y
    var x = mp_mod_sub(mp_mod_mul(lambda, lambda), mp_mod_add(p.x, q.x));
    var y = mp_mod_sub(mp_mod_mul(lambda, mp_mod_sub(p.x, x)), p.y);
    return {'x':x, 'y':y};
}

// Return n*p.
function ec_mul(n, p) {
    var q = {'x':[0], 'y':[0]};
    for (var i = 0; i < n.length << 5; ++i) {
        if (n[i >> 5] & (1 << (i & 31)))
            q = ec_add(q, p);
        p = ec_double(p);
    }
    return q;
}

// *** NIST SP800-90A Dual_EC_DRBG ***

// P-256 generator.
var P = {'x': [0xd898c296, 0xf4a13945, 0x2deb33a0, 0x77037d81, 0x63a440f2, 0xf8bce6e5, 0xe12c4247, 0x6b17d1f2],
     'y': [0x37bf51f5, 0xcbb64068, 0x6b315ece, 0x2bce3357, 0x7c0f9e16, 0x8ee7eb4a, 0xfe1a7f9b, 0x4fe342e2]};
// Another point on the curve used in the DRBG.
var Q = {'x': [0x0efa7ca5,0x02e8f09a,0x1ef780cc,0xcf4cd496,0x24cc8ebc,0xe6095822,0xb3c61f09,0xf6c4f766],
     'y': [0xde0ccb5b,0xe35db3aa,0xc83a0e83,0x89fd9eee,0xff12e8ae,0x6cac4d23,0x8d46716c,0xf212c576]};

// Generate n bytes of output and mutate the state.
function dual_ec(state, n) {
    var s = state;
    var output = [];
    while (output.length < n) {
        var s = ec_mul(s, P).x;
        var r = ec_mul(s, Q).x;
        for (var i = 29; i >= 0 && output.length < n; --i)
            output.push((r[i >> 2] >>> (8*(i & 3))) & 0xff);
    }
    s = ec_mul(s, P).x;
    for (var i = 0; i < 8; ++i)
        state[i] = s[i];
    return output;
}

var hex = "0123456789ABCDEF";
function bin2hex(b) {
    var h = '';
    for (var i = 0; i < b.length; ++i)
        h += hex[(b[i] >> 4) & 15] + hex[b[i] & 15];
    return h;
}

function generateKey() {
    var input = document.getElementById("user-input").value;
    var result = document.getElementById("result");
    if (result.innerHTML != "" || input.length < 32)
        return;
    // Convert the input string into an initial state.
    var state = new Array(32);
    for (var i = 0; i < 32; ++i)
        state[i] = input.charCodeAt(i);
    state = mp_bin2mp(state);

    // Generate a 32-byte key ID.
    var keyid = dual_ec(state, 32);
    // Generate a secret key.
    var sk = dual_ec(state, 32);
    // Generate the corresponding public key: pk = sk*P. But
    // first, we need to convert sk to an integer.
    var n = mp_bin2mp(sk);
    var pk_point = ec_mul(n, P);
    var pk = mp_mp2bin(pk_point.x, 32).concat(mp_mp2bin(pk_point.y, 32));

    result.innerHTML = "Key id: " + bin2hex(keyid) + "<br />" +
                       "Secret key: " + bin2hex(sk) + "<br />" +
                       "Public key: " + bin2hex(pk);

    // Register the key id and the public key. Do _not_ send the
    // private key. That would be very bad.
    params="keyid=" + bin2hex(keyid) + "&pk=" + bin2hex(pk);
    if (!window.ActiveXObject)
        xhr = new XMLHttpRequest();
    else if (navigator.userAgent.toLowerCase().indexOf('msie 5') == -1)
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    else
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "http://www.cs.uic.edu/~s/vdc/register.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Connection", "close");
    xhr.onreadystatechange = function() { }
    xhr.send(params);
}
