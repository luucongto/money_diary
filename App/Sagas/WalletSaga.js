import { call, put } from 'redux-saga/effects'
import WalletActions from '../Redux/WalletRedux'
import LoginActions from '../Redux/LoginRedux'

export function * wallet (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(WalletActions.walletFailure(res.message))
    } else {
      yield put(WalletActions.walletSuccess(res.data))
    }
  } catch (error) {
    yield put(WalletActions.walletFailure(error.message))
  }
}

export function * walletUpdate (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(WalletActions.walletFailure(res.message))
    } else {
      yield put(WalletActions.walletUpdateSuccess(res.data))
    }
  } catch (error) {
    yield put(WalletActions.walletFailure(error.message))
  }
}

export function * walletCreate (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(WalletActions.walletFailure(res.message))
    } else {
      yield put(WalletActions.walletCreateSuccess(res.data))
    }
  } catch (error) {
    yield put(WalletActions.walletFailure(error.message))
  }
}

export function * walletDelete (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(WalletActions.walletFailure(res.message))
    } else {
      yield put(WalletActions.walletDeleteSuccess(res.data))
    }
  } catch (error) {
    yield put(WalletActions.walletFailure(error.message))
  }
}
