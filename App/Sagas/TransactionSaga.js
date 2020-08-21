import { call, put } from 'redux-saga/effects'
import TransactionActions from '../Redux/TransactionRedux'
import LoginActions from '../Redux/LoginRedux'

export function * transaction (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(TransactionActions.transactionFailure(res.message))
    } else {
      yield put(TransactionActions.transactionSuccess(res.data))
    }
  } catch (error) {
    yield put(TransactionActions.transactionFailure(error.message))
  }
}

export function * transactionUpdate (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(TransactionActions.transactionFailure(res.message))
    } else {
      yield put(TransactionActions.transactionUpdateSuccess(res.data))
    }
  } catch (error) {
    yield put(TransactionActions.transactionFailure(error.message))
  }
}

export function * transactionCreate (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(TransactionActions.transactionFailure(res.message))
    } else {
      yield put(TransactionActions.transactionCreateSuccess(res.data))
    }
  } catch (error) {
    yield put(TransactionActions.transactionFailure(error.message))
  }
}

export function * transactionDelete (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(TransactionActions.transactionFailure(res.message))
    } else {
      yield put(TransactionActions.transactionDeleteSuccess(res.data))
    }
  } catch (error) {
    yield put(TransactionActions.transactionFailure(error.message))
  }
}
