import { Body, Button, Header, Icon, Left, Title, Right } from 'native-base'
import React, { PureComponent } from 'react'
import I18n from '../../I18n'
export default class WalletComponent extends PureComponent {
  render () {
    return (
      <Header style={{ backgroundColor: 'white' }}>
        <Left>
          {this.props.left || (
            <Button transparent onPress={() => this.props.navigation.openDrawer()}>
              <Icon name='menu' style={{ color: '#0096c7' }} />
            </Button>)}
        </Left>
        <Body stye={{ justifyContent: 'center', alignItem: 'center' }}>
          <Title style={{ color: '#0096c7' }}>{I18n.t(this.props.title)}</Title>
        </Body>
        <Right>
          {this.props.right}
        </Right>
      </Header>
    )
  }
}
