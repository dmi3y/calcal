// @flow
/* globals React$Element */
import React, { PureComponent } from 'react'
import { round, isFunction, isNumber } from 'lodash'
import './Fable.css'

import type { cellValue } from './customTypes'

import EditableCell from './EditableCell'

class Fable extends PureComponent {
  renderHead (row: Array<*>) {
    const rows = <div className='fable__row'>
      {
        row.map((cells) =>
          cells.map((cell, ix) =>
            <div className='fable__cell' key={ix}>
              {cell.value}
            </div>
          )
        )
      }
    </div>
    return rows
  }

  rowCell (cell: cellValue, key: number, onChange: ?Function): React$Element<*> {
    const isLabel = !isNumber(cell.value)
    const isDisallowed = cell.value === -1
    const hasInputCallback = isFunction(onChange)
    const isEditable = !isDisallowed && !isLabel && hasInputCallback

    if (onChange && isEditable) {
      const roundValue = round(cell.value, 3)
      const showValue = roundValue > 0 ? roundValue : ''
      return <div className='fable__cell' key={key}>
        <EditableCell value={showValue} onChange={onChange.bind(null, cell.coord)} />
      </div>
    }
    if (isDisallowed) {
      return <div className='fable__cell' key={key}>
        -
      </div>
    }
    if (isLabel) {
      return <div className='fable__cell' key={key}>
        {cell.value}
      </div>
    }
    return <div className='fable__cell' key={key}>
      {round(cell.value, 3)}
    </div>
  }

  renderDash (data: Array<*>) {
    return this.renderRows(data)
  }

  renderRows (data: Array<*>, onChange: ?Function) {
    const rows = data.map((row, ix) =>
      <div className='fable__row' key={ix}>
        {
          row.map((cell, y) => this.rowCell(cell, y, onChange))
        }
      </div>
    )
    return rows
  }

  render (): React$Element<*> {
    const { values, dashboard, onValueChange, className } = this.props
    const dash = this.renderDash(dashboard)
    const rows = this.renderRows(values, onValueChange)

    return <div className={`fable ${className}`}>
      <div className='fable__dashboard'>{dash}</div>
      <div className='fable__body'>{rows}</div>
    </div>
  }
}

export default Fable
