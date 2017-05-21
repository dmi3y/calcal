// @flow
import React, { PureComponent } from 'react'

import type { cellCoord, cellValue } from './customTypes'
import validateValue from './validators/validateValue'

import Layout from './Layout'
import './App.css'

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
  componentDidMount () {
    this.props.fetchDataSheet()
  }

  changeValue (valuePack: cellValue) {
    const isValidValue = validateValue(valuePack)

    if (isValidValue) {
      const { coord, value } = valuePack
      const isQuantity = coord.y === 1

      this.props.changeValue(valuePack, isQuantity)
      this.props.setLastChanged(valuePack)
      this.props.commitLastChanged()

      console.log('changed value at:', coord, value)
    } else {
      console.warn('got invalid value', valuePack)
    }
  }

  onValueChange = (coord: cellCoord, e: Object) => {
    const {labelX: product, labelY: nutrient, y} = coord
    const isNotQuantity = y !== 1
    const value = Number(e.target.value)
    let shouldChangeValue = true

    if (isNotQuantity) {
      const lookupValue = this.props.lookup[product][nutrient]
      shouldChangeValue = Boolean(lookupValue) && value >= 0
    }
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
    let displayValues = body
    if (filters.minAmount > -1) {
      displayValues = body.filter((row) => filteredValues.includes(row[0].coord.x))
    }
    return (
      fetchedAt
      ? <Layout
        head={head}
        body={displayValues}
        recommended={recommended}
        onValueChange={this.onValueChange}
        applyFilter={this.props.applyFilter}
        filters={filters}
      />
      : this.renderNoData()
    )
  }
}
