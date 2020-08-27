import React, { Component } from 'react'
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
    this.updateTransactions()
  }

  componentWillReceiveProps (nextProps) {
    Utils.log('Wallet', nextProps)
  }

  updateTransactions () {
    const wallets = Wallet.findWithAmount()
    this.setState({ wallets })
  }

  openWalletDetailModal (wallet) {
    Utils.log('wallet', wallet)
    this.props.navigation.navigate('TransactionScreen', { wallet: wallet })
  }

  walletCreate (label, color) {

  }

  renderPhone () {
    const totalWallet = {
      id: 0,
      label: 'Total',
      amount: 0,
      income: 0,
      outcome: 0
    }
    const renderItems = this.state.wallets.map(item => {
      totalWallet.amount += item.amount
      totalWallet.income += item.income
      totalWallet.outcome += item.outcome
      return (
        <WalletItem key={item.id} item={item} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)} />
      )
    })
    return (
      <Container>
        <Content>
          <WalletItem item={totalWallet} openWalletDetailModal={(wallet) => this.openWalletDetailModal(wallet)} />
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
    transaction: state.transaction
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
