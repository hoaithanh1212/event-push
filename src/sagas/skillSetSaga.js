import {AsyncStorage} from 'react-native';
import {
    put, takeLatest, all, call, take
} from 'redux-saga/effects';
var get = require('lodash.get');

import * as skillSetApi from '../services/skillSetService';
import * as skillSetConstant from '../actions/skillSet';
import Configure from '../contants/configure';
import {showMessage} from '../common/Message';


export default function* watchSkillSet() {
    yield all([
        takeLatest(skillSetConstant.GET_SKILLSETS, getSkillSets),
    ])
}

function* getSkillSets() {
    try {
        const response = yield call(skillSetApi.getSkillSets);
        if (response.statusCode === 200) {
            yield put({type: skillSetConstant.GET_SKILLSETS_SUCCESS, payload: response.data});
        } else {
            showMessage(get(response, 'message', ''))
        }
    } catch (err) {
        showMessage(get(err, 'message', ''))
    }
}