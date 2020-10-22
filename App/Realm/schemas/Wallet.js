
import Realm from 'realm'
const schema = {
  name: 'Wallet',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: '' },
    label: { type: 'string', default: '' },
    icon: { type: 'string', default: '' },
    color: { type: 'string', default: '' },
    position: { type: 'int', default: 0 },
    amount: { type: 'int', default: 0 },
    count: { type: 'int', default: 0 },
    lastUpdate: { type: 'int', default: 0 },
    income: { type: 'int', default: 0 },
    outcome: { type: 'int', default: 0 },
    type: { type: 'int', default: 0 },
    countInTotal: { type: 'bool', default: true }
  }
}

export default class Wallet extends Realm.Object {
  static schema = schema
  removeTransaction (transaction) {
    this.amount -= transaction.amount
    this.income -= transaction.amount > 0 ? transaction.amount : 0
    this.outcome -= transaction.amount < 0 ? transaction.amount : 0
    this.count--
  }

  addTransaction (transaction) {
    this.amount += transaction.amount
    this.income += transaction.amount > 0 ? transaction.amount : 0
    this.outcome += transaction.amount < 0 ? transaction.amount : 0
    this.count++
    this.lastUpdate = this.lastUpdate < transaction.date ? transaction.date : this.lastUpdate
  }
}
