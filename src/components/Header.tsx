import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'

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
  render() {
    return (
      <>
        <UpperHeader>
          <VFlex>
            <span
              style={{
                fontSize: 20,
              }}
            >
              Crit Result
            </span>
          </VFlex>
          <VFlex>Signup or Login</VFlex>
        </UpperHeader>
        <LowerHeader>
          Easy Criterium race registration and result management
        </LowerHeader>
      </>
    )
  }
}
