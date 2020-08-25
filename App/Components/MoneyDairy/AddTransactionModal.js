import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Utils from '../../Utils/Utils'
import { Category } from '../../Realm'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input, Switch, List, ListItem } from 'native-base'
import Modal, { ModalContent, ModalFooter, ModalButton } from 'react-native-modals'
import _ from 'lodash'
class AddTransactionModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      wallet: this.props.wallets ? this.props.wallets[0].label : null,
      category: this.props.categories ? this.props.categories[0].label : null,
      date: new Date(),
      amount: 0,
      include: true
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

  onValueChangeWallet (value) {
    this.setState({
      selectedWallet: value
    })
  }

  onValueChangeCategory (value) {
    this.setState({
      category: value
    })
  }

  addTransaction () {
    const data = {
      wallet: this.state.wallet ? this.state.wallet : this.props.wallets[0].label,
      category: this.state.category ? this.state.category : this.props.categories[0].label,
      amount: this.state.amount || 0,
      date: this.state.date,
      include: this.state.include
    }
    this.props.transactionCreate(data)
    this.setState({
      wallet: this.props.wallets ? this.props.wallets[0].label : null,
      category: this.props.categories ? this.props.categories[0].label : null,
      date: new Date(),
      amount: 0,
      include: true
    })
    this.setModalVisible(false)
  }

  render () {
    if (!this.props.wallets || !this.props.categories) {
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
                  <Button success onPress={this.addTransaction.bind()}>
                    <Text>Create</Text>
                  </Button>
                  <Right>
                    <Button info onPress={() => this.setModalVisible(false)}>
                      <Text>Cancel</Text>
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
            <CardItem>
              <Left>
                <Item style={{ height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>
                  <Text style={{ position: 'absolute', backgroundColor: 'green', left: 0, height: 50, width: 50, borderRadius: 50, textAlign: 'center', textAlignVertical: 'center', color: 'white' }}>{Utils.getDay(this.state.date)}</Text>
                  {
                    this.state.visible && (
                      <DatePicker
                        defaultDate={this.state.date}
                        minimumDate={new Date(2016, 1, 1)}
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
                    )
                  }
                </Item>
              </Left>
              <Body>
                <Item picker>
                  <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='arrow-down' />}
                    style={{ width: 200 }}
                    placeholder='Select Category'
                    placeholderStyle={{ color: '#bfc6ea' }}
                    placeholderIconColor='#007aff'
                    selectedValue={this.state.category}
                    onValueChange={this.onValueChangeCategory.bind(this)}
                  >
                    {this.props.categories.map(wallet => <Picker.Item key={wallet.id} label={wallet.label} value={wallet.label} />)}
                  </Picker>
                </Item>
              </Body>
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
                  selectedValue={this.state.wallet}
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
                  <Text>Include in Report</Text>
                </Body>
                <Right>
                  <Switch
                    value={this.state.include} onValueChange={value => {
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

export default AddTransactionModal
