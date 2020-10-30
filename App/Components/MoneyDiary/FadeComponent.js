import React, { PureComponent } from 'react'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
export default class FadeComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.opacity = new Value(1)
    this.transX = new Value(500)
  }

  _in () {
    // timing(this.opacity, {
    //   duration: this.props.fadeInTime || 500,
    //   toValue: 1,
    //   easing: Easing.inOut(Easing.ease)
    // }).start()
    timing(this.transX, {
      duration: this.props.fadeInTime || 500,
      toValue: 0,
      easing: Easing.inOut(Easing.ease)
    }).start()
  }

  _out () {
    // timing(this.opacity, {
    //   duration: this.props.fadeInTime || 500,
    //   toValue: 0,
    //   easing: Easing.inOut(Easing.ease)
    // }).start()
    timing(this.transX, {
      duration: this.props.fadeInTime || 500,
      toValue: 500,
      easing: Easing.inOut(Easing.ease)
    }).start()
  }

  componentDidMount () {
    this._in()
  }

  componentWillUnmount () {
    this._out()
  }

  render () {
    return (
      <Animated.View style={{
        ...this.props.style,
        border: 0,
        opacity: this.opacity,
        transform: [
          { translateX: this.transX }
        ]
      }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
