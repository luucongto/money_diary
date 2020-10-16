
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
    income: { type: 'int', default: 0 },
    outcome: { type: 'int', default: 0 }
  }
}

export default class Wallet extends Realm.Object {
  static schema = schema
}
