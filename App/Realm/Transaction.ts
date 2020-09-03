import schema from './schemas/Transaction'
import RealmWrapper from './RealmWrapper'
import Utils from '../Utils/Utils'
import Wallet from './Wallet'
import Category from './Category'
import _ from 'lodash'
class Transaction extends RealmWrapper {
  static schema = schema
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

  static getbyPeriod = (startDate: string, endDate:string, wallet: null | number) => {
    let query = `date >= ${Utils.formatDateForRealmQuery(startDate)} and date < ${Utils.formatDateForRealmQuery(endDate)}`
    if (wallet) {
      query = `${query} and wallet=${wallet}`
    }
    Utils.log('getByPeriod', query)
    return Transaction.find(query, { sort: { date: true } })
  }

  static beforeInsert (params: any) {
    if (!params.date) {
      params.date = new Date()
    }
    params = Transaction.appendId(params)
    if (typeof (params.category) === 'string') {
      const category = Category.findOne({ label: params.category })
      if (category) {
        params.category = category.id
      } else {
        const newCategory = Category.insert({
          label: params.category,
          color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }, true)
        params.category = newCategory.id
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
    return params
  }

  static getMonths () {
    const realm = Transaction.realm
    const minDate = realm.objects(schema.name).min('date')
    const maxDate = realm.objects(schema.name).max('date')
    const months = Utils.getAllMonthsBetweenDates(minDate, maxDate)
    return months
  }
  // static _updateWalletAmount (doc:any, modifier: null|any) {
  //   const wallet = Wallet.get(doc.wallet)
  //   if (wallet) {
  //     const sign = modifier && modifier.include === false ? -1 : 1
  //     const walletUpdateData = {
  //       amount: wallet.amount + sign * doc.amount,
  //       income: wallet.income,
  //       outcome: wallet.outcome
  //     }
  //     if (doc.amount > 0) {
  //       walletUpdateData.income = wallet.income + sign * doc.amount
  //     } else {
  //       walletUpdateData.outcome = wallet.outcome + sign * doc.amount
  //     }
  //     Wallet.update({ label: wallet.label }, walletUpdateData, true)
  //   }
  //   return doc
  // }

  // static afterInsert (doc: any) {
  //   return Transaction._updateWalletAmount(doc, null)
  // }

  // static afterUpdate (doc: any, modifier: any) {
  //   if (modifier.include !== undefined) {
  //     return Transaction._updateWalletAmount(doc, modifier)
  //   } else {
  //     return doc
  //   }
  // }
}

export default Transaction
