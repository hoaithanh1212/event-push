import React from 'react';
import {Dimensions, View} from 'react-native';
import {
  createStackNavigator, createDrawerNavigator,
  createSwitchNavigator, createAppContainer, createMaterialTopTabNavigator
} from 'react-navigation';

import {RouteKey} from '../contants/route-key';
import LeftMenuContainer from '../components/leftmenu/LeftMenuContainer';
import DashBoardContainer from '../components/dashboard/DashBoardContainer';
import LoginContainer from '../components/login/LoginContainer';
import OTPContainer from '../components/login/OTPContainer';
import RegisterContainer from '../components/register/RegisterContainer';
import ManageTrainerContainer from '../components/trainer/ManageTrainerContainer';
import ForgotContainer from '../components/forgot/ForgotPasswordContainer';
import ForgotPasswordSuccessContainer from '../components/forgot/ForgotPasswordSuccessContainer';
import CreateNewRequestScreen from '../components/request/CreateNewRequestScreen';
import CreateTrainerContainer from '../components/trainer/CreateTrainerContainer';
import ListRequestContainer from '../components/request/ListRequestContainer';
import AddProgrammeScreen from '../components/request/AddProgrammeScreen';
import UpdateProgammeScreen from '../components/request/UpdateProgammeScreen';
import FilterContainer from '../components/filter/FilterContainer';
import FilterDateRangeContainer from '../components/filter/FilterDateRangeContainer';
import AssignRequestContainer from '../components/assignrequest/AssignRequestContainer';
import UpdateRequestContainer from '../components/request/UpdateRequestContainer';
import ChangeRequestScreen from '../components/request/ChangeRequestScreen';
import ReviewChangeRequest from '../components/request/ReviewChangeRequest';
import ViewRequestDetail from '../components/request/presenters/ViewRequestDetail';
import ListTrainerScreen from '../components/trainer/ListTrainerScreen';
import SkillSetScreen from '../components/trainer/SkillSetScreen';
import UserProfile from '../components/profile/UserProfileContainer';
import {CustomTrainerTab} from './CustomTrainerTab';
import UpdateTrainerScreen from '../components/trainer/UpdateTrainerScreen';
import TrainerDetailScreen from '../components/trainer/TrainerDetailScreen';
import SplashScreenContainer from '../components/splashscreen/SplashScreenContainer';
import UpdateUserProfile from '../components/profile/UpdateUserProfileContainer';
import NotificationContainer from '../components/notification/NotificationContainer';
import EndSessionContainer from '../components/request/EndSessionContainer'
import ChangePasswordContainer from '../components/profile/ChangePasswordContainer';
import AnalyticContainer from '../components/analytic/AnalyticContainer';
import FrequencySettingScreen from '../components/request/FrequencySettingScreen';
import CalendarScreen from '../components/request/CalendarScreen';
import ProgrammeScreen from '../components/PurchaseOrder/ProgrammeScreen';
import POProgrammeDetail from '../components/PurchaseOrder/POProgrammeDetail';
import DateRangeAnalytic from '../components/analytic/DateRangeAnalytic';
import PurchaseOrderDetails from '../components/PurchaseOrder/PurchaseOrderDetails';
import NotificationThreshold from '../components/PurchaseOrder/NotificationThreshold';
import SuspensionThreshold from '../components/PurchaseOrder/SuspensionThreshold';
import PurchaseOrderSetting from '../components/PurchaseOrder/PurchaseOrderSetting';
import ChartFullScreen from '../components/analytic/ChartFullScreen';
import AssignSPScreen from '../components/request/AssignSPScreen';
import CreateChangeRequest from '../components/request/CreateChangeRequest';
const {width} = Dimensions.get('window')

const mainDrawerOptions = {}

