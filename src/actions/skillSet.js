export const GET_SKILLSETS = 'GET_SKILLSETS'
export const GET_SKILLSETS_SUCCESS = 'GET_SKILLSET_SUCCESS'
export const GET_SKILLSETS_FAIL = 'GET_SKILLSETS_FAIL'
export function getSkillSets() {
    return {
        type: GET_SKILLSETS,
    }
}