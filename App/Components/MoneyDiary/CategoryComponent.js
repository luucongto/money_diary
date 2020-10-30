import { Body, ListItem, Right, Text } from 'native-base'
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import I18n from '../../I18n'
export default class CategoryComponent extends PureComponent {
  render () {
    const item = this.props.item
    if (!item) return null
    const includeCount = item.includeCount
    const count = item.count
    return (
      <TouchableOpacity onPress={() => this.props.onPress(item)}>
        <ListItem noIndent noBorder>
          <View
            style={{
              backgroundColor: item.color,
              width: 10,
              height: '100%'
            }}
          />
          <Body>

            <Text>{item.label}</Text>
            <Text note>{count} {I18n.t('transactions')}</Text>
            <Text note>{includeCount} {I18n.t('transactions')}</Text>
          </Body>
          <Right />
        </ListItem>
      </TouchableOpacity>

    )
  }
}
