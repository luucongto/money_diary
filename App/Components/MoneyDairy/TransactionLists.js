import React, { Component } from 'react'
import { SectionList } from 'react-native'
import { Container, Content, ListItem, Text, Right, Body } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import TransactionComponent from './TransactionComponent'
import autoBind from 'react-autobind'
import _ from 'lodash'
import { transaction } from '../../Sagas/TransactionSaga'
class TransactionList extends Component {
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
      this.refreshTransactions()
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isThisTabVisible || nextProps.transactionParams === this.props.tab.key
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.tab !== nextProps.tab) {
      this.refreshTransactions()
    } else if (!this.props.isThisTabVisible && nextProps.isThisTabVisible) {
      this.refreshTransactions()
    }
    if (nextProps.transactions) {
      const transactions = nextProps.transactions
      let amount = 0
      let income = 0
      let outcome = 0
      transactions.forEach(transaction => {
        amount += transaction.amount
        income += (transaction.include && transaction.amount) ? transaction.amount : 0
        outcome += (transaction.include && transaction.amount < 0) ? transaction.amount : 0
      })
      this.setState({ items: this._groupTransactionByDate(transactions), amount, income, outcome })
    }
  }

  _groupTransactionByDate (items) {
    const result = []
    const groups = _.groupBy(items, item => Utils.getDate(item.date))
    _.each(groups, (v, k) => {
      result.push({
        title: k,
        data: v
      })
    })
    return result
  }

  refreshTransactions () {
    this.props.transactionRequest({ month: this.props.tab.key })
  }

  _renderItem ({ item, index }) {
    const itemView = (
      <TransactionComponent
        key={item.id}
        transaction={item}
        wallets={this.props.wallets}
        categories={this.props.categories}
        walletColorsMapping={this.props.walletColorsMapping}
        categoryColorsMapping={this.props.categoryColorsMapping}
        refreshTransactions={this.refreshTransactions}
        openTransactionDetailModal={this.props.openTransactionDetailModal}
      />)

    return itemView
  }

  renderPhone () {
    const { amount, income, outcome } = this.state
    return (
      <Container>
        <Content>
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
            renderSectionHeader={({ section: { title } }) => (
              <ListItem itemDivider>
                <Text>{title}</Text>
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
