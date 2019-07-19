import {combineReducers} from 'redux';
import appReducer from '../reducers/app';
import authReducer from '../reducers/auth';
import userReducer from '../reducers/user';
import skillSetReducer from '../reducers/skillSet';
import requestReducer from '../reducers/request';
import purchaseOrder from '../reducers/purchaseOrder';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  user: userReducer,
  skillSet: skillSetReducer,
  request: requestReducer,
  purchaseOrder: purchaseOrder
});

export default rootReducer;