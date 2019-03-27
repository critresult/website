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

export default class Header extends React.Component {
  state = {
    signupVisible: true,
  }
  render() {
    return (
      <>
        <Popup visible={this.state.signupVisible}>
          <Signup
            onCancelClick={() => this.setState({ signupVisible: false })}
          />
        </Popup>
        <UpperHeader>
          <VFlex>
            <span
              style={{
                fontSize: 20,
              }}
            >
              CritResult
            </span>
          </VFlex>
          <VFlex>
            <span
              style={{
                padding: 5,
                backgroundColor: Colors.black,
                borderRadius: 5,
                color: Colors.white,
                cursor: 'pointer',
              }}
              onClick={() => this.setState({ signupVisible: true })}
            >
              Signup or Login
            </span>
          </VFlex>
        </UpperHeader>
        <LowerHeader>
          Easy Criterium race registration and result management
        </LowerHeader>
      </>
    )
  }
}
