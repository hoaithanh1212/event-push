export const INIT_ACCESS_TOKEN = "INIT_ACCESS_TOKEN" 

export const REGISTER_PARTNER = "REGISTER_PARTNER"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_FAIL = "REGISTER_FAIL"
export function registerPartnerAction(data) {
    return {
        type: REGISTER_PARTNER,
        payload: data
    }
}

export const LOGIN = "LOGIN"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAIL = "LOGIN_FAIL"
export function login(data) {
    return {
        type: LOGIN,
        payload: data
    }
}

export const SOCIAL_LOGIN_BY_FB = "SOCIAL_LOGIN_BY_FB"
export const SOCIAL_LOGIN_BY_GG = "SOCIAL_LOGIN_BY_GG"
export const SOCIAL_LOGIN_SUCCESS = "SOCIAL_LOGIN_SUCCESS"
export const SOCIAL_LOGIN_FAIL = "SOCIAL_LOGIN_FAIL"
export function loginByFb() {
    return {
        type: SOCIAL_LOGIN_BY_FB,
    }
}
export function loginByGG() {
    return {
        type: SOCIAL_LOGIN_BY_GG,
    }
}

export const LOGOUT = "LOGOUT"
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS"
export const LOGOUT_FAIL = "LOGOUT_FAIL"
export function logout(data) {
    return {
        type: LOGOUT,
        payload: data
    }
}

export const FORGOT_PASSWORD = "FORGOT_PASSWORD"
export const FORGOT_PASSWORD_FAIL = "FORGOT_PASSWORD_FAIL"
export function forgotPassword(model) {
    return {
        type: FORGOT_PASSWORD,
        payload: model
    }
}

export const OTP_REQUEST = "OTP_REQUEST"
export const OTP_REQUEST_SUCCESS = "OTP_REQUEST_SUCCESS"
export const OTP_REQUEST_FAIL = "OTP_REQUEST_FAIL"
export function otpRequest(data) {
    return {
        type: OTP_REQUEST,
        payload: data
    }
}

export const OTP_RESEND = "OTP_RESEND"
export const OTP_RESEND_SUCCESS = "OTP_RESEND_SUCCESS"
export const OTP_RESEND_FAIL = "OTP_RESEND_FAIL"
export function otpResend(data) {
    return {
        type: OTP_RESEND,
        payload: data
    }
}

export const GET_USER_INFO = "GET_USER_INFO"
export const GET_USER_INFO_SUCCESS = "GET_USER_INFO_SUCCESS"
export const GET_USER_INFO_FAIL = "GET_USER_INFO_FAIL"
export function getUserInfo() {
    return {
        type: GET_USER_INFO
    }
}