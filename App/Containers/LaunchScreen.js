import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
// import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'

// import { Images, Metrics } from '../Themes'

import I18n from 'react-native-i18n'
// import Utils from './Utils'
// Styles
import styles from './Styles/LaunchScreenStyles'
import autoBind from 'react-autobind'
import Utils from '../Utils/Utils'
class LaunchScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {}
    }
    autoBind(this)
  }

  componentDidMount () {
    this.checkStartUpAndGoNext()
  }

  checkStartUpAndGoNext () {
    setTimeout(() => {
      if (this.props.start) {
        Utils.log('this.props.start', this.props.start)
        this.goNext()
      } else {
        this.checkStartUpAndGoNext()
      }
    }, 1000)
  }

  goNext () {
    Utils.log('goNext')
    this.props.navigation.replace('MainScreen')
  }

  renderPhone () {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.tab_txt}>{I18n.t('copyright')}</Text>
      </View>
    )
  }

  render () {
    return this.renderPhone()
  }
}

const mapStateToProps = (state) => {
  return {
    start: state.startup.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
