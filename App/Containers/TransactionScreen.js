import _ from 'lodash'
// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Content, Fab, Header, Icon, Right, Text, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { connect } from 'react-redux'
import TransactionDetailModal from '../Components/MoneyDairy/TransactionDetailModal'
import TransactionList from '../Components/MoneyDairy/TransactionLists'
import { Category, Wallet } from '../Realm'
import TransactionRedux from '../Redux/TransactionRedux'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'
import { RefreshControl } from 'react-native'
import LongTransactionList from '../Components/MoneyDairy/LongTransactionLists'

class TransactionScreen extends Component {
  constructor (props) {
    super(props)
    const { wallet, category, useWalletTitle } = props?.route?.params
    const { wallets, categories } = this.props
    const walletMapping = Utils.createMapFromArray(wallets, 'id')
    const categoryMapping = Utils.createMapFromArray(categories, 'id')
    this.state = {
      start: {},
      items: [],
      currentTransaction: null,
      wallet,
      category,
      useWalletTitle,
      walletMapping,
      categoryMapping,
      categories,
      wallets
    }
    Utils.log('TransactionScreen', props)
    autoBind(this)
  }

  componentDidMount () {
    const wallets = Wallet.find()
    const categories = Category.find()
    const walletMapping = Utils.createMapFromArray(wallets, 'id')
    const categoryMapping = Utils.createMapFromArray(categories, 'id')
    this.setState({ wallets, categories, walletMapping, categoryMapping })
    this.refreshTransactions()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transactions) {
      this.setState({ items: this._groupTransactionByDate(nextProps.transactions) })
    }
    if (nextProps.categories !== this.state.categories) {
      const categories = nextProps.categories
      const categoryMapping = Utils.createMapFromArray(categories, 'id')
      this.setState({ categories, categoryMapping })
    }
    if (nextProps.wallets !== this.state.wallets) {
      const wallets = nextProps.wallets
      const walletMapping = Utils.createMapFromArray(wallets, 'id')
      this.setState({ wallets, walletMapping })
    }
  }

  _groupTransactionByDate (items) {
    const result = []
    const groups = _.groupBy(items, item => Utils.getDate(item.date))
    _.each(groups, (v, k) => {
      let amount = 0
      v.forEach(item => { amount += item.amount })
      result.push({
        title: k,
        amount,
        data: v
      })
    })
    return result
  }

  refreshTransactions () {
    const findConditions = {}
    if (this.state.wallet && this.state.wallet.id) {
      findConditions.wallet = this.state.wallet.id
    }
    if (this.state.category && this.state.category.id) {
      findConditions.category = this.state.category.id
    }
    Utils.log('transactionScreen findConditions', findConditions)
    this.props.transactionRequest(findConditions)
  }

  openTransactionDetailModal (transaction) {
    this.props.navigation.navigate('TransactionDetailScreen', { transaction })
  }

  transactionUpdate (transaction) {
    this.props.transactionUpdateRequest(transaction)
    setTimeout(() => this.refreshTransactions(), 100)
  }

  transactionDelete (transaction) {
    this.props.transactionDeleteRequest(transaction)
    setTimeout(() => this.refreshTransactions(), 100)
  }

  transactionCreate (transaction) {
    this.props.transactionCreateRequest(transaction)
    setTimeout(() => this.refreshTransactions(), 100)
  }

  renderPhone () {
    Utils.log('items', this.state.items, this.state.walletMapping)
    const amount = this.state.wallet ? this.state.wallet.amount : 0
    return (
      <Container>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon color='black' name='arrow-back' />
            </Button>
          </View>
          <Body>
            <Text>{this.state.wallet ? this.state.wallet.label : this.state.category.label}</Text>
            <Text note>{this.state.items.length} days</Text>
          </Body>
          <Right>
            <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>
          </Right>
        </Header>
          <LongTransactionList
            {...this.props}
            wallets={this.state.wallets}
            categories={this.state.categories}
            walletMapping={this.state.walletMapping}
            categoryMapping={this.state.categoryMapping}
            wallet={this.state.wallet ? this.state.wallet.id : 0}
            isThisTabVisible
            tab={null}
            openTransactionDetailModal={this.openTransactionDetailModal}
          />
      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: state.transaction.data,
    transactionParams: state.transaction.params,
    transactionUpdateObjects: state.transaction.updateObjects,
    transactionDeleteObjects: state.transaction.deleteObjects,
    categories: state.category.data,
    wallets: state.wallet.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transactionRequest: (params) => dispatch(TransactionRedux.transactionRequest(params)),
    transactionUpdateRequest: (params) => dispatch(TransactionRedux.transactionUpdateRequest(params)),
    transactionDeleteRequest: (params) => dispatch(TransactionRedux.transactionDeleteRequest(params)),
    transactionCreateRequest: (params) => dispatch(TransactionRedux.transactionCreateRequest(params))
  }
}
const screenHook = Screen(TransactionScreen, mapStateToProps, mapDispatchToProps, ['transaction', 'category', 'wallet'])
export default screenHook
