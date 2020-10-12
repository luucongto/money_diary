import { Body, Container, Content, ListItem, Right, Text } from 'native-base'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { FlatList, RefreshControl } from 'react-native'
// import I18n from 'react-native-i18n'
import Utils from '../../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import _ from 'lodash'
import { TransactionCardAddComponent, TransactionCardItem, TransactionMonthTag } from './TransactionCardItem'

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
      renderItems: [{
        type: 'addnew'
      }],
      stickIndices: [0],
      amount: 0,
      income: 0,
      outcome: 0,
      currentTransaction: null
    }
    autoBind(this)
  }

  componentDidMount () {
    this.setState(this.appendData(this.props.transactions))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transactions !== this.props.transactions) {
      this.setState(this.appendData(nextProps.transactions))
    }
  }

  appendData (transactions) {
    let result = [{
      type: 'addnew'
    }]
    const stickIndices = [0]
    const renderItems = transactions.slice(0, this.state.renderItems.length + 20)
    const groups = _.groupBy(renderItems, item => item.monthTag)
    Utils.log('groups', groups)
    _.each(groups, (items, monthTag) => {
      const monthTagItem = {
        type: 'monthTag',
        title: monthTag,
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

    return {
      renderItems: result,
      stickIndices
    }
  }

  refresh () {
    this.props.refreshTransactions()
  }

  _renderItem (item, index) {
    if (index === 0) {
      return (
        <TransactionCardAddComponent
          transactionCreateRequest={this.props.transactionCreateRequest}
          wallet={this.props.walletMapping[this.props.wallet]} walletId={this.props.wallet} category={this.props.category}
          callback={() => this.refresh()}
        />
      )
    }
    if (item.type === 'monthTag') {
      return (
        <TransactionMonthTag
          {...item}
        />
      )
    }
    const itemView = (
      <TransactionCardItem
        key={item.id}
        index={index}
        transaction={item}
        wallet={this.props.walletMapping[item.wallet]}
        category={this.props.categoryMapping[item.category]}
        openTransactionDetailModal={this.props.openTransactionDetailModal}
        transactionDeleteRequest={this.props.transactionDeleteRequest}
        transactionUpdateRequest={this.props.transactionUpdateRequest}
        refresh={this.refresh}
      />)

    return itemView
  }

  renderPhone () {
    const transactions = this.state.renderItems || []
    Utils.log('transactions', transactions, this.state.stickIndices)
    return (
      <Container>

        <FlatList
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
          data={transactions}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.05}
          getItemLayout={(data, index) => (
            { length: 160, offset: 160 * index, index }
          )}
          stickyHeaderIndices={this.state.stickIndices}
          // onEndReached={() => {
          //   if (this.state.renderItems.length < this.props.transactions.length) {
          //     Utils.log('onEndReached', this.state.renderItems.length)
          //     this.setState(this.appendData(this.props.transactions))
          //   }
          // }}
        />

      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

export default TransactionList
