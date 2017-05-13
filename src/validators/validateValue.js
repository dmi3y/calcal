// @flow

import {
  isFinite,
  isString,
  isPlainObject,
  isNumber
} from 'lodash'

import type { cellValue } from '../customTypes'

export default function validateValue ({coord, value}: cellValue) {
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
