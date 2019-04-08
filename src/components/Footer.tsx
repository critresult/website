import React from 'react'
import Colors from '../Colors'
import { TiSocialGithub } from 'react-icons/ti'
import { RootCell } from './Shared'

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
            <a href="https://github.com/critrace" target="_blank">
              <TiSocialGithub color={Colors.black} size={50} />
            </a>
          </RootCell>
        </div>
      </>
    )
  }
}
