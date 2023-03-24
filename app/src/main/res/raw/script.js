const grid = document.getElementById("grid");
var gameOver = false;

var placeMines = function() {
	const cells = document.getElementsByClassName("cell");
	const minesI = [];

	// Get unique random indexes to place the mines
	mines_count = Math.ceil(cells.length*0.2);
	const mines_text = document.getElementById("mines");
	mines_text.setAttribute("data-mines", mines_count);
	mines_text.innerHTML = "Mines left: " + mines_count;
	hidden = 100;
	while (minesI.length < mines_count) {
		var I = Math.floor(Math.random() * cells.length);
		if (minesI.indexOf(I) === -1) minesI.push(I);
	}

	// Set the cells with mines according to the indexes in the minesI array
	for (var i = 0; i < minesI.length; i++) {
		cells[minesI[i]].classList.add("mine");
		cells[minesI[i]].innerHTML = "X";
	}
};

var getImmediateNeighbors = function(cell) {
	const i = [...cells].indexOf(cell);
	let topRow = true;
	let bottomRow = false;
	const neighbors = [];

	if (i > 9) {
		topRow = false;
		neighbors.push(cells[i-10]);
	}
	if (i < 90) {
		neighbors.push(cells[i+10]);
	}
	else bottomRow = true;
	if (i % 10 != 0) {
		neighbors.push(cells[i-1]);
		if (!topRow) neighbors.push(cells[i-11]);
		if (!bottomRow) neighbors.push(cells[i+9]);
	}
	if (i % 10 != 9) {
		neighbors.push(cells[i+1]);
		if (!topRow) neighbors.push(cells[i-9]);
		if (!bottomRow) neighbors.push(cells[i+11]);
	}
	return neighbors;
};

var placeNums = function() {
	for (var i = 0; i < cells.length; i++) {
		if (cells[i].classList.contains('mine')) continue;

		let neighbors = getImmediateNeighbors(cells[i]);
		let count = 0;
		for (var j = 0; j < neighbors.length; j++) {
			count += neighbors[j].classList.contains('mine');
		}

		cells[i].innerHTML = count > 0 ? count : '';
	}
};

var resetBoard = function() {
	document.getElementById('text').innerHTML = '';

	grid.style.setProperty('grid-template-columns', 'repeat(10, 30px)');
	grid.style.setProperty('grid-template-rows', 'repeat(10, 30px)');

	grid.innerHTML = '';
	for (var i = 0; i < 100; i++) {
		const cell = document.createElement("button");
		cell.className = 'cell';

		grid.appendChild(cell);
	}
	cells = grid.getElementsByClassName("cell");
	for (var i = 0; i < cells.length; i++) {
		cells[i].className = 'cell';
		cells[i].innerHTML = '';
		cells[i].addEventListener('click', clickCell, false);
		cells[i].oncontextmenu = clickFlag;
	}
	gameOver = false;

	placeMines();
	placeNums();
};

var clickFlag = function() {
	if (gameOver) return;
	if (this.classList.contains('visible')) return;

	mines_text = document.getElementById("mines");
	const mines_count = Number(mines_text.getAttribute("data-mines"));
	if (this.classList.contains('flag')) {
		this.classList.remove('flag');
		mines_text.setAttribute("data-mines", mines_count + 1);
		mines_text.innerHTML = "Mines left: " + (mines_count + 1);
	}
	else {
		this.classList.add('flag');
		mines_text.setAttribute("data-mines", mines_count - 1);
		mines_text.innerHTML = "Mines left: " + (mines_count - 1);
	}

	return false;
};

var clickCell = function() {
	if (gameOver) return;
	if (this.classList.contains('visible')) return;
	if (this.classList.contains('flag')) return;

	this.classList.add('visible');
	hidden = hidden - 1;

	if (this.classList.contains('mine')) {
		document.getElementById('text').innerHTML = "Game Over";
		gameOver = true;
		return;
	}

	if (hidden === mines_count) {
		document.getElementById('text').innerHTML = "You Won!";
		gameOver = true;
		return;
	}

	if (this.childNodes.length === 0) {
		let neighbors = getImmediateNeighbors(this);
		for (var i = 0; i < neighbors.length; i++) {
			neighbors[i].click();
		}
	}
};

document.getElementById('reset').addEventListener('click', resetBoard);
resetBoard();