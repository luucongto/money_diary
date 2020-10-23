import { Body, Button, Col, Form, Grid, Icon, Input, Item, Label, Picker, Row, Text } from 'native-base'
import React, { PureComponent } from 'react'
import autoBind from 'react-autobind'
import { Alert, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Constants from '../../Config/Constants'
import I18n from '../../I18n'
import Wallet from '../../Realm/Wallet'
import Api from '../../Services/Api'
import { ApplicationStyles, Fonts } from '../../Themes'
import Utils from '../../Utils/Utils'
import FadeComponent from './FadeComponent'
import { TransactionCardAddComponent } from './TransactionCardItem'
const t = I18n.t
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
        wallet={this.props.item}
        walletId={this.props.item.id}
        callback={() => {
          this.toggleAddTransactionPanel()
          this.props.refresh()
        }}
      />
    )
  }

  delete () {
    Alert.alert(
      t('wallet_delete_confirm_title'),
      t('wallet_delete_confirm_msg', this.props.item),
      [
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            Api.walletDelete(this.props.item)
            setTimeout(() => this.props.refresh(), 1000)
          }
        }
      ],
      { cancelable: true }
    )
  }

  toggleCheckInclude () {
    Wallet.update({ id: this.props.item.id }, { countInTotal: !this.props.item.countInTotal })
    this.props.refresh()
  }

  render () {
    const wallet = this.props.item
    if (!wallet) return null
    const amount = wallet.amount
    const font = Fonts.style.h6 // wallet.label.length > 8 ? Fonts.style.h6 : Fonts.style.h3
    return (
      <FadeComponent fadeInTime={300 + this.props.index * 200} style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
        <View style={{
          ...ApplicationStyles.components.card,
          flexDirection: 'row'
        }}
        >
          <Body style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Grid>
              <Col>
                <Row style={{ height: 50, flexDirection: 'column', justifyContent: 'center' }}>
                  {this.props.editing ? (
                    <TouchableOpacity onPress={() => this.toggleCheckInclude()}>
                      <Text style={[font, { color: '#0096c7', alignSelf: 'flex-start' }]}>
                        <Icon name={wallet.countInTotal ? 'checksquareo' : 'minussquareo'} type='AntDesign' style={{ color: wallet.countInTotal ? 'green' : 'gray' }} />   {wallet.position ? wallet.label : I18n.t(wallet.label)}
                      </Text>
                    </TouchableOpacity>)
                    : (
                      <Text style={[font, { color: '#0096c7', alignSelf: 'flex-start' }]}>
                        {wallet.position ? wallet.label : I18n.t(wallet.label)}
                      </Text>)}
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
            width: 40,
            height: '100%',
            marginLeft: 10,
            borderLeftWidth: 1,
            borderLeftColor: '#999999',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end'
          }}
          >
            {this.props.editing && wallet.id !== Constants.DEFAULT_WALLET_ID && (
              <TouchableOpacity style={{ width: 40, height: 60, flexDirection: 'row', justifyContent: 'center', paddingLeft: 10 }} onPress={() => this.delete()}>
                <Icon name='remove' type='FontAwesome' style={{ fontSize: 30, color: 'red', alignSelf: 'center' }} />
              </TouchableOpacity>
            )}

            {!this.props.editing && (
              <TouchableOpacity style={{ width: 40, height: 60, flexDirection: 'row', justifyContent: 'center', paddingLeft: 10 }} onPress={() => this.props.openWalletDetailModal(wallet)}>
                <Icon name='angle-right' type='FontAwesome' style={{ fontSize: 30, color: 'blue', alignSelf: 'center' }} />
              </TouchableOpacity>)}
            {
              !this.props.editing && wallet.position > 0 && (
                <TouchableOpacity style={{ width: 40, height: 60, flexDirection: 'row', justifyContent: 'center', paddingLeft: 10 }} onPress={() => this.toggleAddTransactionPanel()}>
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
      <FadeComponent fadeInTime={300 + this.props.index * 200} style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
        <View style={{
          ...ApplicationStyles.components.card,
          flexDirection: 'row'
        }}
        >
          <Form style={{ width: '70%' }}>
            <Item inlineLabel>
              <Input placeholder={I18n.t('WalletName')} value={this.state.label} onChangeText={label => this.setState({ label })} />
            </Item>
            <Item inlineLabel>
              <Label>{I18n.t('Color')}</Label>
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
        </View>
      </FadeComponent>
    )
  }
}

module.exports = {
  WalletItem,
  WalletAddComponent
}