export const MainStack = createStackNavigator({
  [RouteKey.DashBoard]: {
    screen: DashBoardContainer,
    navigationOptions: {}
  },
  [RouteKey.Login]: {
    screen: LoginContainer,
    navigationOptions: {
      header: null
    }
  },
  [RouteKey.OTP]: {
    screen: OTPContainer,
    navigationOptions: {}
  },
  [RouteKey.Register]: {
    screen: RegisterContainer,
    navigationOptions: {}
  },
  [RouteKey.ManageTrainer]: {
    screen: ManageTrainerContainer,
    navigationOptions: {}
  },
  [RouteKey.Forgot]: {
    screen: ForgotContainer,
    navigationOptions: {}
  },
  [RouteKey.ForgotPasswordSuccess]: {
    screen: ForgotPasswordSuccessContainer,
    navigationOptions: {}
  },
  [RouteKey.CreateNewRequestScreen]: {
    screen: CreateNewRequestScreen,
    navigationOptions: {
      title: 'SUBMIT REQUEST',
    }
  },
  [RouteKey.CreateTrainer]: {
    screen: CreateTrainerContainer,
    navigationOptions: {
      title: 'ADD TRAINER',
    }
  },
  [RouteKey.ListRequest]: {
    screen: ListRequestContainer,
    navigationOptions: {}
  },
  [RouteKey.AddProgrammeScreen]: {
    screen: AddProgrammeScreen,
    navigationOptions: {
      title: 'ADD PROGRAMME',
      headerLayoutPreset: 'center'
    }
  },
  [RouteKey.FrequencySettingScreen]: {
    screen: FrequencySettingScreen,
    navigationOptions: {
      title: 'FREQUENCY',
      headerLayoutPreset: 'center'
    }
  },
  [RouteKey.UpdateProgammeScreen]: {
    screen: UpdateProgammeScreen,
    navigationOptions: {
      title: 'UPDATE PROGRAMME'
    }
  },
  [RouteKey.Filter]: {
    screen: FilterContainer,
    navigationOptions: {
      header: null
    }
  },
  [RouteKey.FilterDateRange]: {
    screen: FilterDateRangeContainer,
    navigationOptions: {
      header: null
    }
  },
  [RouteKey.AssignRequest]: {
    screen: AssignRequestContainer,
    navigationOptions: {
      header: null
    }
  },
  [RouteKey.UpdateRequest]: {
    screen: UpdateRequestContainer,
    navigationOptions: {
      title: 'Update Request'
    }
  },
  [RouteKey.ChangeRequest]: {
    screen: ChangeRequestScreen,
    navigationOptions: {
      title: 'CHANGE REQUEST'
    }
  },
  [RouteKey.ReviewChangeRequest]: {
    screen: ReviewChangeRequest,
    navigationOptions: {
      title: 'REVIEW REQUEST'
    }
  },
  [RouteKey.ViewRequestDetail]: {
    screen: ViewRequestDetail,
    navigationOptions: {
      title: 'REQUEST DETAIL'
    }
  },
  [RouteKey.UserProfile]: {
    screen: UserProfile,
    navigationOptions: {
    }
  },
  [RouteKey.UpdateUserProfile]: {
    screen: UpdateUserProfile,
    navigationOptions: {
      header: null
    }
  },
  [RouteKey.TrainerDetailScreen]: {
    screen: TrainerDetailScreen
  },
  [RouteKey.UpdateTrainerInfo]: {
    screen: UpdateTrainerScreen,
    navigationOptions: {
      title: 'UPDATE TRAINER INFO'
    }
  },
  [RouteKey.Notification]: {
    screen: NotificationContainer,
    navigationOptions: {}
  },
  [RouteKey.ChangePassword]: {
    screen: ChangePasswordContainer,
    navigationOptions: {
    }
  },
  [RouteKey.EndSession]: {
    screen: EndSessionContainer,
    navigationOptions: {
     header:null
    }
  },
  [RouteKey.Analytic]: {
    screen: AnalyticContainer,
    navigationOptions: {}
  },
  [RouteKey.CalendarScreen]: {
    screen: CalendarScreen,
    navigationOptions: {
      title: 'CALENDAR'
    }
  },
  [RouteKey.ProgrammeScreen]: {
    screen: ProgrammeScreen,
    navigationOptions: {
      title: 'PO MANAGEMENT'
    }
  },
  [RouteKey.POProgrammeDetail]: {
    screen: POProgrammeDetail
  },
  [RouteKey.DateRangeAnalytic]: {
    screen: DateRangeAnalytic,
    navigationOptions: {
      header:null
    }
  },
  [RouteKey.PurchaseOrderDetails]: {
    screen: PurchaseOrderDetails
  },
  [RouteKey.NotificationThreshold]: {
    screen: NotificationThreshold
  },
  [RouteKey.SuspensionThreshold]: {
    screen: SuspensionThreshold
  },
  [RouteKey.PurchaseOrderSetting] : {
    screen: PurchaseOrderSetting
  },
  [RouteKey.ChartFullScreen]: {
    screen: ChartFullScreen,
    navigationOptions: {
      title: 'ANALYTIC'
    }
  },
  [RouteKey.AssignSP]: {
    screen: AssignSPScreen,
    navigationOptions: {
      title: 'ASSIGN SP'
    }
  }
}, {
    initialRouteName: RouteKey.Login,
    navigationOptions: {
      headerForceInset: {top: 'never', bottom: 'never'},
      headerBackTitleVisible: false
    },
    headerLayoutPreset: 'center'
  })


export const MainDrawer = createDrawerNavigator({
  MainDrawer: {
    screen: MainStack,
  }
}, {
    drawerLockMode: 'locked-closed',
    contentComponent: LeftMenuContainer,
    drawerWidth: width - 80,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerBackgroundColor: 'transparent',
    disableGestures: true,

  })

const routeAppConfiguration = {
  [RouteKey.Splash]: SplashScreenContainer,
  [RouteKey.MainDrawer]: {
    screen: MainDrawer,
  }
}

const ManageTrainerTabNavigation = createMaterialTopTabNavigator({
  [RouteKey.ListTrainer]: {
    screen: ListTrainerScreen
  },
  [RouteKey.SkillSet]: {
    screen: SkillSetScreen
  }
}, {
    tabBarComponent: props => <CustomTrainerTab {...props} />,
  })

const stackAppConfiguration = {
  initialRouteName: RouteKey.Splash,
  navigationOptions: {}
}

export const AppNavigator = createSwitchNavigator(
  routeAppConfiguration,
  stackAppConfiguration
);

export const TabTrainer = createAppContainer(ManageTrainerTabNavigation)

export default createAppContainer(AppNavigator)