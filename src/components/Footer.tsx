import React from 'react'
import Colors from '../Colors'
import { IoLogoGithub } from 'react-icons/io'
import { VFlex } from './Shared'

class Footer extends React.Component<{}> {
  render() {
    return (
      <VFlex
        style={{
          marginTop: 10,
          marginBottom: 10,
          paddingTop: 10,
          borderTop: `solid 1px ${Colors.black}`,
        }}
      >
        <a href="https://github.com/critresult" target="_blank">
          <IoLogoGithub color={Colors.black} size={50} />
        </a>
      </VFlex>
    )
  }
}

export default Footer
