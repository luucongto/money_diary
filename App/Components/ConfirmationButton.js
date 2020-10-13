import { Button, Icon, Text, View } from 'native-base'
import React, { PureComponent } from 'react'
import Animated, { Easing, Value } from 'react-native-reanimated'
import Utils from '../Utils/Utils'

export default class ConfirmationButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isConfirming: false
    }
    this.buttonY = new Value(0)
  }

  _open () {
    Utils.animatedParallelize([
      Animated.timing(this.buttonY, { toValue: -50, duration: 200, easing: Easing.quad })
    ])
  }

  _close () {
    this.setState({
      isConfirming: false
    })
    clearInterval(this.timeCountdownInterval)
    Utils.animatedParallelize([
      Animated.timing(this.buttonY, { toValue: 0, duration: 200, easing: Easing.quad })
    ])
  }

  onCancel () {
    this._close()
    this.setState({
      isConfirming: false
    })
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onConfirm () {
    this._close()
    if (this.props.onConfirm) {
      this.props.onConfirm()
    }
  }

  componentWillUnmount () {
    clearInterval(this.timeCountdownInterval)
  }

  showConfirm () {
    const timeout = this.props.timeout || 5000
    this._open()
    this.setState({
      isConfirming: true,
      timeCountdown: parseInt(timeout / 1000)
    })
    clearInterval(this.timeCountdownInterval)
    this.timeCountdownInterval = setInterval(() => {
      if (this.state.timeCountdown <= 1) {
        this._close()
        return
      }
      this.setState({
        timeCountdown: this.state.timeCountdown - 1
      })
    }, 1000)
  }

  render () {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          height: 50,
          width: 150,
          flexDirection: 'column',
          overflow: 'hidden',
          justifyContent: 'space-between'
        }}
      >
        <Animated.View style={{
          height: 100,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: [
            { translateY: this.buttonY }
          ]
        }}
        >
          <Button
            {...this.props}
            style={[{
              height: 50,
              width: '100%',
              justifyContent: 'center'
            }, this.props.buttonStyle]}
            onPress={() => this.showConfirm()}
          >{this.props.buttonContent}
          </Button>

          <Button
            success
            style={[{
              height: 50,
              width: '100%',
              justifyContent: 'center',
              flexDirection: 'row'
            }, this.props.buttonStyle]}
            onPress={() => this.onConfirm()}
          >

            <Text uppercase={false}>
              <Icon name='check' type='FontAwesome' style={{ color: 'white', fontSize: 20 }} /> {this.state.timeCountdown}s
            </Text>
          </Button>
        </Animated.View>
      </View>
    )
  }
}
