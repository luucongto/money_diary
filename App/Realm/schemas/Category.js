import Realm from 'realm'
const schema = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    label: { type: 'string', default: '' },
    icon: { type: 'string', default: '' },
    color: { type: 'string', default: '' }
  }
}
class Category extends Realm.Object {
  static schema = schema
}
export default Category
