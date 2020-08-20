import React, { Component } from 'react'
import { Card, Button, CardItem, Form, Item, Picker, Icon, Text, DatePicker, Input } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
// import Utils from '../../Containers/Utils'
import autoBind from 'react-autobind'
import { Transaction } from '../../Realm'
export default class AddTransaction extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      selectedWallet: this.props.wallets ? this.props.wallets[0].label : null,
      selectedCategory: this.props.wallets ? this.props.categories[0].label : null,
      chosenDate: new Date()
    }
    this._transX = new Value(70)
    this._config = {
      duration: 300,
      toValue: 320,
      easing: Easing.inOut(Easing.ease)
    }

    autoBind(this)
  }

  setDate (newDate) {
    this.setState({ chosenDate: newDate })
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

  addTransaction () {
    Transaction.insert({
      wallet: this.state.selectedWallet ? this.state.selectedWallet : this.props.wallets[0].label,
      selectedCategory: this.state.selectedCategory ? this.state.selectedCategory : this.props.categories[0].label,
      category: this.state.selectedCategory,
      amount: this.state.amount || 0
    })
    this.props.updateTransactions()
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
                  placeholder='Select Wallet'
                  placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.selectedWallet}
                  onValueChange={this.onValueChangeWallet.bind(this)}
                >
                  {this.props.wallets.map(wallet => <Picker.Item key={wallet.id} label={wallet.label} value={wallet.label} />)}

                </Picker>
              </Item>
              <Item picker>
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: undefined }}
                  placeholder='Select Category'
                  placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.selectedCategory}
                  onValueChange={this.onValueChangeCategory.bind(this)}
                >
                  {this.props.categories.map(wallet => <Picker.Item key={wallet.id} label={wallet.label} value={wallet.label} />)}

                </Picker>
              </Item>
              <Item picker>
                <DatePicker
                  defaultDate={new Date(2018, 4, 4)}
                  minimumDate={new Date(2018, 1, 1)}
                  maximumDate={new Date(2018, 12, 31)}
                  locale='en'
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType='fade'
                  androidMode='default'
                  placeHolderText='Select date'
                  textStyle={{ color: 'green' }}
                  placeHolderTextStyle={{ color: '#d3d3d3' }}
                  onDateChange={this.setDate.bind(this)}
                  disabled={false}
                />
              </Item>
              <Item regular>
                <Input placeholder='0' />
              </Item>
              <Item regular>
                <Button success onPress={this.addTransaction.bind()}>
                  <Text>Add</Text>
                </Button>
              </Item>
            </Form>}
        </Animated.View>
      </Card>
    )
  }
}
