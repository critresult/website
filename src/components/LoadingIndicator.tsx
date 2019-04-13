import React from 'react'
import { VFlex } from './Shared'

export default class LoadingIndicator extends React.Component<{
  style?: any
  height?: number
}> {
  render() {
    return (
      <VFlex
        style={{
          margin: 8,
          fontSize: 25,
          justifyContent: 'center',
          ...(this.props.style || {}),
        }}
      >
        <img
          src={require('../../static/bikeLoading.svg')}
          height={this.props.height || 75}
        />
      </VFlex>
    )
  }
}
