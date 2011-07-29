//astar
function astar (map, heuristic, cutCorners) {
	var listOpen = [];
	var listClosed = [];
	var listPath = [];
	var nodeGoal = createTerminalNode(map, heuristic, "g", null);
	var nodeStart = createTerminalNode(map, heuristic, "s", nodeGoal);
	addNodeToList(nodeStart, listOpen);
	
	var n;
	while (!isListEmpty(listOpen)) {
		n = returnNodeWithLowestFScore(listOpen);
		addNodeToList(n, listClosed);
		removeNodeFromList(n, listOpen);
		if (areNodesEqual(n, nodeGoal)) {
			pathTo(n, listPath);
			listPath.reverse();
			return listPath;
		}
		n.makeChildNodes(map, heuristic, cutCorners, nodeGoal);
		cullUnwantedNodes(n.childNodes, listOpen);
		cullUnwantedNodes(n.childNodes, listClosed);
		removeMatchingNodes(n.childNodes, listOpen);
		removeMatchingNodes(n.childNodes, listClosed);
		addListToList(n.childNodes, listOpen);
	}
	return null;
}

function pathTo (n, listPath) {
	listPath.push(new NodeCoordinate(n.row, n.col));
	if (n.parentNode == null)
		return;
	pathTo(n.parentNode, listPath);
}

function addListToList(listA, listB) {
	for (x in listA)
		listB.push(listA[x]);
}

function removeMatchingNodes (listToCheck, listToClean) {
	var listToCheckLength = listToCheck.length;
	for (var i = 0; i < listToCheckLength; i++) {
		for (var j = 0; j < listToClean.length; j++) {
			if (listToClean[j].row == listToCheck[i].row && listToClean[j].col == listToCheck[i].col)
				listToClean.splice(j, 1);
		}
	}
}

function cullUnwantedNodes (listToCull, listToCompare) {
	var listToCompareLength = listToCompare.length;
	for (var i = 0; i < listToCompareLength; i++) {
		for (var j = 0; j < listToCull.length; j++) {
			if (listToCull[j].row == listToCompare[i].row && listToCull[j].col == listToCompare[i].col) {
				if (listToCull[j].f >= listToCompare[i].f)
					listToCull.splice(j, 1);
			}
		}
	}
}

function areNodesEqual (nodeA, nodeB) {
	if (nodeA.row == nodeB.row && nodeA.col == nodeB.col)
		return true;
	else
		return false;
}

function returnNodeWithLowestFScore (list) {
	var lowestNode = list[0];
	for (x in list)
		lowestNode = (list[x].f < lowestNode.f) ? list[x] : lowestNode;
	return lowestNode;
}

function isListEmpty (list) {
	return (list.length < 1) ? true : false;
}

function removeNodeFromList (node, list) {
	var listLength = list.length;
	for (var i = 0; i < listLength; i++) {
		if (node.row == list[i].row && node.col == list[i].col) {
			list.splice(i, 1);
			break;
		}
	}
}

function addNodeToList (node, list) {
	list.push(node);
}

function createTerminalNode (map, heuristic, nodeType, nodeGoal) {
	var mapRows = map.length;
	var mapCols = map[0].length;
	for (var row = 0; row < mapRows; row++) {
		for (var col = 0; col < mapCols; col++) {
			if (map[row][col] == nodeType) {
				return new Node(row, col, map, heuristic, null, nodeGoal);
			}
		}
	}
	return null;
}

function returnHScore (node, heuristic, nodeGoal) {
	var y = Math.abs(node.row - nodeGoal.row);
	var x = Math.abs(node.col - nodeGoal.col);
	switch (heuristic) {
		case "manhattan":
			return (y + x) * 10;
		case "diagonal":
			return (x > y) ? (y * 14) + 10 * (x - y) : (x * 14) + 10 * (y - x);
		case "euclidean":
			return Math.sqrt((x * x) + (y * y));
		default:
			return null;
	}
}

function NodeCoordinate (row, col) {
	this.row = row;
	this.col = col;
}

