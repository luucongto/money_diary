import { Body, Container, Content, ListItem, Right, Text } from 'native-base'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { FlatList, RefreshControl } from 'react-native'
// import I18n from 'react-native-i18n'
import Utils from '../../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import { TransactionCardAddComponent, TransactionCardItem } from './TransactionCardItem'

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
      renderItems: [],
      amount: 0,
      income: 0,
      outcome: 0,
      currentTransaction: null
    }
    autoBind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transactions !== this.props.transactions) {
      this.setState({
        renderItems: nextProps.transactions.slice(0, 20) || []
      })
    }
  }

  refresh () {
    this.props.refreshTransactions()
  }

  _renderItem (item, index) {
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
    const { amount, income, outcome } = this.state
    const transactions = this.state.renderItems || []
    return (
      <Container>
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
        <TransactionCardAddComponent
          transactionCreateRequest={this.props.transactionCreateRequest}
          wallet={this.props.walletMapping[this.props.wallet]} walletId={this.props.wallet} category={this.props.category}
        />

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
          initialNumToRender={10}
          onEndReached={() => {
            if (this.state.renderItems.length < this.props.transactions.length) {
              Utils.log('onEndReached', this.state.renderItems.length)
              this.setState({
                renderItems: this.props.transactions.slice(0, this.state.renderItems.length + 20)
              })
            }
          }}
        />

      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

export default TransactionList
