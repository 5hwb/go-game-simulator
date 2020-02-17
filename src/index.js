import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { addSomething, changeBoardCols, changeBoardRows } from './actions';
import allReducers from './reducers';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

// ========================================
// REDUX EXPERIMENT
// ========================================
const store = createStore(allReducers);

console.log(store.getState());

const unsubscribe = store.subscribe(() => console.log(store.getState()));

// Dispatch some actions
store.dispatch(addSomething('This is a message!'));
store.dispatch(addSomething('Another message!'));
store.dispatch(addSomething('Tic tac toe or baduk? Thats the question'));
store.dispatch(changeBoardCols(89));
store.dispatch(changeBoardRows(37));

function mapStateToProps(state) {
  return {
    aListOfSomething: state.addSomething.aListOfSomething,
    boardCols: state.changeSettings.boardCols,
    boardRows: state.changeSettings.boardRows,
  };
}

// ========================================
// SQUARE COMPONENT
// A Square is a cell on the Board component that holds a player piece.
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
// A Board is a grid of Square components, representing the board on which the game is played.
// ========================================
class Board extends React.Component {

  // Render a square element of the board
  renderSquare(i) {
    // Check if the square being rendered is part of the winning combination
    var isWinnerSquare = this.props.winnerSquares.includes(i);
    // Set the key as its index
    return (
      <Square
        key={i}
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
    // Set the key of the row to be the index of its 1st element
    return vals.map((valRow) =>
      <div className="board-row" key={valRow[0]}>
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
// SETTINGS COMPONENT
// Contains a form where the user can modify the size of the Board.
// ========================================
class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.handleChangeCols = this.handleChangeCols.bind(this);
    this.handleChangeRows = this.handleChangeRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Set the number of columns for the next game
  handleChangeCols(e) {
    return this.props.handleChangeCols(e);
  }

  // Set the number of rows for the next game
  handleChangeRows(e) {
    return this.props.handleChangeRows(e);
  }

  // Submit the form and start a new game with the new dimensions
  handleSubmit(e) {
    return this.props.handleSubmit(e);
  }

  render() {
    return (
      <form className="game-settings" onSubmit={this.handleSubmit}>
        <label>Settings</label>
        <input
          id="game-cols"
          onChange={this.handleChangeCols}
          value={this.props.newBoardCols}
        />
        <input
          id="game-rows"
          onChange={this.handleChangeRows}
          value={this.props.newBoardRows}
        />
        <button>New game</button>
      </form>
    );
  }
}

// ========================================
// GAMEHISTORYBUTTONS COMPONENT
// Holds buttons that allow the player to revert to an earlier stage in the game.
// ========================================
class GameHistoryButtons extends React.Component {

  constructor(props) {
    super(props);
    this.handleJumpTo = this.handleJumpTo.bind(this);
  }

  handleJumpTo(e) {
    return this.props.handleJumpTo(e.target.value);
  }

  render() {
    // Generate buttons to 'step back' into a previous state.
    // * step = an element in the 'history' array game state
    // * move = the i'th move of the game
    const moves = this.props.history.map((step, move) => {
      console.log("MOVE: " + move);
      const desc = move ?
        'Go to move #' + move + " (" + step.clickedSquareCol + ", " + step.clickedSquareRow + ")" :
        'Go to game start';
      return (
        <li key={move}>
          <button value={move} onClick={this.handleJumpTo}>{desc}</button>
        </li>
      );
    });
    return moves;
  }
}

// ========================================
// GAME COMPONENT
// The main component on which all other components are controlled by.
// ========================================
class Game extends React.Component {

  // Define some state attributes
  constructor(props) {
    super(props);
    this.handleChangeCols = this.handleChangeCols.bind(this);
    this.handleChangeRows = this.handleChangeRows.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleJumpTo = this.handleJumpTo.bind(this);
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
    if (calculateWinner(squares, this.state.boardCols, this.state.boardRows)
        || squares[i]) {
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
    this.props.dispatch(addSomething('I started a new game with dimensions (' + this.state.newBoardCols + ',' + this.state.newBoardRows + ')!' ));
    console.log("aListOfSomething = " + this.props.aListOfSomething[0]['text']);
    this.setState({
      boardCols: this.state.newBoardCols,
      boardRows: this.state.newBoardRows,
    });
    this.resetState();
  }

  // Jump to a previous state
  handleJumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // Render a Game component
  render() {
    const history = this.state.history; // all history
    const current = history[this.state.stepNumber]; // the current state
    const winner = calculateWinner(current.squares, this.state.boardCols, this.state.boardRows); // return object containing winning squares and their indexes

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
        <Settings
          newBoardCols={this.state.newBoardCols}
          newBoardRows={this.state.newBoardRows}
          handleChangeCols={this.handleChangeCols}
          handleChangeRows={this.handleChangeRows}
          handleSubmit={this.handleSubmit} />

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
            <ol>
              <GameHistoryButtons
                history={this.state.history}
                handleJumpTo={this.handleJumpTo} />
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

// ========================================

const RealGame = connect(mapStateToProps)(Game);

// Render a Game component to DOM
ReactDOM.render(
  <Provider store={store}>
    <RealGame />
  </Provider>,
  document.getElementById('root')
);
