import * as skillSetConstant from '../actions/skillSet';
var get = require('lodash.get');

const initialState = {
    skillSets: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case skillSetConstant.GET_SKILLSETS_SUCCESS:
            return {
                ...state,
                skillSets: get(action.payload, "list", []),
            }
        default:
            return state
    }
}