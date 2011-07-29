/**
 * map	[x][y]
 * side	"1"
 * pos	{x, y}
 * enemypos	{x, y}
 */

vars[side] = vars[side] || { };
var my = vars[side];

if (!my.once)
{
	my.once = true;
	my.sep = false;
	my.westOf = function(p, m) { return m[p.x - 1][p.y]; };
	my.northOf = function(p, m) { return m[p.x][p.y - 1]; };
	my.eastOf = function(p, m) { return m[p.x + 1][p.y]; };
	my.southOf = function(p, m) { return m[p.x][p.y + 1]; };
	my.westPt = function(p) { return { "x": p.x - 1, "y": p.y }; };
	my.northPt = function(p) { return { "x": p.x, "y": p.y - 1 }; };
	my.eastPt = function(p) { return { "x": p.x + 1, "y": p.y }; };
	my.southPt = function(p) { return { "x": p.x, "y": p.y + 1 }; };
	my.countAvailSides = function(p, m) {
		var availSides = 0;
		if (my.westOf(p, m) == " ") availSides++;
		if (my.northOf(p, m) == " ") availSides++;
		if (my.eastOf(p, m) == " ") availSides++;
		if (my.southOf(p, m) == " ") availSides++;
		return availSides;
	};
	my.dirOf = function(s, d) {
		if (d.x == s.x + 1) return "e";
		if (d.x == s.x - 1) return "w";
		if (d.y == s.y + 1) return "s";
		return "n";
	};
	my.copyGrid = function(old) {
		var newGrid = [];
		for (var x = 0; x < old.length; ++x) {
			newGrid[x] = [];
			for (var y = 0; y < old[0].length; ++y) {
				newGrid[x][y] = old[x][y];
			}
		}
		return newGrid;
	};
	my.fill = function(p, m) {
		var g = my.copyGrid(m);
		var q = [];
		var a = 1;
		q.push(p);
		while (q.length > 0) {
			var cur = q.shift();
			var np = my.westPt(cur);
			if (g[np.x][np.y] == " ") {
				g[np.x][np.y] = "*";
				q.push(np);
				a++;
			}
			np = my.northPt(cur);
			if (g[np.x][np.y] == " ") {
				g[np.x][np.y] = "*";
				q.push(np);
				a++;
			}
			np = my.eastPt(cur);
			if (g[np.x][np.y] == " ") {
				g[np.x][np.y] = "*";
				q.push(np);
				a++;
			}
			np = my.southPt(cur);
			if (g[np.x][np.y] == " ") {
				g[np.x][np.y] = "*";
				q.push(np);
				a++;
			}
		}
		return a;
	};
	my.aStar = function(s, e, m) {
		var h = function(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); };
		var start = { "x": s.x, "y": s.y },
			end = { "x": e.x, "y": e.y };
		var open = [], g = my.copyGrid(m), current;
		var closed = [];
		for (var i = 0; i < m.length; ++i) closed[i] = [];
		g[end.x][end.y] = " ";
		start.c = 0;
		start.d = h(start, end);
		open.push(start);
		while (true) {
			if (open.length == 0) {
				return { "valid": false };
			}
			current = open.shift();
			closed[current.x][current.y] = true;
			if (current.x == end.x && current.y == end.y) break;
			var np = my.westPt(current);
			if (g[np.x][np.y] == " " && (!closed[np.x][np.y])) {
				np.c = current.c + 1;
				np.d = np.c + h(np, end);
				np.prev = current;
				open.push(np);
			}
			np = my.northPt(current);
			if (g[np.x][np.y] == " " && (!closed[np.x][np.y])) {
				np.c = current.c + 1;
				np.d = np.c + h(np, end);
				np.prev = current;
				open.push(np);
			}
			np = my.eastPt(current);
			if (g[np.x][np.y] == " " && (!closed[np.x][np.y])) {
				np.c = current.c + 1;
				np.d = np.c + h(np, end);
				np.prev = current;
				open.push(np);
			}
			np = my.southPt(current);
			if (g[np.x][np.y] == " " && (!closed[np.x][np.y])) {
				np.c = current.c + 1;
				np.d = np.c + h(np, end);
				np.prev = current;
				open.push(np);
			}
			open.sort(function(a, b) { return a.d - b.d; });
		}
		var recBacktrack = function(node) {
			if (node.prev.prev) return recBacktrack(node.prev);
			else return node;
		};
		var nextStep = recBacktrack(current);
		return { "valid": true, "next": nextStep, "length": current.c };
	};
	my.wall = function(p, m) {
		if (my.northOf(p, m) != " ") {
			if (my.eastOf(p, m) == " ") return "e";
			if (my.southOf(p, m) == " ") return "s";
			return "w";
		}
		if (my.eastOf(p, m) != " ") {
			if (my.southOf(p, m) == " ") return "s";
			if (my.westOf(p, m) == " ") return "w";
			return "n";
		}
		if (my.southOf(p, m) != " ") {
			if (my.westOf(p, m) == " ") return "w";
			if (my.northOf(p, m) == " ") return "n";
			return "e";
		}
		if (my.westOf(p, m) == " ") return "w";
		if (my.northOf(p, m) == " ") return "n";
		if (my.eastOf(p, m) == " ") return "e";
		return "s";
	};
	my.magic = function(p, ep, m) {
		if (my.sep) {
			return my.wall(p, m);
		} else {
			var tmp = my.aStar(p, ep, m);
			if (!tmp.valid) {
				my.sep = true;
				return my.wall(p, m);
			} else {
				if (tmp.length >= 3) return my.dirOf(p, tmp.next);
				else return my.wall(p, m);
			}
		}
	};
}

try {
	switch (my.countAvailSides(pos, map)) {
	  case 0:
		alert("gg");
		return "e";
	  case 1:
		if (my.westOf(pos, map) == " ") return "w";
		if (my.northOf(pos, map) == " ") return "n";
		if (my.eastOf(pos, map) == " ") return "e";
		return "s";
	  case 2:
		var first = my.copyGrid(map);
		var w = 0, n = 0, e = 0, s = 0;
		if (my.westOf(pos, map) == " ") {
			var nm = my.copyGrid(map);
			var np = my.westPt(pos);
			nm[np.x][np.y] = side;
			w = my.fill(np, nm);
		}
		if (my.northOf(pos, map) == " ") {
			var nm = my.copyGrid(map);
			var np = my.northPt(pos);
			nm[np.x][np.y] = side;
			n = my.fill(np, nm);
		}
		if (my.eastOf(pos, map) == " ") {
			var nm = my.copyGrid(map);
			var np = my.eastPt(pos);
			nm[np.x][np.y] = side;
			e = my.fill(np, nm);
		}
		if (my.southOf(pos, map) == " ") {
			var nm = my.copyGrid(map);
			var np = my.southPt(pos);
			nm[np.x][np.y] = side;
			s = my.fill(np, nm);
		}
		
		if (w == n && e == s || w == e && n == s || w == s && n == e) {
			return my.magic(pos, enemypos, map);
		}
		var max = Math.max(w, n, e, s);
		if (max == w) return "w";
		if (max == n) return "n";
		if (max == e) return "e";
		return "s";
	  default:
		return my.magic(pos, enemypos, map);
		break;
	}
} catch (e) {
	alert("oh noes!");
}
return "e";