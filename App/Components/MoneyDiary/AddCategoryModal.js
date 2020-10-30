import { Button, Form, Input, Item, Label, Right, Text, Picker, Icon } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import Modal, { ModalContent } from 'react-native-modals'
import Utils from '../../Utils/Utils'

class AddCategoryModal extends Component {
  constructor (props) {
    super(props)
    const colors = Utils.randomPaletteColors(100)
    this.state = {
      visible: false,
      label: '',
      color: colors[0],
      colors
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
    if (!this.state.label) {
      return
    }
    const data = {
      label: this.state.label,
      color: this.state.color
    }
    this.props.itemCreate(data)
    this.setModalVisible(false)
  }

  onValueChangeColor (color) {
    this.setState({ color })
  }

  render () {
    return (
      <Modal.BottomModal
        visible={this.state.visible}
        onTouchOutside={() => this.setModalVisible(false)}
        onSwipeOut={() => this.setModalVisible(false)}
        height={0.3}
        width={1}
      >
        <ModalContent>
          <Form>
            <Item inlineLabel>
              <Label>Category Name</Label>
              <Input placeholder='Category Name' value={this.state.label} onChangeText={label => this.setState({ label })} />
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

export default AddCategoryModal
