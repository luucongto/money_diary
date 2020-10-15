import _ from 'lodash'
// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Header, Icon, Right, Spinner, Text, View } from 'native-base'
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
      preprocessTransactions: [{
        type: 'addnew'
      }],
      isRefreshing: false,
      currentRequestMonthTag: Utils.getMonth(),
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

  componentDidMount () {
    setTimeout(() => {
      this.refreshTransactions()
    }, (1000))
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
    if (this.state.isRefreshing) {
      return
    }
    this.setState({
      isRefreshing: true
    })
    Utils.log('refreshTransactions')
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
    const preprocessTransactions = this.preprocessTransactions(transactions)
    this.setState({
      wallet,
      preprocessTransactions,
      isRefreshing: false
    })
    Utils.log('findConditions', findConditions, transactions)
  }

  preprocessTransactions (transactions) {
    let result = [{
      type: 'addnew'
    }]
    Utils.log('processedTransactions 1', transactions)
    if (!transactions || !transactions.length) return result
    const stickIndices = [0]
    const groups = _.groupBy(transactions, item => item.monthTag)
    _.each(groups, (items, monthTag) => {
      const monthTagItem = {
        type: 'monthTag',
        title: monthTag,
        count: items.length,
        income: 0,
        outcome: 0
      }
      items.forEach(item => {
        monthTagItem.income += item.include && item.amount > 0 ? item.amount : 0
        monthTagItem.outcome += item.include && item.amount < 0 ? item.amount : 0
      })
      monthTagItem.amount = monthTagItem.income + monthTagItem.outcome
      result.push(monthTagItem)
      stickIndices.push(result.length - 1)
      result = result.concat(items)
    })
    Utils.log('processedTransactions', transactions, result)
    return result
  }

  openTransactionDetailModal (transaction) {
    this.props.navigation.navigate('TransactionDetailScreen', { transaction })
  }

  getPrevMonth () {
    const currentMonth = this.currentRequestMonthTag
    const prevMonthTag = Utils.getPrevMonth(currentMonth)
    const findConditions = { monthTag: prevMonthTag }
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
      currentRequestMonthTag: prevMonthTag,
      wallet,
      transactions: this.state.transactions.concat(transactions)
    })
    Utils.log('findConditions getPrevMonth', findConditions, transactions)
  }

  renderPhone () {
    const amount = this.state.wallet ? this.state.wallet.amount : 0
    const transactions = this.state.preprocessTransactions || []
    return (
      <Container style={{ backgroundColor: Colors.listBackground }}>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            {(transactions.length > 1 || !this.state.isRefreshing) && (
              <Button
                style={{ width: 60, height: 60 }} transparent onPress={() => {
                  this.setState({
                    isGoingBack: true
                  })
                  this.props.navigation.goBack()
                }}
              >
                <Icon color='black' name='back' type='AntDesign' />
              </Button>
            )}
            {(this.state.isGoingBack || this.state.isRefreshing) && <Spinner style={{ width: 30, alignSelf: 'center', paddingBottom: 20 }} />}
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
          transactions={transactions}
          walletId={this.state.wallet ? this.state.wallet.id : 0}
          refreshTransactions={() => this.refreshTransactions()}
          getPrevMonth={() => this.getPrevMonth()}
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
