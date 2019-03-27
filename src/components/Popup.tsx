import React from 'react'
import styled from 'styled-components'

export default class Popup extends React.Component<{
  visible: boolean
}> {
  render() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          display: this.props.visible ? 'flex' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.17)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
