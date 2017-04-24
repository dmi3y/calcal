import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {
  combineReducers
} from 'redux-immutable'
import { Map } from 'immutable'

import appReducers from './store/appReducers'
import App from './App'
import './index.css'

const rootReducer = combineReducers({
  ...appReducers
})

const initialState = Map()
const store = createStore(
  rootReducer,
  initialState
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
