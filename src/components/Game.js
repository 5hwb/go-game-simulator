import React from 'react';
import { connect } from 'react-redux';
import { addToHistory } from '../redux/actions';
import { mapStateToProps } from '../redux/store';
import Settings from './Settings';
import Board from './Board';
import GameHistoryButtons from './GameHistoryButtons';

// ========================================
// GAME COMPONENT
// The main component on which all other components are controlled by.
// ========================================

function convertIndexToCoordinates(i, numOfCols) {
  return [(i % numOfCols), Math.floor(i / numOfCols)];
}

class Game extends React.Component {
  
  // Process a click at the i'th square
  handleClick(i) {
    console.log("==============================");
    // Get the current history
    const history = this.props.history.slice(0, this.props.stepNumber + 1); // all history up to current step number
    const current = history[history.length - 1]; // current history
    const squares = current.squares.slice(); // current state of board pieces

    // Do not do anything if the game is finished or the clicked square has already been clicked
    if (calculateWinner(squares, this.props.boardCols, this.props.boardRows)
        || squares[i]) {
      console.log("DO NOT DO ANYTHING");
      return;
    }
    
    // Calculate col-row coordinates for the state
    var coordinates = convertIndexToCoordinates(i, this.props.boardCols);

    // Update the board pieces at square i
    squares[i] = this.props.xIsNext ? 'X' : 'O';
    console.log("NEW STATE: " + squares);
    console.log(squares);

    // Update state
    this.props.dispatch(addToHistory(squares, coordinates));
    console.log("HISTORY: " + JSON.stringify(this.props.history));
    console.log("STEPNUMBER: " + this.props.stepNumber);
    console.log("XISNEXT: " + this.props.xIsNext);
  }

  // Render a Game component
  render() {
    const history = this.props.history; // all history
    console.log("RENDER() STEPNUM = " + this.props.stepNumber);
    console.log(this.props.stepNumber);
    console.log("RENDER() ISNEXT = " + this.props.xIsNext);
    console.log(this.props.xIsNext);
    const current = history[this.props.stepNumber]; // the current state
    const winner = calculateWinner(current.squares, this.props.boardCols, this.props.boardRows); // return object containing winning squares and their indexes

    // Update status display
    let status;
    if (winner) {
      status = 'Winner: ' + winner["squares"][0];
      console.log("WINNER! " + JSON.stringify(winner));
    } else {
      status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
    }

    // Get list of indexes of winning squares
    let winnerSquares = (winner != null) ? winner.winningSquares : [];

    return (
      <div>
        {/* GAME SETTINGS */}
        <Settings />

        {/* GAME BOARD */}
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              numOfCols={this.props.boardCols}
              numOfRows={this.props.boardRows}
              winnerSquares={winnerSquares}
            />
          </div>

          <div className="game-info">
            <div>{status}</div>
            <ol>
              <GameHistoryButtons
                history={this.props.history} />
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

// Given a series of squares, detect if a winner is present.
// Returns the name of the winning player if a winner is found,
// and returns null otherwise.
function calculateWinner(squares, numOfCols, numOfRows) {
  /* Winning indexes
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];*/

  // Get the index of the square array with row and column indexes.
  // Returns null if the indexes go beyond the bounds of the square
  function getIndex(r, c) {
    var isValidRowIndex = (r >= 0 && r < numOfRows);
    var isValidColIndex = (c >= 0 && c < numOfCols);

    // Check if indexes are valid
    if (isValidRowIndex && isValidColIndex) {
      return r*numOfCols + c;
    }

    return null;
  }

  // Go thru every possible winning combination
  for (var r = 0; r < numOfRows; r++) {
    for (var c = 0; c < numOfCols; c++) {
      // Indexes of squares to check
      const curr = getIndex(r, c);
      const left = getIndex(r, (c-1));
      const right = getIndex(r, (c+1));
      const top = getIndex((r-1), c);
      const bottom = getIndex((r+1), c);
      const topLeft = getIndex((r-1), (c-1));
      const topRight = getIndex((r-1), (c+1));
      const bottLeft = getIndex((r+1), (c-1));
      const bottRight = getIndex((r+1), (c+1));

      // Patterns
      const lines = [
        [left, curr, right], // horizontal
        [top, curr, bottom], // horizontal
        [topLeft, curr, bottRight], // backslash
        [topRight, curr, bottLeft], // forward slash
      ];

      // Go thru every pattern to see which one contains a win
      for (var i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        //console.log("RESULTS: " + a + " " + b + " " + c);
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return {
            squares: [squares[a], squares[b], squares[c]],
            winningSquares: [a, b, c]
          };
        }
      }

    }
  }

  return null;
}

export default connect(mapStateToProps)(Game);
