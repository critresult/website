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
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <a href="https://github.com/critresult" target="_blank">
              <TiSocialGithub color={Colors.black} size={50} />
            </a>
          </RootCell>
        </div>
      </>
    )
  }
}
