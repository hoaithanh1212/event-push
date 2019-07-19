import {AsyncStorage, Alert, Platform} from 'react-native';
import {
    put, takeLatest, all, call
} from 'redux-saga/effects';
import {
    AccessToken, LoginManager,
    GraphRequest,
    GraphRequestManager
} from "react-native-fbsdk";
import {GoogleSignin, statusCodes} from "react-native-google-signin";
var get = require('lodash.get');

import * as authApi from '../services/authService';
import {showLoading} from '../actions/app';
import * as authConstant from '../actions/auth';
import * as appConstant from '../actions/app';
import {pushNav, resetNav} from '../actions/navigate';
import Configure from '../contants/configure';
import {RouteKey} from '../contants/route-key';
import {showMessage} from '../common/Message';
import * as requestConstant from '../actions/request'

export default function* watchAuth() {
    yield all([
        takeLatest(authConstant.LOGIN, login),
        takeLatest(authConstant.SOCIAL_LOGIN_BY_FB, loginByFb),
        takeLatest(authConstant.SOCIAL_LOGIN_BY_GG, loginByGG),
        takeLatest(authConstant.REGISTER_PARTNER, register),
        takeLatest(authConstant.LOGOUT, logout),
        takeLatest(authConstant.FORGOT_PASSWORD, forgotPassword),
        takeLatest(authConstant.OTP_REQUEST, otpRequest),
        takeLatest(authConstant.OTP_RESEND, otpResend),
        takeLatest(authConstant.GET_USER_INFO, getUserInfo)
    ])
}

function* login(data) {
    yield put(showLoading(true))
    let response = yield call(authApi.login, data.payload)
    console.log('DATA-->', response)
    if (response.statusCode === 200) {
        console.log('login-email', response)
        yield put({type: authConstant.LOGIN_SUCCESS})
        yield put(pushNav(RouteKey.OTP, {email: data.payload, loginToken: response.data}))
        AsyncStorage.setItem(Configure.LOGIN_TOKEN, response.data.token)
    } else {
        showMessage(get(response, 'message',''))
    }
    yield put(showLoading(false))
}

function* loginByFb() {
    yield put(showLoading(true))
    try {
        let data = yield AccessToken.getCurrentAccessToken()
        if (data && data.accessToken) {
            let response = yield call(authApi.loginViaFb, data.accessToken)
            console.log("data facebook", response)
            if (response.statusCode === 200) {
                yield put({type: authConstant.SOCIAL_LOGIN_SUCCESS})
                yield put(pushNav(RouteKey.OTP, {email: data.payload, loginToken: response.data}))
            } else {
                showMessage(get(response, 'message',''))
            }
        } else {
            LoginManager.setLoginBehavior(Platform.OS === 'android' ? 'NATIVE_WITH_FALLBACK' : 3)
            let loginResult = yield LoginManager.logInWithReadPermissions([
                'public_profile',
                'email'
            ])

            if (!loginResult.isCancelled) {
                let data = yield AccessToken.getCurrentAccessToken()
                if (data && data.accessToken) {
                    let response = yield call(authApi.loginViaFb, data.accessToken)
                    console.log("data facebook", response)
                    if (response.statusCode === 200) {
                        yield put({type: authConstant.SOCIAL_LOGIN_SUCCESS})
                        yield put(pushNav(RouteKey.OTP, {email: data.payload, loginToken: response.data}))
                    } else {
                        showMessage(get(response,'message',''))
                    }
                }
            }
        }
        yield put(showLoading(false))
    } catch (err) {
        yield put(showLoading(false))
        showMessage(get(err, 'message',''))
    }


}

function getFacebookUserProfile() {
    return new Promise((resolve, reject) => {
        const infoRequest = new GraphRequest(
            '/me?fields=picture.type(large),email,name',
            null,
            (error, userInfo) => {
                resolve({error, userInfo});
            }
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    })
}

function* loginByGG() {

    yield put(showLoading(true))
    try {
        let userInfo = yield GoogleSignin.signIn()
        if (!userInfo)
            return null

        let response = yield call(authApi.loginViaGG, userInfo.idToken)
        if (response.statusCode === 200) {
            console.log('login-google', response)
            yield put({type: authConstant.SOCIAL_LOGIN_SUCCESS})
            yield put(pushNav(RouteKey.OTP, {loginToken: response.data}))
        } else {
            showMessage(get(response && response, 'message',''))
        }

    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {

        } else {
            showMessage(get(error && error,'message',''))
        }
    }

    yield put(showLoading(false))
}

function* register(data) {
    yield put(showLoading(true))
    let response = yield call(authApi.register, data.payload)
    if (response.statusCode === 200) {
        yield put({type: authConstant.REGISTER_SUCCESS})
        Alert.alert("Register successfully", "Thank you for your application. We will inform you shortly via email when your account has been activated.")
        yield put(pushNav(RouteKey.Login))
    } else {
        showMessage(get(response, 'message',''))
    }
    yield put(showLoading(false))
}

function* forgotPassword(data) {
    yield put(showLoading(true))
    let response = yield call(authApi.forgotPassword, data.payload)
    if (response.statusCode === 200) {
        yield put(pushNav(RouteKey.ForgotPasswordSuccess, {email: data.payload.email}))
    } else {
        yield put({type: authConstant.FORGOT_PASSWORD_FAIL})
        showMessage(get(response, 'message', ''))
    }
    yield put(showLoading(false))
}

function* logout(data) {
    try {
        let response = yield call(authApi.logout, data.payload)
        // if (response.statusCode === 200) {
            yield AsyncStorage.removeItem(Configure.ACCESS_TOKEN)
            yield AsyncStorage.removeItem(Configure.LOGIN_TOKEN)
            yield put({type: authConstant.LOGOUT_SUCCESS})
            yield put({type: requestConstant.CLEAR_FILTER_DATA})
            yield put({type: appConstant.CLEAN_APP_DATA})
        // } else {
        //     showMessage(get(response, 'message',''))
        // }
    }
    catch (err) {
        showMessage(get(err,'message',''))
    }
}

function* otpRequest(data) {
    yield put(showLoading(true))
    let response = yield call(authApi.otpRequest, data.payload)
    if (response.statusCode === 200) {
        yield put({type: authConstant.OTP_REQUEST_SUCCESS, payload: {accessToken: response.data.accessToken}})
        yield put({type: appConstant.GET_ALL_NECESSARY_DATA})
        yield put({type: authConstant.GET_USER_INFO})
        yield put(resetNav(RouteKey.DashBoard))
        AsyncStorage.setItem(Configure.ACCESS_TOKEN, response.data.accessToken)
    } else {
        showMessage(get(response, 'message',''))
    }
    yield put(showLoading(false))
}

function* otpResend(data) {
    yield put(showLoading(true))
    let response = yield call(authApi.otpResend, data.payload)
    if (response.statusCode === 200) {
        yield put({type: authConstant.OTP_RESEND_SUCCESS})
        Alert.alert("Warning", "Resend code successfully, please check message.")
    } else {
        showMessage(get(response, 'message',''))
    }
    yield put(showLoading(false))
}

function* getUserInfo() {
    let response = yield call(authApi.getUserInfo)
    if (response.statusCode === 200) {
        console.log("user info", response)
        yield put({type: authConstant.GET_USER_INFO_SUCCESS, payload: {user: response.data}})
    }
}
