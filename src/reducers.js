import { combineReducers } from 'redux';
import {
  ADD_SOMETHING,
  CHANGE_BOARD_COLS,
  CHANGE_BOARD_ROWS,
  RESET_STATE,
} from './actions';

const initialRandomState = {
  aListOfSomething: [],
};

const initialSettingsState = {
  // Board dimensions
  boardCols: 3,
  boardRows: 3,
  // Move number
  stepNumber: 0,
  // Is X the next player?
  xIsNext: true,
};

const initialHistoryState = {
  // Game move history
  history: [
    {
        squares: Array(9).fill(null),
        clickedSquareCol: -1,
        clickedSquareRow: -1,
    }
  ],
};

function addSomething(state = initialRandomState, action) {
  switch (action.type) {
    case ADD_SOMETHING:
      // Concat a new entry at the end of the list of texts
      return {
        ...state,
        aListOfSomething: [
          ...state['aListOfSomething'],
          {
            text: action.text,
            completed: false
          }
        ]
      };
    default:
      return state;
  }
}

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

const allReducers = combineReducers({
  addSomething,
  changeSettings
});

export default allReducers;
