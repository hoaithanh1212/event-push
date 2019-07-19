import {NavigationActions, StackActions} from 'react-navigation';
import {
    put, takeLatest, all, fork
} from 'redux-saga/effects';

import {
    PUSH, RESET,
    POPTOTOP, BACK, REPLACE
} from '../actions/navigate';
let _navigator;

export function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

export default function* watchNavigate() {
    yield all([
        takeLatest(PUSH, pushNavHandle),
        takeLatest(BACK, backNavHandle),
        takeLatest(RESET, resetNavHandle),
        takeLatest(POPTOTOP, popToTopNavHandle),
        takeLatest(REPLACE, replaceNavHandle)
    ])
}

function* pushNavHandle(params) {
    const {screen} = params
    const navigateAction = NavigationActions.navigate({
        routeName: screen,
        params: params,

    });
    _navigator.dispatch(navigateAction)
}

function* backNavHandle() {
    const backAction = NavigationActions.back();
    _navigator.dispatch(backAction)
}

function* resetNavHandle(params) {
    const {screen} = params
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: screen })],
    });
    _navigator.dispatch(resetAction)
}

function* popToTopNavHandle() {
    _navigator.dispatch(StackActions.popToTop())
}

function* replaceNavHandle(params) {
    const {screen} = params
    const replaceAction = StackActions.replace({
        routeName: screen,
        params: params,
    });
    _navigator.dispatch(replaceAction)
}