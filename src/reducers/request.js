import * as requestConstant from '../actions/request';
var get = require('lodash.get');

const initialState = {
    requests: [],
    requestData: {},
    totalPage: 0,
    filterData: {},
    filterDateRange: {},
    searchKey: '',
    page: 0,
    columns: [],
    selectedRequests: [],
    totalItem: 0,
    dashboardStatus: ''
}

export default function (state = initialState, action) {
    switch (action.type) {
        case requestConstant.GET_REQUESTS_SUCCESS: {
            var originData = state.requests ? state.requests : []
            let data = get(action.payload, "data.list", [])
            let page = get(action.payload, "pageIndex", 0)
            let totalPage = get(action.payload, "totalPage", 0)
            let totalItem = get(action.payload, "totalItem", 0)
            if (page !== 0) {
                originData = originData.concat(data)
            } else {
                originData = data
            }

            return {
                ...state,
                requests: originData,
                totalPage: totalPage,
                page: page,
                totalItem: totalItem
            }

        }
        case requestConstant.GET_REQUESTS_FAIL: {
            return {
                ...state,
                requests: [],
                totalPage: 0,
                page: 0,
                totalItem: 0
            }
        }
        case requestConstant.GET_REQUEST_SUCCESS: {
            return {
                ...state,
                requestData: get(action.payload, 'data', {}),
            }

        }

        case requestConstant.FILTER_DATA_SUCCESS: {
            return {
                ...state,
                filterData: get(action, 'payload', {})
            }
        }

        case requestConstant.FILTER_DATE_RANGE_DATA_SUCCESS: {
            return {
                ...state,
                filterDateRange: get(action, 'payload', {})
            }
        }

        case requestConstant.INPUT_SEARCH_KEYWORD: {
            return {
                ...state,
                searchKey: get(action, 'payload', ''),
            }
        }

        case requestConstant.SETTING_SHOW_COLUMNS: {
            return {
                ...state,
                columns: get(action, 'payload', []),
            }
        }

        case requestConstant.SELECT_REQUEST: {
            let ids = get(action, 'payload', [])
            return {
                ...state,
                selectedRequests: ids,
            }
        }
        case requestConstant.CLEAR_FILTER_DATA: {
            return {
                ...state,
                filterData: {},
                filterDateRange: {},
                dashboards: {}
            }
        }
        case requestConstant.CLEAR_REQUEST_DATA: {
            return {
                ...state,
                requests: []
            }
        }
        case requestConstant.GET_CHART_1_SUCCESS: {
            return {
              ...state,
              chart1: get(action, 'payload', [])
            }
        }
        case requestConstant.GET_CHART_2_SUCCESS: {
            return {
              ...state,
              chart2: get(action, 'payload', [])
            }
        }
        case requestConstant.GET_CHART_3_SUCCESS: {
            return {
              ...state,
              chart3: get(action, 'payload', [])
            }
        }
        case requestConstant.GET_CHART_4_SUB_1_SUCCESS: {
            return {
              ...state,
              chart4Sub1: get(action, 'payload', [])
            }
        }
        case requestConstant.GET_CHART_4_SUB_2_SUCCESS: {
            return {
              ...state,
              chart4Sub2: get(action, 'payload', [])
            }
        }
        case requestConstant.GET_CHART_5_SUCCESS: {
            return {
              ...state,
              chart5: get(action, 'payload', [])
            }
        }
        case requestConstant.DASHBOARD_STATUS: {
            return {
                ...state,
                dashboardStatus: get(action, 'payload', '')
            }
        }
        default:
            return state
    }
}