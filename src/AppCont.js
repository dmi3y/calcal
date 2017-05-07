import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchDataSheet,
  changeValue,
  applyFilter
} from './store/dataSheetActions'
import {
  setLastChanged,
  commitLastChanged
} from './store/userDataActions'

import App from './App'

const mapStateToProps = (state) => {
  const { lookup, values, filteredValues, fetchedAt, filters } = state.get('dataSheet').toJS()
  const { recommended } = state.get('user').toJS()
  return {
    lookup,
    values,
    filteredValues,
    fetchedAt,
    recommended,
    filters
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDataSheet,
  setLastChanged,
  commitLastChanged,
  changeValue,
  applyFilter
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
