import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import CategoryIcon from './CategoryIcon'
import { Images } from '../../Themes'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Containers/Utils'
export default class Item extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this._transX = new Value(70)
    this._config = {
      duration: 300,
      toValue: 220,
      easing: Easing.inOut(Easing.ease)
    }

    this.onPress = this.onPress.bind(this)
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

  render () {
    const transaction = this.props.transaction
    return (
      <Card>
        <Animated.View style={{ flex: 0, height: this._transX }}>
          <TouchableOpacity onPress={() => this.onPress()}>
            <CardItem>
              <Left>
                <Text style={{ backgroundColor: 'gray', height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}> {Utils.getDay(transaction.date)} </Text>
                <Body>
                  <Text>{transaction.category}</Text>
                </Body>
              </Left>
              <Right>
                <Text>{transaction.amount}</Text>
              </Right>
            </CardItem>
            {this.state.isOpen &&
              <CardItem>
                <Body>
                  <Text note>{transaction.note}</Text>
                  <Text note>{transaction.wallet}</Text>
                </Body>
              </CardItem>}
          </TouchableOpacity>
        </Animated.View>
      </Card>
    )
  }
}
