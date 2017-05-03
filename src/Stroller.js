// @flow
import React, { PureComponent } from 'react'
import { throttle } from 'lodash'

export default class Stroller extends PureComponent {
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  // updateStrollerVars (vars: {top: number, left: number}, stroller: Object) {
  //   for (let key in vars) {
  //     if (vars.hasOwnProperty(key)) {
  //       const cssKey = `--stroller-${key}`
  //       const cssValue = `${vars[key]}px`
  //       stroller.style.removeProperty(cssKey)
  //       stroller.style.setProperty(cssKey, cssValue)
  //     }
  //   }
  // }

  handleScroll = throttle((e: Object) => {
    const stroller = e.target.body
    const top = stroller.scrollTop
    const left = stroller.scrollLeft
    const width = stroller.scrollWidth
    const height = stroller.scrollHeight

    this.props.onScroll({
      top,
      left,
      width,
      height
    })
  }, 15)

  render () {
    return <div>
      {this.props.children}
    </div>
  }
}
