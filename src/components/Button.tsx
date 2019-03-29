import React from 'react'
import Colors from '../Colors'
import { VFlex } from './Shared'

const rings = require('../../static/puff.svg')

export default class Button extends React.Component<{
  title: string
  animating?: boolean
  style?: any
  onClick?: (event: React.MouseEvent) => void
}> {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        style={{
          margin: 5,
          padding: 5,
          fontFamily: 'Helvetica',
          cursor: 'pointer',
          backgroundColor: Colors.black,
          borderRadius: 5,
          color: Colors.white,
          minWidth: 100,
          minHeight: 18,
          ...(this.props.style || {}),
        }}
      >
        <VFlex style={{ justifyContent: 'center' }}>
          {this.props.animating ? (
            <img src={rings} height="15" />
          ) : (
            this.props.title
          )}
        </VFlex>
      </div>
    )
  }
}
