// import { Images, Metrics } from '../Themes'
import { Container, Content, Fab, Icon, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { RefreshControl } from 'react-native'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import { WalletItem, WalletAddComponent } from '../Components/MoneyDairy/WalletItem'
import ScreenHeader from '../Components/MoneyDairy/ScreenHeader'
import { Wallet } from '../Realm'
import TransactionRedux from '../Redux/TransactionRedux'
import WalletRedux from '../Redux/WalletRedux'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import Screen from './Screen'
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
    Utils.log('Wallet', nextProps)
    const prevProps = this.props
    if ((nextProps.isFocused && prevProps.isFocused !== nextProps.isFocused) || prevProps.walletObjects !== nextProps.walletObjects) {
      this.refresh()
    }
  }

  refresh () {
    Utils.log('Wallet Updates')
    const wallets = Wallet.findWithAmount()
    this.setState({ wallets })
  }

  openWalletDetailModal (wallet) {
    Utils.log('wallet', wallet)
    this.props.navigation.navigate('TransactionScreen', { wallet: wallet })
  }

  walletCreate (params) {
    this.props.walletCreate(params)
  }

  renderPhone () {
    const renderItems = this.state.wallets.map((item, index) => {
      return (
        <WalletItem
          key={item.id} item={item} index={index} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)}
          transactionCreateRequest={this.props.transactionCreateRequest}
          refresh={() => this.refresh()}
        />
      )
    })
    return (
      <Container>
        <ScreenHeader navigation={this.props.navigation} title='Wallet' />
        <Content
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
          style={{
            paddingTop: 10,
            backgroundColor: '#f0efeb'
          }}
        >
          {renderItems}
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
    fetching: state.wallet.fetching,
    walletObjects: state.wallet.objects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    walletCreate: (params) => dispatch(WalletRedux.walletCreateRequest(params)),
    transactionCreateRequest: (params) => dispatch(TransactionRedux.transactionCreateRequest(params))
  }
}
const screenHook = Screen(WalletScreen, mapStateToProps, mapDispatchToProps, ['transaction', 'category', 'wallet'])
export default screenHook
