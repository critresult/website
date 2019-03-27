import React from 'react'
import Colors from '../Colors'

export default class Button extends React.Component<{
  title: string
  animating?: boolean
  style?: any
  onClick: (event: React.MouseEvent) => void
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
          ...(this.props.style || {}),
        }}
      >
        {this.props.title}
      </div>
    )
  }
}
