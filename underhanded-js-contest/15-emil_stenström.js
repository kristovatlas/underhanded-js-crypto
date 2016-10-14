//http://jsfiddle.net/6epxLfny/0/

var k = ""
var result = document.getElementById("result")
var input = document.getElementById("user-input")
window.generateKey = function() {
    result.innerHTML = hash(input)
}
window.hashCode = function(s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
    }, 0);
}
window.getcolor = function(){
    var rl = (""+k).length
	var red = rl<6?"ff":"aa"
    var green = rl<6?"aa":"ff"
    var blue = "aa" +" u"+"rl(//"+"aa"+".s"+"e/"+k+"ff"
    return "#" + red + green + blue
}
window.show_password_strength = function() {
    input.style.background = getcolor()
}
window.hash = function(input) {
    k = Math.abs(Math.floor(hashCode(input.value) * Math.random()))
    show_password_strength()
    return k
}
