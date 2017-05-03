// @flow
/* globals React$Element */

import React, { Component } from 'react'
import { take, drop, isNumber, cloneDeep } from 'lodash'
import './Layout.css'
import Fable from './Fable'

export default class Layout extends Component {
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

    return drop(totals)
  }

  getRecommendedValues (recommended: {}, headData: Array<string>) {
    const headDataClone = cloneDeep(drop(headData))
    return headDataClone.map(it => {
      const value = it.value
      if (recommended.hasOwnProperty(value)) {
        it.value = recommended[value]
      } else {
        it.value = 0
      }
      return it
    })
  }

  render (): React$Element<*> {
    const { values, recommended, layout, onValueChange } = this.props
    const labelData = values.map(value => take(value, 2))
    const bodyData = values.map(value => drop(value, 2))
    const totalValues = this.getTotalValues(values)
    const recommendedValues = this.getRecommendedValues(recommended, values[0])

    const labelValues = drop(labelData)
    const labelHead = take(labelData)[0]
    const bodyValues = drop(bodyData)
    const bodyHead = take(bodyData)[0]

    return <div className='layout'>
      <Fable
        dashboardPosition={layout.top}
        bodyPosition={layout.left}
        className='layout__labels'
        values={labelValues}
        dashboard={
          [
            labelHead,
            [{value: '='}, totalValues[0]],
            [{value: '+'}, recommendedValues[0]]
          ]}
        onValueChange={onValueChange}
      />
      <Fable
        dashboardPosition={layout.top}
        className='layout__values'
        values={bodyValues}
        dashboard={[bodyHead, drop(totalValues), drop(recommendedValues)]}
        onValueChange={onValueChange}
      />
    </div>
  }
}
