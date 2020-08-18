import React, { Component } from 'react'
import { Card, Button, CardItem, Content, Form, Item, Picker, Icon, Text } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import CategoryIcon from './CategoryIcon'
import { Images } from '../../Themes'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Containers/Utils'
import autoBind from 'react-autobind'
export default class AddTransaction extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      selected2: undefined
    }
    this._transX = new Value(70)
    this._config = {
      duration: 300,
      toValue: 220,
      easing: Easing.inOut(Easing.ease)
    }

    this.onPress = this.onPress.bind(this)
    autoBind(this)
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

  onValueChange2 (value) {
    this.setState({
      selected2: value
    })
  }

  render () {
    return (
      <Card>
        <Animated.View style={{ flex: 0, height: this._transX }}>
          <TouchableOpacity onPress={() => this.onPress()}>
            <CardItem>
              <Text>Add new</Text>
            </CardItem>
          </TouchableOpacity>
          {this.state.isOpen &&
            <Form>
              <Item picker>
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: undefined }}
                  placeholder='Select your SIM'
                  placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.selected2}
                  onValueChange={this.onValueChange2.bind(this)}
                >
                  {this.props.wallets.map(wallet => <Picker.Item key={wallet.id} label={wallet.label} value={wallet.label} />)}

                </Picker>
              </Item>
            </Form>}
        </Animated.View>
      </Card>
    )
  }
}
