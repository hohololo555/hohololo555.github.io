const BLACK = 0;
const WHITE = 1;

const shuffle = function (array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const Piece = {
  Pawn: 100,
  Knight: 320,
  Bishop: 330,
  Rook: 500,
  Queen: 900,
  King: 20000,
  Empty: 0
}

const bonusPos = {};
bonusPos[Piece.Knight] = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
];

bonusPos[Piece.Bishop] = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20]
];

bonusPos[Piece.Rook] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0]
];

bonusPos[Piece.Queen] = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20]
];

const kingMiddle = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20]
];

const kingLate = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50]
]
bonusPos[Piece.King] = kingMiddle;

const GameState = {
  HumanWin: 1,
  PCWin: -1,
  Normal: 0
}


const MAX_INT = 1000000000;

const moveToString = function (m, board) {
  const from = m.from;
  const to = m.to;
  const specialCondition = m.specialCondition;
  const str = board.findNameOfPiece(from.container.type) + '(' + from.x + ',' + from.y + ')' + ' to '
    + board.findNameOfPiece(to.container.type) + '(' + to.x + ',' + to.y + ')';
  if (specialCondition != undefined) {
    if (specialCondition.name == 'castling') {
      return str + " - CASTLING";
    } else if (specialCondition.name == 'upgradePawn') {
      return str + " - PAWN UPGRADED";
    }
  }
  return str;

}

