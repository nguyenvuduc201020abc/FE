import axios from 'axios'
import Cookies from 'js-cookie'

export const BASE_URL = 'https://1479-118-69-248-87.ngrok-free.app/'
//export const BASE_URL = 'http://103.229.41.235:6243/api/'

export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 20_000,
  headers: { Authorization: `Bearer ${Cookies.get('jwt_token')}` }
})
