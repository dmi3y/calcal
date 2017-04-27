import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchDataSheet,
  changeValue
} from './store/dataSheetActions'
import {
  scrollLayout
} from './store/layoutActions'

import App from './App'

const mapStateToProps = (state) => {
  const dataSheet = state.get('dataSheet').toJS()
  const layout = state.get('layout').toJS()
  return {
    ...dataSheet,
    layout
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDataSheet,
  changeValue,
  scrollLayout
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(App)
