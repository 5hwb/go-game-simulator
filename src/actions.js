/*
 * action types
 */
export const ADD_SOMETHING = 'ADD_SOMETHING';

/*
 * action creators
 */
export function addSomething(text) {
  return { type: ADD_SOMETHING, text };
}
