// @flow
/* globals React$Element */

import React, { Component } from 'react'
import { take, drop, isNumber } from 'lodash'
import './Layout.css'
import Fable from './Fable'

export default class Layout extends Component {
  getLabelValies (values: Array<Array<*>>): Array<Array<*>> {
    return values.map(value => take(value))
  }
  getBodyValies (values: Array<Array<*>>): Array<Array<*>> {
    return values.map(value => drop(value))
  }
  getTotalValues (values: Array<*>): Array<*> {
    const defaultValues = take(values[0], values[0].length).fill({value: 0})

    const totals = drop(values).reduce((acc, row) => acc.map((it, ix) => {
      const cell = row[ix]
      const isAllowed = isNumber(cell.value) && cell.value !== -1
      const nextValue = isAllowed ? it.value + Number(cell.value) : it.value
      return {
        value: nextValue
      }
    }), defaultValues)

    return totals
  }
  render (): React$Element<*> {
    const { values, recommended, onValueChange } = this.props
    const labelData = this.getLabelValies(values)
    const bodyData = this.getBodyValies(values)
    const recommendedValues = drop(recommended)
    const totalValues = this.getTotalValues(bodyData)

    const labelValues = drop(labelData)
    const labelHead = take(labelData)[0]
    const bodyValues = drop(bodyData)
    const bodyHead = take(bodyData)[0]

    return <div className='layout'>
      <Fable
        className='layout__labels'
        values={labelValues}
        dashboard={[labelHead, [{value: '='}], [{value: '+'}]]}
      />
      <Fable
        className='layout__values'
        values={bodyValues}
        dashboard={[bodyHead, totalValues, recommendedValues]}
        onValueChange={onValueChange}
      />
    </div>
  }
}
