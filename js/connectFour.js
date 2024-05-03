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

/**
 * Creates game board and adds event listeners to spaces
 * @return {void}
 */
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
/**
 * resets board and game to default parameters
 * @return {void}
 */
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

/**
 * places piece based on height of column
 * (How many pieces are already placed in column)
 * @param {Event} e - The event object with information on the column
 *    a piece was placed
 * @return {void}
*/
function placePiece(e) {
  console.log(typeof(e));
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

/**
 * removes all the children inside a parent element
 * @param {Element} container 
 * @return {void}
 */
function clearDiv(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function endGame() {
  removeInteractivity();
  promptForGame();
}

/**
 * Displays end game message and promps if players want to play again
 * @return {void}
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

/**
 * Sets message tab to tell whos currently playing
 * @return {void}
 */ 
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

/**
 * adds a div into a container with the given classes
 * @param {Element} container - the parent element 
 * @param {string[]} classes - list of classes to be added to child div
 * @return {Element} div - the child element with the classes specified
 */ 
function addDiv(container, classes) {
  let div = document.createElement("div");
  classes.forEach(c => {
    div.classList.add(c);
  })
  container.appendChild(div);
  return div;
}

/**
 * Adds a button into a container with given classes
 * @param {string} text - text to be shown in button
 * @param {Element} container - parent element that button will be added to
 * @param {string[]} classes - list of classes to be added to button
 * @return {Element} button - the child button with classes specified
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

/**
 * Adds p tag into container with contents of message
 * @param {string} message - message to be added into container
 * @param {Element} container - parent element message will be added to
 * @return {Element} messageElement - child p element returned
 */ 
 
function addMessage(message, container) {
  let messageElement = document.createElement("p");
  let text = document.createTextNode(message);
  messageElement.append(text);
  container.appendChild(messageElement);
  return messageElement;
}

// removes interactivity of board
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

/**
 * Checks board for horizontal, vertical, diagonal win from the coordinates
 *    that a piece was placed
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @return {void}
 */
function checkForWin(row, col) {
	checkHorizontal(row);
	checkVertical(col);
	checkDiagonal(row, col);
}

/**
 * Checks board for diagonal win from the coordinates a piece was placed
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @return {void}
 */
function checkDiagonal(row, col) {
  let [leftDiagStartRow, leftDiagStartCol] = getLeftDiagStart(row,col);
  let [rightDiagStartRow, rightDiagStartCol] = getRightDiagStart(row,col);
  checkLeftDiag(leftDiagStartRow, leftDiagStartCol);
  checkRightDiag(rightDiagStartRow, rightDiagStartCol);
}
/**
 * Checks board for left diagonal win from the coordinates a piece was placed
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @return {void}
 */
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
/**
 * Checks board for right diagonal win from the coordinates a piece was placed
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @return {void}
 */
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
/**
 * Gets coordinate of left diagonal to use for iterating over diagonal
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @returns {int[]} - 2 element array with row and col coord of start coord
 */
function getLeftDiagStart(row, col) {
	return row <= col ? [0,col-row] : [row-col,0];
}
/**
 * Gets coordinate of right diagonal to use for iterating over diagonal
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @returns {int[]} - 2 element array with row and col coord of start coord
 */
function getRightDiagStart(row, col) {
	while (row < 5 && col > 0) {
		row++;
		col--;
	}
	return [row,col];
}
/**
 * Checks board for vertical win from the coordinates a piece was placed
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @return {void}
 */
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
/**
 * Checks board for horizontal win from the coordinates a piece was placed
 * @param {int} row - row coord of placed piece
 * @param {int} col - column coord of placed piece
 * @return {void}
 */
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

/**
 * Checks if a column is full
 * @param {int} col 
 * @returns {bool} - whether column is full or not
 */
function colFull(col) {
	return colHeight[col] < 0;
}

/**
 * Gets the coord of a click on board
 * @param {Event} e 
 * @returns {int[]} - 2 element array with coords of click event
 */
function getCoords(e) {
	let coord = e.target.id.split('-');
	let row = parseInt(coord[0]);
	let col = parseInt(coord[1]);
	return [row,col];
}

/**
 * Adds hover class to a hovered column
 * @param {Event} e - event object
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

/**
 * Removes hover class from a hovered column
 * @param {Event} e - event object
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

/**
 * Gets all the elements in a column to add effects to
 * @param {int} col 
 * @returns {Element[]} column - array of elements in the same column
 */
function getCol(col) {
	let column = [];
	for (let r = 0; r < rows; r++) {
		let id = r + '-' + col;
		let space = document.getElementById(id);
		column.push(space);
	}
	return column;
}
