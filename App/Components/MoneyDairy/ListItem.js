import React, { Component } from 'react'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input } from 'native-base'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Containers/Utils'
import autoBind from 'react-autobind'
import { Transaction, Wallet, Category } from '../../Realm'
export default class ListItem extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      isOpen: false,
      selectedWallet: transaction.wallet,
      selectedCategory: transaction.category,
      chosenDate: new Date(transaction.date),
      amount: transaction.amount
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

  update () {
    Transaction.update({ id: this.props.transaction.id }, {
      amount: this.state.amount,
      date: new Date(this.state.chosenDate),
      wallet: this.state.selectedWallet,
      category: this.state.selectedCategory
    })
    this.props.updateTransactions()
  }

  delete () {
    Transaction.remove({ id: this.props.transaction.id })
    this.props.updateTransactions()
  }

  render () {
    const transaction = this.props.transaction
    return (
      <Card>
        <Animated.View style={{ flex: 0, height: this._transX, borderColor: transaction.walletColor, borderWidth: 2 }}>
          <TouchableOpacity onPress={() => this.onPress()}>
            <CardItem>
              <Left>
                <Text style={{ backgroundColor: transaction.categoryColor, height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}> {Utils.getDay(transaction.date)} </Text>
                <Body>
                  <Text>{transaction.category}</Text>
                </Body>
              </Left>
              <Right>
                <Text>{Utils.numberWithCommas(transaction.amount)}</Text>
              </Right>
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
                  defaultDate={this.state.chosenDate}
                  minimumDate={new Date(2016, 1, 1)}
                  maximumDate={new Date(2030, 12, 31)}
                  locale='en'
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType='fade'
                  androidMode='default'
                  placeHolderText={Utils.getDate(this.state.chosenDate)}
                  textStyle={{ color: 'green' }}
                  placeHolderTextStyle={{ color: 'green' }}
                  onDateChange={this.setDate.bind(this)}
                  disabled={false}
                />
              </Item>
              <Item regular>
                <Input value={this.state.amount} />
              </Item>
              <Item regular>
                <Button success onPress={this.update.bind()}>
                  <Text>Update</Text>
                </Button>
                <Button danger onPress={this.delete.bind()}>
                  <Text>Delete</Text>
                </Button>
              </Item>
            </Form>}

        </Animated.View>
      </Card>
    )
  }
}
