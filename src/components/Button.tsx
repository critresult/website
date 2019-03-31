import React from 'react'
import Colors from '../Colors'
import { VFlex } from './Shared'

const rings = require('../../static/puff.svg')

export default class Button extends React.Component<{
  title?: string
  animating?: boolean
  style?: any
  onClick?: () => void | Promise<any>
}> {
  // Tracking isMounted helps prevent making state changes in async functions
  // once we've been unmounted
  _isMounted = false
  state = {
    internallyAnimating: false,
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div
        onClick={() => {
          if (!this.props.onClick) return
          const ret = this.props.onClick()
          this.setState({ internallyAnimating: true })
          Promise.resolve(ret)
            .then(
              () =>
                this._isMounted && this.setState({ internallyAnimating: false })
            )
            .catch(
              () =>
                this._isMounted && this.setState({ internallyAnimating: false })
            )
        }}
        style={{
          margin: 4,
          padding: 8,
          paddingLeft: 16,
          paddingRight: 16,
          fontFamily: 'Helvetica',
          cursor: 'pointer',
          backgroundColor: Colors.black,
          borderRadius: 5,
          color: Colors.white,
          ...(this.props.style || {}),
        }}
      >
        <VFlex style={{ justifyContent: 'center' }}>
          {this.state.internallyAnimating || this.props.animating ? (
            <img src={rings} height="15" />
          ) : (
            this.props.title || this.props.children
          )}
        </VFlex>
      </div>
    )
  }
}
