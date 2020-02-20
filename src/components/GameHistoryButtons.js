import React from 'react';
import { connect } from 'react-redux';
import { jumpToPrevState } from '../redux/actions';
import { mapStateToProps } from '../redux/store';

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
  // TODO Game is not being reset - find out why!
  handleJumpTo(e) {
    e.preventDefault();
    console.log("handleJumpTo() step = " + e.target.value);
    console.log(e.target.value);
    this.props.dispatch(jumpToPrevState(e.target.value));
  }

  render() {
    // Generate buttons to 'step back' into a previous state.
    // * step = an element in the 'history' array game state
    // * move = the i'th move of the game
    const moves = this.props.history.map((step, move) => {
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

export default connect(mapStateToProps)(GameHistoryButtons);
