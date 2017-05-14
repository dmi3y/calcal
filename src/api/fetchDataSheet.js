// @flow
/* globals fetch */

import {
  drop,
  cloneDeep
} from 'lodash'

const ENV: Object = process.env

const sheetUri = [
  'https://sheets.googleapis.com/v4/spreadsheets/',
  `${ENV.REACT_APP_SHEETID}/values/`,
  ENV.REACT_APP_SHEETPATH,
  `?key=${ENV.REACT_APP_SECRET_KEY}`
].join('')

function groupByProductNameAndNormalize (values) {
  const lookup = {}
  for (let x = 1; x < values.length; x++) {
    const row = values[x]
    const name = row[0]
    const quantity = row[1]
    const norm = drop(row, 2).map(it => it / quantity)
    lookup[name] = {
      norm,
      coord: {
        x
      }
    }
  }
  return lookup
}

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
      const lookup = groupByProductNameAndNormalize(values)
      return { values: displayValues, lookup, fetchedAt: +new Date() }
    })
}

export default fetchDataSheet
