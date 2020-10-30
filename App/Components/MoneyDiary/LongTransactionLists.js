import { Button, Container, Text } from 'native-base'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { FlatList, RefreshControl } from 'react-native'
import Animated, { Easing, Value } from 'react-native-reanimated'
import I18n from '../../I18n'
import Api from '../../Services/Api'
import { Colors } from '../../Themes'
// import I18n from 'react-native-i18n'
import Utils from '../../Utils/Utils'
// Styles
// import styles from './Styles/LaunchScreenStyles'
import { TransactionCardAddComponent, TransactionCardItem, TransactionMonthTag } from './TransactionCardItem'
class TransactionList extends Component {
  propTypes = {
    transaction: PropTypes.object.isRequired,
    openTransactionDetailModal: PropTypes.func.isRequired,
    wallet: PropTypes.string
  }

  constructor (props) {
    super(props)
    const preprocessTransactions = props.transactions
    this.state = {
      preprocessTransactions,
      ...this.appendData(preprocessTransactions),
      amount: 0,
      income: 0,
      outcome: 0,
      currentTransaction: null
    }
    this.walletObjects = Utils.createMapFromArray(Api.wallet(), 'id')
    this.categoryObjects = Utils.createMapFromArray(Api.category(), 'id')
    this.bottomPanelShow = new Value(0)
    autoBind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.transactions !== this.props.transactions) {
      this.setState({
        ...this.appendData(nextProps.transactions)
      })
    }
  }

  appendData (transactions) {
    const stickIndices = []
    transactions.forEach((item, index) => {
      if (item.type === 'monthTag' || item.type === 'addnew') {
        stickIndices.push(index)
      }
    })
    return {
      stickIndices
    }
  }

  refresh () {
    this.props.refreshTransactions()
  }

  _renderItem (item, index) {
    if (index === 0) {
      return this.props.firstItem || (
        <TransactionCardAddComponent
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
    Utils.log('render transaction', index, item)
    const itemView = (
      <TransactionCardItem
        key={item.id}
        index={index}
        transaction={item}
        wallet={this.walletObjects[item.wallet]}
        category={this.categoryObjects[item.category]}
        openTransactionDetailModal={this.props.openTransactionDetailModal}
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
    const transactions = this.props.transactions
    Utils.log('longtransactionlist length', transactions.length)
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
          // getItemLayout={(data, index) => (
          //   { length: 160, offset: 160 * index, index }
          // )}
          stickyHeaderIndices={this.state.stickIndices}
          onEndReached={() => {
            this.props.getPrevMonth()
            // if (this.state.renderItems.length < this.state.preprocessTransactions.length) {
            //   Utils.log('onEndReached', this.state.renderItems.length)
            //   this.setState(this.appendData(this.state.preprocessTransactions, this.state.renderItems.length))
            // } else if (this.state.renderItems.length) {
            // }
          }}
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
          ><Text>{I18n.t('scroll_to_top')}</Text>
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
