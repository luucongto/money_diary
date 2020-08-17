import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'
import { Card, Button, CardItem, Body, Text, Left, Thumbnail, Icon } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import CategoryIcon from './CategoryIcon'
import { Images } from '../../Themes'
import { TouchableOpacity } from 'react-native-gesture-handler'
export default class Item extends Component {
  static defaultProps = { show: true }

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this._transX = new Value(100)
    this._config = {
      duration: 1000,
      toValue: 220,
      easing: Easing.inOut(Easing.ease)
    }
    this._animOpen = timing(this._transX, this._config)
    this._animClose = timing(this._transX, {
      duration: 1000,
      toValue: 100,
      easing: Easing.inOut(Easing.ease)
    })
    this.onPress = this.onPress.bind(this)
  }

  onPress () {
    if (this.state.isOpen) {
      this._animClose.start()
    } else {
      this._animOpen.start()
    }
    this.setState({ isOpen: !this.state.isOpen })
  }

  render () {
    return (
      <Card>
        <Animated.View style={{ flex: 0, height: this._transX }}>
          <TouchableOpacity onPress={() => this.onPress()}>
            <CardItem>
              <Left>
                <Thumbnail source={Images.iconUser} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>April 15, 2016</Text>
                </Body>
              </Left>
            </CardItem>
          </TouchableOpacity>
        </Animated.View>
      </Card>
    )
  }
}
