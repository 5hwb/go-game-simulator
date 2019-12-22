import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ========================================
// SQUARE COMPONENT
// ========================================
function Square(props) {

  // Set appropriate CSS classes if square is part of the winning combination
  var className = (props.isWinnerSquare) ? "square square-winner" : "square";

  return (
    <button
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

// Generate a 2D array with the elements arranged as shown:
/* [0,1,2],
   [3,4,5],
   [6,7,8] */
// This 2D array will be used to generate the grid of squares.
function generateSquare(numOfCols, numOfRows) {
  var vals = [];
  for (var i = 0; i < numOfRows; i++) {
    var valRow = [];
    for (var j = 0; j < numOfCols; j++) {
      valRow.push(j + (i*numOfCols));
    }
    vals.push(valRow);
  }

  return vals;
}

function convertIndexToCoordinates(i, numOfCols) {
  return [(i % numOfCols), Math.floor(i / numOfCols)];
}


// ========================================
// BOARD COMPONENT
// ========================================
class Board extends React.Component {

  // Render a square element of the board
  renderSquare(i) {
    // Check if the square being rendered is part of the winning combination
    var isWinnerSquare = this.props.winnerSquares.includes(i);
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinnerSquare={isWinnerSquare}
      />
    );
  }

  // Map an array of values into a list of square elements
  renderRow(valRow) {
    return valRow.map((val) =>
      this.renderSquare(val)
    );
  }

  // Map a 2D array input to a list of row elements
  renderAllRows(vals) {
    return vals.map((valRow) =>
      <div className="board-row">
        {this.renderRow(valRow)}
      </div>
    );
  }

  // Render a Board component
  render() {
    // Get dimension of board from properties
    const numOfCols = this.props.numOfCols;
    const numOfRows = this.props.numOfRows;

    var vals = generateSquare(numOfCols, numOfRows);

    // Return div element containing 9 squares in a grid
    return (
      <div>
        {this.renderAllRows(vals)}
      </div>
    );
  }
}

// ========================================
// GAME COMPONENT
// ========================================
class Game extends React.Component {

  // Define some state attributes
  constructor(props) {
    super(props);
    this.handleChangeCols = this.handleChangeCols.bind(this);
    this.handleChangeRows = this.handleChangeRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      // Board dimensions
      boardCols: 3,
      boardRows: 3,
      // New board dimensions (for updating settings)
      newBoardCols: 3,
      newBoardRows: 3,
      // Game move history
      history: [{
        squares: Array(9).fill(null), // contains the current pieces on the board in this move
        clickedSquareCol: -1, // column of the clicked square in this move
        clickedSquareRow: -1, // row of the clicked square in this move
      }],
      // Move number
      stepNumber: 0,
      // Is X the next player?
      xIsNext: true,
    };
  }

  // Reset the game state (start a new game)
  resetState() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        clickedSquareCol: -1,
        clickedSquareRow: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  // Process a click at the i'th square
  handleClick(i) {
    // Get the current history
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // all history up to current step number
    const current = history[history.length - 1]; // current history
    const squares = current.squares.slice(); // current state of board pieces

    // Do not do anything if the game is finished or the clicked square has already been clicked
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Update the board pieces at square i
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Calculate col-row coordinates for the state
    var coordinates = convertIndexToCoordinates(i, this.state.boardCols);

    // Update state
    this.setState({
      history: history.concat([{
        squares: squares,
        clickedSquareCol: coordinates[0] + 1, // get the column from the index
        clickedSquareRow: coordinates[1] + 1, // get the row from the index
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    console.log("==============================");
    console.log("HISTORY: " + JSON.stringify(this.state.history));
    console.log("STEPNUMBER: " + this.state.stepNumber);
    console.log("XISNEXT: " + this.state.xIsNext);
  }

  // Set the number of columns for the next game
  handleChangeCols(e) {
    this.setState({ newBoardCols: e.target.value });
  }

  // Set the number of rows for the next game
  handleChangeRows(e) {
    this.setState({ newBoardRows: e.target.value });
  }

  // Submit the form and start a new game with the new dimensions
  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      boardCols: this.state.newBoardCols,
      boardRows: this.state.newBoardRows,
    });
    this.resetState();
  }

  // Jump to a previous state
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // Render a Game component
  render() {
    const history = this.state.history; // all history
    const current = history[this.state.stepNumber]; // the current state
    const winner = calculateWinner(current.squares); // return object containing winning squares and their indexes

    // Generate buttons to 'step back' into a previous state.
    // * step = an element in the 'history' array game state
    // * move = the i'th move of the game
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + " (" + step.clickedSquareCol + ", " + step.clickedSquareRow + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // Update status display
    let status;
    if (winner) {
      status = 'Winner: ' + winner["squares"][0];
      console.log("WINNER! " + JSON.stringify(winner));
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Get list of indexes of winning squares
    let winnerSquares = (winner != null) ? winner.winningSquares : [];

    return (
      <div>
        {/* GAME SETTINGS */}
        <form className="game-settings" onSubmit={this.handleSubmit}>
          <label>Settings</label>
          <input
            id="game-cols"
            onChange={this.handleChangeCols}
            value={this.state.newBoardCols}
          />
          <input
            id="game-rows"
            onChange={this.handleChangeRows}
            value={this.state.newBoardRows}
          />
          <button>New game</button>
        </form>

        {/* GAME BOARD */}
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              numOfCols={this.state.boardCols}
              numOfRows={this.state.boardRows}
              winnerSquares={winnerSquares}
            />
          </div>

          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// Given a series of squares, detect if a winner is present.
// Returns the name of the winning player if a winner is found,
// and returns null otherwise.
function calculateWinner(squares) {
  // Winning indexes
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Go thru every possible winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //console.log(squares);
    //console.log(a + " " + b + " " + c);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        squares: [squares[a], squares[b], squares[c]],
        winningSquares: [a, b, c]
      };
    }
  }
  return null;
}

// ========================================

// Render a Game component to DOM
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
