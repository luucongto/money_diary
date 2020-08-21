import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
import Utils from '../Utils/Utils'
import { Transaction } from '../Realm'
const autoBind = require('react-autobind')
class API {
  constructor (loginToken, baseURL = ApiConfig.baseURL) {
    this.api = apisauce.create({
      // base URL is read from the "constructor"
      baseURL,
      // here are some default headers
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      // 15 second timeout...
      timeout: 1500000
    })
    autoBind(this)
  }

  authenticated (loginToken) {
    this.loginToken = loginToken
    this.api.setHeader('Authorization', 'Bearer ' + loginToken)
  }

  preprocessResult (data) {
    if (!data) {
      return {
        error: 1,
        message: 'Network Error.'
      }
    }
    if (data.status === 401) {
      this.authenticated(null)
      return {
        error: 1,
        message: 'Unauthenticated.'
      }
    }
    const result = data.data
    if (!result) {
      return {
        error: 1,
        message: 'error_null_response'
      }
    }
    if (result.message === 'Your email address is not verified.') {
      return {
        error: 1,
        message: 'Unauthenticated.'
      }
    }
    return result
  }

  login (params) {
    const url = params.type === 'guest' ? 'v1.0/guest_login' : 'v1.0/login'
    return this.api.post(url, params).then(data => {
      const result = data.data
      Utils.log('login', data, result)
      if (!result) {
        return {
          error: 1,
          message: 'error_null_response'
        }
      }
      if (!result.error && result.data) { this.authenticated(result.data) }
      return result
    })
    // }
    // return this.loginFirebase(params)
  }

  loginFirebase (params) {
    return this.api.post('login', params).then(data => {
      const result = data.data
      if (!result) {
        return 'error_null_response'
      }
      if (result.error) {
        return {
          error: 1,
          message: result.message
        }
      }
      if (result.access_token) this.authenticated(result.access_token)
      return { data: result }
    })
  }

  logout () {
    return this.api.get('logout').then(data => {
      this.authenticated('empty')
      return this.preprocessResult(data)
    })
  }

  user () {
    return this.api.get('v1.0/me').then(data => {
      return this.preprocessResult(data)
    })
  }

  // Custom API ---------------------------------------------------------
  transaction (params) {
    return { data: Transaction.getbyPeriod(Utils.startOf(), Utils.endOf()) }
  }
}

const api = new API()

export default api
