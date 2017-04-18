import React, { Component } from 'react';
import { zipObject, drop, take, concat, fill } from 'lodash'

import Table from './Table'
import './App.css'

const infoSymbol = Symbol('info')

class App extends Component {
  state = {
    fetchedAt: null,
    values: null,
    lookup: null,
    recommended: {
      "кКал (Кк)": 1400,
      "Белки (г)": 79,
      "Жиры (г)": 63,
      "Угл (г)": 132
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
        this.setState({
          fetchedAt: +new Date(),
          lookup: this.groupByProductNameAndNormalize(values),
          values: this.resetValues(values)
        })
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
    const head = values[0]
    const validLength = head.length

    return values.map((val, ix) => {
      const isHeader = ix === 0
      if (!isHeader) {
        fill(val, 0, 1)
      }
      return val
    })
  }
  groupByProductNameAndNormalize (values) {
    const head = drop(values[0], 2)
    const body = {}
    for (let i = 1; i < values.length; i++) {
      const row = values[i]
      const name = row[0]
      const quantity = row[1]
      const info = drop(row, 2).map(it => it/quantity)
      body[name] = zipObject(head, info)
      body[name][infoSymbol] = info
    }
    return body
  }
  renderNoData () {
    return <div className="App">
      Calculate it.
    </div>
  }
  changeQuantity ({row, product}, value) {
    const normalizedInfo = this.state.lookup[product][infoSymbol]
    const values = this.state.values
    const copyRow = take(values[row])
    const newRow = concat(copyRow, value, normalizedInfo.map(it => it * value))
    values[row] = newRow
    this.setState({
      values
    })
  }
  changeNutrient (coord, value) {
    const {product, nutrient} = coord
    const normalizedNutrientValue = this.state.lookup[product][nutrient]
    const productValue = value / normalizedNutrientValue
    this.changeQuantity(coord, productValue)
  }
  onValueChange = (coord, e) => {
    const value = Number(e.target.innerText)

    if (coord.col === 1) {
      this.changeQuantity(coord, value)
    } else {
      this.changeNutrient(coord, value)
    }

    console.log('changed value at:', coord, value)
  }
  onFootChange (coord, e) {
    const value = Number(e.target.innerText)
    console.log('changed total at:', coord, value)
  }
  render () {
    return (
      this.state.fetchedAt
        ? <Table
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
