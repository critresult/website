import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import SeriesStore from '../stores/series'
import { withRouter } from 'react-router-dom'

@inject('event', 'series')
@observer
class EventCreate extends React.Component<{
  onCancelled?: () => void
  event?: EventStore
  series?: SeriesStore
}> {
  state = {
    eventData: {},
  }

  selectRef = React.createRef()

  componentDidMount() {
    this.props.series.load()
    this.props.series.loadMySeries()
  }

  createEvent = () =>
    this.props.event
      .create({
        ...this.state.eventData,
        seriesId: this.selectRef.current.value,
      })
      .then((created: any) => this.props.history.push(`/event/${created._id}`))

  render() {
    return (
      <VFlex>
        <HFlex style={{ borderRadius: 5 }}>
          <ModalContainer>
            <VFlex style={{ padding: 10 }}>
              <HFlex>
                Event Name:{' '}
                <Input
                  valid
                  type="text"
                  onChange={(e: any) => {
                    this.setState({
                      eventData: {
                        ...this.state.eventData,
                        name: e.target.value,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Event Date:{' '}
                <Input
                  valid
                  type="date"
                  onChange={(e: any) => {
                    const date = new Date(e.target.value).toISOString()
                    this.setState({
                      eventData: {
                        ...this.state.eventData,
                        startDate: date,
                        endDate: date,
                      },
                    })
                  }}
                />
              </HFlex>
              <HFlex>
                Series:{' '}
                <select ref={this.selectRef}>
                  {this.props.series.mySeries.map((series) => (
                    <option key={series._id} value={series._id}>
                      {series.name}
                    </option>
                  ))}
                </select>
              </HFlex>
              <HFlex style={{ padding: 8, textAlign: 'center' }}>
                Additional options can be configured after creation.
              </HFlex>
              <HFlex>
                <Button title="Create Event" onClick={this.createEvent} />
                <Button
                  title="Cancel"
                  onClick={this.props.onCancelled || (() => {})}
                />
              </HFlex>
            </VFlex>
          </ModalContainer>
        </HFlex>
      </VFlex>
    )
  }
}

export default withRouter(EventCreate)
