import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux';
import allReducers from './redux/reducers/index';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import Game from './components/Game';
import { store } from './redux/store';

// ========================================

// Render a Game component to DOM
ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('root')
);
