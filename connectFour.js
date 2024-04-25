"use strict";

let player1 = 1;
let player2 = 2;
let currentPlayer = 1;

let board;
let rows = 6;
let cols = 7;
let colHeight = new Array(7).fill(5);
let gameOver = false;


window.onload = () => {
	setGame();
}


function setGame() {
	board = [];

	for (let r = 0; r < rows; r++) {
		let row = [];
		for (let c = 0; c < cols; c++) {
			row.push(0);
			let space = document.createElement('div');
			space.id = r.toString() + '-' + c.toString();
			space.classList.add("space");
			// let text = document.createElement('p');
			// let node = document.createTextNode(space.id);
			// text.appendChild(node);

			// space.append(text);
			space.addEventListener("click", placePiece);
			space.addEventListener("mouseover", hoverCol);
			space.addEventListener("mouseout", unHoverCol);
			document.getElementById("board").append(space);
		}
		board.push(row);
	}
}

function placePiece(e) {
	if (gameOver) {
		return
	}
	let [row,col] = getCoords(e);
	if (colFull(col)) {
		return;
	}
	row = colHeight[col];
	
	board[row][col] = currentPlayer;
	colHeight[col]--;
	let id = row + '-' + col;
	let space = document.getElementById(id);

	space.classList.add(currentPlayer == 1 ? "redPiece" : "yellowPiece");   


	checkForWin(row, col);
	if (gameOver) {
		console.log("winner: ");
	}
	currentPlayer = currentPlayer % 2 + 1;  // Set current player to other player

}


function checkForWin(row, col) {
	checkHorizontal(row);
	checkVertical(col);
	checkDiagonal(row, col);
}


function checkDiagonal(row, col) {
	let leftDiagStartRow, leftDiagStartCol, rightDiagStartRow, rightDiagStartCol;
	[leftDiagStartRow, leftDiagStartCol] = getLeftDiagStart(row,col);
	[rightDiagStartRow, rightDiagStartCol] = getRightDiagStart(row,col);
	checkLeftDiag(leftDiagStartRow, leftDiagStartCol);
	checkRightDiag(rightDiagStartRow, rightDiagStartCol);
}


function checkLeftDiag(row, col) {
	let consecutive = 0;
	while (row <= 5 && col <= 6) {
		if (board[row][col] == currentPlayer) {
			consecutive++;
			if (consecutive >= 4) {
				gameOver = true;
				return;
			}    } else {
			consecutive = 0;
		}
		row++;
		col++;
	}
}


function checkRightDiag(row, col) {
	let consecutive = 0;
	while (row >= 0 && col <= 6) {
		if (board[row][col] == currentPlayer) {
			consecutive++;
			if (consecutive >= 4) {
				gameOver = true;
				return;
			}
		} else {
			consecutive = 0;
		}
		row--;
		col++;
	}
}


function getLeftDiagStart(row, col) {
	return row <= col ? [0,col-row] : [row-col,0];
}


function getRightDiagStart(row, col) {
	while (row < 5 && col > 0) {
		row++;
		col--;
	}
	return [row,col];
}


function checkVertical(col) {
	let consecutive = 0;
	for (let row = 0; row < rows; row++) {
		if (board[row][col] == currentPlayer) {
			consecutive++;
			if (consecutive >= 4) {
				gameOver = true;
				return;
			}
		} else {
			consecutive = 0;
		}
	}
}


function checkHorizontal(row) {  
	let consecutive = 0;
	for (let col = 0; col < cols; col++) {
		if (board[row][col] == currentPlayer) {
			consecutive++;
			if (consecutive >= 4) {
				gameOver = true;
				return;
			}
		} else {
			consecutive = 0;
		}
	}
}


function colFull(col) {
	return colHeight[col] < 0;
}
function getCoords(e) {
	let coord = e.target.id.split('-');
	let row = parseInt(coord[0]);
	let col = parseInt(coord[1]);
	return [row,col];
}

/* 
	Display hover effect for column 
	Also shows possible location of piece placement
*/
function hoverCol(e) {
	let [row,col] = getCoords(e);
	let column = getCol(col);
	column.forEach((space) => {
		if (space) {
			space.classList.add("hover");
		}
	});
	row = colHeight[col];
	if (row > -1) {
		let possiblePiecePlaceId = row + '-' + col;
		let possiblePiecePlace = document.getElementById(possiblePiecePlaceId);
		possiblePiecePlace.classList.add(currentPlayer == 1 ? "redPiece" : "yellowPiece");
	}

}

/*
	Removes hover effect when mouse moves away from column
*/
function unHoverCol(e) {
	let [row,col] = getCoords(e);
	let column = getCol(col);

	column.forEach((space) => {
		if (space) {
			space.classList.remove("hover");
		}
	})
	row = colHeight[col];
	if (row > -1) {
		let possiblePiecePlaceId = row + '-' + col;
		let possiblePiecePlace = document.getElementById(possiblePiecePlaceId);
		possiblePiecePlace.classList.remove(currentPlayer == 1 ? "redPiece" : "yellowPiece");
	}

}
function getCol(col) {
	let column = [];
	for (let r = 0; r < rows; r++) {
		let id = r + '-' + col;
		let space = document.getElementById(id);
		column.push(space);
	}
	return column;
}
