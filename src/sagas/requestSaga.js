import {Alert} from 'react-native';
import {
    put, takeLatest, all, call
} from 'redux-saga/effects';
var get = require('lodash.get');

import * as requestApi from '../services/requestService';
import * as requestConstant from '../actions/request';
import Configure from '../contants/configure';
import {showLoading} from '../actions/app';
import {showMessage} from '../common/Message';
import {getRequestsAction} from '../actions/request';
import {RouteKey} from '../contants/route-key';
import {resetNav, pushNav} from '../actions/navigate';

export default function* watchRequest() {
    yield all([
        takeLatest(requestConstant.GET_REQUESTS, getRequests),
        takeLatest(requestConstant.GET_REQUEST, getRequestData),
        takeLatest(requestConstant.FILTER_DATA, filterData),
        takeLatest(requestConstant.FILTER_DATE_RANGE_DATA, filterDataRange),
        takeLatest(requestConstant.ASSIGN_REQUEST_FOR_TRAINER, handelAssignRequest),
        takeLatest(requestConstant.INIT_FILTER_DATA, initFilter),
        takeLatest(requestConstant.GET_CHART_1, getChart1),
        takeLatest(requestConstant.GET_CHART_2, getChart2),
        takeLatest(requestConstant.GET_CHART_3, getChart3),
        takeLatest(requestConstant.GET_CHART_4_SUB_1, getChart4Sub1),
        takeLatest(requestConstant.GET_CHART_4_SUB_2, getChart4Sub2),
        takeLatest(requestConstant.GET_CHART_5, getChart5)
    ])
}

function* getRequests(data) {
    try {
        if (get(data.payload, "showLoading", false)) {
            yield put(showLoading(true))
        }

        let response = yield call(requestApi.getListRequest,
            get(data.payload, "progamId", []),
            get(data.payload, "grcId", []),
            get(data.payload, "districtId", []),
            get(data.payload, "divisionId", []),
            get(data.payload, "status", []),
            get(data.payload, "startDate", []),
            get(data.payload, "endDate", []),
            get(data.payload, "searchDetail", []),
            get(data.payload, "pageIndex", 0),
            Configure.PageSize)
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_REQUESTS_SUCCESS, payload: {
                    data: get(response, "data", []),
                    totalPage: get(response, "data.totalPage", 0),
                    pageIndex: get(response, "data.pageIndex", 0),
                    totalItem: get(response, "data.totalItem", 0)
                }
            })
        } else {
            showMessage(get(response, "message"))
            yield put({
                type: requestConstant.GET_REQUESTS_FAIL
            })
        }
        if (get(data.payload, "showLoading", false)) {
            yield put(showLoading(false))
        }
    } catch (err) {
        if (get(data.payload, "showLoading", false)) {
            yield put(showLoading(false))
        }
        showMessage(get(err, "message", ""))
        yield put({
            type: requestConstant.GET_REQUESTS_FAIL
        })
    }
}

function* getRequestData(id) {
    try {
        let response = yield call(requestApi.getRequestDetail, get(data.payload, "id", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_REQUEST_SUCCESS, payload: {
                    data: get(response, "data", {})
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* filterData(data) {
    try {
        yield put({
            type: requestConstant.FILTER_DATA_SUCCESS, payload: data.payload
        })
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* filterDataRange(data) {
    try {
        yield put({
            type: requestConstant.FILTER_DATE_RANGE_DATA_SUCCESS, payload: data.payload
        })
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* handelAssignRequest(data) {
    try {
        let response = yield call(requestApi.assignRequest, get(data.payload, "trainerId", ''), get(data.payload, "ids", []))
        if (response.statusCode === 200) {
            Alert.alert("Alert", "The request have been successfully assigned")
            yield put({
                type: requestConstant.GET_REQUESTS,
                payload: {
                    search: '',
                    columnSearch: [],
                    progamId: [],
                    grcId: [],
                    districtId: [],
                    divisionId: [],
                    status: [],
                    startDate: '',
                    endDate: '',
                    pageIndex: 0,
                    showLoading: false,
                }
            })
            yield put(pushNav(RouteKey.ListRequest))

        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* initFilter(data) {
    console.log('thanh log filter data', data)
    try {
        let lstPrograms = [];
        let lstDistricts = [];
        let lstGrcs = [];
        let lstDivisions = [];
        let lstStatus = [];

        if (data.payload) {
            let grcs = get(data, "payload[0].data.list", [])
            let districts = get(data, "payload[1].data.list", [])
            let divisions = get(data, "payload[2].data.list", [])
            let programTypes = get(data, "payload[4].data.list", [])
            let status = get(data, "payload[6].data.list", [])

            lstPrograms = programTypes.map(program => {
                return {...program, selected: true};
            });

            lstDistricts = districts.map(district => {
                return {...district, selected: true};
            });

            lstGrcs = grcs.map(grc => {
                return {...grc, selected: true};
            });

            lstDivisions = divisions.map(division => {
                return {...division, selected: true};
            });

            lstStatus = status.map(st => {
                return {...st, selected: true};
            });

            let lstFilterData = {
                programs: lstPrograms,
                districts: lstDistricts,
                grcs: lstGrcs,
                divisions: lstDivisions,
                status: lstStatus,
                isActiveFilter: false
            };
            yield put({type: requestConstant.FILTER_DATA, payload: lstFilterData})
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* getChart1(data) {
    try {
        let response = yield call(requestApi.chart1, get(data.payload, "startDate", ''), get(data.payload, "endDate", ''), get(data.payload, "chart1FieldType", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_CHART_1_SUCCESS,
                payload: {
                    chart1: response.data,
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* getChart2(data) {
    try {
        let response = yield call(requestApi.chart2, get(data.payload, "startDate", ''), get(data.payload, "endDate", ''), get(data.payload, "chart2FieldType", ''), get(data.payload, "chart2ChildId", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_CHART_2_SUCCESS,
                payload: {
                    chart2: response.data,
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* getChart3(data) {
    try {
        let response = yield call(requestApi.chart3, get(data.payload, "startDate", ''), get(data.payload, "endDate", ''), get(data.payload, "chart3FieldType", ''), get(data.payload, "chart3ChildId", ''), get(data.payload, "frequencyType", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_CHART_3_SUCCESS,
                payload: {
                    chart3: response.data,
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* getChart4Sub1(data) {
    try {
        let response = yield call(requestApi.chart4sub1, get(data.payload, "startDate", ''), get(data.payload, "endDate", ''), get(data.payload, "chart4Sub1FieldType", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_CHART_4_SUB_1_SUCCESS,
                payload: {
                    chart4Sub1: response.data,
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* getChart4Sub2(data) {
    try {
        let response = yield call(requestApi.chart4sub2, get(data.payload, "startDate", ''), get(data.payload, "endDate", ''), get(data.payload, "chart4Sub2FieldType", ''), get(data.payload, "chart4Sub2ChildId", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_CHART_4_SUB_2_SUCCESS,
                payload: {
                    chart4Sub2: response.data,
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}

function* getChart5(data) {
    try {
        let response = yield call(requestApi.chart5, get(data.payload, "startDate", ''), get(data.payload, "endDate", ''), get(data.payload, "chart5FieldType", ''))
        if (response.statusCode === 200) {
            yield put({
                type: requestConstant.GET_CHART_5_SUCCESS,
                payload: {
                    chart5: response.data,
                }
            })
        } else {
            showMessage(get(response, "message"))
        }
    } catch (err) {
        showMessage(get(err, "message", ""))
    }
}