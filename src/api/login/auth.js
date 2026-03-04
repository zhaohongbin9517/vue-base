import md5 from 'js-md5'
import request from '@/api/userUtils/userRequest'

export const loginByPassword = ({ username, password }) => request({
  url: '/login',
  method: 'post',
  data: {
    username,
    password: md5(password),
    grant_type: 'password'
  }
})
