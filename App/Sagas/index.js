import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
// import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */
import { UserTypes } from '../Redux/UserRedux'
import { StartupTypes } from '../Redux/StartupRedux'

/* ------------- Sagas ------------- */
import { user } from './UserSaga'
import { startup } from './StartupSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = API

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // tool generated sagas
    // some sagas receive extra parameters in addition to an action
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP_REQUEST, startup, api.startup),
    takeLatest(UserTypes.USER_REQUEST, user, api.user)
  ])
}
