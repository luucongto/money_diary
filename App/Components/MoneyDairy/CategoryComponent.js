import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, ListItem, Icon } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Utils/Utils'
import I18n from '../../I18n'
export default class CategoryComponent extends PureComponent {
  render () {
    const wallet = this.props.item
    if (!wallet) return null
    const amount = wallet.amount
    const includeAmount = wallet.includeAmount
    const includeCount = wallet.includeCount
    const count = wallet.count
    return (
      <TouchableOpacity onPress={() => this.props.onPress(wallet)}>
        <ListItem noIndent noBorder>
          <View
            style={{
              backgroundColor: wallet.color,
              width: 10,
              height: '100%'
            }}
          />
          <Body>

            <Text>{wallet.label}</Text>
            <Text note>{count} {I18n.t('transactions')}</Text>
            <Text note>{includeCount} {I18n.t('transactions')}</Text>
          </Body>
          <Right>
            <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>đ {Utils.numberWithCommas(amount)}</Text>
            <Text style={{ textAlign: 'right', width: 200, color: amount > 0 ? 'green' : 'red' }}>đ {Utils.numberWithCommas(includeAmount)}</Text>
          </Right>
        </ListItem>
      </TouchableOpacity>

    )
  }
}
