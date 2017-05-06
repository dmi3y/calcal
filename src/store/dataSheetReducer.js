// @flow
import { fromJS } from 'immutable'
import { createReducer } from 'redux-immutablejs'
import {
  take,
  concat
} from 'lodash'

import {
  DATASHEET_FETCH_REQUEST,
  DATASHEET_FETCH_SUCCESS,
  DATASHEET_FETCH_FAILURE,
  DATASHEET_CHANGE_VALUE
} from './dataSheetActions'

import { infoSymbol } from '../api/fetchDataSheet'
import type { cellValue } from '../customTypes'

const DEFAULT = fromJS({
  isFetching: false,
  fetchedAt: null,
  isSuccess: null,
  data: [],
  lookup: {},
  values: [],
  filter: {
    title: null
  },
  filteredValues: [],
  error: null
})

function changeQuantity ({ coord, value }: cellValue, state: Object) {
  const { x: row, labelX: product } = coord
  const normalizedData = state.lookup[product][infoSymbol]
  const values = state.values
  const head = take(values[row])
  const normalizedInfo = normalizedData.map(it => {
    const newValue = it > 0 ? it * value : -1
    return {
      coord,
      value: newValue
    }
  })
  const newRow = concat(head, {coord, value}, normalizedInfo)
  values[row] = newRow
  return values
}

function changeNutrient ({ coord, value }: cellValue, state: Object) {
  const {labelX: product, labelY: nutrient} = coord
  const normalizedNutrientValue = state.lookup[product][nutrient]
  const productValue = value / normalizedNutrientValue
  return changeQuantity({coord, value: productValue}, state)
}

export default createReducer(DEFAULT, {
  [DATASHEET_FETCH_REQUEST]: (state, action) =>
    state.merge(fromJS({
      isFetching: true,
      data: [],
      isSuccess: null
    })),
  [DATASHEET_FETCH_SUCCESS]: (state, action) =>
    state.merge(fromJS(action.payload.data)),
  [DATASHEET_FETCH_FAILURE]: (state, action) =>
    state.merge(fromJS({
      isFetching: false,
      data: [],
      isSuccess: false,
      error: action.payload.error
    })),
  [DATASHEET_CHANGE_VALUE]: (state, {payload, meta}) => {
    const plainState = state.toJS()
    let values
    if (meta.isQuantity) {
      values = changeQuantity(payload, plainState)
    } else {
      values = changeNutrient(payload, plainState)
    }
    return state.merge({
      values: fromJS(values)
    })
  }
})
