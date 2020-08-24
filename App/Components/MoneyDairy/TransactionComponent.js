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
      <ListItem avatar>
        <Left />
        <Body>
          <Text>{transaction.category}</Text>
          <Text note>{transaction.note}</Text>
        </Body>
        <Right>
          <Text note>{Utils.numberWithCommas(transaction.amount)}</Text>
        </Right>
      </ListItem>
    )
  }

  render () {
    return this._renderNormal()
    const transaction = this.props.transaction
    if (!transaction) {
      return null
    }
    return (
      <Card>
        <Animated.View style={{ flex: 0, height: this._transX, borderColor: Wallet.getColor(transaction.wallet), borderWidth: 2 }}>
          <TouchableOpacity onPress={() => !this.state.isOpen && this.onPress()}>
            <CardItem style={{ opacity: transaction.include ? 1 : 0.3 }}>
              <Left>
                <Item style={{ backgroundColor: Category.getColor(transaction.category), height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>
                  <Text style={{ position: 'absolute', left: 0, backgroundColor: Category.getColor(transaction.category), height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>{Utils.getDay(this.state.chosenDate)}</Text>
                  {
                    this.state.isOpen && (
                      <DatePicker
                        defaultDate={this.state.chosenDate}
                        minimumDate={new Date(2016, 1, 1)}
                        maximumDate={new Date(2030, 12, 31)}
                        locale='en'
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType='fade'
                        androidMode='default'
                        placeHolderText={Utils.getDay(this.state.chosenDate)}
                        textStyle={{ color: 'green', opacity: 0 }}
                        placeHolderTextStyle={{ width: 50, height: 50, textAlign: 'center', textAlignVertical: 'center', color: 'green', opacity: 0 }}
                        onDateChange={this.setDate.bind(this)}
                        disabled={false}
                      />
                    )
                  }

                </Item>
                <Body>
                  {this.state.isOpen
                    ? (
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
                    )
                    : <Text>{transaction.category}</Text>}
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

              <Item picker />
              <Item regular>
                <Input value={Utils.numberWithCommas(this.state.amount.toString())} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
              </Item>
              <Item regular>
                <Left>
                  <Button style={{ backgroundColor: '#FF9501' }}>
                    <Icon active name='airplane' />
                  </Button>
                </Left>
                <Body>
                  <Text>Airplane Mode</Text>
                </Body>
                <Right>
                  <Switch
                    value={this.state.selectedInclude} onValueChange={value => {
                      Utils.log('swithc', value)
                      this.setState({ selectedInclude: value })
                    }}
                  />
                </Right>
              </Item>
              <Item regular>
                <Button success onPress={this.update.bind()}>
                  <Text>Update</Text>
                </Button>
                <Button danger onPress={this.delete.bind()}>
                  <Text>Delete</Text>
                </Button>
                <Right>
                  <Button info onPress={this.onPress.bind()}>
                    <Text>X</Text>
                  </Button>
                </Right>
              </Item>
            </Form>}

        </Animated.View>
      </Card>
    )
  }
}
