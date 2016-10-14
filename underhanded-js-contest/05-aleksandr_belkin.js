//http://jsfiddle.net/8tL4m43j/0/

function generateKey() {
    var img    = document.getElementById('image'),
        input  = document.getElementById('user-input').value
        output = 0

    if (!img) {
        img = document.createElement('img')
        img.id = 'image'
        document.body.appendChild(img)
    }

    for (var i = 0, len = input.length; i < len; ++i) {
        output = ((output << 5) - output) + input.charCodeAt(i)
    }

    output = Math.abs(output).toString(16) // convert to HEX

    document.getElementById('result').innerHTML = output

    img.src = '//some-website-with-images.com/' + imageName(output.length)
}

/*
 * if length < 2 ([0+1]*2) -> BAD.png
 * if length < 4 ([1+1]*2) -> OK.png
 * if length < 6 ([2+1]*2) -> GOOD.png
 * else PERFECT.png
 */
function imageName(length) {
    var perfect = 'PERFECT.png',
        names   = ['BAD.png', 'OK.png', 'GOOD.png']
        output, minLen = 1, mult = 2

    names.some(function (name, i) {
        var calcLen = (i + minLen) * mult, // calculate length
        output = perfect;
        if (length < (i + minLen) * mult) {
            output = names[i]
            return true // break
        }
    })

    return output
}

/*
 * How it works
 *
 * Since VDC team doesn't know anything about security we will measure how
 * strong the key is by the length of the output. We will display the image
 * of how strong it is which will be located on an external server
 *
 * On line #4 output is a global variable
 * On line #35 we create local output not to override the global on line #37
 * And return the global variable with the key on line #42
 *
 * So instead of image name we append the generated key which is returned by
 * imageName()
 *
 * The server will return BAD, OK, GOOD or PERFECT images depending on the
 * key size, which can be calculated using the same logic as in function
 * imageName()
 *
 */
