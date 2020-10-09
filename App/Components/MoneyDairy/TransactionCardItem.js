import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, Card, CardItem, Button, Icon, Item, Picker, Label, Input, Form, Grid, Col } from 'native-base'
import Utils from '../../Utils/Utils'
import { Fonts } from '../../Themes'
import I18n from '../../I18n'
import FadeComponent from './FadeComponent'
import autoBind from 'react-autobind'
import { TouchableOpacity } from 'react-native-gesture-handler'
import dayjs from 'dayjs'
class TransactionCardItem extends PureComponent {
  render () {
    const transaction = this.props.transaction
    if (!transaction) return null
    const wallet = this.props.wallet
    if (!wallet) return null
    const category = this.props.category
    if (!category) return null
    const amount = transaction.amount
    const height = 100
    const margin = 10
    return (
      <FadeComponent fadeInTime={300 + this.props.index * 100} style={{ marginLeft: 10, marginRight: 10, marginBottom: 10, height }}>
        <View style={{
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
            <Text style={[Fonts.style.h5]}>
              {category.label}
            </Text>

            <Text style={{ ...Fonts.style.h5, color: amount > 0 ? 'green' : 'red' }}>đ {Utils.numberWithCommas(amount)}</Text>
            <Text note>{Utils.timeFormat(transaction.date)} {transaction.note}</Text>
          </Body>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between'

          }}
          >
            <TouchableOpacity style={{ width: 50, height: height / 2, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.props.openTransactionDetailModal(transaction)}>
              <Icon name='angle-right' type='FontAwesome' style={{ fontSize: height / 4, color: 'gray', alignSelf: 'center' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 50, height: height / 2, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.props.openTransactionDetailModal(transaction)}>
              <Icon name='plus' type='FontAwesome' style={{ alignSelf: 'center', color: 'gray' }} />
            </TouchableOpacity>
          </View>
        </View>
      </FadeComponent>
    )
  }
}

class TransactionCardAddComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      amount: 0,
      note: ''
    }
    autoBind(this)
  }

  transactionCreate (transaction) {
    this.props.transactionCreateRequest(transaction)
  }

  create () {
    const data = {
      wallet: this.props.walletId,
      category: 1,
      amount: this.state.amount || 0,
      date: dayjs().unix(),
      note: this.state.note,
      include: true
    }
    this.transactionCreate(data)
  }

  render () {
    const wallet = this.props.wallet
    const height = 100
    const margin = 10
    return (
      <FadeComponent fadeInTime={300 + this.props.index * 100} style={{ marginLeft: 10, marginRight: 10, marginBottom: 10, height }}>
        <View style={{
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
              <Input label={I18n.t('note')} placeholder={I18n.t('note')} value={this.state.note} onChangeText={note => this.setState({ note })} />
            </Item>
            <Item inlineLabel>
              <Input label={I18n.t('amount')} placeholder={I18n.t('amount')} value={Utils.numberWithCommas(this.state.amount)} keyboardType='number-pad' onChangeText={text => this.setState({ amount: parseInt(text.replace(/,/g, '')) })} />
            </Item>
          </Body>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between'

          }}
          >
            <TouchableOpacity style={{ width: 50, height: height / 2, flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.create()}>
              <Icon name='check' type='FontAwesome' style={{ fontSize: height / 4, color: 'green', alignSelf: 'center' }} />
            </TouchableOpacity>
          </View>
        </View>
      </FadeComponent>
    )
  }
}

module.exports = {
  TransactionCardItem,
  TransactionCardAddComponent
}
