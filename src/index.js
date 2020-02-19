import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import { addSomething, changeBoardCols, changeBoardRows, resetState, addToHistory, jumpToPrevState } from './actions';
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
//store.dispatch(changeBoardCols(3));
//store.dispatch(changeBoardRows(3));

// Maps state values to prop values to be used in the component
function mapStateToProps(state) {
  return {
    aListOfSomething: state.addSomething.aListOfSomething,
    boardCols: state.changeSettings.boardCols,
    boardRows: state.changeSettings.boardRows,
    stepNumber: state.changeHistory.stepNumber,
    xIsNext: state.changeHistory.xIsNext,
    history: state.changeHistory.history,
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

const ConnectedBoard = connect(mapStateToProps)(Board);

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
    this.state = {
      newBoardCols: 3,
      newBoardRows: 3,
    };
  }

  // Set the number of columns for the next game
  handleChangeCols(e) {
    console.log("CHANGING THE COL FROM " + this.props.boardCols + " TO " + e.target.value);
    this.setState({ newBoardCols: e.target.value });
  }

  // Set the number of rows for the next game
  handleChangeRows(e) {
    console.log("CHANGING THE ROW FROM " + this.props.boardRows + " TO " + e.target.value);    
    this.setState({ newBoardRows: e.target.value });
  }

  // Submit the form and start a new game with the new dimensions
  handleSubmit(e) {
    e.preventDefault();
    //this.props.dispatch(addSomething('I started a new game with dimensions (' + this.state.newBoardCols + ',' + this.state.newBoardRows + ')!' ));
    console.log("boardCols = " + this.props.boardCols);
    console.log("boardRows = " + this.props.boardRows);
    /*
    this.setState({
      boardCols: this.state.newBoardCols,
      boardRows: this.state.newBoardRows,
    });
    */
    this.props.dispatch(changeBoardCols(this.state.newBoardCols));
    this.props.dispatch(changeBoardRows(this.state.newBoardRows));
    
    // Reset the game state (start a new game)
    this.props.dispatch(resetState());
  }
  
  render() {
    return (
      <form className="game-settings" onSubmit={this.handleSubmit}>
        <label>Settings</label>
        <input
          id="game-cols"
          onChange={this.handleChangeCols}
          value={this.newBoardCols}
        />
        <input
          id="game-rows"
          onChange={this.handleChangeRows}
          value={this.newBoardRows}
        />
        <button>New game</button>
      </form>
    );
  }
}

const ConnectedSettings = connect(mapStateToProps)(Settings);

// ========================================
// GAMEHISTORYBUTTONS COMPONENT
// Holds buttons that allow the player to revert to an earlier stage in the game.
// ========================================
class GameHistoryButtons extends React.Component {

  constructor(props) {
    super(props);
    this.handleJumpTo = this.handleJumpTo.bind(this);
  }

  // Jump to a previous state
  handleJumpTo(e) {
    e.preventDefault();
    console.log("handleJumpTo() step = " + e.target.value);
    console.log(e.target.value);
    this.props.dispatch(jumpToPrevState(e.target.value));
    /*this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });*/
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

const ConnectedGameHistoryButtons = connect(mapStateToProps)(GameHistoryButtons);


// ========================================
// GAME COMPONENT
// The main component on which all other components are controlled by.
// ========================================
class Game extends React.Component {

  // Define some state attributes
  constructor(props) {
    super(props);
    /*this.state = {
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
    };*/
  }
  
  // Process a click at the i'th square
  handleClick(i) {
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
    /*this.setState({
      history: history.concat([{
        squares: squares,
        clickedSquareCol: coordinates[0] + 1, // get the column from the index
        clickedSquareRow: coordinates[1] + 1, // get the row from the index
      }]),
      stepNumber: history.length,
      xIsNext: !this.props.xIsNext,
    });*/
    console.log("==============================");
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
        <ConnectedSettings />

        {/* GAME BOARD */}
        <div className="game">
          <div className="game-board">
            <ConnectedBoard
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
              <ConnectedGameHistoryButtons
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

// ========================================

const ConnectedGame = connect(mapStateToProps)(Game);

// Render a Game component to DOM
ReactDOM.render(
  <Provider store={store}>
    <ConnectedGame />
  </Provider>,
  document.getElementById('root')
);
