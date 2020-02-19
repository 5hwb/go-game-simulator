import {
  CHANGE_BOARD_COLS,
  CHANGE_BOARD_ROWS,
  RESET_STATE,
} from '../actions';

const initialSettingsState = {
  // Board dimensions
  boardCols: 3,
  boardRows: 3,
};

function changeSettings(state = initialSettingsState, action) {
  switch (action.type) {
    case CHANGE_BOARD_COLS:
      return {
        ...state,
        boardCols: action.num
      };
    case CHANGE_BOARD_ROWS:
      return {
        ...state,
        boardRows: action.num
      };
    // right... this should be in gameState.js
    case RESET_STATE:
      return {
        ...state,
        history: [{
          squares: Array(9).fill(null),
          clickedSquareCol: -1,
          clickedSquareRow: -1,
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    default:
      return state;
  }
}

export default changeSettings;
