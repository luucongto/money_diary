import React, { Component } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, ListItem } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Utils/Utils'
import autoBind from 'react-autobind'
import { Transaction } from '../../Realm'
export default class TransactionComponent extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      isOpen: false,
      wallet: transaction?.wallet,
      category: transaction?.category,
      date: new Date(transaction?.date),
      amount: transaction?.amount,
      include: transaction?.include
    }
    autoBind(this)
  }

  setDate (newDate) {
    this.setState({ date: newDate })
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.transaction && nextProps.transaction !== this.state.transaction
  }

  componentWillReceiveProps (nextProp) {
    if (nextProp.transaction) {
      const transaction = nextProp.transaction
      this.setState({
        transaction: transaction,
        wallet: transaction?.wallet,
        category: transaction?.category,
        date: new Date(transaction?.date),
        amount: transaction?.amount,
        include: transaction?.include
      })
    }
  }

  onValueChangeWallet (value) {
    this.setState({
      wallet: value
    })
  }

  onValueChangeCategory (value) {
    this.setState({
      category: value
    })
  }

  update () {
    Transaction.update({ id: this.props.transaction.id }, {
      amount: this.state.amount,
      date: new Date(this.state.date),
      wallet: this.state.wallet,
      category: this.state.category,
      include: this.state.include
    })
    this.onPress()
    this.props.updateTransactions()
  }

  delete () {
    Transaction.remove({ id: this.props.transaction.id })
    this.props.updateTransactions()
  }

  _renderNormal () {
    const transaction = this.props.transaction
    if (!transaction) {
      return null
    }
    return (

      <ListItem noIndent style={{ opacity: transaction.include ? 1 : 0.15 }}>
        <View
          style={{
            backgroundColor: this.props.walletColorsMapping[transaction.wallet],
            width: 10,
            height: '100%'
          }}
        />
        <Body>
          <Text style={{ color: this.props.categoryColorsMapping[transaction.category] }}>{transaction.category}</Text>
          <Text note>{transaction.note}</Text>
        </Body>
        <TouchableOpacity onPress={() => this.props.openTransactionDetailModal(transaction)}>
          <Right>
            <Text note style={{ textAlign: 'right', width: 200, color: transaction.amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(transaction.amount)}</Text>
          </Right>
        </TouchableOpacity>
      </ListItem>

    )
  }

  render () {
    return this._renderNormal()
  }
}
