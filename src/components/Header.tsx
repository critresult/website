import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'
import Popup from './Popup'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'
import Signup from './Signup'
import Login from './Login'
import TabSelector from './TabSelector'
import { Link } from 'react-router-dom'

const UpperHeader = styled(HFlex)`
  background-color: ${Colors.blue};
  justify-content: space-between;
  height: 40px;
  font-family: Helvetica;
  padding: 20px;
  color: ${Colors.white};
`

const LowerHeader = styled(HFlex)`
  background-color: ${Colors.black};
  height: 20px;
  color: ${Colors.white};
  font-family: Helvetica;
  padding: 20px;
`

const TitleSpan = styled(Link)`
  font-size: 20px;
  color: ${Colors.white};
  text-decoration: none;
`

const HeaderButton = styled.span`
  padding: 5px;
  background-color: ${Colors.black};
  border-radius: 5px;
  color: ${Colors.white};
  cursor: pointer;
`

@inject('promoter')
@observer
class Header extends React.Component<{
  promoter?: PromoterStore
}> {
  state = {
    authVisible: false,
  }
  onAuthenticated = () => this.setState({ authVisible: false })
  onCancelled = () => this.setState({ authVisible: false })

  render() {
    const tabs = [
      {
        title: 'Sign Up',
        render: () => (
          <Signup
            onAuthenticated={this.onAuthenticated}
            onCancelled={this.onCancelled}
          />
        ),
      },
      {
        title: 'Login',
        render: () => (
          <Login
            onAuthenticated={this.onAuthenticated}
            onCancelled={this.onCancelled}
          />
        ),
      },
    ]
    return (
      <>
        <Popup visible={this.state.authVisible}>
          <VFlex>
            <HFlex style={{ borderRadius: 5 }}>
              <TabSelector tabs={tabs} />
            </HFlex>
          </VFlex>
        </Popup>
        <UpperHeader>
          <VFlex>
            <TitleSpan to="/">CritResult</TitleSpan>
          </VFlex>
          <VFlex>
            <HFlex>
              {this.props.promoter.userId ? (
                <HeaderButton onClick={() => {}}>
                  {this.props.promoter.active.email || ''}
                </HeaderButton>
              ) : (
                <HeaderButton
                  onClick={() => this.setState({ authVisible: true })}
                >
                  Signup or Login
                </HeaderButton>
              )}
              {this.props.promoter.userId ? (
                <HeaderButton
                  style={{ marginLeft: 5 }}
                  onClick={() => this.props.promoter.logout()}
                >
                  Logout
                </HeaderButton>
              ) : null}
            </HFlex>
          </VFlex>
        </UpperHeader>
        <LowerHeader>
          Easy Criterium race registration and result management
        </LowerHeader>
      </>
    )
  }
}

// Goddamn decorator export linting issues
export default Header
