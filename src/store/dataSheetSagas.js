import { put, call, takeEvery } from 'redux-saga/effects'

import {
  DATASHEET_FETCH_REQUEST,
  DATASHEET_FETCH_SUCCESS,
  DATASHEET_FETCH_FAILURE
} from './dataSheetActions'

import fetchDataSheet from '../api/fetchDataSheet'

function * fetchRequest (action) {
  try {
    const data = yield call(fetchDataSheet)
    yield put({type: DATASHEET_FETCH_SUCCESS, payload: {data}})
  } catch (error) {
    yield put({type: DATASHEET_FETCH_FAILURE, payload: {error}})
  }
}

export default function * watchFetchData () {
  yield takeEvery(DATASHEET_FETCH_REQUEST, fetchRequest)
}
