
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

  static getColor = (label: string) => {
    const item = Wallet.findOne({ label })
    const color = item ? item.color : 'black'
    return color
  }
}

export default Wallet
