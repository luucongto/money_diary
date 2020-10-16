import schema from './schemas/Transaction'
import RealmWrapper from './RealmWrapper'
import Utils from '../Utils/Utils'
import Wallet from './Wallet'
import Category from './Category'
import _ from 'lodash'
import dayjs from 'dayjs'
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

  static bulkInsertRaw = (rows: any) => {
    let result = {}
    Transaction.realm.write(() => {
      const categories = _.map(rows, 'category')
      const wallets = _.map(rows, 'wallet')
      const walletMap: any = {}
      wallets.forEach((wallet:string) => {
        const obj = Wallet.findOne({ label: wallet })
        if (obj) {
          walletMap[wallet] = obj.id
        } else {
          const newObj = Wallet.insert({
            label: wallet,
            color: Utils.randomColor()
          }, true)
          Utils.log('newWallet', wallet, newObj)
          if (newObj) {
            walletMap[wallet] = newObj.id
          }
        }
      })

      const categoryMap: any = {}
      categories.forEach((item:string) => {
        const obj = Category.findOne({ label: item })
        if (obj) {
          categoryMap[item] = obj.id
        } else {
          const newObj = Category.insert({
            label: item,
            color: Utils.randomColor()
          }, true)
          if (newObj) {
            categoryMap[item] = newObj.id
          }
        }
      })
      const processedRows = rows.map((item:any) => {
        if (typeof (item.wallet) === 'string') {
          item.wallet = walletMap[item.wallet]
        }
        if (typeof (item.category) === 'string') {
          item.category = categoryMap[item.category]
        }
        return item
      })
      Utils.log('processedRows', walletMap, categoryMap, processedRows)
      result = Transaction.bulkInsert(processedRows, true)
    })
    return result
  }

  static getBy (condition, option) {
    return Transaction.find({ ...condition, deleted: false }, { sort: { date: true }, ...option })
  }

  static findWithFilter = (startDate: number, endDate:number, params: any | null) => {
    // let query = `date >= ${Utils.formatDateForRealmQuery(startDate)} and date < ${Utils.formatDateForRealmQuery(endDate)}`
    let query = `date >= ${startDate} and date < ${endDate} and deleted==false`
    const { wallet, category } = params
    if (wallet) {
      query = `${query} and wallet=${wallet}`
    }
    if (category) {
      query = `${query} and category=${category}`
    }
    Utils.log('findWithFilter', query)
    return Transaction.find(query, { sort: { date: true } })
  }

  static beforeInsert (params: any) {
    if (!params.date) {
      params.date = dayjs().unix()
    } else if (typeof (params.date) === 'string') {
      params.date = dayjs(params.date).unix()
    }
    params.monthTag = Utils.getMonth(params.date)
    params.quarterTag = Utils.getQuarter(params.date)
    params.dateTag = Utils.getDateFromUnix(params.date)
    params = Transaction.appendId(params)
    if (typeof (params.category) === 'string') {
      const category = Category.findOne({ label: params.category })
      if (category) {
        params.category = category.id
      } else {
        const newCategory = Category.insert({
          label: params.category,
          color: params.amount > 0 ? 'green' : 'red'
        }, true)
        params.category = newCategory ? newCategory.id : 0
      }
    }
    if (typeof (params.wallet) === 'string') {
      const wallet = Wallet.findOne({ label: params.wallet })
      if (wallet) {
        params.wallet = wallet.id
      } else {
        const newWallet = Category.insert({
          label: params.wallet,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }, true)
        params.wallet = newWallet.id
      }
    }
    Utils.log('insert', params)
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
