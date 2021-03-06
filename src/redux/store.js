import { createStore } from 'redux';
import { addSomething } from '../redux/actions';
import allReducers from '../redux/reducers/index';

// ========================================
// REDUX EXPERIMENT
// ========================================
export const store = createStore(allReducers);

console.log(store.getState());

store.subscribe(() => console.log(store.getState()));

// Dispatch some actions
store.dispatch(addSomething('This is a message!'));
store.dispatch(addSomething('Another message!'));
store.dispatch(addSomething('Tic tac toe or baduk? Thats the question'));
//store.dispatch(changeBoardCols(3));
//store.dispatch(changeBoardRows(3));

// Maps state values to prop values to be used in the component
export function mapStateToProps(state) {
  return {
    aListOfSomething: state.randomState.aListOfSomething,
    boardCols: state.settingsState.boardCols,
    boardRows: state.settingsState.boardRows,
    stepNumber: state.gameState.stepNumber,
    xIsNext: state.gameState.xIsNext,
    history: state.gameState.history,
  };
}
