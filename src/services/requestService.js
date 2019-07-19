var get = require('lodash.get');
import {stringify} from 'query-string';
import moment from 'moment';

import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';

export function getListRequest(progamId, grcId, districtId,
  divisionId, status, startDate, endDate,
  searchDetail, pageIndex, pageSize) {

  let filterModel = {
    programId: progamId,
    grcId: grcId,
    districtId: districtId,
    divisionId: divisionId,
    status: status,
    startDate: startDate,
    endDate: endDate,
    searchDetail: searchDetail,
    pageIndex: pageIndex,
    pageSize: pageSize,
    search: "",
    isSearchOfMobile: true,
    sortDetail: [{key: "RequestDetailNo", value: 2}]
  }

  console.log('SUBMITED DATA--->', filterModel)
  console.log('JSON--->', JSON.stringify(filterModel))

  return HttpService.postWithTimeout(Configure.CompassApi + `RequestDetails/filterRequest`, filterModel)
}

export function getListPrograms() {
  return HttpService.get(Configure.CompassApi + 'Programs?PageIndex=0&PageSize=100')
}

export function getListRecipesByCategory(programType, categoryId) {
  return HttpService.get(Configure.CompassApi + `Recipes/filterRecipes?programType=${programType}&categoryId=${categoryId}&PageSize=1000`)
}

export function getListCategoryByProgram(programType) {
  return HttpService.get(Configure.CompassApi + `Categories/filterCategory?programType=${programType}&PageSize=10000&isShow=true`)
}

export function getActivityByProgramType(programType) {
  return HttpService.get(Configure.CompassApi + `Activities/filterActivity?programType=${programType}&PageSize=10000&isShow=true`)
}

export function handleRequest(ids, actionRequestType) {

  let obj = {
    listRequestDetailId: ids,
    isApprove: actionRequestType
  }
  console.log('APPROVE/REJECT DATA--->', obj)
  return HttpService.post(Configure.CompassApi + `RequestDetails/userApprove`, obj)
}

export function getRequestDetail(id) {
  return HttpService.get(Configure.CompassApi + `RequestDetails/${id}`)
}

export function createRequest(data) {
  return HttpService.post(Configure.CompassApi + `Requests`, data)
}

export function getRequest() {
  return HttpService.get(Configure.CompassApi + 'Requests')
}

export function deleteRequest(requestId) {
  return HttpService.delete(Configure.CompassApi + 'Requests/' + requestId)
}

export function submitRequest() {
  return HttpService.post(Configure.CompassApi + `Requests/submit`)
}

export function getRequestById(id) {
  return HttpService.get(Configure.CompassApi + `Requests/${id}`)
}

export function editRequest(data, id) {
  console.log(data)
  return HttpService.put(Configure.CompassApi + `Requests/${id}`, data)
}

export function getTrainers(userId) {
  return HttpService.get(Configure.CompassApi + `UserManagers/trainer/${userId}`)
}

export function getFacilitator(spId) {
  return HttpService.get(Configure.CompassApi + `UserManagers/facilitator/${spId}`)
}

export function assignRequest(trainerId, ids) {
  let data = {
    userAssignId: trainerId,
    listRequestDetailId: ids,
  }

  return HttpService.post(Configure.CompassApi + `RequestDetails/userAssign`, data)
}

export function changePartner(id) {
  let data = {
    userPartnerId: id
  }
  return HttpService.put(Configure.CompassApi + 'Requests/partner', data)
}

export function updateRequestDetail(data, id) {
  console.log('updateRequestDetail', id)
  console.log('updateRequestDetail', data)
  return HttpService.put(Configure.CompassApi + `RequestDetails/${id}`, data)
}

export function changeRequest(data, id) {
  return HttpService.post(Configure.CompassApi + `RequestDetails/change/${id}`, data)
}

export function getChangeRequestDetailsGetOld(requestId) {
  return HttpService.get(Configure.CompassApi + `ChangeRequestDetails/${requestId}?getOld=true`)
}

export function getChangeRequestDetails(requestId) {
  return HttpService.get(Configure.CompassApi + `ChangeRequestDetails/${requestId}`)
}

//For changed
export function confirmChangeRequest(requestIds, isApprove) {
  let data = {
    listRequestDetailId: requestIds,
    isApprove: isApprove
  }
  return HttpService.post(Configure.CompassApi + `RequestDetails/ChangeApprove`, data)
}

export function acceptChangeRequest(requestIds, isApprove) {
  let data = {
    listRequestDetailId: requestIds,
    isApprove: isApprove
  }
  console.log('ahihihi', data)
  return HttpService.post(Configure.CompassApi + `ChangeRequestDetails/spAcceptChangeRequest`, data)
}

export function getDashboardData() {
  return HttpService.get(Configure.CompassApi + `Dashboards`)
}

