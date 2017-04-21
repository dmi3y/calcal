import React, { Component } from 'react'
import { zipObject, drop, take, concat, cloneDeep, each } from 'lodash'
import { pull, push } from './sessionStorage'

import Fable from './Fable'
import './App.css'

/* globals fetch */

const infoSymbol = Symbol('info')

class App extends Component {
  state = {
    fetchedAt: null,
    values: null,
    lookup: null,
    recommended: {
      'кКал (Кк)': 1400,
      'Белки (г)': 79,
      'Жиры (г)': 63,
      'Угл (г)': 132,
      'Вит А (мкг)': 900,
      'Вит С (мг)': 90,
      'Кальций (мг)': 1000,
      'Омега 3 (мг)': 3,
      'Цинк (мг)': 10
    }
  }
  componentDidMount () {
    const sheetUri = [
      'https://sheets.googleapis.com/v4/spreadsheets/',
      `${process.env.REACT_APP_SHEETID}/values/`,
      process.env.REACT_APP_SHEETPATH,
      `?key=${process.env.REACT_APP_SECRET_KEY}`
    ].join('')

    fetch(sheetUri)
      .then(response => response.json())
      .then(data => {
        const values = this.filterValidValues(data.values)
        const displayValues = this.resetValues(values)
        const lookup = this.groupByProductNameAndNormalize(values)
        return { values: displayValues, lookup }
      })
      .then(({values, lookup}) => this.setState({
        fetchedAt: +new Date(),
        lookup,
        values
      }))
      .then(() => {
        const { values: storedValues } = pull()
        if (storedValues) {
          this.restoreValues(storedValues)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
  filterValidValues (values) {
    const head = values[0]
    const validLength = head.length
    return values.filter(val => val.length === validLength)
  }
  resetValues (values) {
    return cloneDeep(values).map((row, ix) => {
      const isHeader = ix === 0
      if (!isHeader) {
        return row.map((cell, iy) => {
          const isLabel = iy === 0
          if (isLabel) {
            return cell
          }
          return cell === '0' ? -1 : 0
        })
      }
      return row
    })
  }
  restoreValues (storedValues) {
    each(storedValues, (data) => {
      this.changeValue(data)
    })
  }
  groupByProductNameAndNormalize (values) {
    const head = drop(values[0], 2)
    const body = {}
    for (let i = 1; i < values.length; i++) {
      const row = values[i]
      const name = row[0]
      const quantity = row[1]
      const info = drop(row, 2).map(it => it / quantity)
      body[name] = zipObject(head, info)
      body[name][infoSymbol] = info
    }
    return body
  }
  renderNoData () {
    return <div className='app__no-data'>
      Calculate it.
    </div>
  }
  changeQuantity ({x: row, labelX: product}, value) {
    const normalizedInfo = this.state.lookup[product][infoSymbol]
    const values = this.state.values
    const copyRow = take(values[row])
    const newRow = concat(copyRow, value, normalizedInfo.map(it => it > 0 ? it * value : -1))
    values[row] = newRow
    this.setState({
      values
    })
  }
  changeNutrient (coord, value) {
    const {labelX: product, labelY: nutrient} = coord
    const normalizedNutrientValue = this.state.lookup[product][nutrient]
    const productValue = value / normalizedNutrientValue
    this.changeQuantity(coord, productValue)
  }
  changeValue ({coord, value}) {
    const isQuantity = coord.y === 1

    if (isQuantity) {
      this.changeQuantity(coord, value)
    } else {
      this.changeNutrient(coord, value)
    }

    push({
      values: {
        [`${coord.labelX}`]: {
          coord,
          value
        }
      }
    })
    console.log('changed value at:', coord, value)
  }
  onValueChange = (coord, e) => {
    const {labelX: product, labelY: nutrient, y} = coord
    const isNotQuantity = y !== 1
    const value = Number(e.target.value)
    let shouldChangeValue = true

    if (isNotQuantity) {
      const lookupValue = this.state.lookup[product][nutrient]
      shouldChangeValue = Boolean(lookupValue) && value >= 0
    }
    if (shouldChangeValue) {
      this.changeValue({coord, value})
    }
  }
  onFootChange (coord, e) {
    const value = Number(e.target.value)
    console.log('changed total at:', coord, value)
  }
  render () {
    return (
      this.state.fetchedAt
        ? <Fable
          values={this.state.values}
          recommended={this.state.recommended}
          onValueChange={this.onValueChange}
          onFootChange={this.onFootChange}
        />
        : this.renderNoData()
    )
  }
}

export default App
