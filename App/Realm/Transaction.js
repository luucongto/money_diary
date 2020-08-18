import realm from './schemas/realm'
import schema from './schemas/Transaction'
import data from './data/transaction.json'
class Transaction {}
Transaction.initializeTransactions = () => {
  const id = realm.objects(schema.name).max('id')
  if (id > 0) {
    return
  }
  realm.write(() => {
    const items = realm.objects(schema.name)
    realm.delete(items)
    data.rows.forEach(item => realm.create(schema.name, item))
  })
}

Transaction.add = (amount, note = '', wallet = '', category = '', date = new Date()) => {
  realm.write(() => {
    let id = realm.objects(schema.name).max('id')
    const newItem = {
      id: id > 0 ? ++id : 1,
      amount,
      wallet,
      category,
      date
    }
    realm.create(schema.name, newItem)
  })
}
Transaction.list = () => {
  const items = realm.objects(schema.name)
  return items
}
Transaction.getbyPeriod = (startDate, endDate) => {
  const items = realm.objects(schema.name).filtered('date > $0 and date < $1', new Date(startDate), new Date(endDate))
  return items
}
export default Transaction
