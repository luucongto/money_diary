
import schema from './schemas/Wallet'
import RealmWrapper from './RealmWrapper'
class Wallet extends RealmWrapper {
  static schema = schema
  static initializeDatas = () => {
    const id = this.realm.objects(schema.name).max('id')
    if (id > 0) {
      return
    }
    this.bulkInsert(require('./data/wallet.json'))
  }
}

export default Wallet
