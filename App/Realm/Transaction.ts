import schema from './schemas/Transaction'
import data from './data/transaction.json'
import RealmWrapper from './RealmWrapper'
import Utils from '../Utils/Utils'
import Wallet from './Wallet'
class Transaction extends RealmWrapper {
  static schema = schema
  static initializeTransactions = () => {
    const realm = Transaction.realm
    const id = realm.objects(schema.name).max('id')
    if (id) {
      return
    }
    Transaction.bulkInsert(data.rows)
  }

  static getbyPeriod = (startDate: string, endDate:string) => {
    return Transaction.find(`date > ${Utils.formatDateForRealmQuery(startDate)} and date < ${Utils.formatDateForRealmQuery(endDate)}`, { sort: { date: true } })
  }

  static beforeInsert (params: any) {
    if (!params.date) {
      params.date = new Date()
    }
    const realm = this.realm
    const id = params.id ? params.id : realm.objects(schema.name).max('id')
    params.id = id || 0 + 1
    return params
  }

  static _updateWalletAmount (doc:any) {
    const wallet = Wallet.get(doc.wallet)
    if (wallet) {
      const walletUpdateData = {
        amount: wallet.amount + doc.amount,
        income: wallet.income,
        outcome: wallet.outcome
      }
      if (doc.amount > 0) {
        walletUpdateData.income = wallet.income + doc.amount
      } else {
        walletUpdateData.outcome = wallet.outcome + doc.amount
      }
      Wallet.update({ label: wallet.label }, walletUpdateData, true)
    }
    return doc
  }

  static afterInsert (doc: any) {
    return Transaction._updateWalletAmount(doc)
  }

  static afterUpdate (doc: any) {
    return Transaction._updateWalletAmount(doc)
  }
}

export default Transaction
