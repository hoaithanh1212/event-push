/**
 * Created by Hong HP on 4/22/19.
 */

export const GET_LIST_PO_PROGRAMME = 'GET_LIST_PO_PROGRAMME'
export const GET_LIST_PO_PROGRAMME_SUCCESS = 'GET_LIST_PO_PROGRAMME_SUCCESS'

export function getListPOProgramme() {
  return {
    type: GET_LIST_PO_PROGRAMME
  }
}


export const GET_LIST_SP_PROGRAMME = 'GET_LIST_SP_PROGRAMME'
export const GET_LIST_SP_PROGRAMME_SUCCESS = 'GET_LIST_SP_PROGRAMME_SUCCESS'

export function getListSPByProgramme(programType) {
  return {
    type: GET_LIST_SP_PROGRAMME,
    programType
  }
}

export const ADD_PO_SUCCESS = 'ADD_PO_SUCCESS'