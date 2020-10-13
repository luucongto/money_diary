import _ from 'lodash'
// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Header, Icon, Right, Text, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import LongTransactionList from '../Components/MoneyDairy/LongTransactionLists'
import I18n from '../I18n'
import { Category, Wallet } from '../Realm'
import TransactionRedux from '../Redux/TransactionRedux'
import { Colors } from '../Themes'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'

class TransactionScreen extends Component {
  constructor (props) {
    super(props)
    Utils.log('TransactionScreen props?.route?.params', props?.route?.params)
    const { wallet, category, useWalletTitle, walletId, categoryId } = props?.route?.params
    const wallets = Wallet.find()
    const categories = Category.find()
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
      wallets,
      walletId,
      categoryId
    }
    Utils.log('TransactionScreen', props)
    autoBind(this)
  }

  componentDidMount () {
    this.refreshTransactions()
  }

  refreshTransactions () {
    const findConditions = { ...this.props?.route?.params }
    if (this.state.wallet && this.state.wallet.id) {
      findConditions.wallet = this.state.wallet.id
    }
    if (this.state.category && this.state.category.id) {
      findConditions.category = this.state.category.id
    }

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
    const amount = this.state.wallet ? this.state.wallet.amount : 0
    return (
      <Container style={{ backgroundColor: Colors.listBackground }}>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon color='black' name='arrow-back' />
            </Button>
          </View>
          <Body>
            <Text>{this.state.wallet ? this.state.wallet.label : this.state.category.label}</Text>
            <Text note>{this.props.transactions.length} {I18n.t('transactions')}</Text>
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
          refreshTransactions={this.refreshTransactions}
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