const Board = function (conf) {
  let MAX_DEPTH = 3;
  let HUMAN_COLOR = WHITE;
  let PC_COLOR = BLACK;
  let firstColor = BLACK;
  let secondColor = WHITE;
  let state = {};

  let isKingMove = {};
  let isLeftRookMove = {};
  let isRightRookMove = {};
  isKingMove[firstColor] = 0;
  isKingMove[secondColor] = 0;
  isLeftRookMove[firstColor] = 0;
  isLeftRookMove[secondColor] = 0;
  isRightRookMove[firstColor] = 0;
  isRightRookMove[secondColor] = 0;

  if (conf !== undefined) {
    isKingMove = conf.isKingMove;
    isLeftRookMove = conf.isLeftRookMove;
    isRightRookMove = conf.isRightRookMove;
    firstColor = conf.firstColor;
    secondColor = conf.secondColor;
    state = conf.state;
    HUMAN_COLOR = conf.HUMAN_COLOR;
    PC_COLOR = conf.PC_COLOR;
    MAX_DEPTH = conf.MAX_DEPTH;
  }

  const findNameOfPiece = function (piece) {
    for (let key in Piece) {
      if (Piece[key] == piece) return key;
    }
    return null;
  }

  const Move = function (from, to, specialCondition) {
    this.from = from;
    this.to = to;
    if (specialCondition != undefined) this.specialCondition = specialCondition;

  };

  const makePieceContainer = function (type, color) {
    return {
      type: type,
      color: color
    };
  }

  const abs = function (a) { return a > 0 ? a : -a; }
  const isValid = function (move) {
    const x = move.to.x, y = move.to.y;
    const destination = move.to.container;
    const source = move.from.container;
    return x > -1 && y > -1 && x < 8 && y < 8 && ((destination.type == Piece.Empty) || (destination.color != source.color));
  }

  const hash = function (x, y) {
    return x * 8 + y;
  }

  const decode = function (h) {
    return [Math.floor(h / 8), h % 8];
  }

  const get = function (x, y) {
    const h = hash(x, y);
    if (state[h] == undefined) {
      return {
        type: Piece.Empty,
        color: 0
      };
    } else return state[h];
  }

  const set = function (x, y, pieceContainer) {
    if (pieceContainer.type == Piece.Empty) {
      del(x, y);
    } else state[hash(x, y)] = pieceContainer;
  }

  const del = function (x, y) {
    delete state[hash(x, y)];
  }

  const makeMoveObject = function (fromx, fromy, tox, toy, specialCondition) {
    const from = {
      x: fromx,
      y: fromy,
      container: get(fromx, fromy)
    };
    const to = {
      x: tox,
      y: toy,
      container: get(tox, toy)
    }
    return new Move(from, to, specialCondition);
  }

  const pieceMoves = {};
  pieceMoves[Piece.King] = function (x, y) {
    const moves = [
      [-1, 0], [0, -1], [1, 0], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];

    const result = [];

    moves.forEach(function (move) {
      const i = x + move[0];
      const j = y + move[1];
      const m = makeMoveObject(x, y, i, j);
      if (isValid(m)) {
        result.push(m);
      }
    })

    // castling move
    const isBottom = get(x, y).color == secondColor;
    const color = get(x, y).color;
    const bottomRow = (isBottom) ? 7 : 0;
    if (isKingMove[color] == 0 && x == bottomRow) {
      let sumOfSpace = 0;
      // check right
      for (let i = 5; i < 7; i++) sumOfSpace += get(x, i).type;
      let rook = get(x, 7);
      if (sumOfSpace == 0 && rook.color == color && rook.type == Piece.Rook && isRightRookMove[color] == 0) {
        // make special move
        const m = makeMoveObject(x, y, x, y + 2, {
          name: 'castling',
          secondMove: makeMoveObject(x, y + 3, x, y + 1)
        });
        result.push(m);
      }

      //check left
      sumOfSpace = 0;
      for (let i = 1; i < 4; i++) sumOfSpace += get(x, i).type;
      rook = get(x, 0);
      if (sumOfSpace == 0 && rook.color == color && rook.type == Piece.Rook && isLeftRookMove[color] == 0) {
        // make special move
        const m = makeMoveObject(x, y, x, y - 2, {
          name: 'castling',
          secondMove: makeMoveObject(x, 0, x, 3)
        });
        result.push(m);
      }
    }


    return result;
  }

  pieceMoves[Piece.Queen] = function (x, y) {
    const moves = [
      [-1, 0], [0, -1], [1, 0], [0, 1],
      [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];

    const result = [];

    moves.forEach(function (move) {
      let i = x;
      let j = y;
      for (let multiplier = 1; multiplier < 8; multiplier++) {
        i += move[0];
        j += move[1];
        const m = makeMoveObject(x, y, i, j);
        if (isValid(m)) {
          result.push(m);
          if (m.to.container.type != Piece.Empty) break;
        } else break;
      }
    })
    return result;
  }

  pieceMoves[Piece.Rook] = function (x, y) {
    const moves = [
      [-1, 0], [0, -1], [1, 0], [0, 1],
    ];

    const result = [];

    moves.forEach(function (move) {
      let i = x;
      let j = y;
      for (let multiplier = 1; multiplier < 8; multiplier++) {
        i += move[0];
        j += move[1];
        const m = makeMoveObject(x, y, i, j);
        if (isValid(m)) {
          result.push(m);
          if (m.to.container.type != Piece.Empty) break;
        } else break;
      }
    })
    return result;
  }

  pieceMoves[Piece.Bishop] = function (x, y) {
    const moves = [
      [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];

    const result = [];

    moves.forEach(function (move) {
      let i = x;
      let j = y;
      for (let multiplier = 1; multiplier < 8; multiplier++) {
        i += move[0];
        j += move[1];
        const m = makeMoveObject(x, y, i, j);
        if (isValid(m)) {
          result.push(m);
          if (m.to.container.type != Piece.Empty) break;
        } else break;
      }
    })
    return result;
  }

  pieceMoves[Piece.Pawn] = function (x, y) {
    const moves = [
      [1, 1], [1, -1]
    ];

    const result = [];
    const direction = (get(x, y).color == secondColor) ? -1 : 1;
    let m = {};
    const color = get(x, y).color;
    if ((direction == 1 && x == 6) || (direction == -1 && x == 1)) {
      m = makeMoveObject(x, y, x + direction, y, {
        name: 'upgradePawn'
      });
    } else {
      m = makeMoveObject(x, y, x + direction, y);
    }
    if (m.to.container.type == Piece.Empty) {
      result.push(m);

      if ((direction == 1 && x == 1) || (direction == -1 && x == 6)) {
        m = makeMoveObject(x, y, x + 2 * direction, y);
        if (m.to.container.type == Piece.Empty) result.push(m);
      }
    }

    moves.forEach(function (move) {
      const i = x + move[0] * direction;
      const j = y + move[1];
      let m = {};
      if ((direction == 1 && i == 7) || (direction == -1 && i == 0)) {
        m = makeMoveObject(x, y, i, j, {
          name: 'upgradePawn'
        });
      } else {
        m = makeMoveObject(x, y, i, j);
      }
      if (isValid(m) && m.to.container.type != Piece.Empty) {
        result.push(m);
      }
    });
    return result;
  }

  pieceMoves[Piece.Knight] = function (x, y) {
    const moves = [
      [1, 2], [2, 1], [-1, 2], [2, -1], [1, -2], [-2, 1], [-1, -2], [-2, -1]
    ];

    const result = [];

    moves.forEach(function (move) {
      const i = x + move[0];
      const j = y + move[1];
      const m = makeMoveObject(x, y, i, j);
      if (isValid(m)) {
        result.push(m);
      }
    })

    return result;
  }

  if (conf === undefined) {
    set(0, 0, makePieceContainer(Piece.Rook, firstColor));
    set(0, 1, makePieceContainer(Piece.Knight, firstColor));
    set(0, 2, makePieceContainer(Piece.Bishop, firstColor));
    set(0, 3, makePieceContainer(Piece.Queen, firstColor));
    set(0, 4, makePieceContainer(Piece.King, firstColor));
    set(0, 5, makePieceContainer(Piece.Bishop, firstColor));
    set(0, 6, makePieceContainer(Piece.Knight, firstColor));
    set(0, 7, makePieceContainer(Piece.Rook, firstColor));
    for (let i = 0; i < 8; i++) {
      set(1, i, makePieceContainer(Piece.Pawn, firstColor));
      set(6, i, makePieceContainer(Piece.Pawn, secondColor));
    }

    set(7, 0, makePieceContainer(Piece.Rook, secondColor));
    set(7, 1, makePieceContainer(Piece.Knight, secondColor));
    set(7, 2, makePieceContainer(Piece.Bishop, secondColor));
    set(7, 3, makePieceContainer(Piece.Queen, secondColor));
    set(7, 4, makePieceContainer(Piece.King, secondColor));
    set(7, 5, makePieceContainer(Piece.Bishop, secondColor));
    set(7, 6, makePieceContainer(Piece.Knight, secondColor));
    set(7, 7, makePieceContainer(Piece.Rook, secondColor));
  }

  const makeMove = function (move) {

    set(move.to.x, move.to.y, move.from.container);
    del(move.from.x, move.from.y);
    if (move.from.container.type == Piece.King) {
      isKingMove[move.from.container.color]++;
    } else if (move.from.container.type == Piece.Rook) {
      let color = null;
      if (move.from.x == 0) color = firstColor;
      else if (move.from.x == 7) color = secondColor;
      if (color != null) {
        if (move.from.y == 0) isLeftRookMove[color]++;
        else if (move.from.y == 7) {
          isRightRookMove[color]++;
        }
      }
    }
    if (move.specialCondition != undefined) {
      if (move.specialCondition.name == 'castling') {
        makeMove(move.specialCondition.secondMove);
      } else if (move.specialCondition.name == 'upgradePawn') {
        const color = move.from.container.color;
        set(move.to.x, move.to.y, makePieceContainer(Piece.Queen, color));
      }
    }
  }

  const undoMove = function (move) {
    set(move.from.x, move.from.y, move.from.container);
    set(move.to.x, move.to.y, move.to.container);
    if (move.from.container.type == Piece.King) {
      isKingMove[move.from.container.color]--;
    } else if (move.from.container.type == Piece.Rook) {
      let color = null;
      if (move.from.x == 0) color = firstColor;
      else if (move.from.x == 7) color = secondColor;
      if (color != null) {
        if (move.from.y == 0) isLeftRookMove[color]--;
        else if (move.from.y == 7) {
          isRightRookMove[color]--;
        }
      }
    }
    if (move.specialCondition != undefined) {
      if (move.specialCondition.name == 'castling') {
        undoMove(move.specialCondition.secondMove);
      } else if (move.specialCondition.name == 'upgradePawn') {

      }
    }
  }

  const getHumanOrPCPositions = function (humanOrPC) {
    let checkColor = PC_COLOR;
    if (humanOrPC) checkColor = HUMAN_COLOR;

    const result = [];
    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        if (state[key].color == checkColor) result.push(decode(key));
      }
    }

    shuffle(result);
    result.sort(function (a, b) {
      return get(a[0], a[1]).type - get(b[0], b[1]).type;
    })
    return result;
  }

  const getAllPossibleMoves = function (humanOrPC) {
    const positions = getHumanOrPCPositions(humanOrPC);
    let result = [];
    for (let i = 0; i < positions.length; i++) {
      const x = positions[i][0], y = positions[i][1];
      const pieceType = get(x, y).type;
      if (pieceType != Piece.Empty) {
        const possibleMoves = pieceMoves[pieceType](x, y);
        result = result.concat(possibleMoves);
      };
    }
    return result;
  }

  const getHumanPositions = function () {
    return getHumanOrPCPositions(true);
  }
  const getPCPositions = function () {
    return getHumanOrPCPositions(false);
  }

  const calculateScore = function () {
    let result = 0;

    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        let score = state[key].type;
        if (bonusPos[state[key].type] != undefined) {
          const pos = decode(key);
          let x = pos[0];
          let y = pos[1];
          if (HUMAN_COLOR != secondColor) {
            y = 7 - y;
          }
          score += bonusPos[state[key].type][x][y];
        }
        if (state[key].color == HUMAN_COLOR) result -= score;
        else result += score;
      }
    }
    return result;
  }
  let calcCount = 0;

  const tryMove = function (humanOrPC, depth, alpha, beta) {
    calcCount++;
    let bestSolutions = [];
    if (depth == 0) return { move: null, bestScore: humanOrPC ? -calculateScore(state) : calculateScore(state) };
    const MINVALUE = -MAX_INT;
    let maxScoreCanHave = MINVALUE - 1;
    let rightMove = null;
    const allPossibleMoves = shuffle(getAllPossibleMoves(humanOrPC));

    const getBestResult = () => {
      if (depth === MAX_DEPTH) {
        if (bestSolutions.length === 0) {
          console.log('never??');
          return {move: rightMove, bestScore: maxScoreCanHave};
        }
        console.log('bestSolutions', bestSolutions.length);
        return bestSolutions[(Math.random() * bestSolutions.length) | 0];
      }
      return {move: rightMove, bestScore: maxScoreCanHave};
    }

    for (let ii = 0; ii < allPossibleMoves.length; ii++) {
      const move = allPossibleMoves[ii];
      makeMove(move);
      if (move.to.container.type == Piece.King) {
        undoMove(move);
        return { move: move, bestScore: -MINVALUE };
      }
      const bestOfTheOther = -tryMove(humanOrPC ^ 1, depth - 1, -beta, -alpha).bestScore;

      undoMove(move);
      if (bestOfTheOther > maxScoreCanHave) {
        maxScoreCanHave = bestOfTheOther;
        rightMove = move;
        if (depth === MAX_DEPTH) {
          bestSolutions = [{move: move, bestScore: maxScoreCanHave}];
        }
      } else if (bestOfTheOther === maxScoreCanHave && depth === MAX_DEPTH) {
        bestSolutions.push({move: move, bestScore: maxScoreCanHave})
      }
      if (maxScoreCanHave > alpha) alpha = maxScoreCanHave;
      if (alpha >= beta) return getBestResult();
    }
    return getBestResult();
  }

  this.get = get;
  this.getHumanPositions = getHumanPositions;
  this.getPCPositions = getPCPositions;
  this.setMaxDepth = function (depth) {
    MAX_DEPTH = depth;
  }

  // allow player to make a move from (i,j) to (x,y)
  this.makeMove = function (move) {
    makeMove(move);
    return moveToString(move, this);
  };

  this.checkWin = function () {
    let isHumanKingAlive = false;
    let isPCKingAlive = false;
    for (let key in state) {
      if (state.hasOwnProperty(key)) {
        const container = state[key];
        if (container.type == Piece.King) {
          if (container.color == HUMAN_COLOR) {
            isHumanKingAlive = true;
          } else {
            isPCKingAlive = true;
          }
        }
      }
    }

    if (!isHumanKingAlive) {
      return GameState.PCWin;
    } else if (!isPCKingAlive) {
      return GameState.HumanWin;
    } else return GameState.Normal;
  }

  this.getPCResponse = function () {
    calcCount = 0;
    const res = tryMove(false, MAX_DEPTH, -MAX_INT, MAX_INT).move;
    console.log('Calculation steps: ' + calcCount);
    return res;
  }

  this.getPossibleMovesFrom = function (x, y) {
    const container = get(x, y);
    if (container.type == Piece.Empty) return [];
    return pieceMoves[container.type](x, y);
  }

  this.isHumanPiece = function (x, y) {
    return get(x, y).type != Piece.Empty && get(x, y).color == HUMAN_COLOR;
  }

  this.getConfiguration = function () {
    const conf = {};
    conf.isKingMove = isKingMove;
    conf.isLeftRookMove = isLeftRookMove;
    conf.isRightRookMove = isRightRookMove;
    conf.firstColor = firstColor;
    conf.secondColor = secondColor;
    conf.state = state;
    conf.HUMAN_COLOR = HUMAN_COLOR;
    conf.PC_COLOR = PC_COLOR;
    conf.MAX_DEPTH = MAX_DEPTH;
    return conf;
  }

  this.findNameOfPiece = findNameOfPiece;
};

Board.findBestMove = function (conf) {
  const board = new Board(conf);
  return board.getPCResponse();
}

addEventListener('message', function (e) {
  const bestMove = Board.findBestMove(e.data);
  postMessage(bestMove);
});
