// @flow
/* globals React$Element */
import React, { Component } from 'react'
import { drop, take, round, isFunction, isNumber } from 'lodash'
import './Fable.css'

import EditableCell from './EditableCell'

class Fable extends Component {
  getFootValues (values: Array<any>, norm: Array<any>): Array<any> {
    const defaultValues = take(values[0], values[0].length).fill(0)

    const totals = drop(values).reduce((acc, rowValues) => acc.map((it, ix) => {
      const isAllowed = rowValues[ix] !== -1
      const nextValue = isAllowed ? it + Number(rowValues[ix]) : it
      return nextValue
    }), defaultValues)

    totals[0] = 'Сейчас'

    norm[0] = 'Я'

    return [
      totals,
      norm
    ]
  }

  getHeadValues (headData: Array<any>, recommended: Array<any>): Array<any> {
    return headData.map(val => {
      if (recommended.hasOwnProperty(val)) {
        return <span>{recommended[val]} <span style={{
          fontWeight: 600,
          fontStyle: 'italic'
        }}>{val}</span></span>
      } else {
        return val
      }
    })
  }

  renderRowsShell (cellMaker: Function, data: Array<any>, head: Array<any> = [], onChange: ?Function) {
    const rows = data.map((row, ix) =>
      <div className='nutrient-calculator-fable__row' key={ix}>
        {
          row.map((cell, y) => cellMaker(cell, y, onChange && onChange.bind(null, {
            x: ix + 1,
            labelX: row[0],
            y: y,
            labelY: head[y]
          })))
        }
      </div>
    )
    return rows
  }

  headCell (cell: React$Element<any>, ix: number) {
    return <div className='nutrient-calculator-fable__cell' key={ix}>
      {cell}
    </div>
  }

  renderHead (data: Array<any>) {
    return this.renderRowsShell(this.headCell, [data])
  }

  rowCell (cell: React$Element<any>, ix: number, onChange: Function): React$Element<any> {
    const isLabel = !isNumber(cell)
    const isDisallowed = cell === -1
    const hasInputCallback = isFunction(onChange)
    const isEditable = !isDisallowed && !isLabel && hasInputCallback

    if (isEditable) {
      const roundValue = round(cell, 3)
      const showValue = roundValue > 0 ? roundValue : ''
      return <div className='nutrient-calculator-fable__cell' key={ix}>
        <EditableCell value={showValue} onChange={onChange} />
      </div>
    }
    if (isDisallowed) {
      return <div className='nutrient-calculator-fable__cell' key={ix}>
        -
      </div>
    }
    if (isLabel) {
      return <div className='nutrient-calculator-fable__cell' key={ix}>
        {cell}
      </div>
    }
    return <div className='nutrient-calculator-fable__cell' key={ix}>
      {round(cell, 3)}
    </div>
  }

  renderRows (data: Array<any>, head: Array<any>, onChange: ?Function) {
    return this.renderRowsShell(this.rowCell, data, head, onChange)
  }

  mapRecommended (recommended: Array<any>, headValues: Array<any>) {
    return headValues.map(val => {
      const recommendedVal = recommended[val] || 0
      if (recommendedVal) {
        return <span>{recommendedVal} <span style={{
          fontWeight: 600,
          fontStyle: 'italic'
        }}>{val}</span></span>
      } else {
        return 0
      }
    })
  }

  render (): React$Element<any> {
    const { values, recommended } = this.props
    const headData = take(values)[0]
    const norm = this.mapRecommended(recommended, headData)
    const footValues = this.getFootValues(values, norm)
    const headValues = this.getHeadValues(headData, recommended)
    const onValueChange = this.props.onValueChange
    // const onFootChange = this.props.onFootChange

    const head = this.renderHead(headValues)
    const foot = this.renderRows(footValues, headData)
    const rows = this.renderRows(drop(values), headData, onValueChange)

    return <div className='nutrient-calculator-fable'>
      <div className='nutrient-calculator-fable__head'>{head}</div>
      <div className='nutrient-calculator-fable__body'>{rows}</div>
      <div className='nutrient-calculator-fable__foot'>{foot}</div>
    </div>
  }
}

export default Fable
