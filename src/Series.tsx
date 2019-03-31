import React from 'react'
import { inject, observer } from 'mobx-react'
import {
  HFlex,
  VFlex,
  Input,
  LargeText,
  RootCell,
  TitleText,
} from './components/Shared'
import SeriesStore from './stores/series'
import BibStore from './stores/bib'
import RiderStore, { Rider } from './stores/rider'
import Header from './components/Header'
import Button from './components/Button'
import keyby from 'lodash.keyby'
import Colors from './Colors'
import AddBibCell from './components/AddBibCell'
import idx from 'idx'
import Footer from './components/Footer'
import Hydrated from 'hydrated'
import emailValidator from 'email-validator'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Popup from './components/Popup'
import EventCreate from './components/EventCreate'

@inject('series', 'event', 'rider', 'bib')
@observer
class Series extends React.Component<{
  series?: SeriesStore
  bib?: BibStore
  rider?: RiderStore
}> {
  state = {
    isSearching: false,
    foundRiders: [],
    promoterEmail: '',
    showingCreatePopup: false,
  }

  searchRef = React.createRef()

  async componentDidMount() {
    await Hydrated.hydrate()
  }

  searchChanged = (e: any) => {
    const newSearchString = e.target.value
    if (newSearchString.length === 0) {
      this.setState({ foundRiders: [], isSearching: false })
      return
    }
    this.setState({ isSearching: true })
    this.props.rider
      .search(newSearchString)
      .then((riders) => {
        if (this.searchRef.current.value !== newSearchString) return
        this.setState({ isSearching: false })
        this.setState({ foundRiders: riders })
      })
      .catch(() => this.setState({ isSearching: false }))
  }

  render() {
    const seriesId = this.props.match.params.id
    const series = this.props.series.seriesById[seriesId] || {}
    const bibs = this.props.bib.bibsBySeriesId[seriesId] || []
    const bibsByRiderId = keyby(bibs, 'riderId')
    const promoters = this.props.series.promotersBySeriesId[seriesId] || []
    const events = this.props.event.eventsBySeriesId[seriesId] || []

    return (
      <>
        <Popup visible={this.state.showingCreatePopup}>
          <EventCreate
            onCancelled={() => this.setState({ showingCreatePopup: false })}
          />
        </Popup>
        <Header />
        <RootCell style={{ marginTop: 0 }}>
          <VFlex>
            <TitleText>{series.name} Race Series</TitleText>
          </VFlex>
        </RootCell>
        <RootCell>
          <VFlex>
            <LargeText>Add Rider to Series</LargeText>
            <HFlex>
              Search:
              <Input
                ref={this.searchRef}
                valid
                type="text"
                placeholder="firstname, lastname, or license #"
                style={{ minWidth: 200 }}
                onChange={this.searchChanged}
              />
              {this.state.isSearching ? (
                <img
                  src={require('../static/puff.svg')}
                  height="15"
                  style={{ filter: 'brightness(0)' }}
                />
              ) : null}
            </HFlex>
          </VFlex>
          {this.state.foundRiders.map((_rider: Rider) => (
            <AddBibCell
              key={_rider._id}
              seriesId={seriesId}
              _rider={_rider}
              bibNumber={(bibsByRiderId[_rider._id] || {}).bibNumber}
            />
          ))}
        </RootCell>
        <RootCell>
          <VFlex>
            <LargeText>Promoters</LargeText>
            <VFlex style={{ margin: 8 }}>
              {promoters.map((promoter) => (
                <div key={promoter._id}>{promoter.email}</div>
              ))}
            </VFlex>
            <HFlex>
              <Input
                valid={emailValidator.validate(this.state.promoterEmail)}
                type="text"
                placeholder="email@domain.com"
                style={{ minWidth: 200 }}
                onChange={(e) =>
                  this.setState({ promoterEmail: e.target.value })
                }
              />
              <Button
                title="Invite"
                onClick={() =>
                  this.props.series.invitePromoter(
                    seriesId,
                    this.state.promoterEmail
                  )
                }
              />
            </HFlex>
          </VFlex>
        </RootCell>
        <RootCell>
          <VFlex>
            <LargeText>Events</LargeText>
          </VFlex>
          <HFlex>
            {events.map((event: any) => {
              const races = event.races || []
              return (
                <div style={{ padding: 8 }} key={event._id}>
                  <HFlex>
                    {series.name || ''} - {event.name}
                  </HFlex>
                  <HFlex style={{ margin: 8 }}>
                    {moment(event.startDate)
                      .utc()
                      .format('MMMM D, YYYY')}{' '}
                    - {races.length} race{races.length === 1 ? '' : 's'}
                  </HFlex>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/event/${event._id}`}
                  >
                    <Button
                      style={{
                        backgroundColor: Colors.yellow,
                        color: Colors.black,
                      }}
                      title="View Details"
                    />
                  </Link>
                </div>
              )
            })}
          </HFlex>
          <HFlex style={{ justifyContent: 'flex-end' }}>
            <VFlex>
              <Button
                style={{
                  backgroundColor: Colors.green,
                }}
                title="Create Event"
                onClick={() => this.setState({ showingCreatePopup: true })}
              />
            </VFlex>
          </HFlex>
        </RootCell>
        <RootCell>
          <VFlex>
            <LargeText>Active Bibs ({bibs.length})</LargeText>
          </VFlex>
          <HFlex style={{ justifyContent: 'space-between', margin: 16 }}>
            <VFlex style={{ minWidth: '15%' }}>Bib #</VFlex>
            <VFlex style={{ minWidth: '15%' }}>Firstname</VFlex>
            <VFlex style={{ minWidth: '15%' }}>Lastname</VFlex>
            <VFlex style={{ minWidth: '15%' }}>License</VFlex>
            <VFlex style={{ minWidth: '15%' }}>Transponder</VFlex>
            <VFlex style={{ flex: 1 }} />
          </HFlex>
          {bibs
            .slice()
            .sort((a, b) => (a.bibNumber > b.bibNumber ? 1 : -1))
            .map((bib) => (
              <HFlex
                key={bib._id}
                style={{
                  justifyContent: 'space-between',
                  margin: 4,
                  marginBottom: 0,
                }}
              >
                <VFlex style={{ minWidth: '15%' }}>{bib.bibNumber}</VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.firstname)}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.lastname)}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.license) || 'One Day'}
                </VFlex>
                <VFlex style={{ minWidth: '15%' }}>
                  {idx(bib, (_: any) => _.rider.transponder) || 'none'}
                </VFlex>
                <VFlex style={{ flex: 1 }}>
                  <HFlex>
                    <Button
                      title="Edit"
                      style={{
                        backgroundColor: Colors.yellow,
                        color: Colors.black,
                        flex: 1,
                      }}
                      onClick={() => {}}
                    />
                    <Button
                      title="Delete"
                      style={{ backgroundColor: Colors.pink, flex: 1 }}
                      onClick={() => {
                        confirm(
                          'Are you sure you want to delete this bib? Any race entries will also be deleted.'
                        )
                        return this.props.bib
                          .delete(bib._id)
                          .then(() =>
                            this.props.bib.loadBibsForSeries(seriesId)
                          )
                      }}
                    />
                  </HFlex>
                </VFlex>
              </HFlex>
            ))}
        </RootCell>
        <Footer />
      </>
    )
  }
}

export default Series
