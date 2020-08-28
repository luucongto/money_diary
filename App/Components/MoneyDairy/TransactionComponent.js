import React, { Component } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, ListItem, Grid, Col, Row } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Utils from '../../Utils/Utils'
import autoBind from 'react-autobind'
export default class TransactionComponent extends Component {
  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      transaction
    }
    autoBind(this)
  }

  setDate (newDate) {
    this.setState({ date: newDate })
  }

  componentWillReceiveProps (nextProp) {
    if (nextProp.transaction) {
      const transaction = nextProp.transaction
      this.setState({
        transaction: transaction
      })
    }
  }

  _renderNormal () {
    const transaction = this.state.transaction
    if (!transaction) {
      return null
    }
    const categoryItem = this.props.categoryMapping[transaction.category]
    const walletItem = this.props.walletMapping[transaction.wallet]
    return (
      <ListItem
        onPress={() => this.props.openTransactionDetailModal(transaction)}
        noIndent style={{ opacity: transaction.include ? 1 : 0.15, paddingTop: 0, paddingBottom: 0 }}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            backgroundColor: walletItem ? walletItem.color : 'black',
            width: 5,
            height: '100%'
          }}
        />
        <Grid style={{ marginTop: 5, marginBottom: 5 }}>
          <Row>
            <Col style={{ justifyContent: 'flex-start', alignContent: 'flex-start' }}>
              {this.props.useWalletTitle
                ? <Text style={{ color: walletItem.color || 'black', alignSelf: 'flex-start' }}>{walletItem.label || 'Error'}</Text>
                : <Text style={{ color: categoryItem ? categoryItem.color : 'black', alignSelf: 'flex-start' }}>{categoryItem ? categoryItem.label : 'Error'}</Text>}

            </Col>

            <Col>
              <Text note style={{ textAlign: 'right', color: transaction.amount > 0 ? 'green' : 'red', alignSelf: 'flex-end' }}>{Utils.numberWithCommas(transaction.amount)}</Text>
            </Col>
          </Row>
          <Text style={{ alignSelf: 'flex-start' }} note>{transaction.note}</Text>
          <Row />

        </Grid>

      </ListItem>

    )
  }

  render () {
    return this._renderNormal()
  }
}
