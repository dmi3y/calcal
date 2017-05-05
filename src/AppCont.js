import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchDataSheet,
  changeValue
} from './store/dataSheetActions'
import {
  setLastChanged,
  commitLastChanged
} from './store/userDataActions'

import App from './App'

const mapStateToProps = (state) => {
  const { lookup, values, fetchedAt } = state.get('dataSheet').toJS()
  const { recommended } = state.get('user').toJS()
  return {
    lookup,
    values,
    fetchedAt,
    recommended
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDataSheet,
  setLastChanged,
  commitLastChanged,
  changeValue
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
