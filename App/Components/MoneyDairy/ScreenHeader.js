import { Body, Button, Header, Icon, Left, Title, Right } from 'native-base'
import React, { PureComponent } from 'react'
export default class WalletComponent extends PureComponent {
  render () {
    return (
      <Header style={{ backgroundColor: '#34d0fb' }}>
        <Left>
          <Button transparent onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' />
          </Button>
        </Left>
        <Body stye={{ justifyContent: 'center', alignItem: 'center' }}>
          <Title>{this.props.title}</Title>
        </Body>
        <Right />
      </Header>
    )
  }
}
