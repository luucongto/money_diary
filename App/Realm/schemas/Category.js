import Realm from 'realm'
const schema = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: '', indexed: true },
    label: { type: 'string', default: '', indexed: true },
    icon: { type: 'string', default: '' },
    color: { type: 'string', default: '' },
    amount: { type: 'int', default: 0 },
    transactions: 'int?[]',
    lastUpdate: { type: 'int', default: 0 },
    income: { type: 'int', default: 0 },
    outcome: { type: 'int', default: 0 }
  }
}
class Category extends Realm.Object {
  static schema = schema
}
export default Category
