export const NETWORK_CONNECTION_STATUS_CHANGED = 'NETWORK_CONNECTION_STATUS_CHANGED'

export const SHOW_LOADING = 'SHOW_LOADING'

export function showLoading(isLoading) {
  return {
    type: SHOW_LOADING,
    payload: isLoading
  }
}

export const APPEAR_CONFIRMATION_MODAL = 'APPEAR_CONFIRMATION_MODAL'

export function appearConfirmationModal() {
  return {
    type: APPEAR_CONFIRMATION_MODAL,
  }
}

export const DID_GET_NOTIFICATION_MESSAGE = 'DID_GET_NOTIFICATION_MESSAGE'
export const DID_GET_NOTIFICATION_TOKEN = 'DID_GET_NOTIFICATION_TOKEN'

export const GET_ALL_NECESSARY_DATA = 'GET_ALL_NECESSARY_DATA'
export const GET_ALL_NECESSARY_DATA_SUCCESS = 'GET_ALL_NECESSARY_DATA_SUCCESS'
export const GET_ALL_NECESSARY_DATA_FAIL = 'GET_ALL_NECESSARY_DATA_FAIL'

export function getAllNecessaryData() {
  return {type: GET_ALL_NECESSARY_DATA}
}

export const INIT_NECESSARY_DATA = 'INIT_NECESSARY_DATA'

export function initData() {
  return {
    type: INIT_NECESSARY_DATA,
  }
}

export const GET_PARTNER_NAMES = 'GET_PARTNER_NAMES'
export const GET_PARTNER_NAMES_SUCCESS = 'GET_PARTNER_NAMES_SUCCESS'
export const GET_PARTNER_NAMES_FAIL = 'GET_PARTNER_NAMES_FAIL'

export function getPartnerNames(search) {
  return {
    type: GET_PARTNER_NAMES,
    payload: {
      search: search
    }
  }
}

export const GET_AVAILABLE_REQUEST_STATUS = 'GET_AVAILABLE_REQUEST_STATUS'

export function saveAvailableRequestStatus(data) {
  return {
    type: GET_AVAILABLE_REQUEST_STATUS,
    payload: data
  }
}

export const GET_DASHBOARD_INFO = 'GET_DASHBOARD_INFO'
export const CLEAN_APP_DATA = 'CLEAN_APP_DATA'