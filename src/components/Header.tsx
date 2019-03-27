import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'
import Popup from './Popup'
import Signup from './Signup'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'

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

const TitleSpan = styled.span`
  font-size: 20px;
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
    signupVisible: true,
  }
  render() {
    return (
      <>
        <Popup visible={this.state.signupVisible}>
          <Signup
            onAccountCreated={() => this.setState({ signupVisible: false })}
            onCancelClick={() => this.setState({ signupVisible: false })}
          />
        </Popup>
        <UpperHeader>
          <VFlex>
            <TitleSpan>CritResult</TitleSpan>
          </VFlex>
          <VFlex>
            {this.props.promoter.authenticated ? (
              <HeaderButton onClick={() => {}}>
                {this.props.promoter.active.email}
              </HeaderButton>
            ) : (
              <HeaderButton
                onClick={() => this.setState({ signupVisible: true })}
              >
                Signup or Login
              </HeaderButton>
            )}
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
