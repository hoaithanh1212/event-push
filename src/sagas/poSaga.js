/**
 * Created by Hong HP on 4/22/19.
 */
import {
  put, takeLatest, all, call
} from 'redux-saga/effects';
import {getListPOProgramme, getListSPByProgramme} from '../services/poService';
import {
  GET_LIST_PO_PROGRAMME,
  GET_LIST_PO_PROGRAMME_SUCCESS,
  GET_LIST_SP_PROGRAMME,
  GET_LIST_SP_PROGRAMME_SUCCESS
} from '../actions/poAction';

function* getListProgrammeSaga() {
  try {
    const response = yield call(getListPOProgramme)
    if (response.statusCode == 200)
      yield put({type: GET_LIST_PO_PROGRAMME_SUCCESS, listProgramme: response.data})
  } catch (e) {

  }
}

function *getListSPByProgrammeSaga({programType}) {
  try {
    const res = yield call(getListSPByProgramme, programType)
    if (res.statusCode === 200) {
      yield put({type: GET_LIST_SP_PROGRAMME_SUCCESS, listSP: res.data.list})
    }
  } catch (e) {

  }
}

export default function* watchPO() {
  yield all([
    takeLatest(GET_LIST_PO_PROGRAMME, getListProgrammeSaga),
    takeLatest(GET_LIST_SP_PROGRAMME, getListSPByProgrammeSaga),

  ])
}