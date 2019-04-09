import React from 'react'
import { VFlex } from './Shared'

export default class LoadingIndicator extends React.Component {
  render() {
    return (
      <VFlex style={{ fontSize: 30, justifyContent: 'center' }}>
        Just a moment...
      </VFlex>
    )
  }
}
