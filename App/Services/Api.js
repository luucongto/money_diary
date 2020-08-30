import apisauce from 'apisauce'
import ApiConfig from '../Config/ApiConfig'
import Utils from '../Utils/Utils'
import { Transaction, Wallet, Category, realm } from '../Realm'
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

  startup () {
    Utils.log('api.startup')
    Wallet.initializeDatas()
    Category.initializeDatas()
    // Transaction.initializeTransactions()
    return { data: true }
  }

  // Custom API ---------------------------------------------------------
  async wallet () {
    return { data: null }
  }

  async walletUpdate () {
    return { data: null }
  }

  async walletCreate () {
    return { data: null }
  }

  async walletDelete () {
    return { data: null }
  }

  async category () {
    return { data: null }
  }

  async categoryUpdate () {
    return { data: null }
  }

  async categoryCreate () {
    return { data: null }
  }

  async categoryDelete () {
    return { data: null }
  }

  transaction (params) {
    if (params && params.month) {
      const startDate = Utils.startOf('month', params.month)
      const endDate = Utils.endOf('month', params.month)
      Utils.log('query', startDate, endDate)
      return { data: Transaction.getbyPeriod(startDate, endDate) }
    }
    return { data: Transaction.find(params, { sort: { date: true } }) }
  }

  transactionUpdate (params) {
    const transaction = Transaction.findOne({ id: params.id })
    if (!transaction) {
      return { error: 'not_found' }
    }
    const updateResults = Transaction.insert({ ...transaction, ...params })
    return { data: updateResults }
  }

  transactionCreate (params) {
    return { data: Transaction.insert(params) }
  }

  transactionDelete (params) {
    const id = params.id
    return { data: Transaction.remove({ id: id }) }
  }

  downloadFile (fileId, token) {
    const api = apisauce.create({
      // base URL is read from the "constructor"
      baseURL: 'https://www.googleapis.com/drive/v3/files',
      // here are some default headers
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      },
      // 15 second timeout...
      timeout: 1500000
    })
    return api.get(fileId, { alt: 'media' }).then(data => {
      const { wallets, transactions, categories } = data.data
      realm.write(() => {
        const walletCounts = Wallet.bulkInsert(wallets, true)
        const categoryCount = Category.bulkInsert(categories, true)
        const transactionCount = Transaction.bulkInsert(transactions, true)
        Utils.log('sync', walletCounts, categoryCount, transactionCount)
      })

      return data.data
    }).catch(error => {
      Utils.log('e', error)
    })
  }
}

const api = new API()

export default api
