import React, { Component } from 'react'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input, Switch } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Containers/Utils'
import autoBind from 'react-autobind'
import { Transaction, Wallet, Category } from '../../Realm'
export default class ListItem extends Component {
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
    return (
      <Card>
        <Item>
          <Text>{wallet.label}</Text>
        </Item>
        <Item>
          <Text>{Utils.numberWithCommas(wallet.amount)}</Text>
        </Item>
      </Card>
    )
  }
}
