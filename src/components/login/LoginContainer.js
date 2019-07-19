import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Image
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from "react-native-google-signin";

import { RouteKey } from "../../contants/route-key";
import { Images } from "../../theme/images";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import PasswordInput from "../../common/PasswordInput";
import * as validation from "../../utils/validation";
import { FontNames } from "../../theme/fonts";
import { AppColors } from "../../theme/colors";
import { Message } from "../../common/Message";
import { login, loginByFb, loginByGG } from "../../actions/auth";
import { pushNav, resetNav } from "../../actions/navigate";

const errorPassword =
  "Password must contain at least 8 characters, one Special character, one Uppercase Character";
const errorUsername = "Username is required";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorPasswordMgs: "",
      errorUsernameMgs: ""
    };
  }

  handleFacebookLogin = () => this.props.loginByFb();

  handleGoogleLogin = () => this.props.loginByGG();

  onChangeUsername(value) {
    if (value.length === 0) {
      this.setState({ errorUsernameMgs: errorUsername });
      return;
    }
    this.setState({ username: value, errorUsernameMgs: "" });
  }

  onChangePassword(value) {
    // if (!validation.validatePassword(value)) {
    //   this.setState({errorPasswordMgs: errorPassword});
    //   return
    // }
    this.setState({ password: value, errorPasswordMgs: "" });
  }

  onLogin = () => {
    if (this.state.username.length === 0) {
      this.setState({ errorUsernameMgs: errorUsername });
      return;
    }

    if (!validation.validatePassword(this.state.password)) {
      this.setState({ errorPasswordMgs: errorPassword });
      return;
    }

    if (this.state.password.length === 0) {
      this.setState({ errorPasswordMgs: "Password is required" });
      return;
    }

    if (
      this.state.username.length > 0 &&
      this.state.password.length > 0 &&
      validation.validatePassword(this.state.password)
    ) {
      this.props.login({
        userName: this.state.username,
        password: this.state.password
      });
    }
  };

  onSignUp = () => {
    this.props.pushNav(RouteKey.Register);
  };

  onForgotPasword() {
    this.props.pushNav(RouteKey.Forgot);
  }

  renderButton = (title, action, colorBtn, colorTitle) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.btn, { backgroundColor: colorBtn }]}
        onPress={() => action && action()}
      >
        <Text style={[styles.titleBtn, { color: colorTitle }]}>{title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginLeft: -16,
            marginRight: -16,
            marginTop: Platform.OS === "android" ? 0 : 16
          }}
        >
          <Message />
        </View>
        <View style={styles.titleContainer}>
          <Image
            style={{ width: 126, height: 126 }}
            source={Images.logoIcon}
            resizeMode={"contain"}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TextInputWithTitle
            placeholder="Username"
            title="Username"
            changeText={value => {
              this.onChangeUsername(value);
            }}
            message={this.state.errorUsernameMgs}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <PasswordInput
            placeholder="Password"
            title="Password"
            changeText={value => {
              this.onChangePassword(value);
            }}
            message={this.state.errorPasswordMgs}
          />
        </View>

        <View style={{ alignItems: "flex-end", marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.onForgotPasword();
            }}
          >
            <Text style={{ color: "#128ff9" }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 15 }}>
          <View style={{ width: "100%" }}>
            {this.renderButton(
              "LOGIN",
              this.onLogin,
              AppColors.blueBackgroundColor,
              AppColors.whiteTitle
            )}
          </View>
        </View>

        {this.renderButton(
          "SIGN UP",
          this.onSignUp,
          AppColors.backgroundColor,
          AppColors.blueTitle
        )}

        {/* <View style={{flex: 1, justifyContent: "flex-end", marginBottom: 30}}>
          <View style={{alignItems: "center", marginTop: 20}}>
            <Text style={{color: "rgba(0, 0, 0, 0.6)"}}>
              or you can login by
              </Text>
          </View>

          <View
            style={{flexDirection: "row", marginLeft: 10, marginRight: 10}}
          >
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={[styles.socialBtn, {
                  marginRight: 10,
                }]}
                onPress={this.handleFacebookLogin}
              >
                <Image
                  style={{width: 15, height: 15, marginRight: 10}}
                  source={Images.facebookIcon}
                />
                <Text style={[styles.titleBtn, {color: AppColors.blueTextColor}]}>
                  FACEBOOK
                    </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={[styles.socialBtn, {marginLeft: 10}]}
                onPress={this.handleGoogleLogin}
              >
                <Image
                  style={{width: 15, height: 15, marginRight: 10}}
                  source={Images.googleIcon}
                />
                <Text style={[styles.titleBtn, {color: AppColors.blueTextColor}]}>
                  GOOGLE
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> */}
      </View>
    );
  }
}

export default connect(
  state => ({}),
  dispatch =>
    bindActionCreators(
      {
        login,
        loginByFb,
        loginByGG,
        pushNav
      },
      dispatch
    )
)(LoginContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 25
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 50
  },
  containerText: {
    flex: 1,
    height: 50,
    justifyContent: "center"
  },
  input: {
    marginLeft: 5,
    flex: 1,
    color: "#333333",
    fontSize: 18,
    height:
      Platform.OS.toLocaleUpperCase() === "ios".toLocaleUpperCase() ? 30 : 40
  },
  titleInput: {
    position: "absolute",
    marginLeft: 15,
    marginTop: -10,
    backgroundColor: "#fff"
  },
  containerPassword: {
    flex: 8,
    height: 50,
    justifyContent: "center"
  },
  containerImage: {
    flex: 2,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  containerTitle: {
    position: "absolute",
    marginLeft: 15,
    marginTop: -10,
    backgroundColor: "#fff"
  },
  borderPassword: {
    borderRadius: 10,
    borderColor: "#128ff9",
    borderWidth: 1,
    flexDirection: "row"
  },
  borderPasswordError: {
    borderRadius: 10,
    borderColor: "#b00020",
    borderWidth: 1,
    flexDirection: "row"
  },
  titleInputColor: {
    color: "#333333"
  },
  titleInputError: {
    color: "#b00020"
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10
  },
  btn: {
    width: "100%",
    height: 44,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  titleBtn: { fontFamily: FontNames.RobotoMedium, fontSize: 14 }
});
