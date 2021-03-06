import React from 'react'
import { HFlex, VFlex, Input, ModalContainer } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'
import emailValidator from 'email-validator'

@inject('promoter')
@observer
export default class Signup extends React.Component<{
  onAuthenticated?: () => void
  onCancelled?: (event: React.MouseEvent) => void
  promoter?: PromoterStore
}> {
  state = {
    email: '',
    password: '',
    passwordConfirm: '',
    isLoading: false,
  }

  inputRef = React.createRef()

  componentDidMount() {
    this.inputRef.current.focus()
  }

  createAccount = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      this.resetFields()
      alert('Passwords do not match')
      return
    }
    this.setState({ isLoading: true })
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
      isLoading: false,
    })

  render() {
    return (
      <ModalContainer>
        <VFlex style={{ padding: 10 }}>
          <HFlex>
            Email:{' '}
            <Input
              ref={this.inputRef}
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
            Confirm:{' '}
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
            <Button
              animating={this.state.isLoading}
              title="Sign Up"
              onClick={this.createAccount}
            />
            <Button title="Cancel" onClick={this.props.onCancelled} />
          </HFlex>
        </VFlex>
      </ModalContainer>
    )
  }
}
