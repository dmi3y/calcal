// @flow

export const USERDATA_COMMIT_LASTCHANGED = 'USERDATA_COMMIT_LASTCHANGED'
export const USERDATA_RETRIVE_LASTCHANGED = 'USERDATA_RETRIVE_LASTCHANGED'
export const USERDATA_APPLY_LASTCHANGED = 'USERDATA_RETRIVE_LASTCHANGED'
export const USERDATA_SET_LASTCHANGED = 'USERDATA_SET__LASTCHANGED'
export const USERDATA_SET_RECOMMENDED = 'USERDATA_GET_RECOMMENDED'

import type { cellValue } from '../customTypes'

export function setLastChanged (value: cellValue) {
  return { type: USERDATA_SET_LASTCHANGED, payload: value }
}

export function commitLastChanged () {
  return { type: USERDATA_COMMIT_LASTCHANGED }
}
