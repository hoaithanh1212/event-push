var get = require('lodash.get');

import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';

export function register(data) {
    return HttpService.post(Configure.CompassApi + `UserManagers/register`, data)
}

export function login(data) {

    let model = {
        clientId: Configure.ClientId,
        clientSecret: Configure.ClientSecret,
        userName: get(data, "userName", ""),
        password: get(data, "password", ""),
    }

    return HttpService.post(Configure.CompassApi + `UserManagers/login`, model)
}

export function loginViaFb(accessToken) {

    let model = {
        accessToken: accessToken,
    }
    console.log("log nhe", accessToken)
    return HttpService.post(Configure.CompassApi + `UserManagers/login-facebook`, model)
}

export function loginViaGG(tokenId) {

    let model = {
        tokenId: tokenId,
    }

    return HttpService.post(Configure.CompassApi + `UserManagers/login-google`, model)
}

export function forgotPassword(model) {
    return HttpService.post(Configure.CompassApi + `UserManagers/forgotPassword`, model)
}

export function otpRequest(data) {

    let model = {
        userName: get(data, "userName", ""),
        otp: get(data, "otp", ""),
        token: get(data, "loginToken", ""),
        deviceToken: get(data, "deviceToken", ""),
        deviceId: get(data, "deviceId", ""),
        os: get(data, "os", "")
    }
    console.log('otp request', model)

    return HttpService.post(Configure.CompassApi + `UserManagers/login-otp`, model)
}

export function otpResend(data) {

    let model = {
        token: get(data, "loginToken", ""),
    }

    return HttpService.post(Configure.CompassApi + `UserManagers/ResendOtp`, model)
}

export function getUserInfo() {
    return HttpService.get(Configure.CompassApi + `UserManagers/getUserInfo`)
}

export function logout(data) {
    console.log('model logout', data);
    return HttpService.post(Configure.CompassApi + `UserManagers/logout`, data)
}

export function editProfile(model) {
    console.log("model edit profile", model);
    return HttpService.put(Configure.CompassApi + `UserManagers/editProfile`, model)
  }

