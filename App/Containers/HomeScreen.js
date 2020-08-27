import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Text, Fab } from 'native-base'
import { TabView, TabBar } from 'react-native-tab-view'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import { Metrics } from '../Themes'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import AddTransactionModal from '../Components/MoneyDairy/AddTransactionModal'
import TransactionRedux from '../Redux/TransactionRedux'
import { Transaction, Wallet, Category } from '../Realm'
import autoBind from 'react-autobind'
import TransactionDetailModal from '../Components/MoneyDairy/TransactionDetailModal'
import TransactionList from '../Components/MoneyDairy/TransactionLists'
class Screen extends Component {
  constructor (props) {
    super(props)
    const months = Transaction.getMonths()
    const tabs = months.map(month => { return { key: month, title: month } })
    const wallets = Wallet.find()
    const categories = Category.find()
    const walletColorsMapping = Utils.createMapFromArray(wallets, 'label', 'color')
    const categoryColorsMapping = Utils.createMapFromArray(categories, 'label', 'color')
    this.state = {
      wallets,
      categories,
      walletColorsMapping,
      categoryColorsMapping,
      start: {},
      items: [],
      tabIndex: tabs.length - 1,
      tabs,
      currentTransaction: null
    }
    autoBind(this)
  }

  openTransactionDetailModal (transaction) {
    this.setState({ currentTransaction: transaction }, () => {
      this.transactionDetailModalRef.setModalVisible(true)
    })
  }

  transactionUpdate (transaction) {
    this.props.transactionUpdateRequest(transaction)
    setTimeout(() => this.refreshTransactions(), 100)
  }

  transactionDelete (transaction) {
    this.props.transactionDeleteRequest(transaction)
    setTimeout(() => this.refreshTransactions(), 100)
  }

  transactionCreate (transaction) {
    this.props.transactionCreateRequest(transaction)
    setTimeout(() => this.refreshTransactions(), 100)
  }

  _setTabIndex (index) {
    this.setState({ tabIndex: index })
  }

  _renderTabs () {
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
    const {
      wallets,
      categories,
      walletColorsMapping,
      categoryColorsMapping
    } = this.state
    return (
      <TransactionList
        {...this.props}
        wallets={wallets}
        categories={categories}
        walletColorsMapping={walletColorsMapping}
        categoryColorsMapping={categoryColorsMapping}
        tab={route}
        isThisTabVisible={this.state.tabIndex === thisTabIndex}
      />
    )
  }

  renderPhone () {
    return (
      <Container>
        {this._renderTabs()}
        <TransactionDetailModal
          transaction={this.state.currentTransaction}
          setRef={(ref) => { this.transactionDetailModalRef = ref }}
          wallets={this.state.wallets}
          categories={this.state.categories}
          refreshTransactions={this.refreshTransactions}
          transactionDelete={this.transactionDelete.bind(this)}
          transactionUpdate={this.transactionUpdate.bind(this)}
        />
        <AddTransactionModal
          setRef={(ref) => { this.addTransactionModalRef = ref }}
          wallets={this.state.wallets}
          categories={this.state.categories}
          refreshTransactions={this.refreshTransactions}
          transactionCreate={this.transactionCreate.bind(this)}
        />
        <Fab
          active={this.state.active}
          direction='up'
          containerStyle={{ }}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={() => this.addTransactionModalRef.setModalVisible(true)}
        >
          <Text>+</Text>

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
    transactions: state.transaction.data,
    transactionParams: state.transaction.params
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    transactionRequest: (params) => dispatch(TransactionRedux.transactionRequest(params)),
    transactionUpdateRequest: (params) => dispatch(TransactionRedux.transactionUpdateRequest(params)),
    transactionDeleteRequest: (params) => dispatch(TransactionRedux.transactionDeleteRequest(params)),
    transactionCreateRequest: (params) => dispatch(TransactionRedux.transactionCreateRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
