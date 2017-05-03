import { watchDataSheetFetch } from './dataSheetSagas'
import { watchLastChangedApply } from './userDataSagas'

// single entry point to start all Sagas at once
export default function * rootSaga () {
  yield [
    watchDataSheetFetch(),
    watchLastChangedApply()
  ]
}
