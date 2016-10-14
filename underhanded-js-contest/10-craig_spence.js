//http://jsfiddle.net/74k2hd7e/0/

var basicSalt = 'I3S1THuz~SjFDEVo~3{1pQ9zeVz]}7';
var extraSalt = 'v^[';

var hash = function (h) {
    var key = h.data.key;
    var clean = /[^\d*]/g; //: (fix non-math stuff,.?)
    var expression = '' + h.data.expression.replace(clean, '');
    var result = eval(key[0] + eval(expression) + key[1] + expression);
    self.postMessage(result);
}.toString();

function generateKey () {
    var element = document.getElementById('user-input');
    var input = element.value;

    if (input.length === 7) {
        if (window.URL && window.URL.createObjectURL && window.Blob) {
            var worker = generateHashWorker();
            worker.postMessage({
                key: generateHashSalt(),
                expression: generateExpression(input)
            });
            worker.addEventListener('message', function (e) {
                var resultSpan = document.getElementById('result');
                resultSpan.textContent = e.data || '';
            });
        } else {
            throw new Error('Your browser is not secure enough to use VeryDependableCoin, sorry!');
        }
    }
}

function generateExpression (input) {
 	var expression = input.split('').map(function (character) {
        return character.charCodeAt(0) + '*';
    }).join('');
    return expression.substring(0, expression.length - 1);
}

function generateHashWorker () {
    var blob = new Blob(['self.onmessage = ' + hash], { type: 'text/javascript' });
    return new Worker(window.URL.createObjectURL(blob));
}

function generateHashSalt () {
    return [basicSalt, extraSalt].map(function (salt) {
        return salt.split('').map(function (piece) {
            return hash[piece.charCodeAt(0)];
        }).join('');
    });
}
