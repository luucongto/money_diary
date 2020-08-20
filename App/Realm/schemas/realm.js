import Transaction from './Transaction'
import Wallet from './Wallet'
import Category from './Category'
import Realm from 'realm'
const realm = new Realm({ schema: [Transaction, Wallet, Category] })
export default realm
