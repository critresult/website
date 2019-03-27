import React from 'react'
import Colors from '../Colors'
import { HFlex, VFlex, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'
import emailValidator from 'email-validator'

@inject('promoter')
@observer
class Signup extends React.Component<{
  onAuthenticated?: () => void
  onCancelled?: (event: React.MouseEvent) => void
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
        this.props.onAuthenticated()
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
          minWidth: 300,
        }}
      >
        <VFlex style={{ padding: 10 }}>
          <HFlex>
            Email:{' '}
            <Input
              valid={emailValidator.validate(this.state.email)}
              type="text"
              onChange={(e: any) => {
                this.setState({ email: e.target.value })
              }}
              value={this.state.email}
            />
          </HFlex>
          <HFlex>
            Password:{' '}
            <Input
              valid={this.state.password.length >= 6}
              type="password"
              onChange={(e: any) => {
                this.setState({ password: e.target.value })
              }}
              value={this.state.password}
            />
          </HFlex>
          <HFlex>
            Confirm Password:{' '}
            <Input
              valid={
                this.state.password.length >= 6 &&
                this.state.passwordConfirm === this.state.password
              }
              type="password"
              onChange={(e: any) => {
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
            <Button title="Sign Up" onClick={this.createAccount} />
            <Button title="Cancel" onClick={this.props.onCancelled} />
          </HFlex>
        </VFlex>
      </div>
    )
  }
}

export default Signup
