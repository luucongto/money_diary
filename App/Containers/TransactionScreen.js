import React, { Component } from 'react'
import { SectionList } from 'react-native'
import { connect } from 'react-redux'
// import { Images, Metrics } from '../Themes'
import { Container, Content, ListItem, Text, Fab, Icon, Button, Header, Left, Body, Title } from 'native-base'
// import I18n from 'react-native-i18n'
import Utils from '../Utils/Utils'
// Styles
import TransactionComponent from '../Components/MoneyDairy/TransactionComponent'
import TransactionRedux from '../Redux/TransactionRedux'
import { Wallet, Category } from '../Realm'
import autoBind from 'react-autobind'
import TransactionDetailModal from '../Components/MoneyDairy/TransactionDetailModal'
import _ from 'lodash'

class TransactionScreen extends Component {
  constructor (props) {
    super(props)
    const { wallet, category, useWalletTitle } = props?.route?.params
    this.state = {
      start: {},
      items: [],
      currentTransaction: null,
      wallet,
      category,
      useWalletTitle
    }
    Utils.log('TransactionScreen', props)
    autoBind(this)
  }

  componentDidMount () {
    const wallets = Wallet.find()
    const categories = Category.find()
    const walletMapping = Utils.createMapFromArray(wallets, 'id')
    const categoryMapping = Utils.createMapFromArray(categories, 'id')
    this.setState({ wallets, categories, walletMapping, categoryMapping })
    this.refreshTransactions()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transaction.data) {
      this.setState({ items: this._groupTransactionByDate(nextProps.transaction.data) })
    }
  }

  _groupTransactionByDate (items) {
    const result = []
    const groups = _.groupBy(items, item => Utils.getDate(item.date))
    _.each(groups, (v, k) => {
      result.push({
        title: k,
        data: v
      })
    })
    return result
  }

  refreshTransactions () {
    const findConditions = {}
    if (this.state.wallet && this.state.wallet.id) {
      findConditions.wallet = this.state.wallet.id
    }
    if (this.state.category && this.state.category.id) {
      findConditions.category = this.state.category.id
    }
    Utils.log('transactionScreen findConditions', findConditions)
    this.props.transactionRequest(findConditions)
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

  _renderItem ({ item, index }) {
    const itemView = (
      <TransactionComponent
        key={item.id}
        transaction={item}
        wallets={this.props.wallets}
        categories={this.categories.categories}
        walletMapping={this.state.walletMapping}
        categoryMapping={this.state.categoryMapping}
        refreshTransactions={this.refreshTransactions}
        openTransactionDetailModal={this.openTransactionDetailModal.bind(this)}
        useWalletTitle={this.state.useWalletTitle}
      />)

    return itemView
  }

  renderPhone () {
    Utils.log('items', this.state.items, this.state.walletMapping)
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.wallet ? this.state.wallet.label : this.state.category.label}</Title>
            <Title note>{this.state.items.length}</Title>
          </Body>
        </Header>
        <Content>
          <SectionList
            sections={this.state.items}
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderItem.bind(this)}
            renderSectionHeader={({ section: { title } }) => (
              <ListItem itemDivider>
                <Text>{title}</Text>
              </ListItem>
            )}
          />
        </Content>
        <TransactionDetailModal
          transaction={this.state.currentTransaction}
          setRef={(ref) => { this.transactionDetailModalRef = ref }}
          wallets={this.props.wallets}
          categories={this.props.categories}
          refreshTransactions={this.refreshTransactions}
          transactionDelete={this.transactionDelete.bind(this)}
          transactionUpdate={this.transactionUpdate.bind(this)}
        />
        <TransactionComponent
          setRef={(ref) => { this.addTransactionModalRef = ref }}
          wallets={this.props.wallets}
          categories={this.props.categories}
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
    transaction: state.transaction,
    categories: state.category.data,
    wallets: state.wallet.data
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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionScreen)
