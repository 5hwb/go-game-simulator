import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ========================================
// SQUARE COMPONENT
// ========================================
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

// ========================================
// BOARD COMPONENT
// ========================================
class Board extends React.Component {

  // Render a square element of the board
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
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
    // Dimension of board is hardcoded for now
    const numOfCols = 3;
    const numOfRows = 3;

    // Generate a 2D array with the elements arranged as shown:
    /*
    var vals = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ];
    */
    // This 2D array will be used to generate the grid
    var vals = [];
    for (var i = 0; i < numOfRows; i++) {
      var valRow = [];
      for (var j = 0; j < numOfCols; j++) {
        valRow.push(j + (i*numOfCols));
      }
      vals.push(valRow);
    }

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
    this.state = {
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

    // Update state
    this.setState({
      history: history.concat([{
        squares: squares,
        clickedSquareCol: (i % 3) + 1,           // get the column from the index
        clickedSquareRow: Math.floor(i / 3) + 1, // get the row from the index
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    console.log("==============================");
    console.log("HISTORY: " + JSON.stringify(this.state.history));
    console.log("STEPNUMBER: " + this.state.stepNumber);
    console.log("XISNEXT: " + this.state.xIsNext);
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

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
        values: [a, b, c]
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
