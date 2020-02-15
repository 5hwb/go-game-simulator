import { combineReducers } from 'redux';
import {
  ADD_SOMETHING
} from './actions';

function theSomething(state = [], action) {
  switch (action.type) {
    case ADD_SOMETHING:
      // Concat a new entry at the end of the list of texts
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    default:
      return state;
  }
}
const someApp = combineReducers({
  theSomething
});
export default someApp;
