export const GET_REQUESTS = "GET_REQUESTS"
export const GET_REQUESTS_SUCCESS = "GET_REQUESTS_SUCCESS"
export const GET_REQUESTS_FAIL = "GET_REQUESTS_FAIL"
export function getRequestsAction(
    progamId, grcId, districtId,
    divisionId, status, startDate,
    endDate, searchDetail, pageIndex, showLoading) {

    return {
        type: GET_REQUESTS,
        payload: {
            progamId: progamId,
            grcId: grcId,
            districtId: districtId,
            divisionId: divisionId,
            status: status,
            startDate: startDate,
            endDate: endDate,
            searchDetail: searchDetail,
            pageIndex: pageIndex,
            showLoading: showLoading,
        }
    }
}

export const ActionRequestType = {
    Approve: true,
    Reject: false
}

export const GET_REQUEST = "GET_REQUEST"
export const GET_REQUEST_SUCCESS = "GET_REQUEST_SUCCESS"
export function getRequestAction(id) {
    return {
        type: GET_REQUEST,
        payload: id
    }
}

export const FILTER_DATA = "FILTER_DATA"
export const FILTER_DATA_SUCCESS = "FILTER_DATA_SUCCESS"
export function filterDataAction(filter) {
    return {
        type: FILTER_DATA,
        payload: filter
    }
}

export const FILTER_DATE_RANGE_DATA = "FILTER_DATE_RANGE_DATA"
export const FILTER_DATE_RANGE_DATA_SUCCESS = "FILTER_DATE_RANGE_DATA_SUCCESS"
export function filterDateRangeAction(filterDate) {
    return {
        type: FILTER_DATE_RANGE_DATA,
        payload: filterDate
    }
}

export const CLEAR_FILTER_DATA = "CLEAR_FILTER_DATA"
export function clearFilterData() {
    return {
        type: CLEAR_FILTER_DATA
    }
}

export const INPUT_SEARCH_KEYWORD = "INPUT_SEARCH_KEYWORD"
export function inputSearchKey(keyword) {
    return {
        type: INPUT_SEARCH_KEYWORD,
        payload: keyword
    }
}

export const SETTING_SHOW_COLUMNS = "SETTING_SHOW_COLUMNS"
export function saveColumnsSetting(columns) {
    return {
        type: SETTING_SHOW_COLUMNS,
        payload: columns
    }
}

export const ASSIGN_REQUEST_FOR_TRAINER = "ASSIGN_REQUEST_FOR_TRAINER"
export function assignRequestForTrainerAction(trainerId, ids) {
    return {
        type: ASSIGN_REQUEST_FOR_TRAINER,
        payload: {
            trainerId: trainerId,
            ids: ids
        }
    }
}

export const SELECT_REQUEST = "SELECT_REQUEST"
export function selectRequest(ids) {
    return {
        type: SELECT_REQUEST,
        payload: ids
    }
}

export const INIT_FILTER_DATA = "INIT_FILTER_DATA"
export const INIT_FILTER_DATA_SUCCESS = "INIT_FILTER_DATA_SUCCESS"
export function initFilterData(data) {
    return {
        type: INIT_FILTER_DATA,
        payload: data
    }
}

export const CLEAR_REQUEST_DATA = "CLEAR_REQUEST_DATA"
export function clearRequestData() {
    return {
        type: CLEAR_REQUEST_DATA
    }
}

export const GET_CHART_1 = "GET_CHART_1"
export const GET_CHART_1_SUCCESS = "GET_CHART_1_SUCCESS"
export function getChart1(data) {
    return {
        type: GET_CHART_1,
        payload: data
    }
}

export const GET_CHART_2 = "GET_CHART_2"
export const GET_CHART_2_SUCCESS = "GET_CHART_2_SUCCESS"
export function getChart2(data) {
    return {
        type: GET_CHART_2,
        payload: data
    }
}

export const GET_CHART_3 = "GET_CHART_3"
export const GET_CHART_3_SUCCESS = "GET_CHART_3_SUCCESS"
export function getChart3(data) {
    return {
        type: GET_CHART_3,
        payload: data
    }
}

export const GET_CHART_4_SUB_1 = "GET_CHART_4_SUB_1"
export const GET_CHART_4_SUB_1_SUCCESS = "GET_CHART_4_SUB_1_SUCCESS"
export function getChart4Sub1(data) {
    return {
        type: GET_CHART_4_SUB_1,
        payload: data
    }
}

export const GET_CHART_4_SUB_2 = "GET_CHART_4_SUB_2"
export const GET_CHART_4_SUB_2_SUCCESS = "GET_CHART_4_SUB_2_SUCCESS"
export function getChart4Sub2(data) {
    return {
        type: GET_CHART_4_SUB_2,
        payload: data
    }
}

export const GET_CHART_5 = "GET_CHART_5"
export const GET_CHART_5_SUCCESS = "GET_CHART_5_SUCCESS"
export function getChart5(data) {
    return {
        type: GET_CHART_5,
        payload: data
    }
}

export const DASHBOARD_STATUS = "DASHBOARD_STATUS"
export function dashboardStatus(status) {
    return {
        type: DASHBOARD_STATUS,
        payload: status
    }
}