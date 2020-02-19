import React from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from '../redux/store';
import Square from './Square';
import { generateSquare } from './Square';

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

export default connect(mapStateToProps)(Board);
