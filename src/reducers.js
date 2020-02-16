import { combineReducers } from 'redux';
import {
  ADD_SOMETHING
} from './actions';

const initialState = {
  aListOfSomething: []
};

function theReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SOMETHING:
      // Concat a new entry at the end of the list of texts
      return {
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
const allReducers = combineReducers({
  theReducer
});
export default allReducers;
