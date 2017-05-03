// @flow
/* globals fetch */

import {
  zipObject,
  drop,
  cloneDeep
} from 'lodash'

const ENV: Object = process.env

export const infoSymbol = 'infofreakinsymbol'

const sheetUri = [
  'https://sheets.googleapis.com/v4/spreadsheets/',
  `${ENV.REACT_APP_SHEETID}/values/`,
  ENV.REACT_APP_SHEETPATH,
  `?key=${ENV.REACT_APP_SECRET_KEY}`
].join('')

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
