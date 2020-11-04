import { Button, Container, Icon, Spinner, Text } from 'native-base'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { FlatList, RefreshControl, View } from 'react-native'
import Animated, { Easing, Value } from 'react-native-reanimated'
import I18n from '../../I18n'
import Api from '../../Services/Api'
import { ApplicationStyles, Colors } from '../../Themes'
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
      if (index === 0 || item.type === 'monthTag' || item.type === 'addnew' || item.type === 'summary') {
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

  _renderSummary (item) {
    const { total, count, income, outcome, amount } = item
    const uncount = total - count
    Utils.log('-----summary', item)
    return (
      <View style={{ ...ApplicationStyles.components.card, height: 110, marginBottom: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{
            borderBottomWidth: 1,
            borderColor: '#666666',
            marginBottom: 5
          }}
          >{total} {I18n.t('transactions')}
          </Text>
          <Text><Icon name='checksquareo' type='AntDesign' style={{ color: 'green' }} /> {count}</Text>
          <Text><Icon name='minussquareo' type='AntDesign' style={{ color: 'gray' }} /> {uncount}</Text>

        </View>

        <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
          <Text style={{ color: 'green', alignSelf: 'flex-end' }}>
            {Utils.numberWithCommas(income)} <Icon name='download' type='AntDesign' style={{ fontSize: 15, color: 'green' }} />
          </Text>
          <Text style={{ color: 'red', alignSelf: 'flex-end' }}>
            {Utils.numberWithCommas(Math.abs(outcome))} <Icon name='upload' type='AntDesign' style={{ fontSize: 15, color: 'red' }} />
          </Text>
          <Text
            style={{
              borderTopWidth: 1,
              borderTopColor: '#666666',
              paddingRight: 20,
              color: amount > 0 ? 'green' : 'red',
              alignSelf: 'flex-end'
            }}
          >{Utils.numberWithCommas(amount)}
          </Text>
        </View>
      </View>
    )
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
    if (item.type === 'summary') {
      return this._renderSummary(item)
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
    Utils.log('LongTransactionList', this.state.stickIndices, transactions.length)
    return (
      <Container>
        <FlatList
          ref={ref => { this.flatListRef = ref }}
          style={{ backgroundColor: Colors.red }}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={this.refresh.bind(this)} />
          }
          data={transactions}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.3}
          // getItemLayout={(data, index) => (
          //   { length: 160, offset: 160 * index, index }
          // )}
          ListFooterComponent={() => {
            return (
              <View style={{ height: 80 }}>
                {!this.props.isEnded && <Spinner />}
              </View>
            )
          }}
          stickyHeaderIndices={this.state.stickIndices}
          onEndReached={() => {
            this.props.getPrevMonth()
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
