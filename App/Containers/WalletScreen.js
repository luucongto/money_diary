import React, { Component } from 'react'
import { RefreshControl } from 'react-native'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content, View, Fab, Text, Icon } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import WalletItem from '../Components/MoneyDairy/WalletItem'
import { Wallet } from '../Realm'
import autoBind from 'react-autobind'
import WalletRedux from '../Redux/WalletRedux'
import AddWalletModal from '../Components/MoneyDairy/AddWalletModal'
class Screen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {},
      wallets: []
    }
    autoBind(this)
  }

  componentDidMount () {
    this.refresh()
  }

  componentWillReceiveProps (nextProps) {
    Utils.log('Wallet', nextProps)
    const prevProps = this.props
    if (prevProps.walletObjects !== nextProps.walletObjects) {
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
    const renderItems = this.state.wallets.map(item => {
      return (
        <WalletItem key={item.id} item={item} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)} />
      )
    })
    return (
      <Container>
        <Content
          refreshControl={
            <RefreshControl refreshing={this.props.fetching} onRefresh={this.refresh.bind(this)} />
          }
        >
          {renderItems}
          <View style={{ height: 50 }} />
        </Content>

        <AddWalletModal
          setRef={(ref) => { this.addWalletModalRef = ref }}
          walletCreate={this.walletCreate.bind(this)}
        />

        <Fab
          active={this.state.active}
          direction='up'
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => this.addWalletModalRef.setModalVisible(true)}
        >
          <Icon name='plus-square' type='FontAwesome' />
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
    transaction: state.transaction,
    fetching: state.wallet.fetching,
    walletObjects: state.wallet.objects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    walletCreate: (params) => dispatch(WalletRedux.walletCreateRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
