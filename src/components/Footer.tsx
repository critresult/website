import React from 'react'
import Colors from '../Colors'
import { TiSocialGithub, TiHeart } from 'react-icons/ti'
import { RootCell, VFlex, HFlex } from './Shared'

export default class Footer extends React.Component<{}> {
  render() {
    return (
      <>
        <div
          style={{
            flex: 1,
          }}
        />
        <div>
          <RootCell
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <VFlex>
              <a href="https://github.com/critrace" target="_blank">
                <TiSocialGithub color={Colors.black} size={50} />
              </a>
              <HFlex style={{ color: Colors.black, fontSize: 11 }}>
                <div>Inspired by and in memory of M.M.</div>
                <TiHeart color={Colors.pink} size={14} />
              </HFlex>
            </VFlex>
          </RootCell>
        </div>
      </>
    )
  }
}
