import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Modal
} from 'react-native';

var get = require('lodash.get');
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ScrollView} from 'react-native-gesture-handler';
import {Images} from '../../theme/images';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import UserProfileHeader from './presenters/UserProfileHeader';
import {logout} from "../../actions/auth";
import {resetNav, pushNav} from "../../actions/navigate";
import {RouteKey} from "../../contants/route-key";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import * as validation from '../../utils/validation';
import {changePassword} from '../../services/userService';
import {showMessage} from "../../common/Message";
import {showLoading} from '../../actions/app';
import {Message} from "../../common/Message";

const errorPassword = "Password must contain at least 8 characters, one Special character, one Uppercase Character";

class ChangePasswordContainer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmationPassword: '',

      errOldPassword: '',
      errNewPassword: '',
      errConfirmationPassword: ''
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: <UserProfileHeader
        title={"Change Password"}
        leftIcon={Images.backIcon}
        leftAction={() => {
          navigation.goBack();
        }}
      />
    }
  }

  onChangeOldPassword = (value) => {
    if (!validation.validatePassword(value)) {
      this.setState({errOldPassword: errorPassword});
      return
    }
    this.setState({oldPassword: value, errOldPassword: ''});
  }

  onChangeNewPassword = (value) => {
    if (!validation.validatePassword(value)) {
      this.setState({errNewPassword: errorPassword});
      return
    }
    this.setState({newPassword: value, errNewPassword: ''});
  }

  onChangeConfirmationPassword = (value) => {
    if (this.state.newPassword === "") {
      this.setState({errNewPassword: errorPassword});
      return
    }
    if (this.state.newPassword !== "" &&
      value !== this.state.newPassword) {
      this.setState({errConfirmationPassword: "The password and confirmation password do not match"});
      return
    }
    this.setState({
      confirmationPassword: value,
      errConfirmationPassword: '',
      errNewPassword: ''
    });
  }

  changePassword = () => {
    if (this.state.errOldPassword !== "" ||
      this.state.errNewPassword !== "" ||
      this.state.errConfirmationPassword !== "") {
      return
    }

    this.props.showLoading(true)
    changePassword(this.state.oldPassword, this.state.newPassword).then(res => {
      if (res.statusCode === 200) {
        this.props.showLoading(false)
        this.props.pushNav(RouteKey.UserProfile)
      } else {
        this.props.showLoading(false)
        showMessage(get(res, "message", ""))
      }
    }).catch(err => {
      this.props.showLoading(false)
      showMessage(get(err, "message", ""))
    })
  }

  render() {

    return <View style={{flex: 1}}>
      <Message />
      <ScrollView style={{flex: 1, marginLeft: 20, marginRight: 20}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 20}}>
          <TextInputWithTitle
            placeholder="Old password"
            title="Old password"
            secureTextEntry={true}
            changeText={value => {
              this.onChangeOldPassword(value)
            }}
            message={this.state.errOldPassword}
          />
        </View>
        <View style={{marginTop: 15}}>
          <TextInputWithTitle
            placeholder="New password"
            title="New password"
            secureTextEntry={true}
            changeText={value => {
              this.onChangeNewPassword(value)
            }}
            message={this.state.errNewPassword}
          />
        </View>
        <View style={{marginTop: 15}}>
          <TextInputWithTitle
            placeholder="Confirm password"
            title="Confirm password"
            secureTextEntry={true}
            changeText={value => {
              this.onChangeConfirmationPassword(value)
            }}
            message={this.state.errConfirmationPassword}
          />
        </View>

      </ScrollView >
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          height: 45,
          backgroundColor: AppColors.blueBackgroundColor,
          justifyContent: 'center', alignItems: 'center',

        }}
        onPress={() => {
          this.changePassword()
        }}>
        <Text style={{
          fontFamily: FontNames.RobotoBold,
          fontSize: 16, color: AppColors.whiteTitle
        }}>Confirm</Text>
      </TouchableOpacity>
    </View>
  }
}

export default connect(state => ({
  userInfo: state.auth.userInfo,
  programTypes: state.app.programTypes
}),
  dispatch => (bindActionCreators({
    logout,
    resetNav,
    pushNav,
    showLoading
  }, dispatch))
)(ChangePasswordContainer)

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between', alignItems: 'center',
    height: 120, marginTop: 15
  },
  avatarContainer: {
    width: 66,
    height: 66, borderRadius: 33,
    backgroundColor: AppColors.avatarBackground,
    alignItems: 'center', justifyContent: 'center'
  },
  roleBorder: {
    width: 59, height: 22, borderRadius: 3,
    borderWidth: 1, justifyContent: 'center', alignItems: 'center'
  },
  headTitleRow: {
    fontFamily: FontNames.RobotoBold, fontSize: 12,
    color: AppColors.blueTitle, marginTop: 35
  },
  logOutBtn: {
    backgroundColor: AppColors.redRoseBackground,
    height: 44, borderRadius: 4,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 35
  },
  titleBtn: {
    color: AppColors.errorTextColor,
    fontFamily: FontNames.RobotoRegular, fontSize: 16
  },
  row: {flexDirection: 'row', alignItems: 'center', paddingTop: 15, paddingBottom: 15},
  label: {
    fontFamily: FontNames.RobotoMedium, fontSize: 13, color: AppColors.black60TextColor,
    textAlign: 'left', flex: 1
  },
  value: {
    fontFamily: FontNames.RobotoRegular, fontSize: 16,
    color: AppColors.black60TextColor, textAlign: 'right'
  }
})