import React from 'react'
import styled from 'styled-components'
import Colors from '../Colors'
import { HFlex, VFlex } from './Shared'
import Popup from './Popup'
import { inject, observer } from 'mobx-react'
import PromoterStore from '../stores/promoter'
import Signup from './Signup'
import Login from './Login'
import TabSelector from './TabSelector'
import { Link } from 'react-router-dom'
import Button from './Button'
import { TiPlus } from 'react-icons/ti'
import EventCreate from './EventCreate'
import SeriesCreate from './SeriesCreate'
import SeriesStore, { Series } from '../stores/series'
import { withRouter } from 'react-router-dom'

const UpperHeader = styled(HFlex)`
  background-color: ${Colors.blue};
  justify-content: space-between;
  height: 30px;
  font-family: Helvetica;
  padding: 20px;
  color: ${Colors.white};
`

const LowerHeader = styled(HFlex)`
  background-color: ${Colors.black};
  height: 2px;
  color: ${Colors.white};
  font-family: Helvetica;
`

const TitleSpan = styled(Link)`
  font-size: 25px;
  color: ${Colors.white};
  text-decoration: none;
`

const HeaderButton = styled.span`
  padding: 5px;
  background-color: ${Colors.black};
  border-radius: 5px;
  color: ${Colors.white};
  cursor: pointer;
`

@inject('promoter', 'series')
@observer
class Header extends React.Component<{
  promoter?: PromoterStore
  series?: SeriesStore
}> {
  state = {
    authVisible: false,
    showingCreatePopup: false,
    showingCreateSeriesPopup: false,
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
        <Popup visible={this.state.showingCreatePopup}>
          <EventCreate
            onCreated={() => this.setState({ showingCreatePopup: false })}
            onCancelled={() => this.setState({ showingCreatePopup: false })}
          />
        </Popup>
        <UpperHeader>
          <VFlex style={{ alignItems: 'flex-start' }}>
            <TitleSpan to="/">CritResult</TitleSpan>
          </VFlex>
          <VFlex style={{ alignItems: 'flex-end' }}>
            <HFlex>
              {this.props.promoter.userId ? (
                <HeaderButton onClick={() => {}}>
                  {this.props.promoter.active.email || ''}
                </HeaderButton>
              ) : (
                <HeaderButton
                  onClick={() => this.setState({ authVisible: true })}
                >
                  Signup or Login
                </HeaderButton>
              )}
              {this.props.promoter.userId ? (
                <HeaderButton
                  style={{ marginLeft: 5 }}
                  onClick={() => this.props.promoter.logout()}
                >
                  Logout
                </HeaderButton>
              ) : null}
            </HFlex>
          </VFlex>
        </UpperHeader>
        <LowerHeader />
        <HFlex
          style={{
            borderBottom: `solid 2px ${Colors.black}`,
            backgroundColor: Colors.black,
            justifyContent: 'space-between',
            fontSize: 20,
          }}
        >
          <VFlex style={{ margin: 8, color: Colors.white }}>
            <HFlex>
              <span style={{ marginRight: 5 }}>Series:</span>
              <Button
                title={''}
                onClick={() => {
                  this.setState({ showingCreateSeriesPopup: true })
                }}
                style={{ minWidth: 0, backgroundColor: Colors.white }}
              >
                <TiPlus color={Colors.black} size={23} />
              </Button>
              {this.props.series.all.map((series: Series, index) => (
                <Button
                  key={index}
                  title={series.name}
                  style={{ backgroundColor: Colors.white, color: Colors.black }}
                  onClick={() => {
                    this.props.history.push(`/series/${series._id}`)
                  }}
                />
              ))}
            </HFlex>
          </VFlex>
          <VFlex>
            <Button
              title="Create Event"
              onClick={() => {
                this.setState({ showingCreatePopup: true })
              }}
              style={{ backgroundColor: Colors.green }}
            />
          </VFlex>
        </HFlex>
      </>
    )
  }
}

// Goddamn decorator export linting issues
export default withRouter(Header)
