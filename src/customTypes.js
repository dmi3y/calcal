// @flow
type product = string
type nutrient = string

export type cellCoord = {|
  x: number,
  labelX: product,
  y: number,
  labelY: nutrient
|}

export type cellValue = {| coord: cellCoord, value: number |}
export type cellLabel = {| coord: cellCoord, value: string |}

export type sealedValue = { [product]: cellValue }
