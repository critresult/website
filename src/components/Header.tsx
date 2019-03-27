import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'
import Popup from './Popup'
import Signup from './Signup'

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

const SignupButton = styled.span`
  padding: 5px;
  background-color: ${Colors.black};
  border-radius: 5px;
  color: ${Colors.white};
  cursor: pointer;
`

export default class Header extends React.Component {
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
            <SignupButton
              onClick={() => this.setState({ signupVisible: true })}
            >
              Signup or Login
            </SignupButton>
          </VFlex>
        </UpperHeader>
        <LowerHeader>
          Easy Criterium race registration and result management
        </LowerHeader>
      </>
    )
  }
}
