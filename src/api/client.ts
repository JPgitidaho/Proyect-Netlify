import createClient from 'openapi-fetch'
import type { paths } from '../openapi-types'

export const api = createClient<paths>({ baseUrl: 'http://127.0.0.1:4010' })
