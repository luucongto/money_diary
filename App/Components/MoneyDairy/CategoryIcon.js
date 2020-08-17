import React, { Component } from 'react'
import { Image } from 'react-native'
import { Images } from '../../Themes'
export default class Item extends Component {
  render () {
    return (
      <Image source={Images.iconUser} style={{ width: 20, height: 20 }} resizeMode='stretch' />
    )
  }
}
