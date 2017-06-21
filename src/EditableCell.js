// @flow
/* globals React$Element */
import React, { PureComponent } from 'react'

export default class EditableCell extends PureComponent {
  changeValue = (ev: *) => {
    const data: Object = this.props.data
    const onChange: Function = this.props.onChange
    onChange(data, ev)
  }

  render (): React$Element<*> {
    const value: number = this.props.showValue

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
      onChange={this.changeValue}
      placeholder='0'
    />
  }
}
