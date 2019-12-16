import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

  // Map an array of values into a list of rendered square elements
  renderRow(valRow) {
    return valRow.map((val) =>
      this.renderSquare(val)
    );
  }

  // Map a 2D array input to a list of rendered row elements
  renderAllRows(vals) {
    return vals.map((valRow) =>
      <div className="board-row">
        {this.renderRow(valRow)}
      </div>
    );
  }
  
  render() {
    const num_of_cols = 3;
    const num_of_rows = 3;

    const vals = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ];

    // A div element containing 9 squares in a grid
    return (
      <div>
        {this.renderAllRows(vals)}
      </div>
    );
  }
}

class Game extends React.Component {

  // Define some attributes
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickedSquareCol: -1,
        clickedSquareRow: -1,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clickedSquareCol: (i % 3) + 1,           // get the column from the index
        clickedSquareRow: Math.floor(i / 3) + 1, // get the row from the index
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // step = an element in the 'history' array game state
    // move = the i'th move of the game
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

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
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

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    console.log(squares);
    console.log(a + " " + b + " " + c);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
