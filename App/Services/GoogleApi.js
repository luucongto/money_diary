import {
  GoogleSignin,

  statusCodes
} from '@react-native-community/google-signin'
import autoBind from 'react-autobind'
import Utils from '../Utils/Utils'
import GoogleSheet from './GoogleSheet'
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
]

class GoogleApi {
  constructor () {
    autoBind(this)
  }

  authorized (tokens) {
    GoogleSheet.authorized(tokens.accessToken)
  }

  async signOut () {
    await GoogleSignin.signOut()
  }

  async signIn (isSilent = false) {
    try {
      GoogleSignin.configure({
        scopes: SCOPES
      })
      await GoogleSignin.hasPlayServices()
      let userInfo = null
      if (isSilent) {
        userInfo = await GoogleSignin.signInSilently()
      } else {
        userInfo = await GoogleSignin.signIn()
      }
      Utils.log('-=---------signin 1')
      const tokens = await GoogleSignin.getTokens()
      Utils.log('-=---------signin 2', tokens)
      this.authorized(tokens, userInfo)
      return { tokens, userInfo }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      throw error
    }
  }
}

const api = new GoogleApi()

export default api
