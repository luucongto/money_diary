
import schema from './schemas/Wallet'
import RealmWrapper from './RealmWrapper'
class Wallet extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    const id = Wallet.realm.objects(schema.name).max('id')
    if (id) {
      return
    }
    Wallet.bulkInsert(require('./data/wallet.json'))
  }
}

export default Wallet
