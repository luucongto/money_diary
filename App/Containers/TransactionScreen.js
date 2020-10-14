import _ from 'lodash'
// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Header, Icon, Right, Text, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import LongTransactionList from '../Components/MoneyDairy/LongTransactionLists'
import I18n from '../I18n'
import { Category, Wallet } from '../Realm'
import Transaction from '../Realm/Transaction'
import TransactionRedux from '../Redux/TransactionRedux'
import { Colors } from '../Themes'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'

class TransactionScreen extends Component {
  constructor (props) {
    super(props)
    Utils.log('TransactionScreen props?.route?.params', props?.route?.params)
    const { wallet, category, walletId, categoryId } = props?.route?.params
    this.state = {
      start: {},
      items: [],
      currentTransaction: null,
      wallet,
      category,
      walletId,
      categoryId
    }
    Utils.log('TransactionScreen', props)
    autoBind(this)
  }

  shouldComponentUpdate (props) {
    return props.isFocused
  }

  componentWillReceiveProps (nextProps) {
    const prevProps = this.props
    if ((nextProps.isFocused && prevProps.isFocused !== nextProps.isFocused)) {
      setTimeout(() => {
        this.refreshTransactions()
      }, (1000))
    }
  }

  refreshTransactions () {
    const findConditions = { }
    let wallet = this.state.wallet

    if (this.state.wallet && this.state.wallet.id) {
      wallet = Wallet.findOneWithAmount(this.state.wallet.id)
      findConditions.wallet = this.state.wallet.id
    }
    if (this.state.category && this.state.category.id) {
      findConditions.category = this.state.category.id
    }

    const transactions = Transaction.getBy(findConditions)
    this.setState({
      wallet,
      transactions
    })
    Utils.log('findConditions', findConditions, transactions)
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
    const transactions = this.state.transactions || []
    return (
      <Container style={{ backgroundColor: Colors.listBackground }}>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            <Button style={{ width: 60, height: 60 }} transparent onPress={() => _.debounce(this.props.navigation.goBack, 10000)()}>
              <Icon color='black' name='arrow-back' />
            </Button>
          </View>
          <Body>
            <Text>{this.state.wallet ? this.state.wallet.label : this.state.category.label}</Text>
            <Text note>{transactions.length} {I18n.t('transactions')}</Text>
          </Body>
          <Right>
            <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>
          </Right>
        </Header>
        <LongTransactionList
          transactionRequest={this.props.transactionRequest}
          transactionUpdateRequest={this.props.transactionUpdateRequest}
          transactionDeleteRequest={this.props.transactionDeleteRequest}
          transactionCreateRequest={this.props.transactionCreateRequest}
          transactions={transactions}
          walletId={this.state.wallet ? this.state.wallet.id : 0}
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
