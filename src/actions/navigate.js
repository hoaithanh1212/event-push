
function action(type, payload = {}) {
    return {type, ...payload}
}

export const PUSH = "PUSH_TO_SCREEN"
export function pushNav(screen, params) {
    return action(PUSH, {screen, id: 1, ...params})
}

export const BACK = "GO_BACK"
export function backNav() {
    return action(BACK)
}

export const RESET = "RESET_ALL"
export function resetNav(screen) {
    return action(RESET, {screen})
}

export const POPTOTOP = "POP_TO_TOP"
export function popToTop() {
    return action(POPTOTOP)
}

export const REPLACE = "REPLACE"
export function replaceNav(screen, params) {
    return action(REPLACE, {screen, ...params})
}
