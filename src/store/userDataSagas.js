import { takeEvery, put, select } from 'redux-saga/effects'

import {
  USERDATA_APPLY_LASTCHANGED
} from './userDataActions'

import {
  DATASHEET_CHANGE_VALUE
} from './dataSheetActions'

const getLastChanged = state => state.getIn(['user', 'lastChanged'])

function * changeValuesFromLastChanged () {
  const lastChanged = yield select(getLastChanged)
  for (let productLabel in lastChanged) {
    const data = lastChanged[productLabel]
    const isQuantity = data.coord.y === 1
    yield put({
      type: DATASHEET_CHANGE_VALUE,
      payload: { ...data },
      meta: { isQuantity }
    })
  }
}
export function * watchLastChangedApply () {
  yield takeEvery(USERDATA_APPLY_LASTCHANGED, changeValuesFromLastChanged)
}
