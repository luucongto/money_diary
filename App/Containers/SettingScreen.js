import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-community/google-signin'
// import GDrive from 'react-native-google-drive-api-wrapper'
// Styles
import Utils from '../Utils/Utils'
import autoBind from 'react-autobind'
import LoginRedux from '../Redux/LoginRedux'
import { Container, Content, ListItem, Button, Text } from 'native-base'
class Screen extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
    autoBind(this)
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })
  }

  async signOut () {
    await GoogleSignin.signOut()
    this.props.logoutSuccess()
  }

  async signIn () {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      Utils.log('userInfo', userInfo)
      const tokens = await GoogleSignin.getTokens()
      Utils.log(tokens)
      if (tokens) {
        this.props.loginSuccess(tokens)
      }
      // GDrive.setAccessToken(tokens.accessToken)
      // GDrive.init()
      // Utils.log('GDrive.isInitialized()', GDrive.isInitialized())
      // const folderRes = await GDrive.files.safeCreateFolder({
      //   name: 'MoneyDairy',
      //   parents: ['root']
      // })
      // const result = await GDrive.files.createFileMultipart(
      //   'My text file contents',
      //   'application/json', {
      //     parents: [folderRes],
      //     name: 'money_diary.json'
      //   },
      //   false)
      // Utils.log('result', result)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Utils.log('error', error)
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Utils.log('error', error)
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Utils.log('error', error)
        // play services not available or outdated
      } else {
        Utils.log('error', error)
        // some other error happened
      }
    }
  };

  _renderLoginButton () {
    return (
      <GoogleSigninButton
        style={{ width: '100%', height: 68 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={this.signIn.bind(this)}
        disabled={this.state.isSigninInProgress}
      />
    )
  }

  renderPhone () {
    return (
      <Container>
        <Content>
          <ListItem>
            {!this.props.login && this._renderLoginButton()}
          </ListItem>
          {this.props.login && (
            <ListItem noBorder noIndent>
              <Button onPress={() => this.signOut()}><Text>Logout</Text></Button>
              <Button><Text>Backup</Text></Button>
              <Button><Text>Synchronize</Text></Button>
            </ListItem>)}
        </Content>
      </Container>

    )
  }

  render () {
    return this.renderPhone()
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: (params) => dispatch(LoginRedux.loginSuccess(params)),
    logoutSuccess: (params) => dispatch(LoginRedux.logoutSuccess(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
