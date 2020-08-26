
import schema from './schemas/Wallet'
import RealmWrapper from './RealmWrapper'
import Transaction from './Transaction'
import _ from 'lodash'
import Utils from '../Utils/Utils'
class Wallet extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    const id = Wallet.realm.objects(schema.name).max('id')
    if (id) {
      return
    }
    Wallet.bulkInsert(require('./data/wallet.json'))
  }

  static getColor = (label: string) => {
    const item = Wallet.findOne({ label })
    const color = item ? item.color : 'black'
    return color
  }

  static get = (label: string) => {
    return Wallet.findOne({ label })
  }

  static findWithAmount = () => {
    const wallets = Wallet.find()
    const result = wallets.map((wallet: { label: string }) => Wallet.findOneWithAmount(wallet.label))
    return result
  }

  static findOneWithAmount = (label: string) => {
    const wallet = Wallet.findOne({ label })
    const amounts = Wallet.calculate(label)
    return { ...wallet, ...amounts }
  }

  static calculate = (label: string) => {
    const transactions = Transaction.find({ wallet: label })
    const result = {
      amount: 0,
      income: 0,
      outcome: 0
    }
    _.forEach(transactions, transaction => {
      result.amount = result.amount + transaction.amount
      if (transaction.include) {
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
