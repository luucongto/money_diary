import Transaction from './Transaction'
import Wallet from './Wallet'
import Category from './Category'
import Realm from 'realm'
import RealmModel from 'react-native-realm-model'
const realm = new Realm({ schema: [Transaction, Wallet, Category] })
export default realm
