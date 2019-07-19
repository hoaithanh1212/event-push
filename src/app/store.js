import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from "redux-saga";

import reducers from './reducer';
import rootSaga from '../sagas/saga';

const middleWares = []
const sagaMiddleware = createSagaMiddleware();
middleWares.push(sagaMiddleware);

if (process.env.NODE_ENV === `development`) {
    const {logger} = require(`redux-logger`);
  middleWares.push(logger);
}

const initialState = {};

const store = createStore(reducers,
    initialState,
    compose(applyMiddleware(...middleWares)))
sagaMiddleware.run(rootSaga)

export default store