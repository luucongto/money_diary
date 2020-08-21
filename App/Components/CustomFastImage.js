import React, { Component } from 'react'
import FastImage from 'react-native-fast-image'
import autoBind from 'react-autobind'
import Utils from '../Utils/Utils'
class CustomFastImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false
    }
    autoBind(this)
  }

  onLoad (event) {

  }

  onError () {
    this.setState({ error: true })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.setState({ error: false })
    }
  }

  render () {
    Utils.log(this.props.source.uri)
    // if (this.state.error) {
    //   return <Image style={[{ ...this.props.style }, { backgroundColor: 'gray', borderRadius: 15 }]} />
    // }
    return (
      <FastImage
        onLoad={event => this.onLoad(event)}
        onError={() => this.onError()}
        {...this.props}
      />
    )
  }
}

export default CustomFastImage
