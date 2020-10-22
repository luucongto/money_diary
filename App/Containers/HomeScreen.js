// import { Images, Metrics } from '../Themes'
import { Body, Button, Container, Fab, Header, Icon, Item, Left, Right, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { ActivityIndicator, Picker } from 'react-native'
import { TabBar, TabView } from 'react-native-tab-view'
import TransactionList from '../Components/MoneyDairy/TransactionLists'
import Constants from '../Config/Constants'
import I18n from '../I18n'
import { Transaction, Wallet } from '../Realm'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import WalletRedux from '../Redux/WalletRedux'
import Api from '../Services/Api'
import { Metrics } from '../Themes'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'
class HomeScreen extends Component {
  constructor (props) {
    super(props)
    Utils.log('constructor Homescreen')
    const wallets = Wallet.findWithAmount()
    const categories = Api.category()
    const walletMapping = Utils.createMapFromArray(wallets, 'id')
    const categoryMapping = Utils.createMapFromArray(categories, 'id')
    const tabData = this._calendarChangeData(Constants.CALENDAR_TYPES.MONTH)
    this.state = {
      wallets,
      categories,
      walletMapping,
      categoryMapping,
      wallet: wallets[0].id,
      start: {},
      items: [],
      ...tabData,
      currentTransaction: null
    }
    this.calandarTypes = Object.values(Constants.CALENDAR_TYPES)
    Utils.log('constructor Homescreen 2')
    autoBind(this)
  }

  componentDidMount () {
    Utils.log('componentDidmount Homescreen')
    this.props.category()
    this.props.wallet()
  }

  openTransactionDetailModal (transaction) {
    this.props.navigation.navigate('TransactionDetailScreen', { transaction })
  }

  transactionUpdate (transaction) {
    this.props.transactionUpdateRequest(transaction)
  }

  transactionDelete (transaction) {
    this.props.transactionDeleteRequest(transaction)
  }

  transactionCreate (transaction) {
    Api.transactionCreate(transaction)
  }

  _setTabIndex (index) {
    this.setState({ tabIndex: index })
  }

  _renderTabs () {
    Utils.log('renderTabs', this.state.tabs)
    return (
      <TabView
        swipeEnabled
        navigationState={{ index: this.state.tabIndex, routes: this.state.tabs }}
        renderScene={(params) => this._renderOneTab(params)}
        onIndexChange={index => this._setTabIndex(index)}
        initialLayout={{ width: Metrics.screenWidth }}
        renderTabBar={props => <TabBar {...props} scrollEnabled tabStyle={{ width: 100 }} />}
      />
    )
  }

  _renderOneTab ({ route }) {
    const thisTabIndex = this.state.tabs.indexOf(route)
    if (Math.abs(thisTabIndex - this.state.tabIndex) > 0) {
      return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', flexDirection: 'column' }}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
    const {
      wallets,
      categories,
      walletMapping,
      categoryMapping,
      wallet
    } = this.state
    return (
      <TransactionList
        {...this.props}
        wallets={wallets}
        categories={categories}
        walletMapping={walletMapping}
        categoryMapping={categoryMapping}
        wallet={wallet}
        tab={route}
        isThisTabVisible={this.state.tabIndex === thisTabIndex}
        openTransactionDetailModal={this.openTransactionDetailModal}
      />
    )
  }

  onValueChangeWallet (value) {
    this.setState({
      wallet: value
    })
  }

  _calendarChangeData (value) {
    let items = []
    switch (value) {
      case Constants.CALENDAR_TYPES.MONTH:
        items = Transaction.getMonths()
        break
      case Constants.CALENDAR_TYPES.QUARTER:
        items = Transaction.getQuarters()
        break
      case Constants.CALENDAR_TYPES.YEAR:
        items = Transaction.getYears()
        break
    }

    const tabs = items.map(item => { return { key: `${item.from}#${item.to}`, title: item.label } })
    Utils.log('onCalendarChange', value, items, tabs)
    return {
      tabs,
      tabIndex: tabs.length - 1,
      calendarType: value
    }
  }

  onCalendarChange (value) {
    this.setState(this._calendarChangeData(value))
  }

  _renderHeader () {
    let walletChoosing = null
    if (this.state.wallets) {
      walletChoosing = (
        <Item inlineLabel>
          <Picker
            mode='dropdown'
            iosIcon={<Icon name='arrow-down' />}
            style={{ width: 280, color: '#0096c7' }}
            placeholder='Select Wallet'
            placeholderStyle={{ color: '#bfc6ea' }}
            placeholderIconColor='#007aff'
            itemTextStyle={{ color: 'red' }}
            selectedValue={this.state.wallet}
            onValueChange={this.onValueChangeWallet.bind(this)}
          >
            {this.state.wallets.map(item => <Picker.Item color='#0096c7' key={item.id} label={`${item.id === 0 ? I18n.t(item.label) : item.label} đ${Utils.numberWithCommas(item.amount)}`} value={item.id} />)}
          </Picker>
        </Item>
      )
    }
    const calendarPicker = (
      <Item picker style={{ width: 50, height: 50, justifyContent: 'center', alignContent: 'center' }}>
        <Picker
          mode='dropdown'
          style={{ width: 50, height: 50, opacity: 0, position: 'absolute', left: 0 }}
          selectedValue={this.state.calendarType}
          onValueChange={value => this.onCalendarChange(value)}
        >
          {this.calandarTypes.map(item => <Picker.Item style={{ width: 50 }} key={item} label={I18n.t(item)} value={item} />)}
        </Picker>
        <Icon name='calendar' style={{ color: '#0096c7', left: 5 }} />
      </Item>
    )
    return (
      <Header style={{ backgroundColor: 'white', paddingLeft: 0, paddingRight: 0 }}>
        <Left>
          <Button transparent onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' style={{ color: '#0096c7' }} />
          </Button>
        </Left>
        <Body stye={{ justifyContent: 'center', alignItem: 'center' }}>
          {walletChoosing}
        </Body>
        <Right>
          {calendarPicker}
        </Right>
      </Header>

    )
  }

  renderPhone () {
    Utils.log('renderhome')
    return (
      <Container>
        {this._renderHeader()}
        {this._renderTabs()}
        <Fab
          active={this.state.active}
          direction='up'
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => this.props.navigation.navigate('TransactionDetailScreen')}
        >
          <Icon name='plus-circle' type='FontAwesome' />

        </Fab>
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

const screenHook = Screen(HomeScreen, mapStateToProps, mapDispatchToProps, [])
export default screenHook
