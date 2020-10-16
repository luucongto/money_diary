
import Realm from 'realm'
const schema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    amount: { type: 'int', default: 0 },
    note: { type: 'string', default: '' },
    date: { type: 'int', default: 0 },
    monthTag: { type: 'string', default: '', indexed: true },
    quarterTag: { type: 'string', default: '', indexed: true },
    dateTag: { type: 'string', default: '', indexed: true },
    category: { type: 'string', default: '', indexed: true },
    wallet: { type: 'string', default: '', indexed: true },
    event: { type: 'string', default: '' },
    include: { type: 'bool', default: true, indexed: true },
    deleted: { type: 'bool', default: false, indexed: true }
  }
}

export default class Transaction extends Realm.Object {
  static schema = schema
}
