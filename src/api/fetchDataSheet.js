// @flow
/* globals fetch */

import {
  zipObject,
  drop,
  cloneDeep,
  each,
  take
} from 'lodash'

// import { pull } from '../geestore'

export const infoSymbol = 'infofreakinsymbol'

const sheetUri = [
  'https://sheets.googleapis.com/v4/spreadsheets/',
  `${process.env.REACT_APP_SHEETID}/values/`,
  process.env.REACT_APP_SHEETPATH,
  `?key=${process.env.REACT_APP_SECRET_KEY}`
].join('')

const recommendedMap = {
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

function getRecommendedValues (recommended: {}, head: Array<*>) {
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

function groupByProductNameAndNormalize (values) {
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

// function restoreValues (storedValues) {
//   each(storedValues, (data) => {
//     changeValue(data, false)
//   })
// }

function resetValues (values) {
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

function filterValidValues (values) {
  const head = values[0]
  const validLength = head.length
  return values.filter(val => val.length === validLength)
}

function fetchDataSheet () {
  return fetch(sheetUri)
    .then(response => response.json())
    .then(data => {
      const values = filterValidValues(data.values)
      const displayValues = resetValues(values)
      const headValues = take(displayValues)
      const lookup = groupByProductNameAndNormalize(values)
      const recommended = getRecommendedValues(recommendedMap, headValues)
      return { values: displayValues, lookup, recommended, fetchedAt: +new Date() }
    })
    // .then(({values, lookup, recommended}) => {
    //   const { values: storedValues } = pull()
    //   if (storedValues) {
    //     restoreValues(storedValues)
    //   }
    // })
}

export default fetchDataSheet
