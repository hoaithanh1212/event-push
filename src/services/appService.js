import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';
import {stringify} from 'query-string';

export function getGRCs() {
  return HttpService.get(Configure.CompassApi + `GRCs?PageSize=1000000`)
}

export function getDivisions() {
  return HttpService.get(Configure.CompassApi + `Divisions?PageSize=1000000`)
}

export function getDistricts() {
  return HttpService.get(Configure.CompassApi + `Districts?PageSize=1000000`)
}

export function getPartnerNames(search) {

  let params = {
    search: search
  }
  return HttpService.get(Configure.CompassApi + `PartnerNames?${stringify(params)}`)
}

export function getActivities(search) {

  let params = {
    search: search
  }
  return HttpService.get(Configure.CompassApi + `Activities?${stringify(params)}`)
}

export function getProgramTypes(search) {

  let params = {
    search: search
  }
  // return HttpService.get(Configure.CompassApi + `Programs?${stringify(params)}`)
  return HttpService.get(Configure.CompassApi + `Programs?PageSize=100`)
}

export function getRoles() {
  return HttpService.get(Configure.CompassApi + `Roles`)
}

export function getAvailableRequestStatus() {
  return HttpService.get(Configure.CompassApi + `requestdetails/status`)
}

export function getNotifications(search, pageIndex) {
  let params = {
    PageIndex: pageIndex,
    PageSize: Configure.PageSize,
    Search: search
  }
  return HttpService.get(Configure.CompassApi + `Notifications?${stringify(params)}`)
}

export function getSettings() {
  return HttpService.get(Configure.CompassApi + `Settings`)
}