import dayjs from 'dayjs'
import _ from 'lodash'
import Utils from '../Utils/Utils'
import Category from './Category'
import RealmWrapper from './RealmWrapper'
import schema from './schemas/Transaction'
import Wallet from './Wallet'
class Transaction extends RealmWrapper {
  static schema = schema
  static appendId (params) {
    const realm = this.realm
    if (params.id === undefined) {
      const maxId = realm.objects(this.schema.name).max('id')
      params.id = (maxId || 0) + 1
    }
    return params
  }

  static bulkInsertFromCSV = (rows = []) => {
    if (!rows.length) {
      return []
    }
    let result = {}
    Transaction.realm.write(() => {
      const walletObjs = {}
      const categoryObjs = {}
      rows.forEach(row => {
        const wallet = walletObjs[row.wallet] || { label: row.wallet, amount: 0, income: 0, outcome: 0 }
        wallet.amount += row.amount
        wallet.income += row.amount > 0 ? row.amount : 0
        wallet.outcome += row.amount < 0 ? row.amount : 0
        const category = categoryObjs[row.category] || { label: row.category, amount: 0, income: 0, outcome: 0 }
        category.amount += row.amount
        category.income += row.amount > 0 ? row.amount : 0
        category.outcome += row.amount < 0 ? row.amount : 0
      })
      result = Transaction.bulkInsert(rows, true)
      Utils.log('====================bulk', walletObjs)
      // process wallet
      _.forEach(walletObjs, (wallet, label) => {
        Wallet.insert(wallet)
      })
      _.forEach(categoryObjs, (item, label) => {
        Category.insert(item)
      })
      // process category
    })
    return result
  }

  static getBy (condition, option = null) {
    return Transaction.find({ ...condition, deleted: false }, { sort: { date: true }, ...option })
  }

  static findWithFilter = (startDate, endDate, params) => {
    const query = { wallet: params.wallet, category: params.category }
    query.date = {
      '>=': startDate,
      '<': endDate
    }

    return Transaction.getBy(query)
  }

  static beforeInsert (params) {
    if (!params.date) {
      params.date = dayjs().unix()
    } else if (typeof (params.date) === 'string') {
      params.date = dayjs(params.date).unix()
    }
    params.monthTag = Utils.getMonth(params.date)
    params.quarterTag = Utils.getQuarter(params.date)
    params.dateTag = Utils.getDateFromUnix(params.date)
    params = Transaction.appendId(params)
    return params
  }

  static getMonths () {
    const realm = Transaction.realm
    const minDate = realm.objects(schema.name).min('date')
    const maxDate = realm.objects(schema.name).max('date')
    const months = Utils.getAllMonthsBetweenDates(minDate, maxDate)
    return months
  }

  static getQuarters () {
    const realm = Transaction.realm
    const minDate = realm.objects(schema.name).min('date')
    const maxDate = realm.objects(schema.name).max('date')
    const months = Utils.getAllQuartersBetweenDates(minDate, maxDate)
    return months
  }

  static getYears () {
    const realm = Transaction.realm
    const minDate = realm.objects(schema.name).min('date')
    const maxDate = realm.objects(schema.name).max('date')
    const months = Utils.getAllYearsBetweenDates(minDate, maxDate)
    return months
  }

  static remove (filter = {}, inTx = false) {
    var className = this
    return className.update(filter, { deleted: true }, inTx)
  }
}

export default Transaction
