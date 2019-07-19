import {NativeEventEmitter, NativeModules, AsyncStorage, Platform} from "react-native";
import {DID_GET_NOTIFICATION_TOKEN} from "../actions/app";
import Configure from '../contants/configure';

const {NotificationHandler} = NativeModules;
const notificationModule = new NativeEventEmitter(NotificationHandler);
let instance = null;

export default class NotificationManagers {
  constructor(store) {
    if (!instance) {
      instance = this;
      this.store = store;
    }
    this.didReceiveNotifcationToken = this.didReceiveNotifcationToken.bind(this);
    this.didReceiveNotificationMessage = this.didReceiveNotificationMessage.bind(this);
    this.didFailToReceiveNotifcationToken = this.didFailToReceiveNotifcationToken.bind(this);

    this.registerEvents();
    return instance;
  }

  registerNotification() {
    NotificationHandler.registerForPushNotifications();
    if (this.store) {
      let token = this.store.getState().app.deviceToken;
      if (!token) {
      } else {
        this.didReceiveNotifcationToken(token);
      }
    }
  }

  registerEvents() {
    notificationModule.addListener(
      NotificationHandler.DID_REGISTER_REMOTE_NOTIFICATION,
      this.didReceiveNotifcationToken
    );
    notificationModule.addListener(
      NotificationHandler.DID_RECEIVE_REMOTE_NOTIFICATION,
      this.didReceiveNotificationMessage
    );
    notificationModule.addListener(
      NotificationHandler.DID_FAIL_REGISTER_REMOTE_NOTIFICATION,
      this.didFailToReceiveNotifcationToken
    );
    notificationModule.addListener(
      NotificationHandler.DID_CLICK_NOTIFICATION,
      this.didClickNotification.bind(this)
    );
    notificationModule.addListener(
      NotificationHandler.USER_LOGIN_ON_OTHER_DEVICE,
    );
  }

  didReceiveNotifcationToken(data) {
    let tmp;
    if (Platform.OS === 'android') {
      if (this.store) {
        if (typeof data === 'object') tmp = data.deviceToken;
        else tmp = data;
        this.store.dispatch({type: DID_GET_NOTIFICATION_TOKEN, token: tmp});
        AsyncStorage.setItem(Configure.DEVICE_TOKEN, tmp)
      }
    } else {
      let obj;
      if (this.store) {
        let tmp;
        if (typeof data === "object") {
          tmp = JSON.stringify(data)
          this.store.dispatch({type: DID_GET_NOTIFICATION_TOKEN, token: data.deviceToken})
        } else {
          tmp = data
          obj = JSON.parse(data)
          this.store.dispatch({type: DID_GET_NOTIFICATION_TOKEN, token: obj.deviceToken})
          AsyncStorage.setItem(Configure.DEVICE_TOKEN, tmp)
        }
      }
    }


  }

  didReceiveNotificationMessage() {
    //To do
  }

  didFailToReceiveNotifcationToken() {
    //To do
  }

  didClickNotification() {
    //To do
  }
}
