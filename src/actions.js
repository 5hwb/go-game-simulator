/*
 * action types
 */
export const ADD_SOMETHING = 'ADD_SOMETHING';
export const CHANGE_BOARD_COLS = 'CHANGE_BOARD_COLS';
export const CHANGE_BOARD_ROWS = 'CHANGE_BOARD_ROWS';
export const RESET_STATE = 'RESET_STATE';
export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';
export const JUMP_TO_PREV_STATE = 'JUMP_TO_PREV_STATE';

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

export function addToHistory(squares, coordinates) {
  return { type: ADD_TO_HISTORY, squares, coordinates };
}

export function jumpToPrevState() {
  return { type: JUMP_TO_PREV_STATE };
}
