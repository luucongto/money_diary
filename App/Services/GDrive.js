import Files from './Files'
import Permissions from './Permissions'
import {
  StaticUtils,
  ArrayStringifier
} from 'simple-common-utils'
import Utils from '../Utils/Utils'
import apisauce from 'apisauce'

export default class GDrive {
  static _uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files'
  static _urlFiles = 'https://www.googleapis.com/drive/v3/files';
  static _contentTypeJson = 'application/json; charset=UTF-8';
  static uploadApi = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: this._uploadUrl,
    // here are some default headers
    headers: {
      'Content-Type': this._contentTypeJson,
      Accept: 'application/json'
    },
    // 15 second timeout...
    timeout: 1500000
  })

  static fileApi = apisauce.create({
    // base URL is read from the "constructor"
    baseURL: this._urlFiles,
    // here are some default headers
    headers: {
      'Content-Type': this._contentTypeJson,
      Accept: 'application/json'
    },
    // 15 second timeout...
    timeout: 1500000
  })

  static init (params = {}) {
    GDrive.files = new Files(params.files)
    GDrive.permissions = new Permissions()
  }

  static setAccessToken (accessToken) {
    GDrive.accessToken = accessToken
    try {
      this.uploadApi.setHeader('Authorization', `Bearer ${accessToken}`)
      this.fileApi.setHeader('Authorization', `Bearer ${accessToken}`)
    } catch (e) {
      Utils.log('GDriveApi setAccessToken Error', JSON.stringify(e))
    }
  }

  static isInitialized () {
    return !!GDrive.accessToken
  }

  static _createHeaders (contentType, contentLength, ...additionalPairs) {
    let pairs = [
      ['Authorization', `Bearer ${GDrive.accessToken}`]
    ];

    [
      ['Content-Type', contentType],
      ['Content-Length', contentLength]
    ].forEach(data => data[1] ? pairs.push(data) : undefined)

    if (additionalPairs) {
      pairs = pairs.concat(additionalPairs)
    }

    const headers = new Headers()

    for (const pair of pairs) {
      headers.append(pair[0], pair[1])
    }

    return headers
  }

  static _stringifyQueryParams (queryParams, prefix = '?', separator = '&', quoteIfString) {
    const array = []

    Object.keys(queryParams).forEach(key => array.push(
      `${key}=${StaticUtils.safeQuoteIfString(queryParams[key], quoteIfString)}`))

    return new ArrayStringifier(array)
      .setPrefix(prefix)
      .setSeparator(separator)
      .process()
  }
}
