import React, { Component } from 'react'
import { drop, take, round, isFunction } from 'lodash'
import './Table.css'

class Table extends Component {
  getFootValues (values, norm) {
    const defaultValues = take(values[0], values[0].length).fill(0)

    const totals = values.reduce((acc, rowValue) => acc.map((it, ix) => {
      return it + (Number(rowValue[ix]) || 0)
    }), defaultValues)

    totals[0] = 'Всего'

    norm[0] = 'Норма'

    return [
      totals,
      norm
    ]
  }

  renderRowsShell (cellMaker, data, head, onChange) {
    const rows = data.map((row, x) =>
      <tr key={x}>
        {
          row.map((cell, y) => cellMaker(cell, y, onChange && onChange.bind(null, {
            col: y,
            row: x + 1,
            product: row[0],
            nutrient: head[y]
          })))
        }
      </tr>
    )
    return rows
  }

  headCell (cell, ix) {
    return <th key={ix}>
      {cell}
    </th>
  }

  renderHead (data) {
    return this.renderRowsShell(this.headCell, data)
  }

  rowCell (cell, ix, onInput) {
    const isLabel = ix === 0
    const hasInputCallback = isFunction(onInput)

    return <td key={ix}>
      <div suppressContentEditableWarning contentEditable={!isLabel && hasInputCallback} onInput={onInput}>
        {isLabel ? cell : round(cell, 3)}
      </div>
    </td>
  }

  renderRows (data, head, onChange) {
    return this.renderRowsShell(this.rowCell, data, head, onChange)
  }

  mapRecommended (recommendedMap, headValues) {
    return headValues.map(val => recommendedMap[val] || 0)
  }

  render () {
    const values = this.props.values
    const headValues = take(values)
    const recommended = this.mapRecommended(this.props.recommended, headValues[0])
    const footValues = this.getFootValues(values, recommended)
    const onValueChange = this.props.onValueChange
    // const onFootChange = this.props.onFootChange

    const head = this.renderHead(headValues)
    const foot = this.renderRows(footValues, headValues[0])
    const rows = this.renderRows(drop(values), headValues[0], onValueChange)

    return <table className='nutrient-calculator-table'>
      <thead>{head}</thead>
      <tfoot>{foot}</tfoot>
      <tbody>{rows}</tbody>
    </table>
  }
}

export default Table
