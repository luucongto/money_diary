import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import ListItem from '../Components/MoneyDairy/ListItem'
import AddTransaction from '../Components/MoneyDairy/AddTransaction'
import TransactionRedux from '../Redux/TransactionRedux'
import { Transaction, Wallet, Category } from '../Realm'
import autoBind from 'react-autobind'
class Screen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {},
      items: []
    }
    autoBind(this)
  }

  componentDidMount () {
    Wallet.initializeDatas()
    Category.initializeDatas()
    Transaction.initializeTransactions()
    this.setState({ wallets: Wallet.find(), categories: Category.find() })
    this.props.transactionRequest()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transaction.data) {
      this.setState({ items: nextProps.transaction.data })
    }
  }

  updateTransactions () {
    const items = Transaction.getbyPeriod(Utils.startOf(), Utils.endOf())
    this.setState({ items })
  }

  renderPhone () {
    const renderItems = this.state.items.map(item => {
      return (
        <ListItem key={item.id} transaction={item} wallets={this.state.wallets} categories={this.state.categories} updateTransactions={this.updateTransactions} />
      )
    })
    return (
      <Container>
        <Content>
          <AddTransaction wallets={this.state.wallets} categories={this.state.categories} updateTransactions={this.updateTransactions} />
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
    transactionRequest: (params) => dispatch(TransactionRedux.transactionRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
