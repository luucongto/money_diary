import schema from './schemas/Category'
import data from './data/categories.json'
import RealmWrapper from './RealmWrapper'
class Category extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    const id = Category.realm.objects(schema.name).max('id')
    if (id) {
      return
    }
    Category.bulkInsert(data)
  }

  static getColor = (label: string) => {
    const item = Category.findOne({ label })
    const color = item ? item.color : 'black'
    return color
  }
}

export default Category
