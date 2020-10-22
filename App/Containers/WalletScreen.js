// import { Images, Metrics } from '../Themes'
import { Button, Container, Content, Fab, Icon, Label, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { RefreshControl } from 'react-native'
import ScreenHeader from '../Components/MoneyDairy/ScreenHeader'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import { WalletAddComponent, WalletItem } from '../Components/MoneyDairy/WalletItem'
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

  refresh () {
    const wallets = Api.wallet()
    Utils.log('Wallet Updates', wallets)
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
    this.setState({ wallets: [totalWallet].concat(wallets) })
  }

  openWalletDetailModal (wallet) {
    Utils.log('wallet', wallet)
    this.props.navigation.navigate('TransactionScreen', { wallet: wallet })
  }

  walletCreate (params) {
    Api.walletCreate(params)
    this.refresh()
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  transactionCreateRequest (transaction) {
    Api.transactionCreate(transaction)
    this.refresh()
  }

  renderPhone () {
    Utils.log('wallets', this.state.wallets)
    const renderItems = this.state.wallets.filter(each => each.countInTotal).map((item, index) => {
      return (
        <WalletItem
          editing={this.state.editing}
          key={item.id} item={item} index={index} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)}
          transactionCreateRequest={this.transactionCreateRequest.bind(this)}
          refresh={() => this.refresh()}
        />
      )
    })
    const renderUncountedItems = this.state.wallets.filter(each => !each.countInTotal).map((item, index) => {
      return (
        <WalletItem
          editing={this.state.editing}
          key={item.id} item={item} index={index} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)}
          transactionCreateRequest={this.transactionCreateRequest.bind(this)}
          refresh={() => this.refresh()}
        />
      )
    })
    return (
      <Container>
        <ScreenHeader
          navigation={this.props.navigation} title={I18n.t('wallet')}
          right={(
            <Button transparent onPress={() => this.toggleEdit()}>
              <Icon name='edit' type='FontAwesome' style={{ color: '#0096c7' }} />
            </Button>)}
        />
        <Content
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
          style={{
            paddingTop: 10,
            backgroundColor: Colors.listBackground
          }}
        >
          {renderItems}
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
          {renderUncountedItems}
          <WalletAddComponent walletCreate={this.walletCreate.bind(this)} />
          <View style={{ height: 80 }} />
        </Content>
        <Fab
          direction='up'
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => this.props.navigation.navigate('TransactionDetailScreen')}
        >
          <Icon name='plus' type='FontAwesome' />
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
