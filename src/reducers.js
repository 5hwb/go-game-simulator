import { combineReducers } from 'redux';
import {
  ADD_SOMETHING,
  CHANGE_BOARD_COLS,
  CHANGE_BOARD_ROWS,
} from './actions';

const initialRandomState = {
  aListOfSomething: [],
};

const initialSettingsState = {
  boardCols: 3,
  boardRows: 3,
};

const initialHistoryState = {
  history: [
    {
        squares: Array(9).fill(null),
        clickedSquareCol: -1,
        clickedSquareRow: -1,
    }
  ],
};

const initialGameState = {
  stepNumber: 0,
  xIsNext: true,
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
    default:
      return state;
  }
}

const allReducers = combineReducers({
  addSomething,
  changeSettings
});

export default allReducers;
