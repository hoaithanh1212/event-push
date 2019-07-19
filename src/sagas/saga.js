import {all, fork} from 'redux-saga/effects';

import watchAuth from './authSaga';
import watchNavigate from './navigateSaga';
import watchApp from './appSaga';
import watchUser from './userSaga';
import watchSkillSet from './skillSetSaga';
import watchRequest from './requestSaga';
import watchPO from './poSaga'

export default function* rootSaga() {
  yield all([
    fork(watchAuth),
    fork(watchNavigate),
    fork(watchApp),
    fork(watchUser),
    fork(watchSkillSet),
    fork(watchRequest),
    fork(watchPO)
  ])
}