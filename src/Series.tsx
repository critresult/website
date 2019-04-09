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
import BibStore, { Bib } from './stores/bib'
import RiderStore, { Rider } from './stores/rider'
import Header from './components/Header'
import Button from './components/Button'
import keyby from 'lodash.keyby'
import Colors from './Colors'
import AddBibCell from './components/AddBibCell'
import Footer from './components/Footer'
import emailValidator from 'email-validator'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Popup from './components/Popup'
import EventCreate from './components/EventCreate'
import BibList from './components/BibList'
import EventStore from './stores/event'
import idx from 'idx'
import LoadingIndicator from './components/LoadingIndicator'

@inject('series', 'event', 'rider', 'bib')
@observer
export default class Series extends React.Component<{
  series?: SeriesStore
  bib?: BibStore
  rider?: RiderStore
  event?: EventStore
  match?: any
}> {
  state = {
    isSearching: false,
    foundRiders: [] as Rider[],
    promoterEmail: '',
    showingCreatePopup: false,
    loading: true,
  }

  searchRef = React.createRef<any>()

  async componentDidMount() {
    this.componentDidUpdate({})
  }

  componentDidUpdate(prevProps: any) {
    const seriesId = this.props.match.params.id
    const lastSeriesId = idx(prevProps, (_: any) => _.match.params.id)
    if (seriesId === lastSeriesId) return
    this.setState({ loading: true })
    Promise.all([
      this.props.series.load(seriesId),
      this.props.bib.loadBibsForSeries(seriesId),
      this.props.series.loadEventsBySeriesId(seriesId),
    ])
      .then(() =>
        Promise.all(
          this.props.series
            .eventsBySeriesId(seriesId)
            .map((event: any) => this.props.event.loadRacesByEventId(event._id))
        )
      )
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        this.setState({ loading: false })
        throw err
      })
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
    const series = this.props.series.seriesById(seriesId)
    const bibs = this.props.bib.bibsBySeriesId(seriesId)
    const bibsByRiderId = keyby(bibs, 'riderId')
    const promoters = this.props.series.promotersBySeriesId(seriesId)
    const events = this.props.series.eventsBySeriesId(seriesId)
    return (
      <>
        <Popup visible={this.state.showingCreatePopup}>
          <EventCreate
            onCancelled={() => this.setState({ showingCreatePopup: false })}
          />
        </Popup>
        <Header />
        {this.state.loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <RootCell
              style={{
                marginTop: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            >
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
                  bibNumber={
                    (bibsByRiderId[_rider._id] || ({} as Bib)).bibNumber
                  }
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
                  const races = this.props.event.racesByEventId(event._id)
                  return (
                    <RootCell key={event._id} style={{ margin: 8 }}>
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
                    </RootCell>
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
              <BibList seriesId={seriesId} />
            </RootCell>
          </>
        )}
        <Footer />
      </>
    )
  }
}
