import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Body, Text, Right, Card, CardItem, Button, Icon, Item, Picker, Label, Input, Form, Grid, Row, Col } from 'native-base'
import Utils from '../../Utils/Utils'
import { Fonts } from '../../Themes'
import I18n from '../../I18n'
import FadeComponent from './FadeComponent'
import autoBind from 'react-autobind'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TransactionCardAddComponent } from './TransactionCardItem'
class WalletItem extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      togglePanel: false
    }
  }

  toggleAddTransactionPanel () {
    this.setState({
      togglePanel: !this.state.togglePanel
    })
  }

  _renderAddTransactionPanen () {
    return (
      <TransactionCardAddComponent
        transactionCreateRequest={this.props.transactionCreateRequest}
        wallet={this.props.item}
        walletId={this.props.item.id}
        callback={() => {
          this.toggleAddTransactionPanel()
          this.props.refresh()
        }}
      />
    )
  }

  render () {
    const wallet = this.props.item
    if (!wallet) return null
    const amount = wallet.amount
    const font = wallet.label.length > 8 ? Fonts.style.h6 : Fonts.style.h3
    return (
      <FadeComponent fadeInTime={300 + this.props.index * 200} style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          borderColor: wallet.color,
          borderWidth: 1,
          borderRadius: 10,
          height: 120,
          overflow: 'hidden',
          justifyContent: 'center',
          paddingHorizontal: 10
        }}
        >
          <Body style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Grid>
              <Col>
                <Row style={{ height: 50 }}>
                  <Text style={[font, { color: '#0096c7', alignSelf: 'flex-end' }]}>
                    {wallet.id ? wallet.label : I18n.t(wallet.label)}
                  </Text>
                </Row>
                <Row>
                  <Text style={{ ...Fonts.style.h5, color: amount > 0 ? 'green' : 'red', alignSelf: 'flex-start' }}>đ {Utils.numberWithCommas(amount)}</Text>
                </Row>
              </Col>
              <Col style={{ alignItems: 'flex-end' }}>
                <Row>
                  <Text note style={{ color: 'blue', alignSelf: 'flex-end' }}>
                    {I18n.t('report_this_month')}
                  </Text>
                </Row>
                <Row style={{ height: 20 }}>
                  <Text note style={{ color: 'green', alignSelf: 'flex-end' }}>
                    đ {Utils.numberWithCommas(wallet.income)} <Icon name='download' type='AntDesign' style={{ fontSize: 15, color: 'green' }} />
                  </Text>
                </Row>
                <Row>
                  <Text note style={{ color: 'red', alignSelf: 'flex-start' }}>
                    đ{Utils.numberWithCommas(wallet.outcome)} <Icon name='upload' type='AntDesign' style={{ fontSize: 15, color: 'red' }} />
                  </Text>
                </Row>
              </Col>
            </Grid>
            {wallet.count > 0 && <Text note style={{ marginBottom: 10 }}>{wallet.count} {I18n.t('transactions')} {I18n.t('last_update')} {Utils.timeFormat(wallet.lastUpdate)}</Text>}
          </Body>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'flex-end'
          }}
          >
            <TouchableOpacity style={{ width: 50, height: 60, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => this.props.openWalletDetailModal(wallet)}>
              <Icon name='angle-right' type='FontAwesome' style={{ fontSize: 30, color: 'blue', alignSelf: 'center' }} />
            </TouchableOpacity>
            {
              wallet.id > 0 && (
                <TouchableOpacity style={{ width: 50, height: 60, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => this.toggleAddTransactionPanel()}>
                  <Icon name={this.state.togglePanel ? 'minus' : 'plus'} type='FontAwesome' style={{ alignSelf: 'center', color: 'green' }} />
                </TouchableOpacity>)
            }
          </View>

        </View>
        {this.state.togglePanel && this._renderAddTransactionPanen()}
      </FadeComponent>
    )
  }
}

class WalletAddComponent extends PureComponent {
  constructor (props) {
    super(props)
    const colors = Utils.randomPaletteColors(100)
    this.state = {
      label: '',
      color: colors[0],
      colors
    }
    autoBind(this)
  }

  insert () {
    if (!this.state.label) {
      return
    }
    const data = {
      label: this.state.label,
      color: this.state.color
    }
    this.setState({
      label: ''
    })
    this.props.walletCreate(data)
  }

  onValueChangeColor (color) {
    this.setState({ color })
  }

  render () {
    return (
      <Card style={{ marginLeft: 10, marginRight: 10, marginBottom: 10, overflow: 'hidden', flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }}>
        <Form style={{ width: '60%' }}>
          <Item inlineLabel>
            <Input placeholder='Wallet Name' value={this.state.label} onChangeText={label => this.setState({ label })} />
          </Item>
          <Item inlineLabel>
            <Label>Color</Label>
            <Picker
              mode='dropdown'
              iosIcon={<Icon name='arrow-down' />}
              style={{ width: undefined }}
              placeholder='Select Color'
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor='#007aff'
              itemTextStyle={{ color: 'red' }}
              selectedValue={this.state.color}
              onValueChange={this.onValueChangeColor.bind(this)}
            >
              {this.state.colors.map(item => <Picker.Item color={item} key={item} label={item} value={item} />)}

            </Picker>
          </Item>
        </Form>

        <Button iconLeft rounded success style={{ alignSelf: 'center' }} onPress={this.insert.bind()}>
          <Icon name='check' type='FontAwesome' />
          <Text>{I18n.t('save')}</Text>
        </Button>
      </Card>
    )
  }
}

module.exports = {
  WalletItem,
  WalletAddComponent
}
