import * as userConstant from '../actions/user';
var get = require('lodash.get');

const initialState = {
    trainers: [],
    totalPage: 0,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case userConstant.GET_TRAINER_SUCCESS: {
            var originData = state.trainers ? state.trainers : []
            let data = get(action.payload, "data.list", [])
            let page = get(action.payload, "data.pageIndex", 0)
            let totalPage = get(action.payload, "data.totalPage", 0)

            if (page !== 0) {
                originData = originData.concat(data)
            } else {
                originData = data
            }

            return {
                ...state,
                trainers: originData,
                totalPage: totalPage
            }

        }
        default:
            return state
    }
}