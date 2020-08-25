import React, { Component } from 'react'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input, Switch, List, ListItem } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Utils/Utils'
import autoBind from 'react-autobind'
import { Transaction, Wallet, Category } from '../../Realm'
export default class TransactionComponent extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      isOpen: false,
      selectedWallet: transaction?.wallet,
      selectedCategory: transaction?.category,
      chosenDate: new Date(transaction?.date),
      amount: transaction?.amount,
      selectedInclude: transaction?.include
    }
    this._transX = new Value(70)
    this._config = {
      duration: 300,
      toValue: 370,
      easing: Easing.inOut(Easing.ease)
    }

    autoBind(this)
  }

  setDate (newDate) {
    this.setState({ chosenDate: newDate })
  }

  componentWillReceiveProps (nextProp) {
    if (nextProp.transaction) {
      const transaction = nextProp.transaction
      this.setState({
        selectedWallet: transaction?.wallet,
        selectedCategory: transaction?.category,
        chosenDate: new Date(transaction?.date),
        amount: transaction?.amount,
        selectedInclude: transaction?.include
      })
    }
  }

  onPress () {
    if (this.state.isOpen) {
      this._animClose = timing(this._transX, {
        duration: 300,
        toValue: 70,
        easing: Easing.inOut(Easing.ease)
      })
      this._animClose.start()
    } else {
      this._animOpen = timing(this._transX, this._config)

      this._animOpen.start()
    }
    this.setState({ isOpen: !this.state.isOpen })
  }

  onValueChangeWallet (value) {
    this.setState({
      selectedWallet: value
    })
  }

  onValueChangeCategory (value) {
    this.setState({
      selectedCategory: value
    })
  }

  update () {
    Transaction.update({ id: this.props.transaction.id }, {
      amount: this.state.amount,
      date: new Date(this.state.chosenDate),
      wallet: this.state.selectedWallet,
      category: this.state.selectedCategory,
      include: this.state.selectedInclude
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
      <TouchableOpacity onPress={() => this.props.openTransactionDetailModal(transaction)}>
        <ListItem avatar style={{ opacity: transaction.include ? 1 : 0.15 }}>
          <Body>
            <Text>{transaction.category}</Text>
            <Text note>{transaction.note}</Text>
          </Body>
          <Right>
            <Text note style={{ color: transaction.amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(transaction.amount)}</Text>
          </Right>
        </ListItem>
      </TouchableOpacity>
    )
  }

  render () {
    return this._renderNormal()
  }
}
