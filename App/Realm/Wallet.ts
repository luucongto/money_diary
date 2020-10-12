
import schema from './schemas/Wallet'
import RealmWrapper from './RealmWrapper'
import Transaction from './Transaction'
import _ from 'lodash'
import Utils from '../Utils/Utils'
class Wallet extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    Wallet.bulkInsert(require('./data/wallet.json'), true)
  }

  static getColor = (id: number) => {
    const item = Wallet.findOne({ id })
    const color = item ? item.color : 'black'
    return color
  }

  static get = (id: number) => {
    return Wallet.findOne({ id })
  }

  static findWithAmount = () => {
    const wallets = Wallet.find()
    const result = wallets.map((wallet: { id: number }) => Wallet.findOneWithAmount(wallet.id))
    return result
  }

  static findOneWithAmount = (id: number) => {
    const wallet = Wallet.findOne({ id })
    const amounts = Wallet.calculate(id)
    return { ...Utils.clone(wallet), ...amounts }
  }

  static calculate = (id: number) => {
    let transactions = Transaction.getBy({ wallet: id }, { sort: { date: true } })
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
