import {
  GoogleSigninButton
} from '@react-native-community/google-signin'
import { Body, Button, CardItem, Container, Content, Header, Icon, Left, Row, Spinner, Text, Thumbnail, Title, Toast } from 'native-base'
import React, { Component } from 'react'
import autoBind from 'react-autobind'
import { ActivityIndicator, PermissionsAndroid, Platform, View } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import ConfirmationButton from '../Components/ConfirmationButton'
import ScreenHeader from '../Components/MoneyDairy/ScreenHeader'
import Constants from '../Config/Constants'
import I18n from '../I18n'
import { Transaction, Wallet } from '../Realm'
import LoginRedux from '../Redux/LoginRedux'
import Api from '../Services/Api'
import GDrive from '../Services/GDrive'
import GoogleApi from '../Services/GoogleApi'
import GoogleSheet from '../Services/GoogleSheet'
import { ApplicationStyles } from '../Themes'
// Styles
import Utils from '../Utils/Utils'
import Screen from './Screen'
const t = I18n.t
class SettingScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
    autoBind(this)
  }

  async componentDidMount () {
    if (this.props.login) {
      await this.signIn(true)
      await this.getFileInfo()
    }
  }

  async signOut () {
    await GoogleApi.signOut()
    this.props.logoutSuccess()
  }

  asyncSetState (state) {
    return new Promise((resolve, reject) => {
      this.setState(state, () => {
        resolve()
      })
    })
  }

  async _backupASheet (spreadsheetId, sheetName, data) {
    let transactionData = []
    let labels = null
    transactionData = data.map(transaction => {
      if (!labels) {
        labels = Object.keys(Utils.clone(transaction))
      }
      return Object.values(Utils.clone(transaction))
    })
    await GoogleSheet.updateData(spreadsheetId, [labels].concat(transactionData), sheetName, labels.length)
  }

  async backupGoogleSheet () {
    const { spreadsheetId } = await GoogleSheet.createSheet()
    const data = {
      wallets: Wallet.findWithAmount(),
      categories: Api.category(),
      transactions: Transaction.getBy()
    }
    await this._backupASheet(spreadsheetId, Constants.SHEETS.TRANSACTIONS, data.transactions)
    await this._backupASheet(spreadsheetId, Constants.SHEETS.WALLETS, data.wallets)
  }

  async backup () {
    await this.asyncSetState({ doingBackup: true })
    // const backupContents = {
    //   wallets: Wallet.findWithAmount(),
    //   categories: Api.category(),
    //   transactions: Transaction.getBy()

    // }
    // const mapCategories = Utils.createMapFromArray(backupContents.categories, 'id')
    // backupContents.categories = lodash.uniq(lodash.map(backupContents.transactions, 'category')).map(label => {
    //   if (!mapCategories[label]) {
    //     return {
    //       id: label, label: label, color: '#fa0770'
    //     }
    //   } else {
    //     return mapCategories[label]
    //   }
    // })
    // const walletObjects = Utils.createMapFromArray(backupContents.wallets, 'id')
    // const categoriesObjects = Utils.createMapFromArray(backupContents.categories, 'id')
    // backupContents.transactions = backupContents.transactions.map(each => {
    //   each = Utils.clone(each)
    //   each.wallet = walletObjects[each.wallet].label
    //   each.category = categoriesObjects[each.category].label
    //   return each
    // })
    // backupContents.wallets = backupContents.wallets.map(each => {
    //   each = Utils.clone(each)
    //   each.id = each.label
    //   return each
    // })
    // backupContents.categories = backupContents.categories.map(each => {
    //   each = Utils.clone(each)
    //   each.id = each.label
    //   return each
    // })
    // GDrive.setAccessToken(tokens.accessToken)
    // GDrive.init()
    // Utils.log('GDrive.isInitialized()', GDrive.isInitialized())
    // const folderRes = await GDrive.files.safeCreateFolder({
    //   name: 'MoneyDairy',
    //   parents: ['root']
    // })
    // const currentFileId = await GDrive.files.getId('money_diary.json', [folderRes], 'application/json', false)
    // if (currentFileId) {
    //   await GDrive.files.delete(currentFileId)
    // }
    // await GDrive.files.createFileMultipart(
    //   JSON.stringify(backupContents),
    //   'application/vnd.google-apps.spreadsheet', {
    //     parents: [folderRes],
    //     name: 'MoneyDairy'
    //   },
    //   false)
    // const result = await GDrive.files.createFileMultipart(
    //   JSON.stringify(backupContents),
    //   'application/json', {
    //     parents: [folderRes],
    //     name: 'money_diary.json'
    //   },
    //   false)
    // Utils.log('result', result)

    await this.backupGoogleSheet()
    Toast.show({
      text: t('exported'),
      duration: 3000
    })
    await this.getFileInfo()
    await this.asyncSetState({ doingBackup: false })
  }

  async getFileId () {
    try {
      const tokens = this.props.login
      if (!tokens) {
        throw new Error('Token empty')
      }
      // GDrive.setAccessToken(tokens.accessToken)
      // Utils.log('0')
      // GDrive.init()
      // Utils.log('1')
      // const folderRes = await GDrive.files.safeCreateFolder({
      //   name: 'MoneyDairy',
      //   parents: ['root']
      // })
      // Utils.log('folderRes', folderRes)
      // const currentFileId = await GDrive.files.getId('money_diary.json', [folderRes], 'application/json', false)
      // Utils.log('fileId', currentFileId)
      const sheet = await GoogleSheet.getSheet()
      return sheet
    } catch (error) {
      Utils.log(error)
      return null
    }
  }

  async getFileInfo () {
    try {
      await this.asyncSetState({ isGettingFile: true })
      const sheet = await this.getFileId()
      if (!sheet) {
        await this.asyncSetState({ isGettingFile: false })
        return null
      }
      const tokens = this.props.login
      if (!tokens) {
        throw new Error('Token empty')
      }
      GDrive.setAccessToken(tokens.accessToken)
      GDrive.init()
      const fileInfo = await GDrive.files.get(sheet.spreadsheetId, { fields: '*' })
      await this.asyncSetState({ fileInfo, isGettingFile: false })
    } catch (error) {
      await this.asyncSetState({ isGettingFile: false })
    }
  }

  async download () {
    try {
      await this.asyncSetState({ doingDownload: true })
      const sheet = await this.getFileId()
      if (!sheet) {
        await this.asyncSetState({ doingDownload: false })
        return null
      }
      const result = await Api.downloadFile(sheet.spreadsheetId)
      Toast.show({
        text: t('imported_transactions', { num: result.transactions.length }),
        buttonText: 'OK',
        duration: 3000
      })
      await this.asyncSetState({ doingDownload: false })
    } catch (error) {
      await this.asyncSetState({ doingDownload: false })
      Utils.log('download error', error)
    }
  }

  async signIn (isSilent = false) {
    try {
      const { tokens, userInfo } = await GoogleApi.signIn()
      if (tokens && userInfo) {
        this.props.loginSuccess(tokens)
        this.setState({ isSignedIn: true, user: userInfo.user })
        await this.getFileInfo()
      }
    } catch (error) {
      Utils.log('error', error)
      Toast.show({
        text: t('signed_failed'),
        buttonText: 'OK',
        duration: 3000
      })
    }
  };

  _renderLoginButton () {
    return (
      <View style={[ApplicationStyles.components.card, { height: 150, marginTop: 10 }]}>
        <CardItem header bordered>
          <Text>{I18n.t('Signin to backup with GDrive')}</Text>
        </CardItem>
        <CardItem>
          <GoogleSigninButton
            style={{ width: '100%', height: 68 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => this.signIn()}
            disabled={this.state.isSigninInProgress}
          />
        </CardItem>
      </View>

    )
  }

  _renderUser () {
    if (!this.state.user) {
      return null
    }
    const user = this.state.user
    return (
      <View style={[ApplicationStyles.components.card, { height: 90, marginTop: 10 }]}>
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: user.photo }} />
            <Body>
              <Text> {user.name}</Text>
            </Body>
          </Left>
          <Button danger onPress={() => this.signOut()} style={{ alignSelf: 'flex-end' }}><Text>{t('Logout')}</Text></Button>
        </CardItem>
      </View>
    )
  }

  _renderBackup () {
    const fileInfo = this.state.fileInfo || {}
    Utils.log('fileInfo', fileInfo)
    return (
      <View style={[ApplicationStyles.components.card, { height: 260, marginTop: 10 }]}>
        <CardItem header bordered>
          <Text>{I18n.t('Backup And Download')}</Text>
        </CardItem>
        <CardItem bordered>
          {this.state.isGettingFile && <Row style={{ justifyContent: 'center' }}><Spinner /></Row>}
          {!this.state.isGettingFile && (
            <Body>
              <Text>{fileInfo && fileInfo.name ? `GoogleSheet: ${fileInfo.name}` : 'No backup'}</Text>
              <Text note>{fileInfo ? I18n.t('last_backup', { time: Utils.timeFormat(fileInfo.modifiedTime) }) : ''}</Text>
            </Body>)}

        </CardItem>
        {!this.state.isGettingFile && (
          <CardItem style={{ justifyContent: 'space-around' }}>
            <ConfirmationButton
              onConfirm={() => this.backup()}
              buttonContent={this.state.doingBackup ? <Spinner /> : (<Text>{t('Backup')}</Text>)}
              info
            />
            <ConfirmationButton
              onConfirm={() => this.download()}
              buttonContent={this.state.doingDownload ? <Spinner /> : (<Text>{t('Download')}</Text>)}
              success
            />
          </CardItem>
        )}
      </View>
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
      await this.asyncSetState({ doingImportFromFile: true })
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
      const result = await Api.importFromFile(res.uri)
      Toast.show({
        text: `Updated ${result.length} transactions`,
        buttonText: 'OK',
        duration: 3000
      })
      await this.asyncSetState({ doingImportFromFile: false })
    } catch (err) {
      await this.asyncSetState({ doingImportFromFile: false })
      Toast.show({
        text: 'Updated failed',
        buttonText: 'OK',
        duration: 3000
      })
    }
  }

  _renderImportFromFile () {
    return (
      <View style={[ApplicationStyles.components.card, { height: 130, marginTop: 10 }]}>
        <CardItem header bordered>
          <Text>{t('Import from File')}</Text>
        </CardItem>
        <CardItem style={{ justifyContent: 'space-around' }}>
          {this.state.doingImportFromFile
            ? <ActivityIndicator />
            : <Button info style={{ justifyContent: 'center' }} onPress={() => this._pickFile()}><Text>{t('Pick MoneyLover CSV File')}</Text></Button>}
        </CardItem>
      </View>
    )
  }

  _renderHeader () {
    return (
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.navigation.openDrawer()}>
            <Icon name='menu' />
          </Button>
        </Left>
        <Body>
          <Title>{t('Settings')}</Title>
        </Body>
      </Header>
    )
  }

  renderPhone () {
    Utils.log('render SettingScreen')
    return (
      <Container>
        <ScreenHeader navigation={this.props.navigation} title='Settings' />
        <Content style={{ padding: 10 }}>
          {this._renderImportFromFile()}
          {(!this.props.login) && this._renderLoginButton()}
          {this.props.login && this.state.isSignedIn && this._renderUser()}
          {this.props.login && this.state.isSignedIn && this._renderBackup()}

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
