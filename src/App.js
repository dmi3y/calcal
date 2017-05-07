// @flow
import React, { PureComponent } from 'react'
import {
  isFinite,
  isString,
  isPlainObject,
  isNumber,
  pullAt
} from 'lodash'

import type { cellCoord, cellValue } from './customTypes'

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
  values: Array<*>,
  filteredValues: Array<number>,
  fetchedAt: string
}

export default class App extends PureComponent<*, props, *> {
  componentDidMount () {
    this.props.fetchDataSheet()
  }

  validateValue ({coord, value}: cellValue) {
    let isValid = false
    const hasValue = isFinite(value) || isString(value)
    const hasCoord = isPlainObject(coord)
    if (hasValue && hasCoord) {
      const hasXCoord = isNumber(coord.x)
      const hasXLabel = isString(coord.labelX)
      const hasX = hasXLabel && hasXCoord
      const hasYCoord = isNumber(coord.y)
      const hasYLabel = isString(coord.labelY)
      const hasY = hasYLabel && hasYCoord
      isValid = hasX && hasY
    }
    return isValid
  }

  changeValue (valuePack: cellValue) {
    const isValidValue = this.validateValue(valuePack)

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
    const { values, filteredValues, fetchedAt, recommended } = this.props
    const displayValues = pullAt(values, filteredValues)

    return (
      fetchedAt
      ? <Layout
        values={displayValues.concat(values)}
        recommended={recommended}
        onValueChange={this.onValueChange}
        applyFilter={this.props.applyFilter}
        filters={this.props.filters}
      />
      : this.renderNoData()
    )
  }
}
