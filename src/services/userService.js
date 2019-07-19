var get = require('lodash.get');
import {stringify} from 'query-string';

import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';

export function getTrainer(userName, mobile, search, pageIndex) {

  let filterModel = {
    userName: userName,
    mobile: mobile,
    Search: search,
    PageIndex: pageIndex,
    PageSize: Configure.PageSize
  }

  return HttpService.get(Configure.CompassApi + `User/trainer?${stringify(filterModel)}`)
}

export function searchPartner(keyword) {
  return HttpService.get(Configure.CompassApi + `PartnerNames?Search=${keyword}&PageSize=20`)
}

export function getUserInfo(userId) {
  return HttpService.get(Configure.CompassApi + `User/` + userId)
}

export function getPartnerName(partnerNameId) {
  return HttpService.get(Configure.CompassApi + `User/GetPartnerName/${partnerNameId}`)
}

export function createTrainer(data) {
  return HttpService.post(Configure.CompassApi + 'User', data)
}

export function deleteUser(userId) {
  return HttpService.delete(Configure.CompassApi + `User/${userId}`)
}


export function updateUser(data, userId) {
  return HttpService.put(Configure.CompassApi + `User/${userId}`, data)
}

export function getTrainerBySP(userName, mobile, search, pageIndex) {

  let filterModel = {
    userName: userName,
    mobile: mobile,
    Search: search,
    PageIndex: pageIndex,
    PageSize: Configure.PageSize
  }

  return HttpService.get(Configure.CompassApi + `User/trainerBySp?${stringify(filterModel)}`)
}

export function changePassword(oldPassword, newPassword) {
  let obj = {
    oldPassword: oldPassword,
    newPassword: newPassword
  }
  return HttpService.postWithTimeout(Configure.CompassApi + 'UserManagers/changePassword', obj)
}

export function filterUser(role) {
  return HttpService.get(Configure.CompassApi + `User/filter?role=` + role)
}

export function editUserPartner(data, userId) {
  return HttpService.put(Configure.CompassApi + `User/editUserPartner?id=${userId}`, data)
}

export function newUserPartner(data) {
  return HttpService.put(Configure.CompassApi + `User/editUserPartner`, data)
}