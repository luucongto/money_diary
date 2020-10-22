import schema from './schemas/Category'
import data from './data/categories.json'
import RealmWrapper from './RealmWrapper'
import Transaction from './Transaction'
import { forEach } from 'lodash'
import Utils from '../Utils/Utils'
class Category extends RealmWrapper {
  static schema = schema
  static initializeDatas = (inTx = true) => {
    const maxId = Category.realm.objects(Category.schema).length
    if (maxId) {
      return
    }
    Category.bulkInsert(data, inTx)
  }

  static insertTransaction (params: any) {
    const wallet = Category.findOne({ label: params.category })
    if (wallet) {
      wallet.amount += params.amount
      wallet.income += params.amount > 0 ? params.amount : 0
      wallet.outcome += params.amount < 0 ? params.amount : 0
    } else {
      Category.insert({
        id: params.category,
        label: params.category,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        amount: params.amount,
        income: params.amount > 0 ? params.amount : 0,
        outcome: params.amount < 0 ? params.amount : 0
      }, true)
    }
  }

  static getColor = (label: string) => {
    const item = Category.findOne({ label })
    const color = item ? item.color : 'black'
    return color
  }

  static findWithAmount = () => {
    const items = Api.category()
    const result = items.map((item: any) => Category.calculate(item))
    Utils.log('category with amount', result)
    return result
  }

  static calculate = (item: any) => {
    const category = item.id
    const transactions = Transaction.getBy({ category })
    const result = {
      amount: 0,
      includeAmount: 0,
      count: transactions.length,
      includeCount: 0
    }
    forEach(transactions, transaction => {
      result.amount = result.amount + transaction.amount
      if (transaction.include) {
        result.includeCount++
        result.includeAmount += transaction.amount
      }
    })
    return { ...Utils.clone(item), ...result }
  }
}

export default Category
