import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import WalletItem from '../Components/MoneyDairy/WalletItem'
import { Wallet } from '../Realm'
import autoBind from 'react-autobind'
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
    const wallets = Wallet.find()
    this.setState({ wallets })
  }

  componentWillReceiveProps (nextProps) {
    Utils.log('Wallet', nextProps)
  }

  updateTransactions () {
    const wallets = Wallet.findWithAmount()
    this.setState({ wallets })
  }

  openWalletDetailModal (wallet) {
    this.props.navigation.navigate('TransactionScreen', { wallet: wallet })
  }

  renderPhone () {
    const totalWallet = {
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
        </Content>
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
