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
const t = I18n.t
class TransactionDetailScreen extends Component {
  constructor (props) {
    super(props)
    const transaction = props?.route?.params?.transaction
    const stateTransaction = this._assignTransactionToStart(transaction)
    this.state = {
      ...stateTransaction
    }
    autoBind(this)
  }

  transactionUpdate (transaction) {
    this.props.transactionUpdateRequest(transaction)
  }

  transactionDelete (transaction) {
    this.props.transactionDeleteRequest(transaction)
  }

  transactionCreate (transaction) {
    this.props.transactionCreateRequest(transaction)
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
      wallet: this.state.wallet ? this.state.wallet : this.props.wallets[0].id,
      category: this.state.category ? this.state.category : this.props.categories[0].label,
      amount: this.state.amount || 0,
      date: dayjs(this.state.date).unix(),
      note: this.state.note,
      include: this.state.include
    }
    this.transactionCreate(data)
    this.goBack()
  }

  update () {
    let updateData = {
      amount: this.state.amount,
      wallet: this.state.wallet,
      category: this.state.category,
      include: this.state.include,
      note: this.state.note
    }
    const transaction = this.state.transaction
    updateData = lodash.omitBy(updateData, (v, k) => transaction[k] === v)
    if (Utils.getDate(transaction.date) !== Utils.getDate(this.state.date)) {
      updateData.date = dayjs(this.state.date).unix()
    }
    Utils.log('updateData', updateData)
    if (!lodash.isEmpty(updateData)) {
      updateData.id = transaction.id
      this.transactionUpdate(updateData)
    }

    this.goBack(false)
  }

  delete () {
    this.transactionDelete({ id: this.state.transaction.id })
    this.goBack(false)
  }

  renderPhone () {
    const transaction = this.state.transaction
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
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon color='black' name='arrow-back' />
            </Button>
          </View>
          <Body />
        </Header>
        <Content>
          <Form>
            <Item inlineLabel>
              <Label>{t('Date')}</Label>
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
                {this.props.categories.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}
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
                {this.props.wallets.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}

              </Picker>
            </Item>
            <Item inlineLabel>
              <Input placeholder={I18n.t('amount')} value={Utils.numberWithCommas(this.state.amount)} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
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
    transactions: state.transaction.data,
    transactionParams: state.transaction.params,
    transactionUpdateObjects: state.transaction.updateObjects,
    transactionDeleteObjects: state.transaction.deleteObjects,
    categories: Object.values(state.category.objects),
    wallets: Object.values(state.wallet.objects)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transactionRequest: (params) => dispatch(TransactionRedux.transactionRequest(params)),
    transactionUpdateRequest: (params) => dispatch(TransactionRedux.transactionUpdateRequest(params)),
    transactionDeleteRequest: (params) => dispatch(TransactionRedux.transactionDeleteRequest(params)),
    transactionCreateRequest: (params) => dispatch(TransactionRedux.transactionCreateRequest(params))
  }
}
const screenHook = Screen(TransactionDetailScreen, mapStateToProps, mapDispatchToProps, ['transaction', 'category', 'wallet'])
export default screenHook
