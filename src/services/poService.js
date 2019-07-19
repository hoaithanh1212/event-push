/**
 * Created by Hong HP on 4/22/19.
 */
import {HttpService} from '../utils/HttpService';
import Configure from '../contants/configure';

export function getListPOProgramme() {
  return HttpService.get(Configure.CompassApi + 'PurchaseOrders/program')
}

export function getListSPByProgramme(programType) {
  return HttpService.get(Configure.CompassApi + `PurchaseOrders/userSp/${programType}?PageIndex=0&PageSize=100000`)
}


export function getPODetails(programType, userSpId) {
  return HttpService.get(Configure.CompassApi + `PurchaseOrders/${programType}/${userSpId}?PageIndex=0&PageSize=100000`)
}

export function addNewPO(programId, userSpId, unit, expiryDate, startDate) {
  let data = {
    programId: programId,
    userSpId: userSpId,
    unit: unit,
    expiryDate: expiryDate,
    startDate: startDate
  }
  return HttpService.post(Configure.CompassApi + `PurchaseOrders`, data)
}

export function updateDataPO(id, unit, expiryDate, startDate) {
  let data = {
    unit: unit,
    expiryDate: expiryDate,
    startDate: startDate
  }
  return HttpService.put(Configure.CompassApi + `PurchaseOrders/${id}`, data)
}

export function addPurchaseOrderSettings(data) {
  return HttpService.post(Configure.CompassApi + `PurchaseOrderSettings`, data)
}

export function updatePurchaseOrderSettings(id, data) {
  return HttpService.put(Configure.CompassApi + `PurchaseOrderSettings/${id}`, data)
}