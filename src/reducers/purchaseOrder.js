/**
 * Created by Hong HP on 4/23/19.
 */


import {ADD_PO_SUCCESS, GET_LIST_PO_PROGRAMME_SUCCESS, GET_LIST_SP_PROGRAMME_SUCCESS} from '../actions/poAction';

export default function (state = {}, action) {
  switch (action.type) {
    case  GET_LIST_PO_PROGRAMME_SUCCESS:
      return {
        ...state,
        listProgramme: action.listProgramme
      }
    case  GET_LIST_SP_PROGRAMME_SUCCESS:
      return {
        ...state,
        listSP: action.listSP
      }
    default:
      return state
  }
}