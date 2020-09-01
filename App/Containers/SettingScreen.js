import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-community/google-signin'
import { Body, Button, Card, CardItem, Container, Content, Left, Text, Thumbnail } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { PermissionsAndroid, Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import { Category, Transaction, Wallet } from '../Realm'
import LoginRedux from '../Redux/LoginRedux'
import Api from '../Services/Api'
import GDrive from '../Services/GDrive'
// Styles
import Utils from '../Utils/Utils'
import Screen from './Screen'
class SettingScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
    autoBind(this)
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.file']
    })
    autoBind(this)
  }

  async componentDidMount () {
    await this.signIn(true)
    await this.getFileInfo()
  }

  async signOut () {
    await GoogleSignin.signOut()
    this.props.logoutSuccess()
  }

  asyncSetState (state) {
    return new Promise((resolve, reject) => {
      this.setState(state, () => {
        resolve()
      })
    })
  }

  async backup () {
    await this.asyncSetState({ doingBackup: true })
    const tokens = this.props.login
    const backupContents = {
      wallets: Wallet.find(),
      categories: Category.find(),
      transactions: Transaction.find()
    }
    GDrive.setAccessToken(tokens.accessToken)
    GDrive.init()
    Utils.log('GDrive.isInitialized()', GDrive.isInitialized())
    const folderRes = await GDrive.files.safeCreateFolder({
      name: 'MoneyDairy',
      parents: ['root']
    })
    const currentFileId = await GDrive.files.getId('money_diary.json', [folderRes], 'application/json', false)
    if (currentFileId) {
      await GDrive.files.delete(currentFileId)
    }
    const result = await GDrive.files.createFileMultipart(
      JSON.stringify(backupContents),
      'application/json', {
        parents: [folderRes],
        name: 'money_diary.json'
      },
      false)
    Utils.log('result', result)
    await this.getFileInfo()
    await this.asyncSetState({ doingBackup: false })
  }

  async getFileId () {
    try {
      const tokens = this.props.login
      GDrive.setAccessToken(tokens.accessToken)
      GDrive.init()
      const folderRes = await GDrive.files.safeCreateFolder({
        name: 'MoneyDairy',
        parents: ['root']
      })
      Utils.log('folderRes', folderRes)
      const currentFileId = await GDrive.files.getId('money_diary.json', [folderRes], 'application/json', false)
      Utils.log('fileId', currentFileId)
      if (!currentFileId) {
        return null
      }
      return currentFileId
    } catch (error) {
      Utils.log('getFileIdError', error)
      return null
    }
  }

  async getFileInfo () {
    try {
      Utils.log('getFileInfo')
      const currentFileId = await this.getFileId()
      if (!currentFileId) {
        Utils.log('getFileInfo fileidnull')
        return null
      }

      const fileInfo = await GDrive.files.get(currentFileId, { fields: '*' })
      await this.asyncSetState({ fileInfo })
    } catch (error) {
      Utils.log('getFileInfoerror', error)
    }
  }

  async download () {
    const tokens = this.props.login
    await this.asyncSetState({ doingDownload: true })
    const folderRes = await GDrive.files.safeCreateFolder({
      name: 'MoneyDairy',
      parents: ['root']
    })
    const currentFileId = await GDrive.files.getId('money_diary.json', [folderRes], 'application/json', false)
    if (!currentFileId) {
      return null
    }
    if (!currentFileId) {
      await this.asyncSetState({ doingDownload: false })
      return
    }
    Utils.log('downloading', currentFileId)
    try {
      const result = await Api.downloadFile(currentFileId, tokens.accessToken)
      Utils.log('result', result, result.wallets)
      await this.asyncSetState({ doingDownload: false })
    } catch (error) {
      Utils.log('download error', error)
    }
  }

  async signIn (isSilent = false) {
    try {
      await GoogleSignin.hasPlayServices()
      let userInfo = null
      if (isSilent) {
        userInfo = await GoogleSignin.signInSilently()
      } else {
        userInfo = await GoogleSignin.signIn()
      }
      Utils.log('userInfo', userInfo)
      const tokens = await GoogleSignin.getTokens()
      Utils.log('tokens', tokens)
      if (tokens) {
        this.props.loginSuccess(tokens)
        this.setState({ isSignedIn: true, user: userInfo.user })
        await this.getFileInfo()
      }
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
      <Card>
        <CardItem header>
          <Text>Signin to backup with GDrive</Text>
        </CardItem>
        <CardItem>
          <GoogleSigninButton
            style={{ width: '100%', height: 68 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.signIn.bind(this)}
            disabled={this.state.isSigninInProgress}
          />
        </CardItem>
      </Card>

    )
  }

  _renderUser () {
    if (!this.state.user) {
      return null
    }
    const user = this.state.user
    return (
      <Card>
        <CardItem header bordered>
          <Text>User</Text>
        </CardItem>
        <CardItem bordered>
          <Left>
            <Thumbnail source={{ uri: user.photo }} />
            <Body>
              <Text> {user.name}</Text>
              <Text note>{user.email}</Text>
            </Body>
          </Left>
          <Button onPress={() => this.signOut()} style={{ alignSelf: 'flex-end' }}><Text>Logout</Text></Button>
        </CardItem>
      </Card>
    )
  }

  _renderBackup () {
    const fileInfo = this.state.fileInfo || {}
    return (
      <Card>
        <CardItem header bordered>
          <Text>Backup And Download</Text>
        </CardItem>
        <CardItem bordered>
          <Body>
            <Text>{fileInfo ? fileInfo.originalFilename : 'No backup'}</Text>
            <Text note>{fileInfo ? 'Last backup: ' + Utils.timeFormat(fileInfo.modifiedTime) : ''}</Text>
          </Body>

        </CardItem>
        <CardItem bordered style={{ justifyContent: 'space-around' }}>
          <Button info style={{ width: 150, justifyContent: 'center' }} onPress={() => this.backup()}><Text>{this.state.doingBackup ? 'Doing backup' : 'Backup'}</Text></Button>
          <Button success style={{ width: 150, justifyContent: 'center' }} onPress={() => this.download()}><Text>{this.state.doingDownload ? 'Doing Download' : 'Download'}</Text></Button>
        </CardItem>
      </Card>
    )
  }

  async _requestStoragePermission () {
    if (Platform.OS !== 'android') return true

    const pm1 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
    const pm2 = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)

    if (pm1 && pm2) return true

    const userResponse = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ])

    if (userResponse['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
        userResponse['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
      return true
    } else {
      return false
    }
  }

  async _pickFile () {
    try {
      const isAllowedPermission = await this._requestStoragePermission()
      if (!isAllowedPermission) {
        Utils.log('no permission')
        return
      }
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      })
      Utils.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      )
      if (res.uri) {
        const stats = await RNFetchBlob.fs.stat(res.uri)
        // console.log(stats.path);
        // output: /storage/emulated/0/WhatsApp/Media/WhatsApp Images/IMG-20200831-WA0019.jpg

        // csv()
        //   .fromFile(stats.path)
        //   .on('json', (jsonObj) => {
        //     // combine csv header row and csv line to a json object
        //     // jsonObj.a ==> 1 or 4
        //     Utils.log('json', jsonObj)
        //   })
        //   .on('done', (error) => {
        //     Utils.log('done', error)
        //   })
        const content = await RNFS.readFile(stats.path)

        Utils.log('content', stats.path, content)
      }
    } catch (err) {
      Utils.log('pickfile', err)
    }
  }

  _renderImportFromFile () {
    return (
      <Card>
        <CardItem header bordered>
          <Text>Import from File</Text>
        </CardItem>
        <CardItem bordered>
          <Body>
            <Text>{}</Text>
            <Text note>{}</Text>
          </Body>

        </CardItem>
        <CardItem bordered style={{ justifyContent: 'space-around' }}>
          <Button info style={{ width: 150, justifyContent: 'center' }} onPress={() => this._pickFile()}><Text>Pick CSV File</Text></Button>
        </CardItem>
      </Card>
    )
  }

  renderPhone () {
    return (
      <Container>
        <Content>
          {(!this.props.login || !this.state.isSignedIn) && this._renderLoginButton()}
          {this.props.login && this.state.isSignedIn && this._renderUser()}
          {this.props.login && this.state.isSignedIn && this._renderBackup()}
          {this._renderImportFromFile()}
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
const screenHook = Screen(SettingScreen, mapStateToProps, mapDispatchToProps, ['login'])
export default screenHook
