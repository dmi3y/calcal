// @flow
import { fromJS } from 'immutable'
import { createReducer } from 'redux-immutablejs'

import {
  USERDATA_COMMIT_LASTCHANGED,
  USERDATA_SET_LASTCHANGED,
  USERDATA_SET_RECOMMENDED,
  USERDATA_RETRIVE_LASTCHANGED
} from './userDataActions'

import type { cellValue } from '../customTypes'

const recommendedMap = {
  'кКал (Кк)': 1400,
  'Белки (г)': 79,
  'Жиры (г)': 63,
  'Угл (г)': 132,
  'Вит А (мкг)': 900,
  'Вит С (мг)': 90,
  'Кальций (мг)': 1000,
  'Омега 3 (мг)': 3,
  'Цинк (мг)': 10,
  'Железо Fe (mg)': 18
}

const DEFAULT = fromJS({
  recommended: {},
  lastChanged: {}
})

export default createReducer(DEFAULT, {
  [USERDATA_SET_LASTCHANGED]: (state, action) => {
    const value: cellValue = action.payload
    const lastChanged = state.get('lastChanged')
    lastChanged[value.coord.labelX] = value
    return state.set('lastChanged', lastChanged)
  },
  [USERDATA_COMMIT_LASTCHANGED]: (state, action) => {
    const lastChanged = state.get('lastChanged')
    window.sessionStorage.setItem('userData', JSON.stringify(lastChanged))
    return state
  },
  [USERDATA_RETRIVE_LASTCHANGED]: (state, action) => {
    const lastChanged = JSON.parse(window.sessionStorage.getItem('userData')) || {}
    return state.set('lastChanged', lastChanged)
  },
  [USERDATA_SET_RECOMMENDED]: (state, action) =>
    state.set('recommended', recommendedMap)
})
