import realm from './schemas/realm'
import schema from './schemas/Category'
import data from './data/categories.json'
class Category {}
Category.initializeDatas = () => {
  const id = realm.objects(schema.name).max('id')
  if (id > 0) {
    return
  }
  realm.write(() => {
    const items = realm.objects(schema.name)
    realm.delete(items)
    data.forEach(item => realm.create(schema.name, item))
  })
}

Category.list = () => {
  const items = realm.objects(schema.name)
  return items
}
export default Category
