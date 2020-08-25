import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Utils from '../../Utils/Utils'
import { Category } from '../../Realm'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input, Switch, List, ListItem } from 'native-base'
import Modal, { ModalContent, ModalFooter, ModalButton } from 'react-native-modals'
import _ from 'lodash'
class TransactionDetailModal extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      visible: false,
      selectedWallet: transaction?.wallet,
      selectedCategory: transaction?.category,
      chosenDate: new Date(transaction?.date),
      amount: transaction?.amount,
      selectedInclude: transaction?.include
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
    let updateData = {
      amount: this.state.amount,
      wallet: this.state.selectedWallet,
      category: this.state.selectedCategory,
      include: this.state.selectedInclude
    }
    updateData = _.omitBy(updateData, (v, k) => this.props.transaction[k] === v)
    if (Utils.getDate(this.props.transaction.date) !== Utils.getDate(this.state.chosenDate)) {
      updateData.date = new Date(this.state.chosenDate)
    } else {
      Utils.log(Utils.getDate(this.props.transaction.date), Utils.getDate(this.state.chosenDate))
    }
    Utils.log('updateData', updateData)
    if (!_.isEmpty(updateData)) {
      updateData.id = this.props.transaction.id
      this.props.transactionUpdate(updateData)
      this.props.refreshTransactions()
    }

    this.setModalVisible(false)
  }

  delete () {
    // Transaction.remove({ id: this.props.transaction.id })
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
        footer={
          <ModalFooter>
            <Card>
              <CardItem>
                <Item regular>
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
              </CardItem>
            </Card>
          </ModalFooter>
        }
      >
        <ModalContent>
          <Card>
            <CardItem style={{ opacity: transaction.include ? 1 : 0.3 }}>
              <Left>
                <Item style={{ backgroundColor: Category.getColor(transaction.category), height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>
                  <Text style={{ position: 'absolute', left: 0, backgroundColor: Category.getColor(transaction.category), height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>{Utils.getDay(this.state.chosenDate)}</Text>
                  {
                    this.state.visible && (
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
                  {this.state.visible
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
                      this.setState({ selectedInclude: value })
                    }}
                  />
                </Right>
              </Item>

            </Form>

          </Card>
        </ModalContent>
      </Modal.BottomModal>)
  }
}

export default TransactionDetailModal
