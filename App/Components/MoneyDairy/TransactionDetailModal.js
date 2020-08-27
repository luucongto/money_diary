import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Utils from '../../Utils/Utils'
import { Category } from '../../Realm'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input, Switch } from 'native-base'
import Modal, { ModalContent, ModalFooter } from 'react-native-modals'
import _ from 'lodash'
class TransactionDetailModal extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      visible: false,
      wallet: transaction?.wallet,
      category: transaction?.category,
      date: new Date(transaction?.date),
      amount: transaction?.amount,
      include: transaction?.include
    }
    autoBind(this)
  }

  componentDidMount () {
    this.props.setRef(this)
  }

  setModalVisible (visible) {
    this.setState({ visible })
  }

  setDate (newDate) {
    this.setState({ date: newDate })
  }

  componentWillReceiveProps (nextProp) {
    if (nextProp.transaction) {
      const transaction = nextProp.transaction
      this.setState({
        wallet: transaction?.wallet,
        category: transaction?.category,
        date: new Date(transaction?.date),
        amount: transaction?.amount,
        include: transaction?.include
      })
    }
  }

  onValueChangeWallet (value) {
    this.setState({
      wallet: value
    })
  }

  onValueChangeCategory (value) {
    this.setState({
      category: value
    })
  }

  update () {
    let updateData = {
      amount: this.state.amount,
      wallet: this.state.wallet,
      category: this.state.category,
      include: this.state.include
    }
    updateData = _.omitBy(updateData, (v, k) => this.props.transaction[k] === v)
    if (Utils.getDate(this.props.transaction.date) !== Utils.getDate(this.state.date)) {
      updateData.date = new Date(this.state.date)
    } else {
      Utils.log(Utils.getDate(this.props.transaction.date), Utils.getDate(this.state.date))
    }
    Utils.log('updateData', updateData)
    if (!_.isEmpty(updateData)) {
      updateData.id = this.props.transaction.id
      this.props.transactionUpdate(updateData)
    }

    this.setModalVisible(false)
  }

  delete () {
    this.props.transactionDelete({ id: this.props.transaction.id })
    this.setModalVisible(false)
  }

  render () {
    const transaction = this.props.transaction
    if (!transaction) {
      return null
    }
    return (
      <Modal.BottomModal
        visible={this.state.visible}
        onTouchOutside={() => this.setModalVisible(false)}
        onSwipeOut={() => this.setModalVisible(false)}
        height={0.5}
        width={1}
      >
        <ModalContent>

          <Form>
            <Item underline>
              <Text style={{ position: 'absolute', left: 0 }}>{Utils.getDate(this.state.date)}</Text>
              <DatePicker
                defaultDate={this.state.date}
                minimumDate={new Date(2010, 1, 1)}
                maximumDate={new Date(2030, 12, 31)}
                locale='en'
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType='fade'
                androidMode='default'
                placeHolderText={Utils.getDay(this.state.date)}
                textStyle={{ color: 'green', opacity: 0 }}
                placeHolderTextStyle={{ width: 50, height: 50, textAlign: 'center', textAlignVertical: 'center', color: 'green', opacity: 0 }}
                onDateChange={this.setDate.bind(this)}
                disabled={false}
              />

            </Item>
            <Item picker>
              <Picker
                mode='dropdown'
                iosIcon={<Icon name='arrow-down' />}
                style={{ width: undefined }}
                placeholder='Select Category'
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor='#007aff'
                selectedValue={this.state.category}
                onValueChange={this.onValueChangeCategory.bind(this)}
              >
                {this.props.categories.map(category => <Picker.Item key={category.id} label={category.label} value={category.id} />)}
              </Picker>
            </Item>
            <Item picker>
              <Picker
                mode='dropdown'
                iosIcon={<Icon name='arrow-down' />}
                style={{ width: undefined }}
                placeholder='Select Wallet'
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor='#007aff'
                selectedValue={this.state.wallet}
                onValueChange={this.onValueChangeWallet.bind(this)}
              >
                {this.props.wallets.map(wallet => <Picker.Item key={wallet.id} label={wallet.label} value={wallet.id} />)}

              </Picker>
            </Item>
            <Item picker />
            <Item inlineLabel>
              <Input value={Utils.numberWithCommas(this.state.amount.toString())} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
            </Item>
            <Item picker>
              <Body>
                <Text>Included</Text>
              </Body>
              <Right>
                <Switch
                  value={this.state.include} onValueChange={value => {
                    this.setState({ include: value })
                  }}
                />
              </Right>
            </Item>
            <Item>
              <Button success onPress={this.update.bind()}>
                <Text>Update</Text>
              </Button>
              <Button danger onPress={this.delete.bind()}>
                <Text>Delete</Text>
              </Button>
              <Right>
                <Button info onPress={() => this.setModalVisible(false)}>
                  <Text>X</Text>
                </Button>
              </Right>
            </Item>
          </Form>
        </ModalContent>
      </Modal.BottomModal>)
  }
}

export default TransactionDetailModal
