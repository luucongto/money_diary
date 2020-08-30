import { call, put } from 'redux-saga/effects'
import CategoryActions from '../Redux/CategoryRedux'
import LoginActions from '../Redux/LoginRedux'

export function * category (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(CategoryActions.categoryFailure(res.message))
    } else {
      yield put(CategoryActions.categorySuccess(res.data))
    }
  } catch (error) {
    yield put(CategoryActions.categoryFailure(error.message))
  }
}

export function * categoryUpdate (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(CategoryActions.categoryFailure(res.message))
    } else {
      yield put(CategoryActions.categoryUpdateSuccess(res.data))
    }
  } catch (error) {
    yield put(CategoryActions.categoryFailure(error.message))
  }
}

export function * categoryCreate (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(CategoryActions.categoryFailure(res.message))
    } else {
      yield put(CategoryActions.categoryCreateSuccess(res.data))
    }
  } catch (error) {
    yield put(CategoryActions.categoryFailure(error.message))
  }
}

export function * categoryDelete (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(CategoryActions.categoryFailure(res.message))
    } else {
      yield put(CategoryActions.categoryDeleteSuccess(res.data))
    }
  } catch (error) {
    yield put(CategoryActions.categoryFailure(error.message))
  }
}
