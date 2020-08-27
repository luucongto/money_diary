import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Utils from '../../Utils/Utils'
import { Card, Button, CardItem, Body, Text, Left, Right, Icon, Form, Item, Picker, DatePicker, Input, Switch } from 'native-base'
import Modal, { ModalContent, ModalFooter } from 'react-native-modals'
class AddWalletModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      label: '',
      color: ''
    }
    autoBind(this)
  }

  componentDidMount () {
    this.props.setRef(this)
  }

  setModalVisible (visible) {
    this.setState({ visible })
  }

  insert () {
    // const data = {
    //   wallet: this.state.wallet ? this.state.wallet : this.props.wallets[0].id,
    //   category: this.state.category ? this.state.category : this.props.categories[0].label,
    //   amount: this.state.amount || 0,
    //   date: this.state.date,
    //   include: this.state.include
    // }
    // this.props.transactionCreate(data)
    // this.setState({
    //   wallet: this.props.wallets ? this.props.wallets[0].id : null,
    //   category: this.props.categories ? this.props.categories[0].label : null,
    //   date: new Date(),
    //   amount: 0,
    //   include: true
    // })
    this.setModalVisible(false)
  }

  render () {
    return (
      <Modal.BottomModal
        visible={this.state.visible}
        onTouchOutside={() => this.setModalVisible(false)}
        onSwipeOut={() => this.setModalVisible(false)}
        height={0.5}
        width={1}
        footer={
          <ModalFooter>
            <Form />
          </ModalFooter>
        }
      >
        <ModalContent>
          <Form>
            <Item>
              <Input placeholder='Wallet Name' value={this.state.label} onChangeText={label => this.setState({ label })} />
            </Item>
            <Item last>
              <Input placeholder='Password' />
            </Item>
            <Item regular>
              <Button success onPress={this.insert.bind()}>
                <Text>Create</Text>
              </Button>
              <Right>
                <Button info onPress={() => this.setModalVisible(false)}>
                  <Text>Cancel</Text>
                </Button>
              </Right>
            </Item>
          </Form>
        </ModalContent>
      </Modal.BottomModal>)
  }
}

export default AddWalletModal
