import React from 'react';
import { VFlex, HFlex } from './components/Shared';
import styled from 'styled-components';
import Colors from './Colors';

export default class Home extends React.Component {
  render() {
    return (
      <>
          <HFlex style={{
            justifyContent: 'space-between',
          backgroundColor: Colors.blue,
          height: 50,
          color: Colors.white,
          fontFamily: 'Helvetica',
          padding: 20,
          }}>
            <VFlex>
            CritResult
            </VFlex>
            <VFlex>
            Signup or Login
            </VFlex>
        </HFlex>
        <div style={{
          backgroundColor: Colors.black,
          height: 100,
          color: Colors.white,
          fontFamily: 'Helvetica',
          padding: 20,
        }}>
        lower header
        </div>
        <div style={{
          padding: 20
        }}>
        Upcoming Events:
        </div>

      </>
    );
  }
}
