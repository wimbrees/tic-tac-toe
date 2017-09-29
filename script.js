let origBoard;
const huPlayer = '0';
const aiPlayer = 'X';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const endgame = document.querySelector('.endgame');

startGame();

function startGame() {
  endgame.style.display = 'none';
  // [0, 1, 2, 3, 4, 5, 6, 7, 8];
  origBoard = [...Array(9).keys()];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.removeProperty('background-color');
    cell.addEventListener('click', turnClick);
  });
}

function turnClick(e) {
  const id = e.target.id;
  if (typeof origBoard[id] === 'number') {
    if (!turn(id, huPlayer)) {
      if (!checkTie()) turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).textContent = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) {
    gameOver(gameWon);
    return true;
  }
  return false;
}

function checkWin(board, player) {
  let plays = board.reduce((prev, curr, i) => {
    return curr === player ? prev.concat(i) : prev;
  }, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.includes(elem))) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function checkTie() {
  if (emptySquares().length === 0) {
    cells.forEach(cell => {
      cell.style.backgroundColor = 'green';
      cell.removeEventListener('click', turnClick);
    });
    declareWinner('Tie Game!');
    return true;
  }
  return false;
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function emptySquares() {
  return origBoard.filter(cell => typeof cell === 'number');
}

function declareWinner(who) {
  endgame.style.display = 'block';
  endgame.querySelector('.text').textContent = who;
}

function gameOver({ index, player }) {
  for (let num of winCombos[index]) {
    document.getElementById(num).style.backgroundColor =
      player === huPlayer ? 'blue' : 'red';
  }
  cells.forEach(cell => cell.removeEventListener('click', turnClick));
  declareWinner(player === huPlayer ? 'You win!' : 'You lose!');
}
