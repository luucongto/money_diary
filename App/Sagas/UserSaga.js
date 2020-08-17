import { call, put } from 'redux-saga/effects'
import UserActions from '../Redux/UserRedux'
import LoginActions from '../Redux/LoginRedux'
export function * user (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(UserActions.userFailure(res.message))
    } else {
      yield put(UserActions.userSuccess(res.data))
    }
  } catch (error) {
    yield put(UserActions.userFailure(error.message))
  }
}
