import { Root } from 'native-base'
import React, { Component } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import ReduxPersist from '../Config/ReduxPersist'
import AppNavigation from '../Navigation/AppNavigation'
import StartupActions from '../Redux/StartupRedux'
// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
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
