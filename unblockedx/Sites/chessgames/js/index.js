const num_threads = 1;
const MT = new Multithread(num_threads);

let currentTurn = 'human'; // human turn
let choosingState = 'none';

let game_depth = 3;

const FIRST_BACKGROUND_COLOR = '#AB7B2A';
const SECOND_BACKGROUND_COLOR = '#FFFAD5';

let cells = [];
let moveTo = [];
for (let i = 0; i < 8; i++) {
  moveTo[i] = [];
  for (let j = 0; j < 8; j++) {
    moveTo[i][j] = null;
  }
}

let board = null;

const getModelOf = function (container) {
  let type = null;
  let url = 'images/';
  for (let key in Piece) {
    if (Piece[key] == container.type) {
      type = key;
      break;
    }
  }
  if (type == 'Empty') return '';
  url += type + '_';
  if (container.color == BLACK) url += 'black.png';
  else url += 'white.png';
  return url;
}

const getCell = function (x, y) {
  return $("[x=" + x + "][y=" + y + "]");
}

const setCellContainer = function (x, y, container) {
  let modelUrl = getModelOf(container);
  if (modelUrl.length > 0)
    cells[x][y].find('img').attr('src', modelUrl);
  else cells[x][y].find('img').removeAttr('src');
}

const setCellStateSelecting = function (x, y) {
  const highlightDiv = cells[x][y].find('.highlight_overlay');
  const chosenDiv = highlightDiv.find('.chosen_overlay');
  chosenDiv.addClass("enabled");
}

const setCellStateHighlighting = function (x, y) {
  const highlightDiv = cells[x][y].find('.highlight_overlay');
  const chosenDiv = highlightDiv.find('.chosen_overlay');
  highlightDiv.addClass("enabled");
  chosenDiv.removeClass("enabled");
}

const setCellStateNormal = function (x, y) {
  const highlightDiv = cells[x][y].find('.highlight_overlay');
  const chosenDiv = highlightDiv.find('.chosen_overlay');
  highlightDiv.removeClass("enabled");
  chosenDiv.removeClass("enabled");
}

const checkState = function (x, y) {
  const highlightDiv = cells[x][y].find('.highlight_overlay');
  const chosenDiv = highlightDiv.find('.chosen_overlay');
  if (highlightDiv.hasClass("enabled")) return "highlight";
  if (chosenDiv.hasClass("enabled")) return "chosen";
  return "normal";
}

let fromx, tox;

const makeMove = function (fromx, fromy, tox, toy, move) {
  choosingState = 'none';
  $('.enabled').removeClass('enabled');
  let m = moveTo[tox][toy];
  if (move != undefined) {
    m = move;
  }
  let log = board.makeMove(m);
  $('textarea#moveLog').append(currentTurn.toUpperCase() + ": " + log + '\n');
  setCellContainer(fromx, fromy, board.get(fromx, fromy));
  setCellContainer(tox, toy, board.get(tox, toy));
  if (m.specialCondition != undefined) {
    updateBoard();
  }
}

let chooseCell = function (x, y) {
  let possibleMoves = board.getPossibleMovesFrom(x, y);
  $('.enabled').removeClass('enabled');
  setCellStateSelecting(x, y);
  fromx = x; fromy = y;
  possibleMoves.forEach(function (move) {
    setCellStateHighlighting(move.to.x, move.to.y);
    moveTo[move.to.x][move.to.y] = move;
  });
  choosingState = 'chosen';
}

let enableBoard = function () {
  $('div#chessdiv').removeClass('disabled');
}

let disableBoard = function () {
  $('div#chessdiv').addClass('disabled');
}

let setStatus = function (text) {
  $('p#status').text(text);
}

let checkWin = function () {
  let whoWin = board.checkWin();
  if (whoWin != GameState.Normal) {
    choosingState = 'over';
    disableBoard();
    if (whoWin == GameState.HumanWin) {
      setStatus('Congratulations, You Win!')
    } else {
      setStatus('Sorry, You lose!')
    }
    return true;
  }
  return false;
}

const startGame = function () {
  board = new Board();
  board.setMaxDepth(game_depth);
  setStatus('Your turn, You are white!');
  initBoard();
  choosingState = 'none';
  currentTurn = 'human';
  $('.enabled').removeClass('enabled');
  $('#moveLog').text('');
}

const chessEngine = new Worker('js/chessboard.js');
chessEngine.addEventListener('message', function (e) {
  const move = e.data;
  makeMove(move.from.x, move.from.y, move.to.x, move.to.y, move);
  currentTurn = 'human';
  choosingState = 'none';
  $('.enabled').removeClass('enabled');
  setStatus('Your turn, You are white!');
  if (checkWin()) return;
})

const cellOnClick = function () {
  if (choosingState == 'over') return;
  if (currentTurn != 'human') return;
  const x = parseInt($(this).attr("x"));
  const y = parseInt($(this).attr("y"));
  const state = checkState(x, y);
  if (currentTurn == 'human') {
    if (board.isHumanPiece(x, y)) {
      chooseCell(x, y);
    } else if (choosingState == 'chosen' && checkState(x, y) == 'highlight') {
      makeMove(fromx, fromy, x, y);

      if (checkWin()) return;
      currentTurn = 'pc';
      setStatus('PC turn, he is thinking...');
      chessEngine.postMessage(board.getConfiguration());
    }
  }
}

const updateBoard = function () {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      setCellContainer(i, j, board.get(i, j));
    }
  }
}

const initBoard = function () {
  for (let i = 0; i < 8; i++) cells[i] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      cells[i][j] = getCell(i, j);
      setCellContainer(i, j, board.get(i, j));
    }
  }
}

const changeBackgroundMode = function (mode) {
  if (mode == 0) {
    $("body").css('background-color', '#FDFDFD');
    $("body").css('color', '#333');
  } else {
    $("body").css('background-color', '#333');
    $("body").css('color', '#FDFDFD');
  }
}

$(document).ready(() => {
  $("input[name=difficulty]").click(function () {
    game_depth = parseInt($(this).val());
    console.log("Set game depth to " + game_depth);
  });
  $("input[name='backgroundmode']").click(function () {
    changeBackgroundMode(parseInt($(this).val()));
  })
  let str = '';
  for (let i = 0; i < 8; i++) {
    let row = '<tr>';
    for (let j = 0; j < 8; j++) {
      let bgcolor = ((i + j) % 2 == 0) ? FIRST_BACKGROUND_COLOR : SECOND_BACKGROUND_COLOR;
      row += '<td x="' + i + '" y="' + j + '" bgcolor="' + bgcolor + '">  <div class="highlight_overlay"><div class="chosen_overlay"><img/></div></div> </td>';
    }
    row += '</tr>'
    str += row;
  }
  $('table#chessboard').append(str);
  $('table#chessboard').find('td').click(cellOnClick);
  startGame();
});