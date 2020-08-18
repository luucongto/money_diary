
import realm from './schemas/realm'
import schema from './schemas/Wallet'
class Wallet {}
Wallet.initializeDatas = () => {
  const id = realm.objects(schema.name).max('id')
  if (id > 0) {
    return
  }
  realm.write(() => {
    const data = require('./data/wallet.json')
    data.forEach(item => realm.create(schema.name, item))
  })
}
Wallet.list = () => {
  const items = realm.objects(schema.name)
  return items
}
export default Wallet
