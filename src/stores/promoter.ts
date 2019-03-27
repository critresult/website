import { observable, computed } from 'mobx'
import axios from 'axios'
import jwt from 'jsonwebtoken'

const JWT_PUBLIC_KEY =
  'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCwdkm3z3UenfMzYwD9IFnTKULdenREyogi0R1s4jlgLjB/DCJaKHEeR6WvRu8X5vmkTnxreHxP6/VjZCkkFPMaiK8ko1GqWwZvoRhl5fB8keJDw49TTmrOguaucvGqP1h6lkrKHu1vbemTCLxu8vzWt/RzUGmXD9I0FTf3jY38VPMtgO33BY2ez7ku95B93K1npY8vK8PuT90C8NoFLmZUTj5dY6qX4JA+LXfVLrMwJaBjZi3xKGvT3E8U1kAi9S6ZLaig8S+/9BU8Dahp2xgB4TtFB49D2rWkmDaUsS2Ky/IY6IuJi/xffusspEET5sA4ISZPKcflf1GoikrK5XQejZ86YbDS+vEh3Rae2mFze3dcM0EHUMmyZ46alr2tCra5pCURs61G236OMj/6APrsEuGPoqMDio/htW2OzmBRSMj0I7rA/is87jOXGK8dNFDOhHr+bg/uFd0jXnK63vkTTi+Ep8+y+1iCI9v9WO8H54y6484Cl7PGNyfbd/6aGFw1et5+DdFsVTDrmOGWWLAs0vnfDtz9HZGyuzCk/ssoZJrJbEH6u0Wij6HsbaupZqq8/UpFcVIaRkMzJdIPj6nQyXjBUVu9K3Syt5noOcfi9hGwUM5velYoySKkyVqE6922D5JIST/nuh+Kw+tb2BK+8FH+N05bWvwUBI/elyisDQ=='

interface Promoter {
  _id: string
  createdAt: string
  email: string
}

export default class PromoterStore {
  @observable active: Promoter = {} as Promoter

  get authenticated() {
    return !!this.token
  }

  @computed
  get token() {
    return localStorage.getItem('token')
  }

  @computed
  static token() {
    return localStorage.getItem('token')
  }

  decodeToken() {
    if (this.token) {
      this.active = jwt.verify(this.token, JWT_PUBLIC_KEY) as Promoter
    }
  }

  async signup(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoter', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      this.active = data
      this.decodeToken()
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }

  async login(email: string, password: string) {
    try {
      const { data } = await axios.post('/promoter/login', {
        email,
        password,
      })
      localStorage.setItem('token', data.token)
      this.active = data
      this.decodeToken()
    } catch (err) {
      console.log(err.response.data.message)
      throw err
    }
  }
}
