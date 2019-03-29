import React from 'react'
import { VFlex, HFlex, ModalContainer, Input } from './Shared'
import Button from './Button'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import SeriesStore from '../stores/series'

@inject('event', 'series')
@observer
class EventCreate extends React.Component<{
  onCreated?: () => void
  onCancelled?: () => void
  event?: EventStore
  series?: SeriesStore
}> {
  state = {
    isLoading: false,
    eventData: {},
  }

  componentDidMount() {
    this.props.series.load()
  }

  createEvent = () => {
    this.setState({ isLoading: true })
    this.props.event
      .create(this.state.eventData as Event)
      .then(() => this.props.event.loadUpcoming())
      .then(() =>
        this.setState({
          isLoading: false,
        })
      )
      .then(() => (this.props.onCreated || (() => {}))())
      .catch(() => {
        this.setState({ isLoading: false })
      })
  }

  handleSeriesChange = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    this.setState({
      eventData: {
        ...this.state.eventData,
        seriesId: event.target.value
      }
    })
  }

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
                <select
                  value={this.state.eventData.seriesId}
                  onChange={this.handleSeriesChange}
                >
                  {this.props.series.mySeries.map((series) => (
                    <option value={series._id}>{series.name}</option>
                  ))}
                </select>
              </HFlex>
              <HFlex style={{ padding: 8, textAlign: 'center' }}>
                Additional options can be configured after creation.
              </HFlex>
              <HFlex>
                <Button
                  animating={this.state.isLoading}
                  title="Create Event"
                  onClick={this.createEvent}
                />
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

export default EventCreate
