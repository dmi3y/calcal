// @flow
import { fromJS } from 'immutable'
import { createReducer } from 'redux-immutablejs'

import fzs from 'fuzzy.js'
import { isNil } from 'lodash'

import validateValue from '../validators/validateValue'

import {
  DATASHEET_FETCH_REQUEST,
  DATASHEET_FETCH_SUCCESS,
  DATASHEET_FETCH_FAILURE,
  DATASHEET_CHANGE_VALUE,
  DATASHEET_SET_FILTER,
  DATASHEET_APPLY_FILTER
} from './dataSheetActions'

const DEFAULT = fromJS({
  isFetching: false,
  fetchedAt: null,
  isSuccess: null,
  data: [],
  lookup: {
    products: {},
    nutrients: {}
  },
  values: [],
  filters: {
    label: '',
    minAmount: -1
  },
  filteredValues: [],
  error: null
})

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
    console.log(payload, meta)
    if (isValid) {
      const productLookup = state.getIn(['lookup', 'products', payload.coord.labelX])
      if (productLookup) {
        const productNorm = productLookup.get('norm')
        const { value } = payload
        const productX = productLookup.get('x')
        let productValue = value
        if (!meta.isQuantity) {
          const nutrientIndex = state.getIn(['lookup', 'nutrients', payload.coord.labelY])
          if (!isNil(nutrientIndex)) {
            const normalizedNutrientValue = productNorm.get(nutrientIndex)
            productValue = value / normalizedNutrientValue
          } else {
            console.error('No nutrient index info for', payload)
            return state
          }
        }
        const newRowValues = productNorm.map(it => it > 0 ? it * productValue : -1).unshift(productValue)
        return state.updateIn([
          'values',
          productX
        ], row => row.map((it, ix) =>
            ix > 0 ? it.set('value', newRowValues.get(ix - 1)) : it
          )
        )
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
    const THRESHOLD_SHORT = 3
    const filters = state.get('filters')
    const values = state.get('values')
    const filteredValues = values.rest().filter((value, ix) => {
      let hasPass: boolean = true
      const isFilterable = true
      // Label Filter
      const filterLabelValue = filters.get('label')
      if (isFilterable && hasPass && filterLabelValue) {
        const match = fzs(value.getIn([0, 'value']), filterLabelValue)
        const THRESHOLD = filterLabelValue.length > 3 ? THRESHOLD_LONG : THRESHOLD_SHORT
        hasPass = match.score > THRESHOLD
      }
      // Min Amount Filter
      const filterMinAmount = filters.get('minAmount')
      if (isFilterable && hasPass && filterMinAmount > -1) {
        const amount = value.getIn([1, 'value'])
        hasPass = amount > filterMinAmount
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
