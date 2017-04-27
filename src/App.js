// @flow
import React, { PureComponent } from 'react'
import {
  isFinite,
  isString,
  isPlainObject,
  isNumber
} from 'lodash'
import { push } from './geestore'
import Stroller from './Stroller'

import type { cellCoord, cellValue } from './customTypes'

import Layout from './Layout'
import './App.css'

type props = {
  fetchDataSheet: Function,
  changeValue: Function,
  scrollLayout: Function,
  lookup: Object,
  recommended: Object,
  values: Array<*>,
  layout: Object
}

export default class App extends PureComponent<*, props, *> {
  componentDidMount () {
    this.props.fetchDataSheet()
  }

  renderNoData () {
    return <div className='app__no-data'>
      Calculate it.
    </div>
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
  changeValue (valuePack: cellValue, isForPush: boolean = true) {
    const isValidValue = this.validateValue(valuePack)

    if (isValidValue) {
      const { coord, value } = valuePack
      const isQuantity = coord.y === 1

      this.props.changeValue(valuePack, isQuantity)

      if (isForPush) {
        push({
          values: {
            [`${coord.labelX}`]: {
              coord,
              value
            }
          }
        })
      }
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

  render () {
    const { values, recommended, scrollLayout, layout } = this.props
    return (
      <Stroller onScroll={scrollLayout}>
        {
          this.props.fetchedAt
          ? <Layout
            layout={layout}
            values={values}
            recommended={recommended}
            onValueChange={this.onValueChange}
          />
          : this.renderNoData()
        }
      </Stroller>
    )
  }
}
