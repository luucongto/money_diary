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
    params.id = (id || 0) + 1
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
