import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from './Utils'
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
    this.setState({ wallets: Wallet.find() })
  }

  updateTransactions () {
    const wallets = Wallet.find()
    this.setState({ wallets })
  }

  renderPhone () {
    const renderItems = this.state.wallets.map(item => {
      return (
        <WalletItem key={item.id} item={item} />
      )
    })
    return (
      <Container>
        <Content>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
