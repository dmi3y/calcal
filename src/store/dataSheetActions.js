// @flow
import type { cellValue } from '../customTypes'

export const DATASHEET_FETCH_REQUEST = 'DATASHEET_FETCH_REQUEST'
export const DATASHEET_FETCH_SUCCESS = 'DATASHEET_FETCH_SUCCESS'
export const DATASHEET_FETCH_FAILURE = 'DATASHEET_FETCH_FAILURE'
export const DATASHEET_CHANGE_VALUE = 'DATASHEET_CHANGE_VALUE'

export function fetchDataSheet () {
  return { type: DATASHEET_FETCH_REQUEST, payload: {} }
}

export function changeValue (valuePack: cellValue, isQuantity: boolean) {
  return {
    type: DATASHEET_CHANGE_VALUE,
    payload: {...valuePack},
    meta: {isQuantity}
  }
}
