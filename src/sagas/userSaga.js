import {
    put, takeLatest, all, call
} from 'redux-saga/effects';
var get = require('lodash.get');

import * as userApi from '../services/userService';
import * as userConstant from '../actions/user';
import Configure from '../contants/configure';
import {showLoading} from '../actions/app';
import {showMessage} from '../common/Message';

export default function* watchUser() {
    yield all([
        takeLatest(userConstant.GET_TRAINER, getTrainer),
    ])
}

function* getTrainer(data) {
    try {
        if (get(data.payload, "showLoading", false)) {
            yield put(showLoading(true))
        }
        let response = yield call(userApi.getTrainerBySP, get(data.payload, "userName", ""),
            get(data.payload, "mobile", ""), get(data.payload, "search", ""), get(data.payload, "pageIndex", 0))
        if (response.statusCode === 200) {
            yield put({
                type: userConstant.GET_TRAINER_SUCCESS, payload: {
                    data: get(response, "data", []),
                    totalPage: get(response, "totalPage", 0),
                    pageIndex: get(response, "pageIndex", 0)
                }
            })
        } else {
            showMessage(get(response, "message", ''))
        }
        if (get(data.payload, "showLoading", false)) {
            yield put(showLoading(false))
        }
    } catch (err) {
        if (get(data.payload, "showLoading", false)) {
            yield put(showLoading(false))
        }
        showMessage(get(err, "message", ""))
    }
}