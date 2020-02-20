import {
  RESET_STATE,
  ADD_TO_HISTORY,
  JUMP_TO_PREV_STATE,
} from '../actions';

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

function gameState(state = initialHistoryState, action) {
  switch (action.type) {
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
    case ADD_TO_HISTORY:
      // Get the current history
      const currentHistory = state.history.slice(0, state.stepNumber + 1); // all history up to current step number
      
      console.log("----- ADD_TO_HISTORY -----");
      console.log("rSQUARES: " + action.squares);
      console.log("rCOORDS: " + action.coordinates);
      console.log("rHISTORY: " + state.history.length);
      console.log("rHISTORY (sliced): " + currentHistory.length);
      console.log("rSTEPNUMBER: " + state.stepNumber);
      console.log("rXISNEXT: " + state.xIsNext);
      console.log("----- ADD_TO_HISTORY -----");
          
      return {
        ...state,
        history: currentHistory.concat([{
          squares: action.squares,
          clickedSquareCol: action.coordinates[0] + 1, // get the column from the index
          clickedSquareRow: action.coordinates[1] + 1, // get the row from the index
        }]),
        stepNumber: currentHistory.length,
        xIsNext: !state.xIsNext,
      };
    case JUMP_TO_PREV_STATE:
      console.log("----- JUMP_TO_PREV_STATE -----");
      console.log("rSTEPNUMBER: " + state.stepNumber);
      console.log("rXISNEXT: " + state.xIsNext);
      console.log("rSTEPNUMBER NEW: " + action.step);
      console.log("rXISNEXT NEW: " + ((action.step % 2) === 0));
      console.log("----- JUMP_TO_PREV_STATE -----");
      let stepNumber = Number(action.step);
      return {
        ...state,
        stepNumber: stepNumber,
        xIsNext: (stepNumber % 2) === 0,  
      };
    default:
      return state;
  }
}

export default gameState;
