
import schema from './schemas/Wallet'
import RealmWrapper from './RealmWrapper'
import Transaction from './Transaction'
import _ from 'lodash'
import Utils from '../Utils/Utils'
import Constants from '../Config/Constants'
class Wallet extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    Wallet.bulkInsert(require('./data/wallet.json'), true)
  }

  static appendId (params) {
    const realm = this.realm
    if (params.position === undefined) {
      const newPosition = realm.objects(this.schema.name).max('position')
      params.position = (newPosition || 0) + 1
    }
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
    return { ...Utils.clone(wallet), ...amounts }
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
