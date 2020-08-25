import React, { Component } from 'react'
import { Body, Text, Right, ListItem } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Utils/Utils'
import autoBind from 'react-autobind'
export default class WalletComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    autoBind(this)
  }

  componentWillReceiveProps (nextProp) {

  }

  render () {
    const wallet = this.props.item
    if (!wallet) return null
    const amount = wallet.amount
    const income = wallet.income
    const outcome = wallet.outcome
    return (
      <TouchableOpacity onPress={() => this.props.openWalletDetailModal(wallet)}>
        <ListItem avatar>
          <Body>
            <Text>{wallet.label}</Text>
            <Text note style={{ color: income > 0 ? 'green' : 'red' }}>Income {Utils.numberWithCommas(income)}</Text>
            <Text note style={{ color: outcome > 0 ? 'green' : 'red' }}>Outcome {Utils.numberWithCommas(outcome)}</Text>
          </Body>
          <Right>
            <Text style={{ color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>

          </Right>
        </ListItem>
      </TouchableOpacity>

    )
  }
}
