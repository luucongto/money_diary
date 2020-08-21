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
    realm.write(() => {
      const items = realm.objects(schema.name)
      realm.delete(items)
      data.rows.forEach(item => realm.create(schema.name, item))
    })
  }

  static getbyPeriod = (startDate: string, endDate:string) => {
    return Transaction.find(`date > ${Utils.formatDateForRealmQuery(startDate)} and date < ${Utils.formatDateForRealmQuery(endDate)}`, { sort: { date: true } })
  }

  static beforeInsert (params: any) {
    if (!params.date) {
      params.date = new Date()
    }
    const realm = this.realm
    const id = realm.objects(schema.name).max('id')
    params.id = id || 0 + 1
    Utils.log('insert', params)
    return params
  }
}

export default Transaction
