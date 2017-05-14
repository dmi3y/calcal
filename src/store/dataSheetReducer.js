// @flow
import { fromJS } from 'immutable'
import { createReducer } from 'redux-immutablejs'
import {
  take,
  concat
} from 'lodash'

import fzs from 'fuzzy.js'

import validateValue from '../validators/validateValue'

import {
  DATASHEET_FETCH_REQUEST,
  DATASHEET_FETCH_SUCCESS,
  DATASHEET_FETCH_FAILURE,
  DATASHEET_CHANGE_VALUE,
  DATASHEET_SET_FILTER,
  DATASHEET_APPLY_FILTER
} from './dataSheetActions'

import type { cellValue } from '../customTypes'

const DEFAULT = fromJS({
  isFetching: false,
  fetchedAt: null,
  isSuccess: null,
  data: [],
  lookup: {},
  values: [],
  filters: {
    label: ''
  },
  filteredValues: [0],
  error: null
})

function changeQuantity ({ coord, value }: cellValue, state: Object) {
  const { labelX: product } = coord
  const {norm: normalizedData, coord: {x: row}} = state.lookup[product]
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
    const isValid = validateValue(payload)
    if (isValid) {
      const lookupInfo = state.getIn(['lookup', payload.coord.labelX])
      if (lookupInfo) {
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
      } else {
        console.error('No lookup info for:', payload)
        return state
      }
    } else {
      console.error('Invalid value:', payload)
      return state
    }
  },
  [DATASHEET_SET_FILTER]: (state, {payload: value, meta}) => {
    return state.mergeIn(['filters'], {[meta.type]: value})
  },
  [DATASHEET_APPLY_FILTER]: (state) => {
    const THRESHOLD_LONG = 9
    const THRESHOLD_SHORT = 4
    const filters = state.get('filters')
    const values = state.get('values')
    const filteredValues = values.filter((value, ix) => {
      let hasPass: boolean = true
      const isFilterable = ix !== 0
      const filterLabelValue = filters.get('label')
      if (isFilterable && hasPass && filterLabelValue) {
        const match = fzs(value.getIn([0, 'value']), filterLabelValue)
        const THRESHOLD = filterLabelValue.length > 3 ? THRESHOLD_LONG : THRESHOLD_SHORT
        hasPass = match.score > THRESHOLD
      }
      return hasPass
    })
    return state.setIn(['filteredValues'], filteredValues.map(row => row.getIn([
      0,
      'coord',
      'x'
    ])))
  }
})
