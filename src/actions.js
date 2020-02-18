/*
 * action types
 */
export const ADD_SOMETHING = 'ADD_SOMETHING';
export const CHANGE_BOARD_COLS = 'CHANGE_BOARD_COLS';
export const CHANGE_BOARD_ROWS = 'CHANGE_BOARD_ROWS';
export const RESET_STATE = 'RESET_STATE';

/*
 * action creators
 */
export function addSomething(text) {
  return { type: ADD_SOMETHING, text };
}

export function changeBoardCols(num) {
  return { type: CHANGE_BOARD_COLS, num };
}

export function changeBoardRows(num) {
  return { type: CHANGE_BOARD_ROWS, num };
}

export function resetState() {
  return { type: RESET_STATE };
}
