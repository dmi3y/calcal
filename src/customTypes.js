// @flow
export type cellCoord = {|
  x: number,
  labelX: string,
  y: number,
  labelY: string
|}
export type cellValue = {| coord: cellCoord, value: number |}
