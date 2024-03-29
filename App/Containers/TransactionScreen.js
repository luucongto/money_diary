import _ from 'lodash'
// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Header, Icon, Right, Spinner, Text, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import LongTransactionList from '../Components/MoneyDiary/LongTransactionLists'
import Constants from '../Config/Constants'
import I18n from '../I18n'
import { Wallet } from '../Realm'
import Transaction from '../Realm/Transaction'
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
      refreshing: false,
      wallet,
      category,
      walletId,
      categoryId
    }
    Utils.log('TransactionScreen', props)
    autoBind(this)
  }

  componentDidMount () {
    this.refreshTransactions()
  }

  shouldComponentUpdate (props) {
    return props.isFocused
  }

  refreshTransactions () {
    if (this.refreshing) {
      return
    }

    this.getMonth(Utils.getMonth(), true)
  }

  preprocessTransactions (transactions, isNew = true) {
    let result = [{
      type: 'addnew'
    }]
    if (!isNew) {
      result = []
    }
    if (!transactions || !transactions.length) return result

    const groups = _.groupBy(transactions, item => Utils.getMonth(item.date))
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
      result = result.concat(items)
    })
    Utils.log('processedTransactions', transactions, result)
    return result
  }

  openTransactionDetailModal (transaction) {
    this.props.navigation.navigate('TransactionDetailScreen', { transaction })
  }

  getMonth (monthTag, isRefresh = false) {
    if (!isRefresh && this.count >= this.state.wallet.count) {
      Utils.log(`getMOnth ${isRefresh} ${this.count >= this.state.wallet.count}`)
      return
    }
    if (this.refreshing) {
      return
    }
    this.refreshing = true
    const findConditions = { monthTag: monthTag }

    if (this.state.wallet && this.state.wallet.id) {
      if (this.state.wallet.id !== Constants.DEFAULT_WALLET_ID) {
        findConditions.wallet = this.state.wallet.id
      } else {
        findConditions.wallet = _.map(Wallet.find({ countInTotal: true }), 'id')
      }
    }
    if (this.state.category && this.state.category.id) {
      findConditions.category = this.state.category.id
    }
    const transactions = Transaction.getBy(findConditions)
    this.count = isRefresh ? transactions.length : this.count + transactions.length

    const preprocessTransactions = this.preprocessTransactions(transactions, false)
    Utils.log(`TransactionScreen findConditions ${isRefresh} ${this.count} ${this.state.currentRequestMonthTag}`, findConditions, transactions)
    this.setState({
      isEnded: this.count >= this.state.wallet.count,
      currentRequestMonthTag: monthTag,
      preprocessTransactions: isRefresh ? [{
        type: 'addnew'
      }].concat(preprocessTransactions) : this.state.preprocessTransactions.concat(preprocessTransactions)
    }, () => {
      this.refreshing = false
      if ((!transactions.length || this.count < 5) && !this.state.isEnded) {
        this.getMonth(Utils.getPrevMonth(monthTag))
      }
    })
  }

  renderPhone () {
    const amount = this.state.wallet ? this.state.wallet.amount : 0
    const transactions = this.state.preprocessTransactions || []
    return (
      <Container style={{ backgroundColor: Colors.listBackground }}>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            {(transactions.length > 1 || !this.refreshing) && (
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
            {(this.state.isGoingBack || this.refreshing) && <Spinner style={{ width: 30, alignSelf: 'center', paddingBottom: 20 }} />}
          </View>
          <Body>
            <Text>{I18n.t(this.state.wallet ? this.state.wallet.label : this.state.category.label)}</Text>
            <Text note>{this.state.wallet ? this.state.wallet.count : 0} {I18n.t('transactions')}</Text>
          </Body>
          <Right>
            <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>
          </Right>
        </Header>
        <LongTransactionList
          isEnded={this.state.isEnded}
          transactions={transactions}
          walletId={this.state.wallet ? this.state.wallet.id : 0}
          refreshTransactions={() => this.refreshTransactions()}
          getPrevMonth={() => this.getMonth(this.state.currentRequestMonthTag ? Utils.getPrevMonth(this.state.currentRequestMonthTag) : Utils.getMonth())}
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
  }
}
const screenHook = Screen(TransactionScreen, mapStateToProps, mapDispatchToProps, ['category', 'wallet'])
export default screenHook
