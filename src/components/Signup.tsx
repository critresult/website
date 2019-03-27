import React from 'react'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'
import Button from './Button'

export default class Signup extends React.Component<{
  onCancelClick?: (event: React.MouseEvent) => void
}> {
  render() {
    return (
      <div
        style={{
          backgroundColor: Colors.white,
          borderRadius: 5,
        }}
      >
        <HFlex style={{ justifyContent: 'space-around' }}>
          <VFlex
            style={{
              padding: 10,
              borderBottomColor: Colors.black,
              borderBottomWidth: 2,
            }}
          >
            Signup
          </VFlex>
          <VFlex style={{ padding: 10 }}>Login</VFlex>
        </HFlex>
        <VFlex style={{ padding: 10 }}>
          <HFlex>
            Email: <input type="text" />
          </HFlex>
          <HFlex>
            Password: <input type="text" />
          </HFlex>
          <HFlex>
            Confirm Password: <input type="text" />
          </HFlex>
          <HFlex>
            <Button title="Signup" onClick={() => {}} />
            <Button title="Cancel" onClick={this.props.onCancelClick} />
          </HFlex>
        </VFlex>
      </div>
    )
  }
}
