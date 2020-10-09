import schema from './schemas/Category'
import data from './data/categories.json'
import RealmWrapper from './RealmWrapper'
import Transaction from './Transaction'
import { forEach } from 'lodash'
import Utils from '../Utils/Utils'
class Category extends RealmWrapper {
  static schema = schema
  static initializeDatas = (inTx = true) => {
    Category.bulkInsert(data, inTx)
  }

  static getColor = (label: string) => {
    const item = Category.findOne({ label })
    const color = item ? item.color : 'black'
    return color
  }

  static findWithAmount = () => {
    const items = Category.find()
    const result = items.map((item: any) => Category.calculate(item))
    Utils.log('category with amount', result)
    return result
  }

  static calculate = (item: any) => {
    const category = item.id
    const transactions = Transaction.getBy({ category })
    const result = {
      amount: 0,
      income: 0,
      outcome: 0
    }
    forEach(transactions, transaction => {
      result.amount = result.amount + transaction.amount
      if (transaction.include) {
        if (transaction.amount > 0) {
          result.income += transaction.amount
        } else {
          result.outcome += transaction.amount
        }
      }
    })
    return { ...item, ...result }
  }
}

export default Category
