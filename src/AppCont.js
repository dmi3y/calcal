import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchDataSheet,
  changeValue
} from './store/dataSheetActions'
import {
  scrollLayout
} from './store/layoutActions'
import {
  setLastChanged,
  commitLastChanged
} from './store/userDataActions'

import App from './App'

const mapStateToProps = (state) => {
  const { lookup, values, fetchedAt } = state.get('dataSheet').toJS()
  const { recommended } = state.get('user').toJS()
  const layout = state.get('layout').toJS()
  return {
    lookup,
    values,
    fetchedAt,
    recommended,
    layout
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDataSheet,
  setLastChanged,
  commitLastChanged,
  changeValue,
  scrollLayout
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
