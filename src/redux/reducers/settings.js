import {
  CHANGE_BOARD_COLS,
  CHANGE_BOARD_ROWS,
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
    default:
      return state;
  }
}

export default changeSettings;
