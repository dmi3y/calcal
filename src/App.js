import React, { Component } from 'react'
import {
  zipObject,
  drop,
  take,
  concat,
  cloneDeep,
  each,
  isFinite,
  isString,
  isPlainObject,
  isNumber
} from 'lodash'
import { pull, push } from './geestore'

import Layout from './Layout'
import './App.css'

/* globals fetch */

const infoSymbol = Symbol('info')

class App extends Component {
  recommended = {
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
  getRecommendedValues (recommended: {}, head: []) {
    const recommendedValues = cloneDeep(head[0])
    return recommendedValues.map(it => {
      const value = it.value
      if (recommended.hasOwnProperty(value)) {
        it.value = recommended[value]
      } else {
        it.value = 0
      }
      return it
    })
  }

  state = {
    fetchedAt: null,
    values: null,
    lookup: null,
    recommended: null
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
        const headValues = take(displayValues)
        const lookup = this.groupByProductNameAndNormalize(values)
        const recommended = this.getRecommendedValues(this.recommended, headValues)
        return { values: displayValues, lookup, recommended }
      })
      .then(({values, lookup, recommended}) => this.setState({
        fetchedAt: +new Date(),
        lookup,
        values,
        recommended
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
    return cloneDeep(values).map((row, x) => {
      const isHeader = x === 0
      return row.map((cell, y) => {
        const isLabel = y === 0
        const labelY = values[0][y]
        const labelX = values[x][0]
        let value = cell
        if (!isLabel && !isHeader) {
          value = cell === '0' ? -1 : 0
        }
        return {coord: {x, labelX, y, labelY}, value}
      })
    })
  }
  restoreValues (storedValues) {
    each(storedValues, (data) => {
      this.changeValue(data, false)
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
  changeQuantity ({ coord, value }) {
    const { x: row, labelX: product } = coord
    const normalizedData = this.state.lookup[product][infoSymbol]
    const values = this.state.values
    const head = take(values[row])
    const normalizedInfo = normalizedData.map(it => {
      const newValue = it > 0 ? it * value : -1
      return {
        coord,
        value: newValue
      }
    })
    const newRow = concat(head, {coord, value}, normalizedInfo)
    values[row] = newRow
    this.setState({
      values
    })
  }
  changeNutrient ({ coord, value }) {
    const {labelX: product, labelY: nutrient} = coord
    const normalizedNutrientValue = this.state.lookup[product][nutrient]
    const productValue = value / normalizedNutrientValue
    this.changeQuantity({coord, value: productValue})
  }
  validateValue ({coord, value}) {
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
  changeValue (valuePack, isForPush = true) {
    const isValidValue = this.validateValue(valuePack)

    if (isValidValue) {
      const { coord, value } = valuePack
      const isQuantity = coord.y === 1

      if (isQuantity) {
        this.changeQuantity(valuePack)
      } else {
        this.changeNutrient(valuePack)
      }

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
    const { values, recommended } = this.state
    return (
      this.state.fetchedAt
        ? <Layout
          values={values}
          recommended={recommended}
          onValueChange={this.onValueChange}
          onFootChange={this.onFootChange}
        />
        : this.renderNoData()
    )
  }
}

export default App
