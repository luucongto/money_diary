import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, Card, CardItem, Button, Icon, Item, Picker, Label, Input, Form, Grid, Col, Row } from 'native-base'
import Utils from '../../Utils/Utils'
import { Colors, Fonts } from '../../Themes'
import I18n from '../../I18n'
import lodash from 'lodash'
import FadeComponent from './FadeComponent'
import autoBind from 'react-autobind'
import { TouchableOpacity } from 'react-native-gesture-handler'
import dayjs from 'dayjs'
import Category from '../../Realm/Category'
import Transaction from '../../Realm/Transaction'
class TransactionCardItem extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      transaction: this.props.transaction
    }
  }

  delete () {
    const transaction = this.state.transaction
    Transaction.update({
      id: transaction.id
    }, {
      deleted: true
    })
    this.setState({
      transaction: {
        ...this.state.transaction,
        deleted: true
      }
    })
  }

  toggleCheckInclude () {
    Utils.log('toggleCheckInclude')
    const transaction = Utils.clone(this.state.transaction)
    transaction.include = !transaction.include
    Transaction.update({
      id: transaction.id
    }, {
      include: transaction.include
    })
    this.setState({
      transaction
    })
  }

  render () {
    const transaction = this.state.transaction
    if (!transaction || transaction.deleted) {
      Utils.log('transactionCardItem, index', this.props.index, 'null')
      return null
    }
    const wallet = this.props.wallet
    if (!wallet) return null
    const category = this.props.category
    if (!category) return null
    const amount = transaction.amount
    const height = 100
    const margin = 10
    return (
      <View style={{
        opacity: transaction.include ? 1 : 0.2,
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderBottomColor: wallet.color,
        borderBottomWidth: 1,
        height,
        overflow: 'hidden',
        justifyContent: 'center'
      }}
      >
        <View
          style={{
            backgroundColor: wallet.color,
            width: margin,
            height,
            marginRight: margin
          }}
        />
        <Body style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>

          <TouchableOpacity onPress={() => this.toggleCheckInclude()}>
            <Text style={[Fonts.style.h5]} uppercase={false}>
              <Icon name={transaction.include ? 'checksquareo' : 'minussquareo'} type='AntDesign' style={{ color: transaction.include ? 'green' : 'gray' }} />  {category.label}
            </Text>
          </TouchableOpacity>

          <Text style={{ ...Fonts.style.h5, color: amount > 0 ? 'green' : 'red' }}>đ {Utils.numberWithCommas(amount)}</Text>
          <Text note numberOfLines={1}>{Utils.timeFormat(transaction.date)} {transaction.note}</Text>
        </Body>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'space-between'

        }}
        >
          <TouchableOpacity style={{ width: 50, height: height / 2, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.props.openTransactionDetailModal(transaction)}>
            <Icon name='pencil-square-o' type='FontAwesome' style={{ fontSize: height / 4, color: 'blue', alignSelf: 'center' }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 50, height: height / 2, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.delete()}>
            <Icon name='trash' type='FontAwesome' style={{ alignSelf: 'center', color: 'red' }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

class TransactionMonthTag extends PureComponent {
  render () {
    const { title, amount, income, outcome, count } = this.props
    return (
      <View style={{
        flexDirection: 'row',
        paddingTop: 10,
        backgroundColor: Colors.listBackground,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingHorizontal: 25,
        height: 100,
        overflow: 'hidden',
        justifyContent: 'center'
      }}
      >
        <Body style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start' }}>
          <Col>
            <Text style={[Fonts.style.h4, { color: '#0096c7', alignSelf: 'flex-start' }]}>
              {title}
            </Text>
            <Text style={{ ...Fonts.style.h5, color: amount > 0 ? 'green' : 'red', alignSelf: 'flex-start' }}>đ {Utils.numberWithCommas(amount)}</Text>
            <Text note>{count} {I18n.t('transactions')}</Text>
          </Col>
          <Col style={{ justifyContent: 'center', paddingTop: 10 }}>
            <Text note style={{ color: 'green', alignSelf: 'flex-end' }}>
              đ {Utils.numberWithCommas(income)} <Icon name='download' type='AntDesign' style={{ fontSize: 15, color: 'green' }} />
            </Text>
            <Text note style={{ color: 'red', alignSelf: 'flex-end' }}>
                đ{Utils.numberWithCommas(outcome)} <Icon name='upload' type='AntDesign' style={{ fontSize: 15, color: 'red' }} />
            </Text>
          </Col>
        </Body>
      </View>
    )
  }
}
class TransactionCardAddComponent extends PureComponent {
  constructor (props) {
    super(props)
    const categories = lodash.sortBy(Category.find(), 'label')
    this.state = {
      amount: 0,
      categoryId: categories[0],
      categories,
      isIncome: false,
      include: true,
      note: ''
    }
    autoBind(this)
  }

  toggleCheckInclude () {
    this.setState({
      include: !this.state.include
    })
  }

  transactionCreate (transaction) {
    if (transaction.amount !== 0) {
      this.props.transactionCreateRequest(transaction)
    }

    if (this.props.callback) {
      this.props.callback(transaction)
    }
  }

  create () {
    const data = {
      wallet: this.props.walletId,
      category: this.state.categoryId,
      amount: (this.state.isIncome ? 1 : -1) * Math.abs(this.state.amount || 0),
      date: dayjs().unix(),
      note: this.state.note,
      include: this.state.include
    }
    this.transactionCreate(data)
    this.setState({
      amount: 0,
      note: ''
    })
  }

  onValueChangeCategory (categoryId) {
    this.setState({
      categoryId
    })
  }

  toggleCheckIncome () {
    this.setState({
      isIncome: !this.state.isIncome
    })
  }

  render () {
    const height = 140
    const margin = 10
    return (
      <View style={{
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderBottomColor: 'green',
        borderBottomWidth: 1,
        height,
        overflow: 'hidden',
        justifyContent: 'center'
      }}
      >
        <View
          style={{
            backgroundColor: 'green',
            width: margin,
            height,
            marginRight: margin
          }}
        />

        <Body style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Item inlineLabel>
            <Icon name={this.state.include ? 'checksquareo' : 'minussquareo'} type='AntDesign' style={{ color: this.state.include ? 'green' : 'gray' }} onPress={() => this.toggleCheckInclude()} />
            <Label>{I18n.t('category')}</Label>
            <Picker
              mode='dropdown'
              iosIcon={<Icon name='arrow-down' />}
              style={{ width: undefined }}
              placeholder='Select Category'
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor='#007aff'
              selectedValue={this.state.categoryId}
              onValueChange={this.onValueChangeCategory.bind(this)}
            >
              {this.state.categories.map(item => <Picker.Item color={item.color} key={item.id} label={item.label} value={item.id} />)}
            </Picker>
          </Item>
          <Item inlineLabel>
            <Input label={I18n.t('note')} placeholder={I18n.t('note')} value={this.state.note} onChangeText={note => this.setState({ note })} />
          </Item>
          <Item inlineLabel>
            <Icon name={this.state.isIncome ? 'plussquareo' : 'minussquareo'} type='AntDesign' style={{ color: this.state.isIncome ? 'green' : 'red' }} onPress={() => this.toggleCheckIncome()} />
            <Input label={I18n.t('amount')} style={{ color: this.state.isIncome ? 'green' : 'red' }} placeholder={I18n.t('amount')} value={Utils.numberWithCommas(this.state.amount)} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button small rounded onPress={() => this.setState({ amount: this.state.amount * 1000 })}><Text uppercase={false}>x1K</Text></Button>
              <Text uppercase={false}> </Text>
              <Button small rounded onPress={() => this.setState({ amount: this.state.amount * 1000000 })}><Text uppercase={false}>x1M</Text></Button>
            </View>
          </Item>
        </Body>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center'

        }}
        >
          <TouchableOpacity style={{ width: 50, height: height / 2, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.create()}>
            <Icon name='check' type='FontAwesome' style={{ fontSize: height / 4, color: 'green', alignSelf: 'center' }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

module.exports = {
  TransactionCardItem,
  TransactionCardAddComponent,
  TransactionMonthTag
}
