import React, {Component} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Button,
  ScrollView
} from "react-native";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import DeviceInfo from 'react-native-device-info';
import {RouteKey} from "../../contants/route-key";
import NavigationBar from '../../common/NavigationBar';
import NumberInput from '../../common/NumberInput';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import {Message} from '../../common/Message';
import OTPTextView from '../../common/OTPTextView';
import {otpRequest, otpResend, clearOTPMessageError} from "../../actions/auth";

class OTPContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      otp: ''
    };
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavigationBar {...navigation}
      title="VERIFICATION"
      leftAction={() => {
        navigation.goBack()
      }} />,
    headerLeft: null
  })

  showTimer() {
    this.setState({ timer: 29 });
    this.interval = setInterval(
      () => this.setState({ timer: --this.state.timer }),
      1000
    );
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      clearInterval(this.interval);
    }
  }

  onSubmit = () => {
    const nav = this.props.navigation.state.params
    NAV = nav;
    let model = {
      userName: nav && nav.email ? nav.email.userName : nav.loginToken.userName,
      otp: this.state.otp,
      loginToken: nav && nav.loginToken && nav.loginToken.token,
      deviceToken: this.props.deviceToken,
      deviceId: DeviceInfo.getUniqueID(),
      os: Platform.OS
    }
    console.log("model-otp", model)
    this.props.otpRequest(model)
  }

  resendCode() {
    const nav = this.props.navigation.state.params
    let model = {
      loginToken: nav && nav.loginToken.token
    }
    this.props.otpResend(model)
  }

  render() {
    const nav = this.props.navigation.state.params
    return <View style={styles.container}>
      <Message />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, marginLeft: 16, marginRight: 16, marginTop: 20}}>
          <Text style={styles.titile}>My OTP Code is</Text>
          <View style={{marginTop: 15, marginBottom: 15}}>
            <OTPTextView handleTextChange={(value) => {this.setState({otp: value})}}/>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.message}>Check your SMS Message. We’ve sent you the OTP at {nav.loginToken.phoneNumber == "null" ? "" : nav.loginToken.phoneNumber}</Text>
          </View>
          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <TouchableOpacity activeOpacity={0.9}
              disabled={this.state.timer !== 0}
              onPress={() => {
                this.showTimer();
                this.resendCode();
              }}>
              <Text style={{fontSize: 14, fontFamily: FontNames.RobotoRegular, 
                color: this.state.timer !== 0 ? '#818181' : AppColors.blueTextColor}}>Didn’t receive SMS?</Text>
            </TouchableOpacity>
            {this.state.timer === 0 ? (
              <View />
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: this.state.timer !== 0 ? '#818181' : 'rgb(0,160,250)'
                  }}
                >
                  {' '}
                  {'('}
                  {this.state.timer}
                  {')'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity activeOpacity={0.9}
        style={{
          backgroundColor: AppColors.buttonColor,
          height: 56, justifyContent: 'center', alignItems: 'center',
          fontSize: 16, fontFamily: FontNames.RobotoMedium
        }}
        onPress={this.onSubmit}>
        <Text style={{color: AppColors.titleButtonColor}}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  }
}

export default connect(state => ({
  deviceToken: state.app.deviceToken
}),
  dispatch => (bindActionCreators({
    otpRequest,
    otpResend,
    clearOTPMessageError
  }, dispatch))
)(OTPContainer)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titile: {fontSize: 16, fontFamily: FontNames.RobotoRegular, color: AppColors.blackTextColor},
  message: {fontSize: 14, fontFamily: FontNames.RobotoRegular, color: AppColors.grayTextColor},
});