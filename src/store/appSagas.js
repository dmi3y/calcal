import dataSheetSagas from './dataSheetSagas'

// single entry point to start all Sagas at once
export default function * rootSaga () {
  yield [
    dataSheetSagas()
  ]
}
