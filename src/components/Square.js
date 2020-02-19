import React from 'react';
import { connect } from 'react-redux';

// ========================================
// SQUARE COMPONENT
// A Square is a cell on the Board component that holds a player piece.
// ========================================
export default function Square(props) {

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
export function generateSquare(numOfCols, numOfRows) {
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
