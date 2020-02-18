import { combineReducers } from 'redux';
import {
  ADD_SOMETHING,
  CHANGE_BOARD_COLS,
  CHANGE_BOARD_ROWS,
  RESET_STATE,
  ADD_TO_HISTORY,
  JUMP_TO_PREV_STATE,
} from './actions';

const initialRandomState = {
  aListOfSomething: [],
};

const initialSettingsState = {
  // Board dimensions
  boardCols: 3,
  boardRows: 3,
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
  // Move number
  stepNumber: 0,
  // Is X the next player?
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

function changeHistory(state = initialHistoryState, action) {
  switch (action.type) {
    case ADD_TO_HISTORY:
      // Get the current history
      const history = state.history.slice(0, state.stepNumber + 1); // all history up to current step number
      
      console.log("------------------------------");
      console.log("rSQUARES: " + action.squares);
      console.log("rCOORDS: " + action.coordinates);
      console.log("rHISTORY: " + JSON.stringify(state.history));
      console.log("rSTEPNUMBER: " + state.stepNumber);
      console.log("rXISNEXT: " + state.xIsNext);
          
      return {
        ...state,
        history: history.concat([{
          squares: action.squares,
          clickedSquareCol: action.coordinates[0] + 1, // get the column from the index
          clickedSquareRow: action.coordinates[1] + 1, // get the row from the index
        }]),
        stepNumber: history.length,
        xIsNext: !state.xIsNext,
      };
    case JUMP_TO_PREV_STATE:
      return {
        ...state,
        stepNumber: action.step,
        xIsNext: (action.step % 2) === 0,
      };
    default:
      return state;
  }
}

const allReducers = combineReducers({
  addSomething,
  changeSettings,
  changeHistory
});

export default allReducers;
