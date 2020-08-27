import schema from './schemas/Transaction'
import data from './data/transaction.json'
import RealmWrapper from './RealmWrapper'
import Utils from '../Utils/Utils'
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
    params.id = (id || 0) + 1
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
