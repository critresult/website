import React from 'react'
import { HFlex, VFlex } from './Shared'
import PromoterStore from '../stores/promoter'
import Colors from '../Colors'
import styled from 'styled-components'
import TabSelector from './TabSelector'
import Signup from './Signup'
import Login from './Login'

class AuthModal extends React.Component<{
  onAuthenticated: () => void
  onCancelled: () => void
  promoter?: PromoterStore
}> {
  render() {
    return (
      <VFlex>
        <HFlex style={{ borderRadius: 5 }}>
          <TabSelector
            tabs={[
              {
                title: 'Sign Up',
                render: () => (
                  <Signup
                    onAuthenticated={this.props.onAuthenticated}
                    onCancelled={this.props.onCancelled}
                  />
                ),
              },
              {
                title: 'Login',
                render: () => (
                  <Login
                    onAuthenticated={this.props.onAuthenticated}
                    onCancelled={this.props.onCancelled}
                  />
                ),
              },
            ]}
          />
        </HFlex>
      </VFlex>
    )
  }
}

export default AuthModal
