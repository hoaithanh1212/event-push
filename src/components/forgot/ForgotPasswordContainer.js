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
import { Images } from "../../theme/images";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import * as validation from "../../utils/validation";
import { FontNames } from "../../theme/fonts";
import { AppColors } from "../../theme/colors";
import { Message } from "../../common/Message";
import { forgotPassword } from "../../actions/auth";
import NavigationBar from "../../common/NavigationBar";
import TextInputWithoutTitle from "../../common/TextInputWithoutTitle";

const errorEmail = "Email must not be empty or not correct";
const errorUsername = "Username is not empty";

class ForgotContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      email: "",
      errorEmailMgs: "",
      errorUsernameMgs: ""
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <NavigationBar
        {...navigation}
        title="forgot password"
        leftAction={() => {
          navigation.goBack();
        }}
      />
    ),
    headerLeft: null
  });

  static getDerivedStateFromProps(props, state) {
    console.log("RUN THIS 2-->", props);
    return state;
  }

  validationEmail(value) {
    if (value.length === 0 || !validation.validateEmail(value)) {
      this.setState({ email: "", errorEmailMgs: errorEmail });
    } else {
      this.setState({ email: value, errorEmailMgs: "" });
    }
  }

  onChangeEmail(value) {
    this.validationEmail(value);
  }

  onSubmit = () => {
    if (this.state.userName.length === 0) {
      this.setState({ errorUsernameMgs: errorUsername });
      return;
    } else {
      this.setState({ errorUsernameMgs: '' });
    }

    if (
      this.state.email.length === 0 ||
      !validation.validateEmail(this.state.email)
    ) {
      this.setState({ errorEmailMgs: errorEmail });
      return;
    } else {
      this.setState({ errorEmailMgs: '' });
    }
    let model = {
      userName: this.state.userName,
      email: this.state.email
    }
    console.log('ahihi', model)
    this.props.forgotPassword(model);
  };

  renderButton = (title, action, colorBtn, colorTitle) => {
    return (
      <TouchableOpacity
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
        <Message />
        <View style={{ flex: 1 }}>
          <View
            style={{
              marginLeft: 16,
              marginRight: 16
            }}
          >
            <View style={styles.titleContainer}>
              <Text
                style={{
                  fontFamily: FontNames.RobotoRegular,
                  fontSize: 16,
                  color: AppColors.grayTextColor
                }}
              >
                Please input your registered Email to receive the Reset Password
                Link
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <TextInputWithoutTitle
                placeholder="Username"
                changeText={value => {
                  this.setState({userName: value});
                }}
                message={this.state.errorUsernameMgs}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInputWithoutTitle
                placeholder="Email"
                changeText={value => {
                  this.onChangeEmail(value);
                }}
                message={this.state.errorEmailMgs}
              />
            </View>
          </View>
        </View>

        {this.renderButton(
          "RESET PASSWORD",
          this.onSubmit,
          AppColors.blueBackgroundColor,
          AppColors.whiteTitle
        )}
      </View>
    );
  }
}

export default connect(
  state => ({}),
  dispatch =>
    bindActionCreators(
      {
        forgotPassword
      },
      dispatch
    )
)(ForgotContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 20
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
