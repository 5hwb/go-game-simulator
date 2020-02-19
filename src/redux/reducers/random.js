import {
  ADD_SOMETHING,
} from '../actions';

const initialRandomState = {
  aListOfSomething: [],
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

export default addSomething;
