import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Icon, Fab, View } from 'native-base'
import { TabView, TabBar } from 'react-native-tab-view'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
import { Metrics } from '../Themes'
// Styles
// import styles from './Styles/LaunchScreenStyles'
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
    const walletMapping = Utils.createMapFromArray(wallets, 'id')
    const categoryMapping = Utils.createMapFromArray(categories, 'id')
    this.state = {
      wallets,
      categories,
      walletMapping,
      categoryMapping,
      start: {},
      items: [],
      tabIndex: tabs.length - 1,
      tabs,
      currentTransaction: null
    }
    autoBind(this)
  }

  openTransactionDetailModal (transaction) {
    Utils.log('openTransactionDetailModal', transaction)
    this.setState({ currentTransaction: transaction }, () => {
      this.transactionDetailModalRef.setModalVisible(true)
    })
  }

  transactionUpdate (transaction) {
    this.props.transactionUpdateRequest(transaction)
  }

  transactionDelete (transaction) {
    this.props.transactionDeleteRequest(transaction)
  }

  transactionCreate (transaction) {
    this.props.transactionCreateRequest(transaction)
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
    if (Math.abs(this.tabIndex - this.state.tabIndex) > 2) {
      return <View />
    }
    const {
      wallets,
      categories,
      walletMapping,
      categoryMapping
    } = this.state
    return (
      <TransactionList
        {...this.props}
        wallets={wallets}
        categories={categories}
        walletMapping={walletMapping}
        categoryMapping={categoryMapping}
        tab={route}
        isThisTabVisible={this.state.tabIndex === thisTabIndex}
        openTransactionDetailModal={this.openTransactionDetailModal}
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
          transactionDelete={this.transactionDelete.bind(this)}
          transactionUpdate={this.transactionUpdate.bind(this)}
        />
        <TransactionDetailModal
          setRef={(ref) => { this.addTransactionModalRef = ref }}
          wallets={this.state.wallets}
          categories={this.state.categories}
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
          <Icon name='plus-circle' type='FontAwesome' />

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
    transactionParams: state.transaction.params,
    transactionUpdateObjects: state.transaction.updateObjects,
    transactionDeleteObjects: state.transaction.deleteObjects
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
