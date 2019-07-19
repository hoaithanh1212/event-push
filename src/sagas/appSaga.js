import {AsyncStorage} from 'react-native';
import {
  put, takeLatest, all, call, take
} from 'redux-saga/effects';

import * as appApi from '../services/appService';
import * as appAction from '../actions/app';
import * as authAction from '../actions/auth';
import * as requestAction from '../actions/request';
import Configure from '../contants/configure';
import {resetNav, pushNav} from '../actions/navigate';
import {RouteKey} from '../contants/route-key';
import {showMessage} from '../common/Message';

var get = require('lodash.get');

export default function* watchApp() {
  yield all([
    takeLatest(appAction.GET_ALL_NECESSARY_DATA, getAllNecessaryData),
    takeLatest(appAction.INIT_NECESSARY_DATA, initData),
    takeLatest(appAction.GET_PARTNER_NAMES, getPartnerNames)
  ])
}

function* getAllNecessaryData() {
  try {
    let data = yield all([
      call(appApi.getGRCs),
      call(appApi.getDistricts),
      call(appApi.getDivisions),
      call(appApi.getActivities),
      call(appApi.getProgramTypes),
      call(appApi.getRoles),
      call(appApi.getSettings)
    ])
    yield put({type: appAction.GET_ALL_NECESSARY_DATA_SUCCESS, data: data})
    yield put({type: requestAction.INIT_FILTER_DATA, payload: data})
  } catch (err) {

  }
}

function* initData() {
  try {
    let accessToken = yield AsyncStorage.getItem(Configure.ACCESS_TOKEN);
    if (accessToken && accessToken !== '') {
      yield put({type: authAction.INIT_ACCESS_TOKEN, payload: {data: accessToken}})
      yield put({type: authAction.GET_USER_INFO})
      yield call(getAllNecessaryData);
    }
  } catch (error) {
  }
}

function* getPartnerNames(data) {
  try {
    const partnerNames = yield call(appApi.getPartnerNames, get(data.payload, 'search', ''));
    yield put({type: appAction.GET_PARTNER_NAMES_SUCCESS, payload: get(partnerNames, 'data.list', [])});
  } catch (error) {
    showMessage(get(error, 'message', ''))
  }
}

