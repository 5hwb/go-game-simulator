import React from 'react';
import { connect } from 'react-redux';
import { changeBoardCols, changeBoardRows, resetState } from '../redux/actions';
import { mapStateToProps } from '../redux/store';

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
  // TODO Game is not being reset - find out why!
  handleSubmit(e) {
    e.preventDefault();
    console.log("boardCols = " + this.props.boardCols);
    console.log("boardRows = " + this.props.boardRows);
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

export default connect(mapStateToProps)(Settings);
