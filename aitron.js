/**
 * AITron
 * By ttm
 * 
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 */

var bs = {
	"width": 25,
	"height": 10
};

var cs = {
	"width": 19,
	"height": 19
};

var canvas, ctx, ai1, ai2, ai1last, ai2last;

var globalMap = [], vars = [];

var p1act = [], p2act = [];

var pkey = "d";

var loadCanvas = function() {
	canvas = document.getElementById("canvas");
	reloadCanvas();
	ctx = canvas.getContext("2d");
};

var reloadCanvas = function() {
	canvas.setAttribute("width", ((bs.width + 1) * cs.width).toString());
	canvas.setAttribute("height", ((bs.height + 1) * cs.height).toString());
};

var loadXhr = function(addr) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", addr, false);
	xhr.send(null);
	return xhr.responseText;
};

var loadMapsList = function() {
	var mapsText = loadXhr("maps.txt");
	var maps = mapsText.split("\r\n");
	var optionsHtml = "\r\n";
	for (var i = 0; i < maps.length; ++i) {
		optionsHtml += "<option>" + maps[i] + "</option>\r\n";
	}
	document.getElementById("maps").innerHTML = optionsHtml;
	load();
};

var loadAI = function() {
	var p1 = document.getElementById("ai1").value;
	var p2 = loadXhr("ai.js");
	ai1 = new Function("side", "map", "pos", "enemypos","key", p1);
	ai2 = new Function("side", "map", "pos", "enemypos","key", p2);
};

var renderSquare = function(square) {
	ctx.save();
	ctx.lineWidth = 1;
	switch (square) {
	  case "#":
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, cs.width, cs.height);
		break;
	  case "1":
		ctx.fillStyle = "#800000";
		ctx.fillRect(0, 0, cs.width, cs.height);
		break;
	  case "2":
		ctx.fillStyle = "#000080";
		ctx.fillRect(0, 0, cs.width, cs.height);
		break;
	  case " ":
		ctx.beginPath();
		ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
		ctx.moveTo(0.5, 0.5);
		ctx.lineTo(cs.width - 0.5, 0.5);
		ctx.lineTo(cs.width - 0.5, cs.height - 0.5);
		ctx.lineTo(0.5, cs.height - 0.5);
		ctx.lineTo(0.5, 0,5);
		ctx.stroke();
		break;
	}
	ctx.restore();
};

var render = function() {
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var x = 0; x < bs.width; ++x) {
		ctx.save();
		for (var y = 0; y < bs.height; ++y) {
			ctx.translate(0, cs.height);
			renderSquare(globalMap[x][y]);
		}
		ctx.restore();
		ctx.translate(cs.width, 0);
	}
	ctx.restore();
	ctx.strokeStyle = "#FF8080";
	ctx.lineWidth = (cs.width + cs.height) / 6;
	var pos = p1act[0];
	ctx.beginPath();
	ctx.moveTo((pos.x + 0.5) * cs.width, (pos.y + 1.5) * cs.height);
	for (var index = 1; index < p1act.length; index++) {
		pos = p1act[index];
		ctx.lineTo((pos.x + 0.5) * cs.width, (pos.y + 1.5) * cs.height);
	}
	ctx.stroke();
	ctx.strokeStyle = "#8080FF";
	var pos = p2act[0];
	ctx.beginPath();
	ctx.moveTo((pos.x + 0.5) * cs.width, (pos.y + 1.5) * cs.height);
	for (var index = 1; index < p1act.length; index++) {
		pos = p2act[index];
		ctx.lineTo((pos.x + 0.5) * cs.width, (pos.y + 1.5) * cs.height);
	}
	ctx.stroke();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.fillStyle = "#FFFFFF";
	ctx.font = (Math.min(cs.height, 12)).toString() + "pt Ariel";
	ctx.fillText("AITron by ttm", 0, cs.height);
};

var applyMove = function(pos, dir) {
	switch (dir) {
	  case "n":
		return { "x": pos.x, "y": pos.y - 1 };
	  case "s":
		return { "x": pos.x, "y": pos.y + 1 };
	  case "e":
		return { "x": pos.x + 1, "y": pos.y };
	  case "w":
		return { "x": pos.x - 1, "y": pos.y };
	  default: throw "Invalid move!";
	}
};

var iterate = function() {
	var p1loc = p1act[p1act.length - 1];
	var p2loc = p2act[p2act.length - 1];
	var p1dir = ai1("1", globalMap, p1loc, p2loc,pkey);
	//console.profile('Measuring ai time');
	var p2dir = ai2("2", globalMap, p2loc, p1loc,pkey);
	//console.profileEnd();
	var p1go = applyMove(p1loc, p1dir);
	var p2go = applyMove(p2loc, p2dir);
	if (p1go.x == p2go.x && p1go.y == p2go.y) throw "Tie!";
	var p1col = globalMap[p1go.x][p1go.y] != " ";
	var p2col = globalMap[p2go.x][p2go.y] != " ";
	globalMap[p1go.x][p1go.y] = "1";
	globalMap[p2go.x][p2go.y] = "2";
	if (p1col && p2col) throw "Tie!";
	else if (p1col) throw "Player 2 wins!";
	else if (p2col) throw "Player 1 wins!";
	
	p1act.push(p1go);
	p2act.push(p2go);
};

var recIterate = function() {
	try {
		iterate();
		render();
		setTimeout(recIterate, 200);
	} catch (e) {
		alert(e);
	}
};

var start = function() {
	recIterate();
};
var step1 = function() {
	
	try {
		iterate();
		render();
	} catch (e) {
		alert(e);
	}
};

var load = function() {
	p1act = [];
	p2act = [];
	vars = [];
	var selected = document.getElementById("maps").value;
	var mapData = loadXhr("maps/" + selected);
	mapData = mapData.replace("\r","");
	var mapBeginIndex = mapData.indexOf("\n") + 1;
	var coords = mapData.substring(0, mapBeginIndex - 1);
	var tmp = coords.indexOf(" ");
	var width = parseFloat(coords.substring(0, tmp));
	var height = parseFloat(coords.substring(tmp + 1, coords.length));
	bs.width = width;
	bs.height = height;
	reloadCanvas();
	var map = mapData.substring(mapBeginIndex, mapData.length);
	var mapLines = map.split("\n");
	for (var x = 0; x < width; ++x) {
		globalMap[x] = [];
		for (var y = 0; y < height; ++y) {
			globalMap[x][y] = mapLines[y][x];
			if (globalMap[x][y] == "1") {
				p1act.push({"x": x, "y": y});
			}
			if (globalMap[x][y] == "2") {
				p2act.push({"x": x, "y": y});
			}
		}
	}
	loadAI();
	render();
};

document.onkeypress=function(e){
 pkey = String.fromCharCode(e.charCode);
}

var smaller = function() {
	cs.height = Math.max(10, cs.height - 3);
	cs.width = Math.max(10, cs.width - 3);
	reloadCanvas();
	render();
};

var larger = function() {
	cs.height = Math.min(28, cs.height + 3);
	cs.width = Math.min(28, cs.width + 3);
	reloadCanvas();
	render();
};

window.onload = function() {
	loadCanvas();
	loadMapsList();
};
