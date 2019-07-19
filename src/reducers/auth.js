import * as authConstant from '../actions/auth';
var get = require('lodash.get');

const initialState = {
    userInfo: {},
    accessToken: "",
    isResend: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case authConstant.LOGOUT_SUCCESS: {
            return {
                ...state,
                userInfo: {},
                accessToken: ""
            }
        }
        case authConstant.OTP_REQUEST_SUCCESS: {
            return {
                ...state,
                accessToken: action.payload.accessToken
            }
        }
        case authConstant.INIT_ACCESS_TOKEN: {
            return {
                ...state,
                accessToken: action.payload.data
            }
        }
        case authConstant.GET_USER_INFO_SUCCESS: {
            return {
                ...state,
                userInfo: action.payload.user
            }
        }
        default:
            return state
    }
}