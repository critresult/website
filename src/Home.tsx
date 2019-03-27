import React from 'react'
import { VFlex, HFlex } from './components/Shared'
import styled from 'styled-components'
import Colors from './Colors'
import Header from './components/Header'
import Popup from './components/Popup';

export default class Home extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div
          style={{
            padding: 20,
            margin: 'auto',
            maxWidth: 900,
          }}
        >
          Upcoming Events:
        </div>
      </>
    )
  }
}
