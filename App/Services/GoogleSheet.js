import apisauce from 'apisauce'
import autoBind from 'react-autobind'
import Constants from '../Config/Constants'
import Utils from '../Utils/Utils'
import GDrive from './GDrive'
const MIMESHEET = 'application/vnd.google-apps.spreadsheet'
const FOLDER_NAME = 'MoneyDiary'
class GoogleSheet {
  static _contentTypeJson = 'application/json; charset=UTF-8';
  constructor () {
    autoBind(this)
    this.sheetApi = apisauce.create({
      // base URL is read from the "constructor"
      baseURL: 'https://sheets.googleapis.com/v4/',
      // here are some default headers
      headers: {
        'Content-Type': this._contentTypeJson,
        Accept: 'application/json'
      },
      // 1500 second timeout...
      timeout: 1500000
    })

    this.fileApi = apisauce.create({
      // base URL is read from the "constructor"
      baseURL: 'https://www.googleapis.com/drive/v3/',
      // here are some default headers
      headers: {
        'Content-Type': this._contentTypeJson,
        Accept: 'application/json'
      },
      // 1500 second timeout...
      timeout: 1500000
    })
  }

  authorized (accessToken) {
    this.accessToken = accessToken
    this.sheetApi.setHeader('Authorization', `Bearer ${accessToken}`)
    this.fileApi.setHeader('Authorization', `Bearer ${accessToken}`)
    GDrive.setAccessToken(accessToken)
    GDrive.init()
  }

  async getSheet () {
    const folderRes = await GDrive.files.safeCreateFolder({
      name: FOLDER_NAME,
      parents: ['root']
    })
    Utils.log('folderRes', folderRes)
    const currentFileId = await GDrive.files.getId(FOLDER_NAME, [folderRes], MIMESHEET, false)
    if (!currentFileId) {
      return null
    }
    const response = await this.sheetApi.get(`spreadsheets/${currentFileId}`)
    Utils.log('getSheet', response.data)
    return response.data
  }

  async getData (currentFileId, sheetName, colNum) {
    let col = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.charAt(colNum % 25)
    if (colNum > 25) {
      col = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.charAt(colNum / 25) + col
    }
    const sheetData = await this.sheetApi.get(`spreadsheets/${currentFileId}/values/${sheetName}!A:${col}?majorDimension=ROWS`, null, {
      params: {
        majorDimension: 'ROWS',
        valueRenderOption: 'UNFORMATTED_VALUE'
      }
    })
    return sheetData.data
  }

  async updateData (currentFileId, data, sheetName = 'Transactions', colNum = 12) {
    let col = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.charAt(colNum % 25)
    if (colNum > 25) {
      col = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.charAt(colNum / 25) + col
    }
    const putData = await this.sheetApi.put(`spreadsheets/${currentFileId}/values/${sheetName}!A:${col}`, { values: data }, {
      params: {
        valueInputOption: 'USER_ENTERED'
      }
    })
    Utils.log('putData', putData.data)
    return putData.data
  }

  async createSheet (title = FOLDER_NAME, sheetNames = Constants.SHEETS) {
    const currentSheet = await this.getSheet()
    if (currentSheet) {
      return currentSheet
    }
    const response = await this.sheetApi.post('spreadsheets', {
      properties: {
        title
      },
      sheets: Object.values(sheetNames).map(title => {
        return { properties: { title } }
      })
    })
    Utils.log(response.data)
    const fileId = response.data.spreadsheetId
    Utils.log('GDrive.isInitialized()', GDrive.isInitialized())
    const folderRes = await GDrive.files.safeCreateFolder({
      name: FOLDER_NAME,
      parents: ['root']
    })
    const updateResult = await this.fileApi.patch(`files/${fileId}?addParents=${folderRes}`)
    Utils.log('=========================== result', updateResult)
    return response.data
  }
}

const api = new GoogleSheet()

export default api
