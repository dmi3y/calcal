import { cloneDeep, merge as lomerge } from 'lodash'

let store = {}
const sessionStorage = window.sessionStorage
// sessionStorage.setItem('store', JSON.stringify(store))

export function push (data) {
  const copy = cloneDeep(data)
  store = lomerge(store, copy)
}

export function fetch () {
  const storageData = sessionStorage.getItem('store')
  return JSON.parse(storageData) || {}
}

export function merge (data) {
  return lomerge(store, data)
}

export function pull () {
  const storageData = fetch()
  return merge(storageData)
}

export function commit () {
  const storageData = JSON.stringify(store)
  sessionStorage.setItem('store', storageData)
}
