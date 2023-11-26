import axios from 'axios'
import https from 'https'

const agent = new https.Agent({
  rejectUnauthorized: false
})

export const instanceMiddleware = axios.create({
  baseURL: '/api'
})

export const instanceMiddlewareApi = axios.create({
  baseURL: `${process.env.APICORE_BASE_URL_API}/api`,
  httpsAgent: agent
})

