
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
      row.push(' ');
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
  console.log(space);
  space.classList.add("redPiece");
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

function hoverCol(e) {
  let [row,col] = getCoords(e);
  let column = getCol(col);

  column.forEach((space) => {
      space.classList.add("hover")
  })
}

function unHoverCol(e) {
  let [row,col] = getCoords(e);
  let column = getCol(col);

  column.forEach((space) => {
      space.classList.remove("hover")
  })
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