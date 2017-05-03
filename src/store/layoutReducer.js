// @flow
import { fromJS } from 'immutable'
import { createReducer } from 'redux-immutablejs'

import {
  WINDOW_SCROLL
} from './layoutActions'

const DEFAULT = fromJS({
  left: 0,
  top: 0,
  width: 0,
  height: 0
})

export default createReducer(DEFAULT, {
  [WINDOW_SCROLL]: (state, action) =>
    state.merge({
      ...action.payload
    })
})
