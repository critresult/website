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
  }

  inputRef = React.createRef()

  componentDidMount() {
    this.inputRef.current.focus()
  }

  login = () => {
    this.props.promoter
      .login(this.state.email, this.state.password)
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
            <Button title="Login" onClick={this.login} />
            <Button title="Cancel" onClick={this.props.onCancelled} />
          </HFlex>
        </VFlex>
      </div>
    )
  }
}

export default Signup
