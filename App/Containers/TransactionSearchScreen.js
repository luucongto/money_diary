// import { Images, Metrics } from '../Themes'
import { Body, Button, Card, CardItem, Col, Container, Content, Header, Icon, Item, Label, Picker, Right, Spinner, Switch, Text, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { TransactionCardItem } from '../Components/MoneyDiary/TransactionCardItem'
import Constants from '../Config/Constants'
import I18n from '../I18n'
import { Wallet } from '../Realm'
import Transaction from '../Realm/Transaction'
import { ApplicationStyles, Colors } from '../Themes'
// import I18n from 'react-native-i18n'
import Screen from './Screen'
import lodash from 'lodash'
import Api from '../Services/Api'
import Category from '../Realm/Category'
import Utils from '../Utils/Utils'
import LongTransactionList from '../Components/MoneyDiary/LongTransactionLists'
import dayjs from 'dayjs'
const t = I18n.t
class TransactionSearchScreen extends Component {
  constructor (props) {
    super(props)
    const calendarItems = Utils.getAllYearsBetweenDates(dayjs('2010-01-01').unix(), dayjs().unix()).reverse()
    this.state = {
      start: {},
      transactions: [{}],
      include: 'include_all',
      calendar: 'year',
      year: calendarItems[0],
      calendarItems,
      isRefreshing: false
    }
    this.categories = [{
      id: Constants.DEFAULT_WALLET_ID,
      color: 'red',
      label: Constants.DEFAULT_WALLET_ID
    }].concat(lodash.sortBy(Api.category(), 'label'))
    this.wallets = [{
      id: Constants.DEFAULT_WALLET_ID,
      color: 'red',
      label: Constants.DEFAULT_WALLET_ID
    }].concat(lodash.sortBy(Api.wallet(), 'position').filter(wallet => wallet.countInTotal))
    autoBind(this)
  }

  shouldComponentUpdate (props) {
    return props.isFocused
  }

  refreshTransactions () {
    if (this.state.isRefreshing) {

    }
  }

  openTransactionDetailModal (transaction) {
    this.props.navigation.navigate('TransactionDetailScreen', { transaction })
  }

  search () {
    this.setState({
      isRefreshing: true
    })
    const findConditions = { }

    if (this.state.walletId) {
      if (this.state.walletId !== Constants.DEFAULT_WALLET_ID) {
        findConditions.wallet = this.state.walletId
      } else {
        findConditions.wallet = lodash.map(Wallet.find({ countInTotal: true }), 'id')
      }
    }
    if (this.state.categoryId) {
      if (this.state.categoryId !== Constants.DEFAULT_WALLET_ID) {
        findConditions.category = this.state.categoryId
      } else {
        findConditions.category = lodash.map(Category.find(), 'id')
      }
    }
    if (this.state.include !== 'include_all') {
      findConditions.include = this.state.include === 'include_only'
    }
    findConditions.from = this.state.year.from
    findConditions.to = this.state.year.to
    const transactions = [{}].concat(Api.transaction(findConditions))
    Utils.log('search', transactions, this.state.include)
    this.setState({
      transactions
    })
  }

  onValueChangeWallet (value) {
    this.setState({
      walletId: value
    })
  }

  onValueChangeCategory (value) {
    this.setState({
      categoryId: value
    })
  }

  _renderCalendar () {
    return (
      <CardItem>
        <Col>
          <Label>{t('Calendar')}</Label>
          <View style={{
            borderRadius: 10,
            borderWidth: 1,
            marginTop: 10,
            borderColor: 'green',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
          >
            <Picker
              mode='dropdown'
              iosIcon={<Icon name='arrow-down' />}
              style={{ width: undefined }}
              placeholder='Select Category'
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor='#007aff'
              selectedValue={this.state.calendar}
              onValueChange={calendar => this.setState({ calendar })}
            >
              {['year', 'quarter', 'month'].map(item => <Picker.Item key={item} label={t(item)} value={item} />)}
            </Picker>
          </View>
        </Col>
        <View style={{ width: 10 }} />
        <Col>
          <Label>{t('')}</Label>
          <View style={{
            borderRadius: 10,
            borderWidth: 1,
            marginTop: 10,
            borderColor: 'green',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
          >
            <Picker
              mode='dropdown'
              iosIcon={<Icon name='arrow-down' />}
              style={{ width: undefined }}
              placeholder='Select Wallet'
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor='#007aff'
              itemTextStyle={{ color: 'red' }}
              selectedValue={this.state.year}
              onValueChange={year => this.setState({ year })}
            >
              {this.state.calendarItems.map(item => <Picker.Item key={item} label={item.label} value={item} />)}

            </Picker>
          </View>
        </Col>
      </CardItem>
    )
  }

  _renderSearchSection () {
    const transactions = this.state.transactions || []
    const count = transactions.length - 1
    return (
      <View style={{ padding: 10 }}>
        <Card style={[ApplicationStyles.components.card, { height: 330 }]}>
          <CardItem>
            <Col>
              <Label>{t('Category')}</Label>
              <View style={{
                borderRadius: 10,
                borderWidth: 1,
                marginTop: 10,
                borderColor: 'green',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              >
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
                  {this.categories.map(item => <Picker.Item color={item.color} key={item.id} label={item.id === Constants.DEFAULT_WALLET_ID ? t(item.label) : item.label} value={item.id} />)}
                </Picker>
              </View>
            </Col>
            <View style={{ width: 10 }} />
            <Col>
              <Label>{t('Wallet')}</Label>
              <View style={{
                borderRadius: 10,
                borderWidth: 1,
                marginTop: 10,
                borderColor: 'green',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              >
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: undefined }}
                  placeholder='Select Wallet'
                  placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  itemTextStyle={{ color: 'red' }}
                  selectedValue={this.state.walletId}
                  onValueChange={this.onValueChangeWallet.bind(this)}
                >
                  {this.wallets.map(item => <Picker.Item color={item.color} key={item.id} label={item.id === Constants.DEFAULT_WALLET_ID ? t(item.label) : item.label} value={item.id} />)}

                </Picker>
              </View>
            </Col>
          </CardItem>
          {this._renderCalendar()}
          <CardItem>
            <Col>
              <Label>{t('Included')}</Label>
              <View style={{
                borderRadius: 10,
                borderWidth: 1,
                marginTop: 10,
                borderColor: 'green',
                flexDirection: 'row',
                justifyContent: 'center'
              }}
              >
                <Picker
                  mode='dropdown'
                  iosIcon={<Icon name='arrow-down' />}
                  style={{ width: undefined }}
                  placeholder='Select Category'
                  placeholderStyle={{ color: '#bfc6ea' }}
                  placeholderIconColor='#007aff'
                  selectedValue={this.state.include}
                  onValueChange={(include) => this.setState({ include })}
                >
                  {['include_all', 'include_only', 'include_not'].map(item => <Picker.Item key={item} label={t(item)} value={item} />)}
                </Picker>
              </View>
            </Col>
            <View style={{ width: 10 }} />
            <Col style={{ flexDirection: 'column', justifyContent: 'flex-end', height: 80, alignItems: 'flex-end' }}>
              {count > 0 && <Text note>{count} {I18n.t('transactions')}</Text>}
              <Button rounded success onPress={() => this.search()} style={{ alignSelf: 'flex-end' }}><Text>{t('search')}</Text></Button>
            </Col>
          </CardItem>

        </Card>
      </View>
    )
  }

  renderPhone () {
    const transactions = this.state.transactions || []
    return (
      <Container style={{ backgroundColor: Colors.listBackground }}>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60 }}>
            {(transactions.length > 1 || !this.state.isRefreshing) && (
              <Button
                style={{ width: 60, height: 60 }} transparent onPress={() => {
                  this.setState({
                    isGoingBack: true
                  })
                  this.props.navigation.goBack()
                }}
              >
                <Icon color='black' name='back' type='AntDesign' />
              </Button>
            )}
            {(this.state.isGoingBack || this.state.isRefreshing) && <Spinner style={{ width: 30, alignSelf: 'center', paddingBottom: 20 }} />}
          </View>
        </Header>
        <LongTransactionList
          firstItem={this._renderSearchSection()}
          transactions={transactions}
          walletId={this.state.wallet ? this.state.wallet.id : 0}
          refreshTransactions={() => this.search()}
          getPrevMonth={() => {}}
          openTransactionDetailModal={this.openTransactionDetailModal}
        />
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
const screenHook = Screen(TransactionSearchScreen, mapStateToProps, mapDispatchToProps, [])
export default screenHook
