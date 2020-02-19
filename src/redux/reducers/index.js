import { combineReducers } from 'redux';
import gameState from './gameState';
import randomState from './random';
import settingsState from './settings';

const allReducers = combineReducers({
  randomState,
  settingsState,
  gameState
});

export default allReducers;
