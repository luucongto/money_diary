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
    // return this.find('date > $0 and date < $1', [new Date(startDate), new Date(endDate)])
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

  static afterUpdate = (doc: any) => {
  }

  static appendFind = (doc: any) => {
    const wallet = Wallet.findOne({ label: doc.wallet })
    const category = Category.findOne({ label: doc.category })
    doc.walletColor = wallet ? wallet.color : 'black'
    doc.categoryColor = category ? category.color : 'red'
    return doc
  }
}

export default Transaction
