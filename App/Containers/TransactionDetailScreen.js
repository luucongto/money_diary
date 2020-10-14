// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Content, Header, Icon, Right, Text, View, Item, Label, Col, Grid, Form, DatePicker, Picker, Input, Switch, Textarea } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import lodash from 'lodash'
import TransactionRedux from '../Redux/TransactionRedux'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'
import dayjs from 'dayjs'
import I18n from '../I18n'
import Wallet from '../Realm/Wallet'
import Category from '../Realm/Category'
import Transaction from '../Realm/Transaction'
const t = I18n.t
class TransactionDetailScreen extends Component {
  constructor (props) {
    super(props)
    const transaction = props?.route?.params?.transaction
    const stateTransaction = this._assignTransactionToStart(transaction)
    this.categories = lodash.sortBy(Category.find(), 'label')
    this.wallets = Wallet.find()
    this.state = {
      ...stateTransaction
    }
    autoBind(this)
  }

  transactionUpdate (transaction) {
    Transaction.insert(transaction)
    this.goBack()
    // this.props.transactionUpdateRequest(transaction)
  }

  transactionDelete (transaction) {
    Transaction.remove({ id: transaction.id })
    this.goBack()
    // this.props.transactionDeleteRequest(transaction)
  }

  transactionCreate (transaction) {
    Transaction.insert(transaction)
    this.goBack()
    // this.props.transactionCreateRequest(transaction)
  }

  goBack () {
    this.props.navigation.goBack()
  }

  setDate (newDate) {
    this.setState({ date: Utils.getDate(newDate) })
  }

  _assignTransactionToStart (transaction) {
    return {
      transaction: transaction,
      wallet: transaction?.wallet,
      category: transaction?.category,
      date: transaction ? dayjs.unix(transaction.date) : new Date(),
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
      wallet: this.state.wallet ? this.state.wallet : this.wallets[1].id,
      category: this.state.category ? this.state.category : this.categories[0].label,
      amount: this.state.amount || 0,
      date: dayjs(this.state.date).unix(),
      note: this.state.note,
      include: this.state.include
    }
    this.transactionCreate(data)
    this.goBack()
  }

  update () {
    const updateData = {
      ...Utils.clone(this.state.transaction),
      amount: this.state.amount,
      wallet: this.state.wallet,
      category: this.state.category,
      include: this.state.include,
      note: this.state.note
    }
    const transaction = this.state.transaction
    if (Utils.getDate(transaction.date) !== Utils.getDate(this.state.date)) {
      updateData.date = dayjs(this.state.date).unix()
    }
    Utils.log('updateData1', updateData)
    if (!lodash.isEmpty(updateData)) {
      updateData.id = transaction.id
      this.transactionUpdate(updateData)
    }
  }

  delete () {
    this.transactionDelete({ id: this.state.transaction.id })
    this.goBack(false)
  }

  renderPhone () {
    const transaction = this.state.transaction
    Utils.log('TransactionDetailScreen, transaction', transaction)
    const buttons = (
      <Grid style={{ padding: 20 }}>
        {transaction &&
          <Col size={0.35}>
            <Button success onPress={this.update.bind(this)}>
              <Text>{t('Update')}</Text>
            </Button>
          </Col>}
        {transaction &&
          <Col size={0.35}>
            <Button danger onPress={this.delete.bind(this)}>
              <Text>{t('Delete')}</Text>
            </Button>
          </Col>}
        {!transaction &&
          <Col size={0.65}>
            <Button success onPress={this.create.bind()}>
              <Text>{t('Create')}</Text>
            </Button>
          </Col>}
        <Col size={0.35}>
          <Button info onPress={() => this.goBack(false)} style={{ alignSelf: 'flex-end' }}>
            <Icon name='close' />
          </Button>
        </Col>
      </Grid>

    )
    return (
      <Container>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            <Button transparent onPress={() => this.goBack()}>
              <Icon color='black' name='arrow-back' />
            </Button>
          </View>
          <Body />
        </Header>
        <Content>
          <Form>
            <Item inlineLabel>
              <Label>ID</Label>
              <Label>{transaction ? transaction.id : ''}</Label>
            </Item>
            <Item inlineLabel>
              <Label>{t('Date')}</Label>
              <DatePicker
                style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
                defaultDate={new Date(this.state.date)}
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
                formatChosenDate={Utils.getDate.bind(this)}
                disabled={false}
              />

            </Item>
            <Item inlineLabel>
              <Label>{t('Category')}</Label>
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
                {this.categories.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}
              </Picker>
            </Item>
            <Item inlineLabel>
              <Label>{t('Wallet')}</Label>
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
                {this.wallets.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}

              </Picker>
            </Item>
            <Item inlineLabel>
              <Input placeholder={I18n.t('amount')} value={Utils.numberWithCommas(this.state.amount)} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button small rounded onPress={() => this.setState({ amount: this.state.amount * 1000 })}><Text uppercase={false}>x1K</Text></Button>
                <Text uppercase={false}> </Text>
                <Button small rounded onPress={() => this.setState({ amount: this.state.amount * 1000000 })}><Text uppercase={false}>x1M</Text></Button>
              </View>
            </Item>
            <Item inlineLabel>
              <Textarea placeholder={I18n.t('note')} multiline rowSpan={4} value={this.state.note} onChangeText={note => this.setState({ note })} />
            </Item>
            <Item inlineLabel style={{ height: 50 }}>
              <Label>{t('Included')}</Label>
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
        </Content>
      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}
const screenHook = Screen(TransactionDetailScreen, mapStateToProps, mapDispatchToProps, ['transaction', 'category', 'wallet'])
export default screenHook
