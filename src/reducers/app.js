import * as appConstant from '../actions/app';

var get = require('lodash.get');

const initialState = {
  validNetworkConnection: true,
  isLoading: false,
  showConfirmationModal: false,
  deviceToken: '',
  grcs: [],
  divisions: [],
  districts: [],
  activities: [],
  programTypes: [],
  roles: [],
  availableRequestStatus: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case appConstant.NETWORK_CONNECTION_STATUS_CHANGED:
      if (state.validNetworkConnection !== action.validNetworkConnection) {
        return {
          ...state,
          validNetworkConnection: action.validNetworkConnection,
        }
      }
      else
        return state
    case appConstant.SHOW_LOADING: {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    case appConstant.APPEAR_CONFIRMATION_MODAL: {
      return {
        ...state,
        showConfirmationModal: !state.showConfirmationModal
      }
    }
    case appConstant.DID_GET_NOTIFICATION_TOKEN: {
      return {
        ...state,
        deviceToken: action.token
      }
    }
    case appConstant.GET_ALL_NECESSARY_DATA_SUCCESS: {
      let data = action
      let grcs = get(data, 'data[0].data.list', [])
      let districts = get(data, 'data[1].data.list', [])
      let divisions = get(data, 'data[2].data.list', [])
      let activities = get(data, 'data[3].data.list', [])
      let programTypes = get(data, 'data[4].data.list', [])
      let roles = get(data, 'data[5].data.list', [])
      let settings = get(data, 'data[6].data', [])

      return {
        ...state,
        grcs: grcs,
        districts: districts,
        divisions: divisions,
        activities: activities,
        programTypes: programTypes,
        roles: roles,
        settings: settings
      }
    }
    case appConstant.GET_PARTNER_NAMES_SUCCESS: {
      return {
        ...state,
        partners: action.payload
      }
    }
    case appConstant.GET_AVAILABLE_REQUEST_STATUS: {
      return {
        ...state,
        availableRequestStatus: action.payload
      }
    }
    case appConstant.GET_DASHBOARD_INFO: {
      return {
        ...state,
        dashboard: action.dashboard
      }
    }
    case appConstant.CLEAN_APP_DATA: {
      return {
        ...state,
        grcs: [],
        divisions: [],
        districts: [],
      }
    }
    default:
      return state
  }
}