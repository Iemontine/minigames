"use strict";

let player1 = 1;
let player2 = 2;
let currentPlayer = 1;

let board;
let rows = 6;
let cols = 7;
let colHeight = new Array(7).fill(5);
let gameOver = false;
let title = document.getElementById("title");
title.addEventListener("click", () => {
  window.location.href = "index.html";
})

window.onload = () => {
	setGame();
}

// Creates game board
function setGame() {
	board = [];

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
      let space = document.createElement('div');
      space.id = r.toString() + '-' + c.toString();
      space.classList.add("space");

      space.addEventListener("click", placePiece);
      space.addEventListener("mouseover", hoverCol);
      space.addEventListener("mouseout", unHoverCol);
      document.getElementById("board").append(space);
    }
    board.push(row);
  }
  setMessage();
}

// resets game board
function resetGame() {
  board =[];
  colHeight = Array(7).fill(5);
  gameOver = false;
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
      let id = r.toString() + '-' + c.toString();
      let space = document.getElementById(id);
      space.classList.remove(...space.classList);
      space.classList.add("space");
      space.addEventListener("click", placePiece);
      space.addEventListener("mouseover", hoverCol);
      space.addEventListener("mouseout", unHoverCol);
    }
    board.push(row);
  }
  let messageContainer = document.getElementById("messageTab");
  clearDiv(messageContainer);
  setMessage();
}

/* 
  places piece based on height of column
  (How many pieces are already placed in column)
*/
function placePiece(e) {
  if (gameOver) {
    endGame();
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

	space.classList.add(currentPlayer == 1 ? "bluePiece" : "yellowPiece");   


  checkForWin(row, col);
  if (gameOver) {
    endGame();
    return;
  }
  currentPlayer = currentPlayer % 2 + 1;  // Set current player to other player
  setMessage();
}

// Removes all children in a div
function clearDiv(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function endGame() {
  removeInteractivity();
  promptForGame();
}

/*
  Displays end game message and promps if players want
  to play again
*/
function promptForGame() {
  let winnerMessage = "player " + currentPlayer + " wins !"; 
  let messageTab = document.getElementById("messageTab");
  clearDiv(messageTab);
  addMessage(winnerMessage, messageTab);
  let buttonContainer = addDiv(messageTab, ["buttonContainer"]);
  let playAgainButton = addButton("play again", buttonContainer, ["button"]);
  playAgainButton.addEventListener("click", resetGame);
  let quitButton = addButton("quit", buttonContainer, ["button"])
  quitButton.addEventListener("click", quitGame);
}

// Sets message to tell whos currently playing
function setMessage() {
  let messageContainer = document.getElementById("messageTab");
  clearDiv(messageContainer);
  let message = "player " + currentPlayer + "'s turn";
  addMessage(message, messageTab);
}

// navigate to home page
function quitGame() {
  window.location.href = "index.html";
}

// adds a div into a container with the given classes
function addDiv(container, classes) {
  let div = document.createElement("div");
  classes.forEach(c => {
    div.classList.add(c);
  })
  container.appendChild(div);
  return div;
}

/* 
  Adds a button into a container with given classes
  returns button element if more manipulation is necessary
*/
function addButton(text, container, classes) {
  let button = document.createElement("button");
  button.innerText = text;
  classes.forEach(c => {
    button.classList.add(c);
  })
  container.appendChild(button);
  return button;
}

/* 
  Adds p tag into container with contents of message
  Returns p element if you want to manipulate it
*/
function addMessage(message, container) {
  let messageElement = document.createElement("p");
  let text = document.createTextNode(message);
  messageElement.append(text);
  container.appendChild(messageElement);
  return messageElement;
}

function removeInteractivity() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let id = r.toString() + '-' + c.toString();
      let space = document.getElementById(id)

      space.removeEventListener("click", placePiece);
      space.removeEventListener("mouseover", hoverCol);
    }
  }
}

function checkForWin(row, col) {
	checkHorizontal(row);
	checkVertical(col);
	checkDiagonal(row, col);
}

function checkDiagonal(row, col) {
  let [leftDiagStartRow, leftDiagStartCol] = getLeftDiagStart(row,col);
  let [rightDiagStartRow, rightDiagStartCol] = getRightDiagStart(row,col);
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

// Checks if colun is full
function colFull(col) {
	return colHeight[col] < 0;
}

// gets the coords of a piece placement
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
		possiblePiecePlace.classList.add(currentPlayer == 1 ? "bluePiece" : "yellowPiece");
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
		possiblePiecePlace.classList.remove(currentPlayer == 1 ? "bluePiece" : "yellowPiece");
	}

}

// gets all the elements in a column
function getCol(col) {
	let column = [];
	for (let r = 0; r < rows; r++) {
		let id = r + '-' + col;
		let space = document.getElementById(id);
		column.push(space);
	}
	return column;
}
