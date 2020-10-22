// import { Images, Metrics } from '../Themes'
import lodash from 'lodash'
import { Body, Button, Card, CardItem, Col, Container, Content, Grid, Header, Icon, List, ListItem, Right, Separator, Text, Title, View } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Utils from '../Utils/Utils'
import Screen from './Screen'
class TransactionReportScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {}

    autoBind(this)
  }

  goBack () {
    this.props.navigation.goBack()
  }

  componentDidMount () {
    this.setState({ params: this.props.params })
    this._groupTransactionByCategory()
  }

  _groupTransactionByCategory () {
    if (this.props.transactions) {
      const transactions = this.props.transactions
      const incomes = lodash.filter(transactions, transaction => transaction.amount > 0 && transaction.include)
      const outcomes = lodash.filter(transactions, transaction => transaction.amount < 0 && transaction.include)
      this.setState({ incomes, outcomes })
    }
  }

  _renderCharts () {
    return (
      <Content />
    )
  }

  _groupTransactionWithFilter (transactions, filter, filterObjects) {
    const groupByFilter = lodash.groupBy(transactions, filter)
    const data = []
    let totalAmount = 0
    lodash.each(groupByFilter, (transactions, categoryId) => {
      let amount = 0
      transactions.forEach(transaction => {
        amount += transaction.amount
      })
      totalAmount += amount
      data.push({
        ...filterObjects[categoryId],
        amount
      })
    })
    return {
      totalAmount,
      data
    }
  }

  _renderSubItem (inputTransactions, isIncome = true) {
    if (!inputTransactions) {
      return
    }
    const forCategory = this._groupTransactionWithFilter(inputTransactions, 'category', this.props.categoryObjects)
    const forWallet = this._groupTransactionWithFilter(inputTransactions, 'wallet', this.props.walletObjects)

    const renderForFilter = ({ totalAmount, data }, filter) => {
      return (
        <Card>
          <Separator bordered>
            <Text>By {filter} </Text>
          </Separator>

          {data.map(each => {
            const amount = each.amount
            return (
              <ListItem
                noIndent
                key={each.id}
                onPress={() => {
                  this.props.navigation.navigate('TransactionScreen', { ...this.state.params, [filter]: each.id })
                }}
                style={{ paddingTop: 0, paddingBottom: 0, height: 50 }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    backgroundColor: each.color,
                    width: 10,
                    height: '100%'
                  }}
                />
                <Body>
                  <Text>{each.label}</Text>
                </Body>
                <Right>
                  <Text style={{ textAlign: 'right', width: 300, color: amount > 0 ? 'green' : 'red' }}>{Utils.numberWithCommas(amount)}</Text>
                  <Text note style={{ textAlign: 'right', width: 300 }}>{Math.floor(amount / totalAmount * 100) + '%'}</Text>
                </Right>
                <View style={{
                  paddingLeft: 5
                }}
                >
                  <Icon name='right' type='AntDesign' style={{ fontSize: 15, color: 'gray' }} />
                </View>
              </ListItem>
            )
          })}
        </Card>
      )
    }

    return (
      <List>
        <Card>
          <CardItem>
            <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{ color: isIncome > 0 ? 'green' : 'red' }}>{isIncome ? 'Income' : 'Outcome'}</Title>
            </Body>
          </CardItem>
        </Card>
        {renderForFilter(forCategory, 'category')}
        {renderForFilter(forWallet, 'wallet')}
      </List>
    )
  }

  _renderSummary () {
    if (!this.state.incomes) {
      return
    }
    let income = 0
    let outcome = 0
    this.state.incomes.forEach(tran => { income += tran.amount })
    this.state.outcomes.forEach(tran => { outcome += tran.amount })
    const amount = income + outcome
    return (
      <Card>
        <ListItem>
          <Grid>
            <Col size={0.5}>
              <Text style={{ color: 'green' }}> Income</Text>
              <Text style={{ color: income > 0 ? 'green' : 'red', fontSize: 25 }}> {Utils.numberWithCommas(income)}</Text>
            </Col>
            <Col size={0.5}>
              <Text style={{ color: 'red' }}> Outcome</Text>
              <Text style={{ color: outcome > 0 ? 'green' : 'red', fontSize: 25 }}> {Utils.numberWithCommas(outcome)}</Text>
            </Col>
          </Grid>
        </ListItem>
        <ListItem>
          <Col>
            <Text style={{ color: amount > 0 ? 'green' : 'red' }}>Net</Text>
            <Text style={{ color: amount > 0 ? 'green' : 'red', fontSize: 25 }}> {Utils.numberWithCommas(amount)}</Text>
          </Col>
        </ListItem>

      </Card>
    )
  }

  renderPhone () {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white', paddingLeft: 0, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <View style={{ width: 60, alignSelf: 'flex-start' }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon color='black' name='back' type='AntDesign' />
            </Button>
          </View>
          <Body>
            <Text style={{ alignSelf: 'center' }}>{this.props.params.month}</Text>
          </Body>
        </Header>
        <Content>
          {this._renderSummary()}
          <View style={{ height: 30 }} />
          {this._renderSubItem(this.state.incomes)}
          <View style={{ height: 30 }} />
          {this._renderSubItem(this.state.outcomes, false)}
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
    transactions: state.transaction.data,
    params: state.transaction.params,
    categoryObjects: state.category.objects,
    walletObjects: state.wallet.objects
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}
const screenHook = Screen(TransactionReportScreen, mapStateToProps, mapDispatchToProps, ['transaction', 'category', 'wallet'])
export default screenHook
