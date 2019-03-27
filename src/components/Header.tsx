import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'

const UpperHeader = styled(HFlex)`
  background-color: ${Colors.blue};
  justify-content: space-between;
  height: 50px;
  font-family: Helvetica;
  padding: 20px;
  color: ${Colors.white};
`

const LowerHeader = styled(HFlex)`
  background-color: ${Colors.black};
  height: 100px;
  color: ${Colors.white};
  font-family: Helvetica;
  padding: 20px;
`

const InnerContainer = styled.div`
  flex: 1;
  margin: auto;
  max-width: 900px;
`

export default class Header extends React.Component {
  render() {
    return (
      <>
        <UpperHeader>
          <InnerContainer>upper header</InnerContainer>
        </UpperHeader>
        <LowerHeader>
          <InnerContainer>lower header</InnerContainer>
        </LowerHeader>
      </>
    )
  }
}
