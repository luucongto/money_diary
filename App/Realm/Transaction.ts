import schema from './schemas/Transaction'
import data from './data/transaction.json'
import RealmWrapper from './RealmWrapper'
import Utils from '../Containers/Utils'
import Wallet from './Wallet'
import Category from './Category'
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
    Utils.log('Transaction insert', params)
    return params
  }

  static _updateWalletAmount (doc:any) {
    const wallet = Wallet.get(doc.wallet)
    if (wallet) {
      Wallet.update({ label: wallet.label }, { amount: wallet.amount + doc.amount }, true)
      Utils.log('wallet update', wallet.label, wallet.amount)
    } else {
      Utils.log('wallet not exist', doc.wallet)
    }
    return doc
  }

  static afterInsert (doc: any) {
    Utils.log('afterinsert', doc)
    return Transaction._updateWalletAmount(doc)
  }

  static afterUpdate (doc: any) {
    return Transaction._updateWalletAmount(doc)
  }
}

export default Transaction
