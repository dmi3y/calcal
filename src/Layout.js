// @flow
/* globals React$Element */

import React, { Component } from 'react'
import { take, drop, isNumber, cloneDeep } from 'lodash'
import './Layout.css'
import Fable from './Fable'

export default class Layout extends Component {
  getTotalValues (values: Array<*>, defaultValues: Array<*>): Array<*> {
    const totals = values.reduce((acc, row) => acc.map((it, ix) => {
      const cell = row[ix]
      const isAllowed = isNumber(cell.value) && cell.value !== -1
      const nextValue = isAllowed ? it.value + Number(cell.value) : it.value
      return {
        value: nextValue
      }
    }), defaultValues)

    return drop(totals)
  }

  getRecommendedValues (recommended: {}, headData: Array<*>) {
    const headDataClone = cloneDeep(headData)
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

  applyLabelFilter = (e:Object) => {
    this.props.applyFilter({
      type: 'label',
      value: e.target.value
    })
  }

  applyMinAmountFilter = (e:Object) => {
    this.props.applyFilter({
      type: 'minAmount',
      value: e.target.checked ? 0 : -1
    })
  }

  renderFilters = () => {
    return <div>
      <input
        type='checkbox'
        checked={this.props.filters.minAmount === 0}
        onChange={this.applyMinAmountFilter}
      />
    </div>
  }

  render (): React$Element<*> {
    const { head, body, recommended, onValueChange } = this.props
    const labelData = body.map(value => take(value, 2))
    const bodyData = body.map(value => drop(value, 2))
    const defaultTotals = take(head, head.length).fill({value: 0})
    const totalValues = this.getTotalValues(body, defaultTotals)
    const recommendedValues = this.getRecommendedValues(recommended, head)
    // const labelValues = drop(labelData)
    const labelHead = take(head, 2)
    // const bodyValues = drop(bodyData)
    const bodyHead = drop(head, 2)
    return <div className='layout'>
      <Fable
        className='layout__labels'
        values={labelData}
        dashboard={[
          labelHead,
          [
            {value: '+'},
            take(recommendedValues, 2)
          ],
          [
            {value: this.renderFilters()},
            totalValues[0]
          ]
        ]}
        onValueChange={onValueChange}
      />
      <Fable
        className='layout__values'
        values={bodyData}
        dashboard={[
          bodyHead,
          drop(recommendedValues, 2),
          drop(totalValues)
        ]}
        onValueChange={onValueChange}
      />
    </div>
  }
}
