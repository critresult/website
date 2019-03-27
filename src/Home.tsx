import React from 'react'
import { VFlex, HFlex } from './components/Shared'
import Header from './components/Header'
import { inject, observer } from 'mobx-react'

@inject('promoter')
@observer
class Home extends React.Component {
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

export default Home
