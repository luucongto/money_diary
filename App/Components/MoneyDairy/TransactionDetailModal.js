import _ from 'lodash'
import { Button, DatePicker, Form, Icon, Input, Item, Picker, Right, Switch, Text, Label, Grid, Col } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Modal, { ModalContent } from 'react-native-modals'
import Utils from '../../Utils/Utils'
class TransactionDetailModal extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    const stateTransaction = this._assignTransactionToStart(transaction)
    this.state = {
      visible: false,
      ...stateTransaction
    }
    autoBind(this)
  }

  componentDidMount () {
    this.props.setRef(this)
  }

  setModalVisible (visible = false) {
    Utils.log('setModalVisible', visible)
    this.setState({ visible })
  }

  setDate (newDate) {
    this.setState({ date: newDate })
  }

  _assignTransactionToStart (transaction) {
    return {
      wallet: transaction?.wallet,
      category: transaction?.category,
      date: transaction ? new Date(transaction.date) : new Date(),
      amount: transaction?.amount || 0,
      include: transaction ? transaction.include : true,
      note: transaction?.note
    }
  }

  componentWillReceiveProps (nextProp) {
    if (nextProp.transaction) {
      const transaction = nextProp.transaction
      this.setState(this._assignTransactionToStart(transaction))
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

  create () {
    const data = {
      wallet: this.state.wallet ? this.state.wallet : this.props.wallets[0].id,
      category: this.state.category ? this.state.category : this.props.categories[0].label,
      amount: this.state.amount || 0,
      date: this.state.date,
      include: this.state.include
    }
    this.props.transactionCreate(data)
    this.setState({
      wallet: this.props.wallets ? this.props.wallets[0].id : null,
      category: this.props.categories ? this.props.categories[0].label : null,
      date: new Date(),
      amount: 0,
      include: true
    })
    this.setModalVisible(false)
  }

  update () {
    let updateData = {
      amount: this.state.amount,
      wallet: this.state.wallet,
      category: this.state.category,
      include: this.state.include,
      note: this.state.note
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
    const buttons = (
      <Grid>

        {this.props.transaction &&
          <Col size={0.35}>
            <Button success onPress={this.update.bind(this)}>
              <Text>Update</Text>
            </Button>
          </Col>}
        {this.props.transaction &&
          <Col size={0.35}>
            <Button danger onPress={this.delete.bind(this)}>
              <Text>Delete</Text>
            </Button>
          </Col>}
        {!this.props.transaction &&
          <Col size={0.65}>
            <Button success onPress={this.create.bind()}>
              <Text>Create</Text>
            </Button>
          </Col>}
        <Col size={0.35}>
          <Button info onPress={() => this.setModalVisible(false)} style={{ alignSelf: 'flex-end' }}>
            <Icon name='close' />
          </Button>
        </Col>
      </Grid>

    )

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
            <Item inlineLabel>
              <Label>Date</Label>
              <DatePicker
                style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
                defaultDate={this.state.date}
                minimumDate={new Date(2010, 1, 1)}
                maximumDate={new Date(2030, 12, 31)}
                locale='en'
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType='fade'
                androidMode='default'
                placeHolderText={Utils.getDate(this.state.date)}
                textStyle={{ color: 'green', opacity: 1 }}
                placeHolderTextStyle={{ color: 'green', opacity: 1 }}
                onDateChange={this.setDate.bind(this)}
                disabled={false}
              />

            </Item>
            <Item inlineLabel>
              <Label>Category</Label>
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
                {this.props.categories.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}
              </Picker>
            </Item>
            <Item inlineLabel>
              <Label>Wallet</Label>
              <Picker
                mode='dropdown'
                iosIcon={<Icon name='arrow-down' />}
                style={{ width: undefined }}
                placeholder='Select Wallet'
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor='#007aff'
                itemTextStyle={{ color: 'red' }}
                selectedValue={this.state.wallet}
                onValueChange={this.onValueChangeWallet.bind(this)}
              >
                {this.props.wallets.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}

              </Picker>
            </Item>
            <Item inlineLabel>
              <Label>Amount</Label>
              <Input value={Utils.numberWithCommas(this.state.amount)} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
            </Item>
            <Item inlineLabel>
              <Label>Note</Label>
              <Input value={this.state.note} onChangeText={note => this.setState({ note })} />
            </Item>
            <Item inlineLabel style={{ height: 50 }}>
              <Label>Included</Label>
              <Right>
                <Switch
                  value={this.state.include} onValueChange={value => {
                    this.setState({ include: value })
                  }}
                />
              </Right>
            </Item>
            {buttons}
          </Form>
        </ModalContent>
      </Modal.BottomModal>)
  }
}

export default TransactionDetailModal
