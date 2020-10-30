import apisauce from 'apisauce'
import { lowerCase } from 'lodash'
import moment from 'moment'
import Papa from 'papaparse'
import autoBind from 'react-autobind'
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import ApiConfig from '../Config/ApiConfig'
import Constants from '../Config/Constants'
import { Category, realm, Transaction, Wallet } from '../Realm'
import Utils from '../Utils/Utils'
import GoogleSheet from './GoogleSheet'
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
    return new Promise((resolve, reject) => {
      try {
        Utils.log('api.startup')
        realm.write(() => {
          Wallet.initializeDatas()
          Category.initializeDatas()
        })
        setTimeout(() => {
          Utils.log('api.startup done', this.wallet(), this.category(), Transaction.getBy())
          resolve({ data: true })
        }, 1000)
      } catch (e) {
        Utils.log('api.startuperror', e)
        reject(e)
      }
    }).then(data => data)
  }

  // Custom API ---------------------------------------------------------
  wallet () {
    return Wallet.find()
  }

  async walletUpdate (params) {
    const { id, ...rest } = params
    return Wallet.update({ id }, rest)
  }

  walletCreate (params) {
    return Wallet.insert(params)
  }

  walletDelete (params) {
    realm.write(() => {
      Utils.log('removing wallet', params)
      // Transaction.remove({ wallet: params.id }, true)
      Wallet.remove({ id: params.id }, true)
    })
  }

  category () {
    return Category.find()
  }

  categoryUpdate (params) {
    const { id, ...rest } = params
    return Category.update({ id }, rest)
  }

  categoryCreate (params) {
    return Category.insert(params)
  }

  async categoryDelete () {
    return { data: null }
  }

  transaction (params) {
    if (params && params.from) {
      const startDate = params.from
      const endDate = params.to
      Utils.log('query', startDate, endDate)
      return Transaction.findWithFilter(startDate, endDate, params)
    }
    Utils.log('transaction query', params)
    return Transaction.getBy({ ...params, deleted: false }, { sort: { date: true } })
  }

  transactionUpdate (params) {
    return realm.write(() => {
      const { id } = params
      const transaction = Transaction.findOne({ id })
      if (!transaction) {
        return { error: 'not_found' }
      }
      const newTransaction = { ...Utils.clone(transaction), ...params }
      if (newTransaction.wallet !== transaction.wallet) {
        // update wallet
        const currentWallet = Wallet.findOne({ id: transaction.wallet })
        currentWallet.removeTransaction(transaction)
        const newWallet = Wallet.findOne({ id: newTransaction.wallet })
        newWallet.addTransaction(newTransaction)
      } else if (newTransaction.amount !== undefined && newTransaction.amount !== transaction.amount) {
        const currentWallet = Wallet.findOne({ id: transaction.wallet })
        currentWallet.removeTransaction(transaction)
        currentWallet.addTransaction(newTransaction)
      }
      delete (newTransaction.id)
      const updateResults = Transaction.update({ id }, newTransaction, true)
      return { data: updateResults }
    })
  }

  transactionCreate (transaction) {
    return realm.write(() => {
      const currentWallet = Wallet.findOne({ id: transaction.wallet })
      const newAmount = transaction.amount
      currentWallet.amount += newAmount
      currentWallet.income += newAmount > 0 ? newAmount : 0
      currentWallet.outcome += newAmount < 0 ? newAmount : 0
      return Transaction.insert(transaction, true)
    })
  }

  transactionDelete (params) {
    const id = params.id
    return {
      data: Transaction.update({
        id
      }, {
        deleted: true
      })
    }
  }

  async extractTransactions (spreadSheetId) {
    const rawData = await GoogleSheet.getData(spreadSheetId, Constants.SHEETS.TRANSACTIONS, 12)
    Utils.log('rawTransactions', rawData)
    const result = []
    if (rawData) {
      rawData.values.forEach((item, index) => {
        if (index === 0) {
          return
        }
        result.push(Transaction.fromArray(item))
      })
    }
    return result
  }

  async extractWallets (spreadSheetId) {
    const rawData = await GoogleSheet.getData(spreadSheetId, Constants.SHEETS.WALLETS, 12)
    Utils.log('rawWallets', rawData)
    const wallets = []
    if (rawData) {
      rawData.values.forEach((item, index) => {
        if (index === 0) {
          return
        }
        wallets.push(Wallet.fromArray(item))
      })
    }
    return wallets
  }

  async extractCategories (spreadSheetId) {
    const rawData = await GoogleSheet.getData(spreadSheetId, Constants.SHEETS.CATEGORIES, 12)
    const result = []
    if (rawData) {
      rawData.values.forEach((item, index) => {
        if (index === 0) {
          return
        }
        result.push(Category.fromArray(item))
      })
    }
    return result
  }

  async downloadFile (spreadSheetId, token) {
    const wallets = await this.extractWallets(spreadSheetId)
    const transactions = await this.extractTransactions(spreadSheetId)
    const categories = await this.extractCategories(spreadSheetId)
    Utils.log('sync', wallets, transactions)
    realm.write(() => {
      Wallet.bulkInsert(wallets, true)
      Category.bulkInsert(categories, true)
      Transaction.bulkInsert(transactions, true)
    })
    Utils.log('downloadFile', transactions)
    return {
      transactions: transactions
    }
  }

  async importFromFile (uri) {
    if (uri) {
      const stats = await RNFetchBlob.fs.stat(uri)
      const content = await RNFS.readFile(stats.path)
      const data = Papa.parse(content, {
        header: true,
        dynamicTyping: true,
        transformHeader: (header, index) => {
          return lowerCase(header)
        }
      })
      Utils.log('content', stats.path, data)
      if (data.data) {
        const transactions = []
        data.data.map(each => {
          if (!each.account) {
            return
          }
          const date = moment('' + each.date, 'DD/MM/YYYY').unix()
          const {
            id,
            category,
            account,
            amount,
            note
          } = each
          transactions.push({
            id,
            category,
            wallet: account,
            amount,
            note: note || '',
            date
          })
        })
        const updatedResult = Transaction.bulkInsertFromCSV(transactions)
        Utils.log('importFromFileAPi updatedResult', updatedResult)
        return updatedResult
      }
    }
  }
}

const api = new API()

export default api
