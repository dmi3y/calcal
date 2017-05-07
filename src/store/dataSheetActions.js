// @flow
import type { cellValue } from '../customTypes'

export const DATASHEET_FETCH_REQUEST = 'DATASHEET_FETCH_REQUEST'
export const DATASHEET_FETCH_SUCCESS = 'DATASHEET_FETCH_SUCCESS'
export const DATASHEET_FETCH_FAILURE = 'DATASHEET_FETCH_FAILURE'
export const DATASHEET_CHANGE_VALUE = 'DATASHEET_CHANGE_VALUE'
export const DATASHEET_SET_FILTER = 'DATASHEET_SET_FILTER'
export const DATASHEET_APPLY_FILTER = 'DATASHEET_APPLY_FILTER'

export function fetchDataSheet () {
  return { type: DATASHEET_FETCH_REQUEST, payload: {} }
}

export function applyFilter (filter: {| type: string, value: * |}) {
  return { type: DATASHEET_SET_FILTER, payload: filter.value, meta: {type: filter.type} }
}

export function changeValue (valuePack: cellValue, isQuantity: boolean) {
  return {
    type: DATASHEET_CHANGE_VALUE,
    payload: valuePack,
    meta: {isQuantity}
  }
}
