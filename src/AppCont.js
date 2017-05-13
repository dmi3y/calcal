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
  const { lookup, filteredValues, fetchedAt, filters } = state.get('dataSheet').toJS()
  const values = state.getIn(['dataSheet', 'values'])
  const head = values.size >= 1 ? values.first().toJS() : []
  const body = values.size > 1 ? values.rest().toJS() : []
  const { recommended } = state.get('user').toJS()

  return {
    lookup,
    head,
    body,
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
