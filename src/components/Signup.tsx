import React from 'react'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'

export default
@inject('promoter')
@observer
class Signup extends React.Component<{
  onAccountCreated?: () => void
  onCancelClick?: (event: React.MouseEvent) => void
  promoter?: PromoterStore
}> {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
  }

  createAccount = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      this.resetFields()
      alert('Passwords do not match')
      return
    }
    this.props.promoter
      .signup(this.state.email, this.state.password)
      .then(() => {
        this.resetFields()
        alert('Account created')
        this.props.onAccountCreated()
      })
      .catch((err) => {
        this.resetFields()
        alert(err.response.data.message)
      })
  }

  resetFields = () =>
    this.setState({
      email: '',
      password: '',
      passwordConfirm: '',
    })

  render() {
    return (
      <div
        style={{
          backgroundColor: Colors.white,
          borderRadius: 5,
          borderColor: 'rgba(0, 0, 0, 0.15)',
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
            Email:{' '}
            <input
              type="text"
              onInput={(e: any) => {
                this.setState({ email: e.target.value })
              }}
              value={this.state.email}
            />
          </HFlex>
          <HFlex>
            Password:{' '}
            <input
              type="password"
              onInput={(e: any) => {
                this.setState({ password: e.target.value })
              }}
              value={this.state.password}
            />
          </HFlex>
          <HFlex>
            Confirm Password:{' '}
            <input
              type="password"
              onInput={(e: any) => {
                this.setState({ passwordConfirm: e.target.value })
                if (e.target.value !== this.state.password) {
                  console.log("Passwords don't match")
                } else {
                  console.log('Passwords match')
                }
              }}
              value={this.state.passwordConfirm}
            />
          </HFlex>
          <HFlex>
            <Button title="Signup" onClick={this.createAccount} />
            <Button title="Cancel" onClick={this.props.onCancelClick} />
          </HFlex>
        </VFlex>
      </div>
    )
  }
}
