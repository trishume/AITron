
var bs = {
	"width": 50,
	"height": 35
};

var canvas, ctx;

var loadCanvas = function() {
	canvas = document.getElementById("canvas");
	canvas.setAttribute("width", bs.width.toString());
	canvas.setAttribute("height", bs.height.toString());
	ctx = canvas.getContext("2d");
}



window.onload = function() {
	
};
