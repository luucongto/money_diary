import { Body, Button, Container, Content, ListItem, Right, Row, Spinner, Text, View } from 'native-base'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { FlatList, RefreshControl } from 'react-native'
// import I18n from 'react-native-i18n'
import Utils from '../../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import _ from 'lodash'
import { TransactionCardAddComponent, TransactionCardItem, TransactionMonthTag } from './TransactionCardItem'
import { Colors } from '../../Themes'
import Wallet from '../../Realm/Wallet'
import Category from '../../Realm/Category'
import Animated, { Easing, Value } from 'react-native-reanimated'
import I18n from '../../I18n'

class TransactionList extends Component {
  propTypes = {
    transaction: PropTypes.object.isRequired,
    openTransactionDetailModal: PropTypes.func.isRequired,
    wallet: PropTypes.string
  }

  constructor (props) {
    super(props)
    const preprocessTransactions = this.preprocessTransactions(props.transaction)
    this.state = {
      preprocessTransactions,
      ...this.appendData(preprocessTransactions),
      amount: 0,
      income: 0,
      outcome: 0,
      currentTransaction: null
    }
    this.walletObjects = Utils.createMapFromArray(Wallet.find(), 'id')
    this.categoryObjects = Utils.createMapFromArray(Category.find(), 'id')
    this.bottomPanelShow = new Value(0)
    autoBind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transactions !== this.props.transactions) {
      const preprocessTransactions = this.preprocessTransactions(nextProps.transactions)
      this.setState({
        preprocessTransactions,
        ...this.appendData(preprocessTransactions)
      })
    }
  }

  preprocessTransactions (transactions) {
    let result = [{
      type: 'addnew'
    }]
    Utils.log('processedTransactions 1', transactions)
    if (!transactions || !transactions.length) return result
    const stickIndices = [0]
    const groups = _.groupBy(transactions, item => item.monthTag)
    _.each(groups, (items, monthTag) => {
      const monthTagItem = {
        type: 'monthTag',
        title: monthTag,
        count: items.length,
        income: 0,
        outcome: 0
      }
      items.forEach(item => {
        monthTagItem.income += item.include && item.amount > 0 ? item.amount : 0
        monthTagItem.outcome += item.include && item.amount < 0 ? item.amount : 0
      })
      monthTagItem.amount = monthTagItem.income + monthTagItem.outcome
      result.push(monthTagItem)
      stickIndices.push(result.length - 1)
      result = result.concat(items)
    })
    Utils.log('processedTransactions', transactions, result)
    return result
  }

  appendData (transactions, currentRenderCount = 0) {
    const renderItems = transactions.slice(0, currentRenderCount + 20)
    const stickIndices = [0]
    renderItems.forEach((item, index) => {
      if (item.type === 'monthTag') {
        stickIndices.push(index)
      }
    })
    Utils.log('appendData', transactions, currentRenderCount, renderItems, stickIndices)
    return {
      renderItems,
      stickIndices
    }
  }

  refresh () {
    this.props.refreshTransactions()
  }

  _renderItem (item, index) {
    if (index === 0) {
      return (
        <TransactionCardAddComponent
          transactionCreateRequest={this.props.transactionCreateRequest}
          wallet={this.walletObjects[this.props.walletId]} walletId={this.props.walletId} category={this.props.category}
          callback={() => this.refresh()}
        />
      )
    }
    if (item.type === 'monthTag') {
      return (
        <TransactionMonthTag
          {...item}
        />
      )
    }
    const itemView = (
      <TransactionCardItem
        key={item.id}
        index={index}
        transaction={item}
        wallet={this.walletObjects[item.wallet]}
        category={this.categoryObjects[item.category]}
        openTransactionDetailModal={this.props.openTransactionDetailModal}
        transactionDeleteRequest={this.props.transactionDeleteRequest}
        transactionUpdateRequest={this.props.transactionUpdateRequest}
        refresh={this.refresh}
      />)

    return itemView
  }

  handleScroll ({ nativeEvent }) {
    const { y } = nativeEvent.contentOffset
    if (y > 500 && !this.state.isShowBottomPanel) {
      this.setState({
        isShowBottomPanel: true
      })
      Animated.timing(this.bottomPanelShow, {
        toValue: 1,
        duration: 300,
        easing: Easing.quad
      }).start()
    } else if (y < 500 && this.state.isShowBottomPanel) {
      this.setState({
        isShowBottomPanel: false
      })
      Animated.timing(this.bottomPanelShow, {
        toValue: 0,
        duration: 300,
        easing: Easing.quad
      }).start()
    }
  }

  renderPhone () {
    const transactions = this.state.renderItems || []
    return (
      <Container>
        <FlatList
          ref={ref => { this.flatListRef = ref }}
          style={{ backgroundColor: Colors.listBackground }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
          data={transactions}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          getItemLayout={(data, index) => (
            { length: 160, offset: 160 * index, index }
          )}
          stickyHeaderIndices={this.state.stickIndices}
          onEndReached={() => {
            if (this.state.renderItems.length < this.state.preprocessTransactions.length) {
              Utils.log('onEndReached', this.state.renderItems.length)
              this.setState(this.appendData(this.state.preprocessTransactions, this.state.renderItems.length))
            }
          }}
          ListFooterComponent={(
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
              <Spinner />
            </View>
          )}
          onScroll={(event) => this.handleScroll(event)}
        />
        <Animated.View
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
            position: 'absolute',
            paddingBottom: 10,
            bottom: this.bottomPanelShow.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0]
            })

          }}
        >
          <Button
            info rounded style={{ width: '40%', justifyContent: 'center' }}
            onPress={() => this.flatListRef.scrollToIndex({
              index: 0
            })}
          ><Text>{I18n.t('sroll_to_top')}</Text>
          </Button>
          <Button
            success rounded style={{ width: '40%', justifyContent: 'center' }}
            onPress={() => this.refresh()}
          ><Text>{I18n.t('refresh')}</Text>
          </Button>
        </Animated.View>
      </Container>
    )
  }

  render () {
    return this.renderPhone()
  }
}

export default TransactionList