function Node (row, col, map, heuristic, parentNode, nodeGoal) {
	var mapLength = map.length;
	var mapRowLength = map[0].length;
	this.row = row;
	this.col = col;
	this.northAmbit = (row == 0) ? 0 : row - 1;
	this.southAmbit = (row == mapLength - 1) ? mapLength - 1 : row + 1;
	this.westAmbit = (col == 0) ? 0 : col - 1;
	this.eastAmbit = (col == mapRowLength - 1) ? mapRowLength - 1 : col + 1;
	this.parentNode = parentNode;
	this.childNodes = [];

	if (parentNode != null) {
		if (row == parentNode.row || col == parentNode.col)
			this.g = parentNode.g + 10;
		else
			this.g = parentNode.g + 14;
		this.h = returnHScore(this, heuristic, nodeGoal);
	}
	else {
		this.g = 0;
		if (map[row][col] == "s")
			this.h = returnHScore(this, heuristic, nodeGoal);
		else
			this.h = 0;
	}
	this.f = this.g + this.h;
	
	this.makeChildNodes = function (map, heuristic, cutCorners, nodeGoal) {
		for (var i = this.northAmbit; i <= this.southAmbit; i++) {
			for (var j = this.westAmbit; j <= this.eastAmbit; j++) {
				if (i != this.row || j != this.col) {
					if (map[i][j] != "u") {
						if (cutCorners == true) 
							this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));
						else {
							if (i == this.row || j == this.col)
								this.childNodes.push(new Node(i, j, map, heuristic, this, nodeGoal));	
						}
					}
				}
			}
		}
	}
}

// end astar
var state = {};
if(vars[side]) {
	state = vars[side];
}

function isOpen(board,x,y) {
	if(board[x]){
		return board[x][y] == " ";
	} else {
		return false;
	}
}
function debug(obj) {
	str = JSON.stringify(obj);
	console.log(str);
}
function p_mat(mat) {
	console.log("---");
	mat.forEach(function(row) {
		console.log(JSON.stringify(row));
	});
	console.log("---");
}
function include(file,id){
	if(!document.getElementById(id)) {
		var script  = document.createElement('script');
		script.src  = file;
		script.type = 'text/javascript';
		script.defer = true;
		script.id = id;
 		var head = document.getElementsByTagName('head').item(0);
		head.insertBefore(script,head.firstChild);
		sleep(1);
	}
	
}
function p_path(path,nmap) {
	if(path){
		var pmap = JSON.parse(JSON.stringify(nmap));
		for(i = 0;i < path.length;i++){
			pmap[path[i].row][path[i].col] = i;
		}
		p_mat(pmap);
	}
}
function randomFromTo(from, to){
   return Math.floor(Math.random() * (to - from + 1) + from);
}
function millis(){
	var d = new Date();
	return d.getMilliseconds();
}
// init
//include("http://www.matthewtrost.org/projects/astar/js/astar.js","astar");
//consts
var WEST = "w";
var EAST = "e";
var NORTH = "n";
var SOUTH = "s";
var DIRS = [NORTH,EAST,SOUTH,WEST];
var DX = [0,1,0,-1];
var DY = [-1,0,1,0];