export function cancelRequest(requestId, isAllowAll, reasonCancel) {
  let data = {
    listRequestDetailId: [requestId],
    isAllowAll: isAllowAll,
    reason: reasonCancel
  }
  return HttpService.post(Configure.CompassApi + `RequestDetails/CancelRequest`, data)
}

export function revertCancelRequest(requestId) {
  let data = {
    listRequestDetailId: [requestId]
  }
  return HttpService.post(Configure.CompassApi + `RequestDetails/revertCancelRequest`, data)
}

export function hpmCancelRequest(requestId, isAllowAll, reasonCancel) {
  let data = {
    listRequestDetailId: [requestId],
    isAllowAll: isAllowAll,
    reason: reasonCancel
  }
  return HttpService.post(Configure.CompassApi + `RequestDetails/hpmCancelRequest`, data)
}

//For cancelled
export function approveCancelRequest(requestIds, isApprove) {
  let data = {
    listRequestDetailId: requestIds,
    isApprove: isApprove
  }
  return HttpService.post(Configure.CompassApi + `RequestDetails/approveCancelRequest`, data)
}

export function getSPForAssign(requestDetailId) {
  let model = {
    listRequestDetailId: requestDetailId
  }
  return HttpService.post(Configure.CompassApi + `UserManagers/getSpForAssign`, model)
}

export function checkInRequest(requestIds) {
  return HttpService.post(Configure.CompassApi + `RequestDetails/checkIn`, requestIds)
}

export function getLanguage() {
  return HttpService.get(Configure.CompassApi + `Languages`)
}

export function getLastActivityNutrition() {
  return HttpService.get(Configure.CompassApi + `UserSettings/getLastActivityNutrition`)
}

export function exportExcel(model) {
  return HttpService.post(Configure.CompassApi + `RequestDetails/sendemail`, model)
}

export function chart1(startDate, endDate, chart1FieldType) {
  return HttpService.get(Configure.CompassApi + `Charts/chart1?startDate=${startDate}&endDate=${endDate}&fieldType=${chart1FieldType}`)
}

export function chart2(startDate, endDate, chart2FieldType, chart2ChildId) {
  return HttpService.get(Configure.CompassApi + `Charts/chart2?startDate=${startDate}&endDate=${endDate}&fieldType=${chart2FieldType}&childId=${chart2ChildId}`)
} 

export function chart3(startDate, endDate, chart3FieldType, chart3ChildId, frequencyType) {
  return HttpService.get(Configure.CompassApi + `Charts/chart3?startDate=${startDate}&endDate=${endDate}&fieldType=${chart3FieldType}&childId=${chart3ChildId}&frequencyType=${frequencyType}`)
} 

export function chart4sub1(startDate, endDate, chart4Sub1FieldType) {
  return HttpService.get(Configure.CompassApi + `Charts/chart4sub1?startDate=${startDate}&endDate=${endDate}&fieldType=${chart4Sub1FieldType}`)
}

export function chart4sub2(startDate, endDate, chart4Sub2FieldType, chart4Sub2ChildId) {
  return HttpService.get(Configure.CompassApi + `Charts/chart4sub2?startDate=${startDate}&endDate=${endDate}&fieldType=${chart4Sub2FieldType}&childId=${chart4Sub2ChildId}`)
} 

export function chart5(startDate, endDate, chart5FieldType, chart5ChildId) {
  return HttpService.get(Configure.CompassApi + `Charts/chartCancel?startDate=${startDate}&endDate=${endDate}&fieldType=${chart5FieldType}&childId=${chart5ChildId}`)
}

export function chartGrc(startDate, endDate, grcId) {
  return HttpService.get(Configure.CompassApi + `Charts/chartGrc?startDate=${startDate}&endDate=${endDate}&grcId=${grcId}`)
}

export function getLeaderShipBoards(startDate, endDate) {
  return HttpService.get(Configure.CompassApi + `LeaderShipBoards?startDate=${startDate}&endDate=${endDate}`)
}

export function getListCalendar(fromDate, toDate) {
  return HttpService.get(Configure.CompassApi + `RequestDetails/calendar?fromDate=${fromDate}&toDate=${toDate}`)
}


export function getListSP(listId) {
  return HttpService.post(Configure.CompassApi + `UserManagers/getSpForAssign`, {
    listRequestDetailId: listId
  })
}

export function getPartnerNameOfPartner() {
  return HttpService.get(Configure.CompassApi + `PartnerNames/UserPartnerGetPartnerName`, {})
}

export function getCPAPActivityId(search) {
  return HttpService.get(Configure.CompassApi + `Requests/GetCpapActivityId?PageSize=100&Search=${search}`)
}

export function getDivisionByGrc(grcId) {
  return HttpService.get(Configure.CompassApi + `Divisions/getDivisionByGrc/${grcId}`)
}