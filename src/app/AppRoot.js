import React from 'react';
import {
  StatusBar, Platform, View,
  BackHandler, PermissionsAndroid,
  NativeModules, NativeEventEmitter
} from 'react-native';
import {Provider, connect} from 'react-redux';
import {SafeAreaView} from 'react-navigation';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import {bindActionCreators} from 'redux';

import store from '../app/store';
import NetworkConnection from '../utils/NetworkConnection';
import AppNavigator from './AppNavigator';
import Loading from '../common/LoadingComponent';
import NotificationManagers from '../utils/NotificationManagers';
import {AppColors} from '../theme/colors';
import {setTopLevelNavigator} from '../sagas/navigateSaga';
import {pushNav} from '../actions/navigate';
import {GET_DASHBOARD_INFO, initData} from '../actions/app';
import {RouteKey} from '../contants/route-key';
import {getDashboardData} from '../services/requestService';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.availableNetwork = true;
    this.showConfirmOnExit = false;

    this.networkConnection = new NetworkConnection(store);
  }

  componentDidMount() {

    // const {NotificationManager} = NativeModules;
    // const notificationModule = new NativeEventEmitter(NotificationManager);
    // console.log('xxx',notificationModule)

    Platform.OS === 'android' &&
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleAndroidBackPress
    );
    this.setupGoogleSignin();
    if (Platform.OS === 'android') {
      this.requestAndroidPermissions();
      SafeAreaView.setStatusBarHeight(20);
    }

    this.notification = new NotificationManagers(store);
    this.notification.registerNotification()

    this.props.initData()
  }

  shouldComponentUpdate() {
    return true;
  }

  handleAndroidBackPress = () => {
    //Todo
  };

  async setupGoogleSignin() {
    try {
      try {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true
        });
      } catch (err) {
        // alert("play services are not available");
      }
      await GoogleSignin.configure({
        webClientId:
          '702667988118-1sjc8gavovisumadoff423ivpfclanr8.apps.googleusercontent.com',
        offlineAccess: false
      });
    } catch (err) {
      alert('Play services error', err.code, err.message);
    }
  }

  getActiveRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white'}}
        forceInset={{top: 'never'}}
      >
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor={AppColors.statusBarColor}
        />
        <AppNavigator
          ref={navigatorRef => {
            setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState);
            const prevScreen = this.getActiveRouteName(prevState);
            if (currentScreen !== prevScreen)
              if (currentScreen == RouteKey.DashBoard) {
                getDashboardData().then(response => {
                  if (response.statusCode === 200) {
                    store.dispatch({
                      type: GET_DASHBOARD_INFO,
                      dashboard: response.data
                    })
                  }
                });

              }
          }}
        />
        <Loading loading={this.props.isLoading}/>
      </SafeAreaView>
    );
  }

  requestAndroidPermissions() {
    try {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ])
        .then(result => {
        })
        .catch(_ => {
          console.log('Request permissions android failure');
        });
    } catch (err) {
      console.log(err);
    }
  }
}

const ConnectedApp = connect(
  state => ({
    validNetworkConnection: state.app.validNetworkConnection,
    isLoading: state.app.isLoading
  }),
  dispatch => (bindActionCreators({
    initData
  }, dispatch))
)(App);

export default function provider() {
  return (
    <Provider store={store}>
      <ConnectedApp/>
    </Provider>
  );
}
