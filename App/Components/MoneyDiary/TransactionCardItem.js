import dayjs from 'dayjs'
import lodash from 'lodash'
import { Body, Button, Col, Icon, Input, Item, Label, Picker, Row, Text } from 'native-base'
import React, { PureComponent } from 'react'
import autoBind from 'react-autobind'
import { Alert, View } from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import I18n from '../../I18n'
import Api from '../../Services/Api'
import { ApplicationStyles, Colors, Fonts } from '../../Themes'
import Utils from '../../Utils/Utils'
const t = I18n.t
class TransactionCardItem extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      transaction: this.props.transaction
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transaction) {
      this.setState({ transaction: nextProps.transaction })
    }
  }

  delete () {
    Alert.alert(
      t('tran_delete_confirm_title'),
      t('tran_delete_confirm_msg'),
      [
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            const transaction = this.state.transaction
            Api.transactionDelete({ id: transaction.id })
            this.setState({
              transaction: {
                ...this.state.transaction,
                deleted: true
              }
            })
          }
        }
      ],
      { cancelable: true }
    )
  }

  toggleCheckInclude () {
    Utils.log('toggleCheckInclude')
    const transaction = Utils.clone(this.state.transaction)
    transaction.include = !transaction.include
    Api.transactionUpdate({
      id: transaction.id,
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
    if (!wallet) {
      Utils.log('transactionCardItem, wallet', this.props.index, 'null')
      return null
    }
    const category = this.props.category
    if (!category) {
      Utils.log('transactionCardItem, category', this.props.index, 'null')
      return null
    }
    const amount = transaction.amount
    const height = 65
    return (
      <View
        style={{
          ...ApplicationStyles.components.card,
          opacity: transaction.include ? 1 : 0.2,
          marginBottom: 10,
          marginHorizontal: 10,
          backgroundColor: Colors.cardBackground,
          flexDirection: 'row',
          borderLeftWidth: 2,
          borderRightWidth: 0,
          height,
          elevation: 5,
          paddingLeft: 10,
          overflow: 'hidden',
          justifyContent: 'center'
        }}
      >
        <Body style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '60%' }}>
            <View style={{ width: 40, justifyContent: 'center' }}>
              <Icon name={wallet.icon} type='MaterialCommunityIcons' style={{ color: wallet.color, width: 30 }} />
            </View>
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity onPress={() => this.toggleCheckInclude()}>
                <Text style={[Fonts.style.h5]} uppercase={false} numberOfLines={1}>
                  <Icon name={transaction.include ? 'checksquareo' : 'minussquareo'} type='AntDesign' style={{ color: transaction.include ? 'green' : 'gray' }} />  {category.label}
                </Text>
              </TouchableOpacity>
              <Text note numberOfLines={1}>{transaction.note}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'column' }}
            onPress={() => this.props.openTransactionDetailModal(transaction)}
          >
            <Text style={{ alignSelf: 'flex-end' }} note numberOfLines={1}>{Utils.timeFormat(transaction.date)}</Text>
            <Text style={{ ...Fonts.style.h5, color: amount > 0 ? 'green' : 'red' }}>{amount > 0 ? '+' : '-'} {Utils.numberWithCommas(Math.abs(amount))}</Text>
          </TouchableOpacity>
        </Body>
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
        marginBottom: 10,
        backgroundColor: Colors.listBackground,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 25,
        height: 80,
        zIndex: 10,
        overflow: 'hidden',
        justifyContent: 'center'
      }}
      >
        <Body style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start' }}>

          <Col>
            <Text style={[Fonts.style.h4, { color: '#0096c7', alignSelf: 'flex-start' }]}>
              {title}
            </Text>
            <Text note>{count} {I18n.t('transactions')}</Text>
          </Col>
          <Col style={{ justifyContent: 'center', paddingTop: 10 }}>
            <Text note style={{ color: 'green', alignSelf: 'flex-end' }}>
              {Utils.numberWithCommas(income)} <Icon name='download' type='AntDesign' style={{ fontSize: 15, color: 'green' }} />
            </Text>
            <Text note style={{ color: 'red', alignSelf: 'flex-end' }}>
              {Utils.numberWithCommas(Math.abs(outcome))} <Icon name='upload' type='AntDesign' style={{ fontSize: 15, color: 'red' }} />
            </Text>
            <Text
              note
              style={{
                borderTopWidth: 1,
                borderTopColor: '#666666',
                paddingRight: 20,
                color: amount > 0 ? 'green' : 'red',
                alignSelf: 'flex-end'
              }}
            >{Utils.numberWithCommas(amount)}
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
    const categories = lodash.sortBy(Api.category(), 'label')
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
      Api.transactionCreate(transaction)
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
