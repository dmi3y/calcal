// @flow
import { cloneDeep, merge as lomerge } from 'lodash'

let store = {}
const sessionStorage = window.sessionStorage
// sessionStorage.setItem('store', JSON.stringify(store))

export function push (data: Object): void {
  const copy = cloneDeep(data)
  store = lomerge(store, copy)
}

export function fetch (): {} {
  const storageData: string = sessionStorage.getItem('store')
  return JSON.parse(storageData) || {}
}

export function merge (data: {}): {} {
  return lomerge(store, data)
}

export function pull () {
  const storageData: Object = fetch()
  return merge(storageData)
}

export function commit (): void {
  const storageData: string = JSON.stringify(store)
  sessionStorage.setItem('store', storageData)
}

window.addEventListener('beforeunload', () => {
  commit()
})
