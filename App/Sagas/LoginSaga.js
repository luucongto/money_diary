import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'
export function * login (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(LoginActions.loginFailure(res.message))
    } else {
      yield put(LoginActions.loginSuccess(res.data))
    }
  } catch (error) {
    yield put(LoginActions.loginFailure(error.message))
  }
}
