import React, { PureComponent } from 'react'
import Animated, { Easing, timing, Value } from 'react-native-reanimated'
export default class FadeComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.opacity = new Value(0)
  }

  componentDidMount () {
    timing(this.opacity, {
      duration: this.props.fadeInTime || 500,
      toValue: 1,
      easing: Easing.inOut(Easing.ease)
    }).start()
  }

  componentWillUnmount () {
    timing(this.opacity, {
      duration: this.props.fadOutTime || 500,
      toValue: 0,
      easing: Easing.inOut(Easing.ease)
    }).start()
  }

  render () {
    return (
      <Animated.View style={{ ...this.props.style, border: 0, opacity: this.opacity }}>
        {this.props.children}
      </Animated.View>
    )
  }
}
