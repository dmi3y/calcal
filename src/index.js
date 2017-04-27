import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { combineReducers } from 'redux-immutablejs'
import { Map } from 'immutable'

import appReducers from './store/appReducers'
import appSagas from './store/appSagas'
import AppCont from './AppCont'
import './index.css'

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  ...appReducers
})

const initialState = Map()
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(appSagas)

ReactDOM.render(
  <Provider store={store}>
    <AppCont />
  </Provider>,
  document.getElementById('root')
)
