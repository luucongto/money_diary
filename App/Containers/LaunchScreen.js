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
class LaunchScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      start: {}
    }
    autoBind(this)
  }

  componentDidMount () {
    setTimeout(() => this.goNext(), 3000)
  }

  goNext () {
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
    start: state.startup,
    user: state.user,
    login: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
