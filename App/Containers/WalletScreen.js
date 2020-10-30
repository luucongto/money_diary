// import { Images, Metrics } from '../Themes'
import lodash from 'lodash'
import { Button, Container, Fab, Icon, Label, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import ScreenHeader from '../Components/MoneyDiary/ScreenHeader'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import { WalletAddComponent, WalletItem } from '../Components/MoneyDiary/WalletItem'
import Constants from '../Config/Constants'
import I18n from '../I18n'
import Api from '../Services/Api'
import { Colors } from '../Themes'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'
const t = I18n.t
class WalletScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {},
      wallets: []
    }
    autoBind(this)
  }

  shouldComponentUpdate (props) {
    return props.isFocused
  }

  componentDidMount () {
    this.refresh()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isFocused && !this.props.isFocused) {
      this.refresh()
    }
  }

  refresh () {
    const wallets = Api.wallet()
    this._sortWallets(wallets)
  }

  _sortWallets (wallets) {
    const totalWallet = {
      id: Constants.DEFAULT_WALLET_ID,
      label: Constants.DEFAULT_WALLET_ID,
      color: '#cce2ed',
      position: 0,
      countInTotal: true,
      income: 0,
      amount: 0,
      outcome: 0,
      count: 0,
      lastUpdate: 0
    }
    wallets.forEach(wallet => {
      if (!wallet.countInTotal) return
      totalWallet.amount += wallet.amount
      totalWallet.income += wallet.income
      totalWallet.outcome += wallet.outcome
      totalWallet.count += wallet.count
      totalWallet.lastUpdate = totalWallet.lastUpdate < wallet.lastUpdate ? wallet.lastUpdate : totalWallet.lastUpdate
    })
    let sortedWallets = [totalWallet]
    sortedWallets = sortedWallets.concat(lodash.sortBy(lodash.filter(wallets, wallet => wallet.countInTotal), ['position']))
    sortedWallets.push({ id: 'separate', isSeparated: true })
    sortedWallets = sortedWallets.concat(lodash.sortBy(lodash.filter(wallets, wallet => !wallet.countInTotal), ['position']))
    sortedWallets.push({ id: 'create', isCreate: true })
    Utils.log('Wallet Updates', sortedWallets)
    this.setState({ wallets: sortedWallets })
  }

  openWalletDetailModal (wallet) {
    this.props.navigation.navigate('TransactionScreen', { wallet: wallet })
  }

  walletCreate (params) {
    Api.walletCreate(params)
    setTimeout(() => {
      this.refresh()
    }, 1000)
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  transactionCreateRequest (transaction) {
    Api.transactionCreate(transaction)
    this.refresh()
  }

  renderItem ({ item, index, drag, isActive }) {
    if (item.isSeparated) {
      return (
        <View style={{
          height: 50,
          paddingHorizontal: 20,
          marginBottom: 10,
          backgroundColor: 'white',
          justifyContent: 'center',
          borderColor: '#999999',
          elevation: 5
        }}
        >
          <Label>{t('uncounted_wallets')}</Label>
        </View>
      )
    }
    if (item.isCreate) {
      return <WalletAddComponent walletCreate={this.walletCreate.bind(this)} />
    }
    const display = (
      <WalletItem
        isActive={isActive}
        editing={this.state.editing}
        key={item.id} item={item} index={index} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)}
        transactionCreateRequest={this.transactionCreateRequest.bind(this)}
        refresh={() => this.refresh()}
      />)
    if (index === 0 || !this.state.editing) {
      return display
    }
    return (
      <TouchableWithoutFeedback onLongPress={drag}>
        {display}
      </TouchableWithoutFeedback>
    )
  }

  renderPhone () {
    return (
      <Container>
        <ScreenHeader
          navigation={this.props.navigation} title={I18n.t('wallet')}
          right={(
            <View style={{ flexDirection: 'row' }}>
              <Button transparent onPress={() => this.props.navigation.navigate('TransactionSearchScreen')}>
                <Icon name='search' type='FontAwesome' style={{ color: '#0096c7' }} />
              </Button>
              <Button transparent onPress={() => this.toggleEdit()}>
                <Icon name='edit' type='FontAwesome' style={{ color: '#0096c7' }} />
              </Button>
            </View>)}
        />
        <DraggableFlatList
          style={{
            paddingTop: 10,
            backgroundColor: Colors.listBackground
          }}
          data={this.state.wallets}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => `draggable-item-${item.id}`}
          onDragEnd={({ data }) => {
            Utils.log('===============new data', data)
            let indexOfSeparate = data.length
            let hasUpdate = false
            data.forEach((wallet, index) => {
              if (wallet.isSeparated) {
                indexOfSeparate = index
              }
              if (wallet.id === Constants.DEFAULT_WALLET_ID || wallet.isCreate || wallet.isSeparated || wallet.position === index) {
                return
              }
              hasUpdate = true
              Api.walletUpdate({
                id: wallet.id,
                position: index,
                countInTotal: index < indexOfSeparate
              })
            })
            this.setState({ wallets: data }, () => {
              if (hasUpdate) {
                this.refresh()
              }
            })
          }}
        />
        <Fab
          direction='up'
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => this.refresh()}
        >
          <Icon name='refresh' type='FontAwesome' />
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
const screenHook = Screen(WalletScreen, mapStateToProps, mapDispatchToProps, [])
export default screenHook
