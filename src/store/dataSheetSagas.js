import { put, call, takeEvery, throttle } from 'redux-saga/effects'

import {
  DATASHEET_FETCH_REQUEST,
  DATASHEET_FETCH_SUCCESS,
  DATASHEET_FETCH_FAILURE,
  DATASHEET_SET_FILTER,
  DATASHEET_APPLY_FILTER
} from './dataSheetActions'

import {
  USERDATA_RETRIVE_LASTCHANGED,
  USERDATA_APPLY_LASTCHANGED,
  USERDATA_SET_RECOMMENDED
} from './userDataActions'

import fetchDataSheet from '../api/fetchDataSheet'

function * fetchRequest () {
  try {
    const data = yield call(fetchDataSheet)
    yield put({type: DATASHEET_FETCH_SUCCESS, payload: {data}})
    yield put({type: USERDATA_RETRIVE_LASTCHANGED})
    yield put({type: USERDATA_APPLY_LASTCHANGED})
    yield put({type: USERDATA_SET_RECOMMENDED})
  } catch (error) {
    yield put({type: DATASHEET_FETCH_FAILURE, payload: {error}})
  }
}

export function * watchDataSheetFetch () {
  yield takeEvery(DATASHEET_FETCH_REQUEST, fetchRequest)
}

function * handleFilterInput () {
  yield put({type: DATASHEET_APPLY_FILTER})
}

export function * watchFilterInput () {
  yield throttle(500, DATASHEET_SET_FILTER, handleFilterInput)
}
