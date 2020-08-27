import React, { Component } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, ListItem } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Utils/Utils'
import autoBind from 'react-autobind'
export default class TransactionComponent extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      transaction
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
        transaction: transaction
      })
    }
  }

  _renderNormal () {
    const transaction = this.props.transaction
    if (!transaction) {
      return null
    }
    const categoryItem = this.props.categoryMapping[transaction.category]
    const walletItem = this.props.walletMapping[transaction.wallet]
    return (
      <ListItem noIndent style={{ opacity: transaction.include ? 1 : 0.15 }}>
        <View
          style={{
            backgroundColor: walletItem ? walletItem.color : 'black',
            width: 10,
            height: '100%'
          }}
        />
        <Body>
          {this.props.useWalletTitle
            ? <Text style={{ color: walletItem.color || 'black' }}>{walletItem.label || 'Error'}</Text>
            : <Text style={{ color: categoryItem ? categoryItem.color : 'black' }}>{categoryItem ? categoryItem.label : 'Error'}</Text>}
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
