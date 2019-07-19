export const GET_TRAINER = "GET_TRAINER"
export const GET_TRAINER_SUCCESS = "GET_TRAINER_SUCCESS"
export const GET_TRAINER_FAIL = "GET_TRAINER_FAIL"
export function getTrainerAction(userName, mobile, search, pageIndex, showLoading) {
    return {
        type: GET_TRAINER,
        payload: {
            userName: userName,
            mobile: mobile,
            search: search,
            pageIndex: pageIndex,
            showLoading: showLoading
        }
    }
}