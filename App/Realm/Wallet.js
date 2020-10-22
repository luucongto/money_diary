
import schema from './schemas/Wallet'
import RealmWrapper from './RealmWrapper'
import Transaction from './Transaction'
import _ from 'lodash'
import Utils from '../Utils/Utils'
import Constants from '../Config/Constants'
class Wallet extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    const realm = this.realm
    const maxId = realm.objects(this.schema).length
    if (maxId) {
      return
    }
    Wallet.bulkInsert(require('./data/wallet.json'), true)
  }

  static insertTransaction (params) {
    const wallet = Wallet.findOne({ label: params.wallet })
    if (wallet) {
      wallet.amount += params.amount
      wallet.income += params.amount > 0 ? params.amount : 0
      wallet.outcome += params.amount < 0 ? params.amount : 0
    } else {
      Wallet.insert({
        id: params.wallet,
        label: params.wallet,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        amount: params.amount,
        income: params.amount > 0 ? params.amount : 0,
        outcome: params.amount < 0 ? params.amount : 0
      }, true)
    }
  }

  static appendId (params) {
    const realm = this.realm
    if (params.position === undefined) {
      const newPosition = realm.objects(this.schema.name).max('position')
      params.position = (newPosition || 0) + 1
    }
    params.id = params.label
    return params
  }

  static getColor = (id) => {
    const item = Wallet.findOne({ id })
    const color = item ? item.color : 'black'
    return color
  }

  static get = (id) => {
    return Wallet.findOne({ id })
  }

  static findWithAmount = () => {
    const wallets = Wallet.find(null, { sort: { position: false } })
    const result = wallets.map((wallet) => Wallet.findOneWithAmount(wallet.id))
    return result
  }

  static findOneWithAmount = (id) => {
    const wallet = Wallet.findOne({ id })
    const amounts = Wallet.calculate(id)
    const result = { ...Utils.clone(wallet), ...amounts }
    Wallet.insert(result)
    return result
  }

  static calculate = (id) => {
    let findConditions = { wallet: id }
    if (id === Constants.DEFAULT_WALLET_ID) {
      findConditions = null
    }
    let transactions = Transaction.getBy(findConditions, { sort: { date: true } })
    if (!id) {
      transactions = Transaction.getBy()
    }
    const currentMonthTag = Utils.getMonth()
    const result = {
      amount: 0,
      income: 0,
      outcome: 0,
      count: transactions.length,
      lastUpdate: 0
    }
    _.forEach(transactions, transaction => {
      result.lastUpdate = result.lastUpdate < transaction.date ? transaction.date : result.lastUpdate
      result.amount = result.amount + transaction.amount
      if (transaction.include && transaction.monthTag === currentMonthTag) {
        if (transaction.amount > 0) {
          result.income += transaction.amount
        } else {
          result.outcome += transaction.amount
        }
      }
    })
    return result
  }
}

export default Wallet
