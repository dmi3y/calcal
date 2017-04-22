// @flow
/* globals React$Element */
import React, { PureComponent } from 'react'

export default class EditableCell extends PureComponent {
  render (): React$Element<*> {
    const value: number = this.props.value
    const onChange: Function = this.props.onChange

    return <input
      type='number' min='0' step='0.001'
      style={{
        fontSize: 'inherit',
        border: 'none',
        background: 'none',
        width: '100%',
        textAlign: 'center'
      }}
      value={value}
      onChange={onChange}
      placeholder='0'
    />
  }
}
