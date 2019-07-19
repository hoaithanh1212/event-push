import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DrawerActions } from "react-navigation";
import { RouteKey } from "../../../contants/route-key";
import { LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "react-native-google-signin";
import ConfirmationModal from "../../../common/ConfirmationModalComponent";
import { resetNav, pushNav } from "../../../actions/navigate";
import { logout } from "../../../actions/auth";
import Collapsible from "../../../common/Collapsible";
import { Images } from "../../../theme/images";
import { RoleType } from "../../../contants/profile-field";
import Configure from "../../../contants/configure";
import DeviceInfo from "react-native-device-info";

const itemsRequestSP = [
  {
    label: "Request Management",
    routeName: RouteKey.ListRequest
  }
];

const itemsRequest = [
  {
    label: "New Request",
    routeName: RouteKey.CreateNewRequestScreen
  },
  {
    label: "Request Management",
    routeName: RouteKey.ListRequest
  }
];

class LeftMenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  handleLogout = async () => {
    try {
      // Facebook
      LoginManager.logOut();

      // Google
      this.signOutGoogle();

      const loginToken = await AsyncStorage.getItem(Configure.LOGIN_TOKEN);
      if (loginToken !== null) {
        let model = {
          token: loginToken,
          deviceId: DeviceInfo.getUniqueID()
        };
        this.props.logout(model);
      }
    } catch (error) {
      console.log(error);
    }
  };

  signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let { userInfo } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: Platform.OS === "android" ? 20 : 10
        }}
      >
        <View style={{ flexDirection: "row", height: 80 }}>
          <View
            style={{
              height: 80,
              flex: 8,
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Image
              style={{ width: 35, height: 35, marginLeft: 15 }}
              source={Images.logoIcon}
              resizeMode={'contain'}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.closeDrawer());
            }}
            style={{
              height: 80,
              flex: 2,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={Images.leftIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.breakLine} />
        <Collapsible
          title={"Dashboard"}
          leftIcon={Images.dashboardIcon}
          onPress={() => {
            this.props.pushNav(RouteKey.DashBoard);
          }}
        />
        <Collapsible
          title={"Request"}
          leftIcon={Images.requestIcon}
          items={
            (userInfo && userInfo.typeRole == RoleType.SP) ||
            userInfo.typeRole == RoleType.Trainer ||
            userInfo.typeRole == RoleType.PL
              ? itemsRequestSP
              : itemsRequest
          }
        />
        <Collapsible
          title={"Programme Listings"}
          leftIcon={Images.programIcon}
        />
        <Collapsible
          title={"Analytics"}
          leftIcon={Images.analyticIcon}
          onPress={() => {
            this.props.pushNav(RouteKey.Analytic);
          }}
        />
        {userInfo && userInfo.typeRole == RoleType.SP && (
          <Collapsible
            title={"Manage Trainer"}
            leftIcon={Images.analyticIcon}
            onPress={() => {
              this.props.pushNav(RouteKey.ManageTrainer);
            }}
          />
        )}
        <Collapsible
          title={"PO Management"}
          leftIcon={Images.iconPO}
          onPress={() => {
            this.props.pushNav(RouteKey.ProgrammeScreen);
          }}
        />
        <Collapsible
          title={"Logout"}
          onPress={() => {
            this.setState({ showModal: true });
          }}
          leftIcon={Images.menuIcon}
        />

        <ConfirmationModal
          show={this.state.showModal}
          message="Are you sure to log out."
          confirmAction={() => {
            this.handleLogout();
            this.setState({ showModal: false });
            this.props.resetNav("Login");
          }}
          cancelAction={() => {
            this.setState({ showModal: false });
          }}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    userInfo: state.auth.userInfo
  }),
  dispatch =>
    bindActionCreators(
      {
        resetNav,
        logout,
        pushNav
      },
      dispatch
    )
)(LeftMenuScreen);

const styles = StyleSheet.create({
  breakLine: {
    height: 1,
    backgroundColor: "rgba(180, 180, 180, 0.5)"
  }
});
