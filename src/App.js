// @flow
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import keymap from './keymap'
import { ShortcutManager } from 'react-shortcuts'

import type { cellCoord, cellValue } from './customTypes'

import Layout from './Layout'
import './App.css'

const shortcutManager = new ShortcutManager(keymap)

type props = {
  fetchDataSheet: Function,
  changeValue: Function,
  applyFilter: Function,
  setRecommended: Function,
  setLastChanged: Function,
  retriveLastChanged: Function,
  commitLastChanged: Function,
  lookup: Object,
  filters: Object,
  recommended: Object,
  head: Array<*>,
  body: Array<*>,
  filteredValues: Array<number>,
  fetchedAt: string
}

export default class App extends PureComponent<*, props, *> {
  getChildContext () {
    return { shortcuts: shortcutManager }
  }

  static childContextTypes = {
    shortcuts: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.fetchDataSheet()
  }

  changeValue (valuePack: cellValue) {
    const { coord: {y} } = valuePack
    const isQuantity = y === 1

    this.props.changeValue(valuePack, isQuantity)
    this.props.setLastChanged(valuePack)
    this.props.commitLastChanged()
  }

  onValueChange = (coord: cellCoord, e: Object) => {
    const value = Number(e.target.value)
    let shouldChangeValue = value >= 0

    if (shouldChangeValue) {
      this.changeValue({coord, value})
    }
  }

  renderNoData () {
    return <div className='app__no-data'>
      Calculate it.
    </div>
  }

  render () {
    const { head, body, fetchedAt, recommended, filteredValues, filters } = this.props
    return (
      fetchedAt
      ? <Layout
        head={head}
        body={body}
        recommended={recommended}
        onValueChange={this.onValueChange}
        applyFilter={this.props.applyFilter}
        filters={filters}
        filteredValues={filteredValues}
      />
      : this.renderNoData()
    )
  }
}
