import React, { Component } from 'react'
import { StatusBar, SafeAreaView } from 'react-native'
import { Root } from 'native-base'
import AppNavigation from '../Navigation/AppNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import Orientation from 'react-native-orientation'
// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    Orientation.lockToPortrait()
    StatusBar.setHidden(true)
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <Root>
        <SafeAreaView style={styles.applicationView}>
          {/* <StatusBar barStyle='light-content' /> */}
          <AppNavigation />
        </SafeAreaView>
      </Root>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startupRequest())
})

export default connect(null, mapDispatchToProps)(RootContainer)
