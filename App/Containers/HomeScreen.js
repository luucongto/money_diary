import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content, ListItem, Text } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import TransactionComponent from '../Components/MoneyDairy/TransactionComponent'
import AddTransaction from '../Components/MoneyDairy/AddTransaction'
import TransactionRedux from '../Redux/TransactionRedux'
import { Transaction, Wallet, Category } from '../Realm'
import autoBind from 'react-autobind'
import TransactionDetailModal from '../Components/MoneyDairy/TransactionDetailModal'
class Screen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {},
      items: [],
      currentTransaction: null
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

  refreshTransactions () {
    this.props.transactionRequest()
  }

  openTransactionDetailModal (transaction) {
    this.setState({ currentTransaction: transaction }, () => {
      this.transactionDetailModalRef.setModalVisible(true)
    })
  }

  transactionUpdate (transaction) {
    this.props.transactionUpdateRequest(transaction)
  }

  renderPhone () {
    let lastDate = null
    const renderItems = this.state.items.map(item => {
      const date = Utils.getDate(item.date)
      const itemView = (
        <TransactionComponent
          key={item.id}
          transaction={item}
          wallets={this.state.wallets}
          categories={this.state.categories}
          refreshTransactions={this.refreshTransactions}
          openTransactionDetailModal={this.openTransactionDetailModal.bind(this)}
        />)
      if (lastDate !== date) {
        lastDate = date
        return (
          <View>
            <ListItem itemDivider>
              <Text>{date}</Text>
            </ListItem>
            {itemView}
          </View>
        )
      }
      return itemView
    })
    return (
      <Container>
        <Content>
          {renderItems}
        </Content>
        <TransactionDetailModal
          transaction={this.state.currentTransaction}
          setRef={(ref) => { this.transactionDetailModalRef = ref }}
          wallets={this.state.wallets}
          categories={this.state.categories}
          refreshTransactions={this.refreshTransactions}
          transactionUpdate={this.transactionUpdate.bind(this)}
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
    transaction: state.transaction
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transactionRequest: (params) => dispatch(TransactionRedux.transactionRequest(params)),
    transactionUpdateRequest: (params) => dispatch(TransactionRedux.transactionUpdateRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
