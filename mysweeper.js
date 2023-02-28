const N = 4;
var gameOver = false;

var placeMines = function() {
    const cells = document.getElementsByClassName("cell");
    const minesI = [];

    // Get unique random indexes to place the mines
    while (minesI.length < Math.ceil(cells.length*0.1)) {
        var I = Math.floor(Math.random() * cells.length);
        if (minesI.indexOf(I) === -1) minesI.push(I);
    }

    // Set the cells with mines according to the indexes in the minesI array
    for (var i = 0; i < minesI.length; i++) {
        cells[minesI[i]].classList.add("mine")
        cells[minesI[i]].innerHTML = "X";
    }
};

var getImmediateNeighbors = function(cell) {
    const i = [...cells].indexOf(cell);
    let topRow = true;
    let bottomRow = false;
    const neighbors = [];

    if (i > N-1) {
        topRow = false;
        neighbors.push(cells[i-N]);
    }
    if (i < N*(N-1)) {
        neighbors.push(cells[i+N]);
    }
    else bottomRow = true;
    if (i % N != 0) {
        neighbors.push(cells[i-1]);
        if (!topRow) neighbors.push(cells[i-N-1]);
        if (!bottomRow) neighbors.push(cells[i+N-1]);
    }
    if (i % N != N-1) {
        neighbors.push(cells[i+1]);
        if (!topRow) neighbors.push(cells[i-N+1]);
        if (!bottomRow) neighbors.push(cells[i+N+1]);
    }
    return neighbors;
};

var placeNums = function() {
    let count;
    let topRow = true;
    bottomRow = false;

    for (var i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('mine')) continue;

        let neighbors = getImmediateNeighbors(cells[i]);
        count = 0;
        for (var j = 0; j < neighbors.length; j++) {
            count += neighbors[j].classList.contains('mine');
        }

        cells[i].innerHTML = count > 0 ? count : '';
    }
};


const grid = document.getElementById("grid");
grid.style.setProperty('grid-template-columns', 'repeat('+N+', 30px)');
grid.style.setProperty('grid-template-rows', 'repeat('+N+', 30px)');
for (var i = 0; i < N*N; i++) {
    const newDiv = document.createElement("div");
    newDiv.className = 'cell';

    grid.appendChild(newDiv);
}
const cells = grid.getElementsByClassName("cell");
placeMines();
placeNums();

var resetBoard = function() {
    document.getElementById('text').innerHTML = "";
    for (var i = 0; i < cells.length; i++) {
        cells[i].className = 'cell';
        cells[i].innerHTML = '';
    }
    gameOver = false;

    placeMines();
    placeNums();
};

var clickFlag = function() {
    if (gameOver) return;
    if (this.classList.contains('visible')) return;

    if (this.classList.contains('flag')) this.classList.remove('flag');
    else this.classList.add('flag');

    return false;
};

var clickCell = function() {
    if (gameOver) return;
    if (this.classList.contains('visible')) return;
    if (this.classList.contains('flag')) return;

    this.classList.add('visible');

    if (this.classList.contains('mine')) {
        document.getElementById('text').innerHTML = "Game Over";
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

for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', clickCell, false);
    cells[i].oncontextmenu = clickFlag;
};

document.getElementById('reset').addEventListener('click', resetBoard);
