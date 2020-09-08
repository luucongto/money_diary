import React, { Component } from 'react'
import { SectionList, RefreshControl } from 'react-native'
import { Container, Content, ListItem, Text, Right, Body, View, Left } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import TransactionComponent from './TransactionComponent'
import autoBind from 'react-autobind'
import _ from 'lodash'
import PropTypes from 'prop-types'
class TransactionList extends Component {
  propTypes = {
    transaction: PropTypes.object.isRequired,
    openTransactionDetailModal: PropTypes.func.isRequired,
    categoryItem: PropTypes.object.isRequired,
    walletItem: PropTypes.object.isRequired,
    wallets: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    walletMapping: PropTypes.object.isRequired,
    categoryMapping: PropTypes.object.isRequired,
    wallet: PropTypes.string,
    tab: PropTypes.object,
    isThisTabVisible: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      items: [],
      amount: 0,
      income: 0,
      outcome: 0,
      currentTransaction: null
    }
    autoBind(this)
  }

  componentDidMount () {
    if (this.props.isThisTabVisible) {
      this.refresh()
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isThisTabVisible || (this.props.tab && nextProps.transactionParams === this.props.tab.key)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.shouldComponentUpdate(nextProps)) {
      return
    }
    const prevProps = this.props
    if (prevProps.tab !== nextProps.tab) {
      this.refresh()
    } else if (!prevProps.isThisTabVisible && nextProps.isThisTabVisible) {
      this.refresh()
    } else if (prevProps.transactionUpdateObjects !== nextProps.transactionUpdateObjects && !_.isEmpty(nextProps.transactionUpdateObjects)) {
      this.refresh()
    } else if (prevProps.transactionDeleteObjects !== nextProps.transactionDeleteObjects && !_.isEmpty(nextProps.transactionDeleteObjects)) {
      this.refresh()
    } else if (prevProps.wallet !== nextProps.wallet) {
      this.refresh(nextProps.wallet)
    }
    Utils.log('componentWillReceiveProps', prevProps.transactionParams, nextProps.transactionParams, nextProps.transactions)
    Utils.log('updateTransactions list')
    const transactions = nextProps.transactions
    let income = 0
    let outcome = 0
    transactions.forEach(transaction => {
      income += (transaction.include && transaction.amount > 0) ? transaction.amount : 0
      outcome += (transaction.include && transaction.amount < 0) ? transaction.amount : 0
    })
    this.setState({ items: this._groupTransactionByDate(transactions), amount: income + outcome, income, outcome })
  }

  _groupTransactionByDate (items) {
    const result = []
    const groups = _.groupBy(items, item => Utils.getDateFromUnix(item.date))
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

  refresh (wallet = this.props.wallet) {
    const query = { wallet }
    if (this.props.tab) {
      query.month = this.props.tab.key
    }
    this.props.transactionRequest(query)
  }

  _renderItem ({ item, index }) {
    const itemView = (
      <TransactionComponent
        key={item.id}
        transaction={item}
        walletItem={this.props.walletMapping[item.wallet]}
        categoryItem={this.props.categoryMapping[item.category]}
        openTransactionDetailModal={this.props.openTransactionDetailModal}
      />)

    return itemView
  }

  renderPhone () {
    const { amount, income, outcome } = this.state
    return (
      <Container>
        <Content
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
        >
          <ListItem noIndent>
            <Body>
              <Text>Total</Text>
              <Text note style={{ color: income > 0 ? 'green' : 'red' }}>Income {Utils.numberWithCommas(income)}</Text>
              <Text note style={{ color: outcome > 0 ? 'green' : 'red' }}>Outcome {Utils.numberWithCommas(outcome)}</Text>
            </Body>
            <Right>
              <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>
            </Right>
          </ListItem>
          <SectionList
            sections={this.state.items}
            keyExtractor={(item, index) => item + index}
            renderItem={item => this._renderItem(item)}
            renderSectionHeader={({ section: { title, amount } }) => (
              <ListItem itemDivider>
                <Left>
                  <Text>{title}</Text>
                </Left>
                <Right>
                  <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>
                </Right>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

export default TransactionList
