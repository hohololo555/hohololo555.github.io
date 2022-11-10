Chess game AI
===================

This is a simple HTML Chess game AI using DFS. Demo version can be played at http://bikrone.github.io/chess-ai.
![nightmode](https://cloud.githubusercontent.com/assets/5102383/12218526/6a9299e4-b754-11e5-8e33-5bac48cb8300.png)

###Algorithm
The algorithm is simple DFS, prioritized by simple estimation of chess state based on the Sum of pieces of one player over the other, assuming both players playing with their best (maximize score of both). No heuristic is used (still very enjoyable though). 

Below is the pseudo code of the main code to find the best move for a specific state.

```csharp
int MAX_DEPTH = 3;

int tryMove(state, humanOrPC, depth) {
  if (depth >= MAX_DEPTH) return null, calculateScore(state);
  var maxScoreCanHave = humanOrPC ? max_int : -max_int;
  var rightMove = null;
  for (move : getAllPossibleMoves() ) {
    var bestOfTheOther = tryMove(makeMove(state, move), humanOrPC ^ 1, depth+1);
    if ((bestOfTheOther < maxScoreCanHave && humanOrPC)
      ||  (bestOfTheOther > maxScoreCanHave && !humanOrPC)) {
      maxScoreCanHave = bestOfHuman;
      rightMove = move;
    }
  }
  return rightMove, maxScoreCanHave;
}

```

###Note
The algorithm is running on client browser so the performance is really bad, if you choose the Hard mode (depth = 4), it may freeze in a few secs. I may move the code to another agent to avoid this issue.


###Resources
Chess pieces models are taken from [Vector.me](http://vector.me/browse/205295/chess_board_and_pieces)