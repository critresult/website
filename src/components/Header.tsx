import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex, Input, ModalContainer, LargeText } from './Shared'
import Popup from './Popup'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'
import Signup from './Signup'
import Login from './Login'
import TabSelector from './TabSelector'
import { withRouter, Link, RouteComponentProps } from 'react-router-dom'
import Button from './Button'
import SeriesCreate from './SeriesCreate'
import SeriesStore, { Series } from '../stores/series'

const UpperHeader = styled(HFlex)`
  background-color: ${Colors.blue};
  justify-content: space-between;
  font-family: Helvetica;
  padding: 20px;
  color: ${Colors.white};
  border-bottom: solid 2px ${Colors.black};
`

const LowerHeader = styled(HFlex)`
  border-bottom: solid 1px ${Colors.blue};
  background-color: ${Colors.black};
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
`

const TitleSpan = styled(Link)`
  font-size: 25px;
  color: ${Colors.white};
  text-decoration: none;
`

@(withRouter as any)
@inject('promoter', 'series')
@observer
export default class Header extends React.Component<
  RouteComponentProps & {
    promoter?: PromoterStore
    series?: SeriesStore
  }
> {
  state = {
    authVisible: false,
    showingCreateSeriesPopup: false,
    editUserVisible: false,
    email: '',
    password: '',
    oldPassword: '',
  }
  onAuthenticated = () => this.setState({ authVisible: false })
  onCancelled = () => this.setState({ authVisible: false })

  render() {
    const tabs = [
      {
        title: 'Sign Up',
        render: () => (
          <Signup
            onAuthenticated={this.onAuthenticated}
            onCancelled={this.onCancelled}
          />
        ),
      },
      {
        title: 'Login',
        render: () => (
          <Login
            onAuthenticated={this.onAuthenticated}
            onCancelled={this.onCancelled}
          />
        ),
      },
    ]
    return (
      <>
        <Popup visible={this.state.authVisible}>
          <VFlex>
            <HFlex style={{ borderRadius: 5 }}>
              <TabSelector tabs={tabs} />
            </HFlex>
          </VFlex>
        </Popup>
        <Popup visible={this.state.showingCreateSeriesPopup}>
          <SeriesCreate
            onCreated={() => this.setState({ showingCreateSeriesPopup: false })}
            onCancelled={() =>
              this.setState({ showingCreateSeriesPopup: false })
            }
          />
        </Popup>
        <Popup visible={this.state.editUserVisible}>
          <ModalContainer>
            <VFlex>
              <LargeText>Update Info</LargeText>
              <Input
                type="text"
                placeholder="email"
                onChange={(e: any) => this.setState({ email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="old password"
                onChange={(e: any) =>
                  this.setState({ oldPassword: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="new password"
                onChange={(e: any) =>
                  this.setState({ password: e.target.value })
                }
              />
              <HFlex>
                <Button
                  title="Update"
                  onClick={() =>
                    this.props.promoter
                      .update({
                        email: this.state.email,
                        oldPassword: this.state.oldPassword,
                        password: this.state.password,
                      })
                      .then(() => this.props.promoter.loadPromoter())
                      .then(() => this.setState({ editUserVisible: false }))
                      .catch(() =>
                        alert('There was a problem updating your info.')
                      )
                  }
                />
                <Button
                  title="Cancel"
                  onClick={() => this.setState({ editUserVisible: false })}
                />
              </HFlex>
            </VFlex>
          </ModalContainer>
        </Popup>
        <UpperHeader>
          <VFlex style={{ alignItems: 'flex-start' }}>
            <TitleSpan to="/">critrace</TitleSpan>
            <span style={{ fontSize: 15 }}>Easy Criterium racing</span>
          </VFlex>
          <VFlex style={{ alignItems: 'flex-end' }}>
            <HFlex>
              {this.props.promoter.userId ? (
                <Button
                  onClick={() => this.setState({ editUserVisible: true })}
                >
                  {this.props.promoter.active.email || ''}
                </Button>
              ) : (
                <Button onClick={() => this.setState({ authVisible: true })}>
                  Signup or Login
                </Button>
              )}
              {this.props.promoter.userId ? (
                <Button
                  style={{ marginLeft: 5 }}
                  onClick={() => this.props.promoter.logout()}
                >
                  Logout
                </Button>
              ) : null}
            </HFlex>
          </VFlex>
        </UpperHeader>
        <LowerHeader>
          <VFlex style={{ color: Colors.white }}>
            <HFlex>
              {this.props.series.all.map((series: Series, index) => (
                <Button
                  key={index}
                  title={series.name}
                  style={{
                    backgroundColor: Colors.white,
                    color: Colors.black,
                  }}
                  onClick={() => {
                    this.props.history.push(`/series/${series._id}`)
                  }}
                />
              ))}
            </HFlex>
          </VFlex>
          <VFlex>
            <Button
              title="Create Series"
              onClick={() => {
                this.setState({ showingCreateSeriesPopup: true })
              }}
              style={{ backgroundColor: Colors.green }}
            />
          </VFlex>
        </LowerHeader>
      </>
    )
  }
}
