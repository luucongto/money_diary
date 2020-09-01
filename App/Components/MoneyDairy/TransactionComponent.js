import { Col, Grid, ListItem, Row, Text, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Utils from '../../Utils/Utils'
import PropTypes from 'prop-types'
class TransactionComponent extends Component {
  propTypes = {
    transaction: PropTypes.object.isRequired,
    openTransactionDetailModal: PropTypes.func.isRequired,
    categoryItem: PropTypes.object.isRequired,
    walletItem: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    const transaction = this.props.transaction
    this.state = {
      transaction
    }
    autoBind(this)
  }

  static getDerivedStateFromProps (nextProps, state) {
    if (nextProps.transaction) {
      const transaction = nextProps.transaction
      return { ...state, transaction }
    }
    return state
  }

  _setDate (newDate) {
    this.setState({ date: newDate })
  }

  _renderNormal () {
    const transaction = this.state.transaction
    if (!transaction) {
      return null
    }
    const categoryItem = this.props.categoryItem
    const walletItem = this.props.walletItem
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

export default TransactionComponent
