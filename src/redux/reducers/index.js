import { combineReducers } from 'redux';
import changeHistory from './gameState';
import addSomething from './random';
import changeSettings from './settings';

const allReducers = combineReducers({
  addSomething,
  changeSettings,
  changeHistory
});

export default allReducers;