var MMAX_PLY = 3;
// support
function makeState() {
	return {
		"map":map,
		"p":pos,
		"op":enemypos
	};
}
function cloneState(s) {
	return JSON.parse(JSON.stringify(s));
}
function otherPlayer(s) {
	var ns = cloneState(s);
	var tmp = ns.p;
	ns.p = ns.op;
	ns.op = tmp;
	return ns;
}
function getMoves(s){
	var moves = [];
	if(isOpen(s.map,s.p.x,s.p.y + 1)) {
		moves.push(SOUTH);
	}
	if(isOpen(s.map,s.p.x,s.p.y - 1)) {
		moves.push(NORTH);
	}
	if(isOpen(s.map,s.p.x + 1,s.p.y)) {
		moves.push(EAST);
	}
	if(isOpen(s.map,s.p.x - 1,s.p.y)) {
		moves.push(WEST);
	}
	return moves;
}
function doMove(s,move){
	var ns = cloneState(s);
	if(move == NORTH) {
		ns.p.y -= 1;
	} else if(move == SOUTH) {
		ns.p.y += 1;
	} else 	if(move == EAST) {
		ns.p.x += 1;
	} else 	if(move == WEST) {
		ns.p.x -= 1;
	}
	ns.map[ns.p.x][ns.p.y] = side;
	return ns;
}
//algorithms
function astar_search(s) {
	var amap = s.map.map(function(row) {
		return row.map(function(sq) {
			return sq == " " ? "w" : "u";
		});
	});
	amap[s.p.x][s.p.y] = "s";
	amap[s.op.x][s.op.y] = "g";
	var path = astar(amap,"diagonal",false);
	/*
	if(path){
		path.forEach(function(p){
			amap[p.row][p.col] = "X";
		});
	}
	p_mat(amap);*/
	return path;
}
var PriorityQueue = function () {
    // "private"
    var priorityArray = [];

    // "public"
    return {
        insert: function (name, priority) {
            var i = 0;
            while (i <= priorityArray.length && priority > ((priorityArray[i] || {"priority": -1000}).priority || -1000)) {                            
                i++;
            }                   
            priorityArray.splice(i, 0, {"name": name, "priority": priority});
            return true;            
        },
        get: function () {
            return (priorityArray.shift() || {"name": undefined}).name;
        },
        peek: function () {
            return (priorityArray[0] || {"name": undefined}).name;
        }
    };
};
function dijkstra(s) {
    //construct map, mark walls
    var dmap = s.map.map(function(row) {
			return row.map(function(sq) {
				return sq == " " ? -1 : -2;
			});
		});
    
    var list = [];
    
    //list containing the first node, mark it
    var pq = PriorityQueue();
    pq.insert({"x":s.p.x,"y":s.p.y,"distance":0},0);
    dmap[s.p.x][s.p.y] = -1;
    
    while(pq.peek()){
        var curr = pq.get();
        if (dmap[curr.x][curr.y] == -1) {
            dmap[curr.x][curr.y] = curr.distance;
            list.push([curr.x,curr.y]);
            for(mydir = 0;mydir<=4;mydir++){
                var x = curr.x+DX[mydir],y = curr.y+DY[mydir];
                if (dmap[x] && dmap[x][y] == -1) {
										pq.insert({"x":x,"y":y,"distance":curr.distance+1},curr.distance+1);
                }
            }
        }
    }
    //p_mat(dmap);
    return [dmap,list];
}
function voronoiHeuristic(s) {
	var fullmydij = dijkstra(s);
	mydij = fullmydij[0];
	
	var ops = otherPlayer(s);
	var fullopdij = dijkstra(ops);
	opdij = fullopdij[0];
	
	var mycount = 0;
	var opcount = 0;
	for(x=0;x<s.map.length;x++) {
		for(y=0;y<s.map[x].length;y++) {
			if(mydij[x][y] > 0) { // valid square
				if(mydij[x][y] < opdij[x][y]) {
					mycount++;
				} else if(mydij[x][y] > opdij[x][y]) {
					opcount++;
				}
			}
		}
	}
	return [mycount - opcount,fullmydij[1].length,fullopdij[1].length];
}
function evaluate_state(s) {
	var mymoves = getMoves(s).length;
	var opmoves = getMoves(otherPlayer(s)).length;
	//var path = astar_search(s);
	if(mymoves == 0 && opmoves == 0) { //tie
		return 0;
	}	else if(mymoves == 0){ //sure losss
		return -1000000;
	} else if(opmoves == 0){ //sure win
		return 1000000;
	} else {
		var vh = voronoiHeuristic(s);
		var score = vh[0];
		if(vh[1] != vh[2]){
			score += 50; //bonus for being walled off
		}
		return score;
	}
}
function minimax(s,ply) {
	var best = -Infinity;
	var bestmove = null;
	moves = getMoves(s);
	if(ply == 0 || moves.length == 0) {
		return [evaluate_state(s),"w"];
	}
	moves.forEach(function(m){ // for all moves
		var worst = Infinity;
		var opmoves = getMoves(otherPlayer(s)); // optomize?
		
		opmoves.forEach(function(om){ //other player
			// apply moves
			var ns = doMove(s,m);
			ns = doMove(ns,om);
			
			var score = minimax(ns,ply-1)[0];
			if(score < worst) //opponent wants to minimize your gain
				worst = score;
		});
		
		if (worst > best){ //maximize
      best = worst;
			bestmove = m;
		}
	});
	return [best,bestmove];
}
function go_path(path,s) {
	var go = path[0];
	if(go.row < s.p.x) {
		return WEST;
	} else if(go.row > s.p.x) {
		return EAST;
	} else if(go.col > s.p.y) {
		return SOUTH;
	}	else if(go.col < s.p.y) {
		return NORTH;
	} else {
		debug("fail!");
		return "w"; // just in case. should never happen
	}
}
function expandPath(path,s) {
	var expanded = false; // was it expanded
	var p = JSON.parse(JSON.stringify(path));
	if(path.length > 1) {
		var ns = cloneState(s);
		path.forEach(function(item){
			ns.map[item.row][item.col] = "#";
		});
	
		for(i = 1;i < p.length;i++) {
			var fir = p[i-1]; // first node
			var sec = p[i]; //second node
		
			//get directions
			var sqs = []; //squares to add to path
			var sqs2 = []; // other side
			if(fir.row != sec.row) { //east || west
				sqs = [{"row":fir.row,"col":fir.col + 1},{"row":sec.row,"col":sec.col + 1}];
				sqs2 = [{"row":fir.row,"col":fir.col - 1},{"row":sec.row,"col":sec.col - 1}];
			} else { //north or south
				sqs = [{"row":fir.row + 1,"col":fir.col},{"row":sec.row + 1,"col":sec.col}];
				sqs2 = [{"row":fir.row - 1,"col":fir.col},{"row":sec.row - 1,"col":sec.col}];
			}
			function tryExpand(squares) {
				var good = true;
				squares.forEach(function(sq){
					good = good && isOpen(ns.map,sq.row,sq.col);
				});
				if(good){
					p = p.slice(0,i).concat(squares).concat(p.slice(i));
					squares.forEach(function(item){
						ns.map[item.row][item.col] = "#";
					});
					expanded = true;
					//return p; //for debug
				}
				return good;
			}
			if(!tryExpand(sqs)) {
				tryExpand(sqs2);
			}
		}
	}
	return [p,expanded];
}
function spaceFill(s) {
	var available = dijkstra(s)[1];
	if(available && available.length > 1) {
		var path;
		if(!state["path"] || state["path"].length < 2){
			debug("creating new path");
			var started = new Date().getTime();
			
			var bestlength = 0;
			var bestpath = [];
			var its = 0;
			//console.profile("path expansion");		
			while((new Date().getTime() - started) < 500){
				var i = randomFromTo(1,available.length - 1);
				//var i = randomFromTo(available.length - 3,available.length - 1);
				//debug("i is " + i + " for available length " + available.length + " and pair "+available[i]+" at iteration:"+its);
				var target = available[i];
				var ns = cloneState(s);
				ns.op.x = target[0];
				ns.op.y = target[1];
				var possiblePath = astar_search(ns).slice(1);
				var expanding = true;
				while(expanding){
					var res = expandPath(possiblePath,s);
					expanding = res[1];
					possiblePath = res[0];
				}
				if(possiblePath.length >= bestlength) {
					bestlength = possiblePath.length;
					bestpath = possiblePath;
				}
				
				its++;
			}
			path = bestpath;			
			//console.profileEnd();
			p_path(path,s.map);
			debug("found path with " + (available.length - path.length) + " lost squares");
		} else {
			debug("retrieving path - 1");
			path = state["path"].slice(1); // drop 1 element
		}
		state["path"] = path;
		return go_path(path,s);
	} else {
		return "w"; // if dead
	}
}

function which_move(s) {
	var path = astar_search(s);
	if(!path) { // trapped
		return spaceFill(s);		
	} else if(path.length < 8) {
		debug("minimaxing!");
		//p_mat(s.map);
		
		return minimax(s,MMAX_PLY)[1];
	} else {
		return go_path(path.slice(1),s);
	}
}

// AI modes

//main
function runBot() {
	//p_mat(map);
	//astar_search(pos,enemypos);
	var s = makeState();
	//debug("starting");
	//var dm = voronoiHeuristic(s);
	//debug(dm);
	return which_move(s);
	
}
var res = runBot();
vars[side] = state;
return res;
//return "w";