import React from 'react'
import { VFlex, HFlex, LargeText, TitleText } from './Shared'
import { inject, observer } from 'mobx-react'
import BibStore from '../stores/bib'
import SeriesStore from '../stores/series'
import EventStore from '../stores/event'
import styled from 'styled-components'

const NumberLine = styled.div`
  margin: 2;
`
@inject('bib', 'series', 'event')
@observer
export default class AvailableBibs extends React.Component<{
  seriesId: string
  bib?: BibStore
  series?: SeriesStore
  event?: EventStore
}> {
  render() {
    const available = this.props.bib.availableBibsForSeriesId(
      this.props.seriesId
    )
    return (
      <VFlex>
        <TitleText>Available Bib Numbers</TitleText>
        <HFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>0-99</LargeText>
            </HFlex>
            {available
              .filter((a) => a < 100)
              .splice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>100-199</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 99 && a < 199)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>200-299</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 199 && a < 299)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>300-399</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 299 && a < 399)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>400-499</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 399 && a < 500)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>500-599</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 499 && a < 600)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>600-699</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 599 && a < 700)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>700-799</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 699 && a < 800)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>800-899</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 799 && a < 900)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
          <VFlex style={{ margin: 8 }}>
            <HFlex>
              <LargeText>900-900</LargeText>
            </HFlex>
            {available
              .filter((a) => a > 899 && a < 1000)
              .slice(0, 5)
              .map((num) => (
                <NumberLine key={num}>{num}</NumberLine>
              ))}
          </VFlex>
        </HFlex>
      </VFlex>
    )
  }
}
