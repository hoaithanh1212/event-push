import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';

var get = require('lodash.get');
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ScrollView} from 'react-native-gesture-handler';
import {Images} from '../../theme/images';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import UserProfileHeader from './presenters/UserProfileHeader';
import TextInputWithTitle from '../../common/TextInputWithTitle';
import CheckBox from '../../common/Checkbox';
import {RoleType} from '../../contants/profile-field';
import {showLoading} from '../../actions/app';
import {editProfile} from '../../services/authService';
import {getUserInfo} from '../../actions/auth';
import * as validation from '../../utils/validation';

class UpdateUserProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      email: '',
      did: '',

      isEmail: false,
      isMessage: false,
      isOther: false,
      isShowDID: true,

      errorEmail: ''
    };
  }

  componentDidMount() {
    let {userInfo} = this.props;
    this.checkTypeRole();

    this.setState({
      isEmail: get(userInfo, 'userSettings.isSentEmail', false),
      isMessage: get(userInfo, 'userSettings.isSentSms', false),
      isOther: get(userInfo, 'userSettings.isSentNotification', false)
    });
  }

  checkTypeRole() {
    let {userInfo} = this.props;
    switch (userInfo.typeRole) {
      case RoleType.SP: {
        this.setState({
          name: userInfo.pocName,
          mobile: userInfo.pocMobile,
          email: userInfo.pocEmail,
          did: userInfo.did,
          isShowDID: false
        });
        break;
      }
      case RoleType.Partner: {
        this.setState({
          name: userInfo.pocName,
          mobile: userInfo.pocMobile,
          email: userInfo.pocEmail,
          did: userInfo.did,
          isShowDID: true
        });
        break;
      }
      case RoleType.SuperAdmin:
      case RoleType.DataEntry:
      case RoleType.Trainer:
        this.setState({
          name: userInfo.name,
          mobile: userInfo.phoneNumber,
          email: userInfo.email,
          did: userInfo.did,
          isShowDID: false
        });
        break;
      default: {
        this.setState({
          name: userInfo.name,
          mobile: userInfo.phoneNumber,
          email: userInfo.email,
          did: userInfo.did,
          isShowDID: true
        });
        break;
      }
    }
  }

  onUpdate() {
    let model = {
      name: this.state.name,
      mobile: this.state.mobile,
      email: this.state.email,
      did: this.state.isShowDID ? this.state.did : null,
      isSentEmail: this.state.isEmail,
      isSentSms: this.state.isMessage,
      isSentNotification: this.state.isOther
    };

    this.props.showLoading(true);
    editProfile(model).then(response => {
      this.props.showLoading(false);
      if (response.statusCode === 200) {
        Alert.alert('Successfully', 'Update profile successfully');
        this.props.getUserInfo();
        this.props.navigation.goBack();
      } else {
        Alert.alert('Warning', get(response, 'message', ''));
      }
    });
  }

  render() {
    return (
      <View>
        <UserProfileHeader
          title={'Edit Profile'}
          leftIcon={Images.closeTinyIcon}
          leftAction={() => {
            this.props.navigation.goBack();
          }}
          rightTitle={'Save'}
          rightAction={() => {
            this.onUpdate();
          }}
        />
        <ScrollView style={{marginLeft: 20, marginRight: 20}}>
          <Text style={styles.headTitleRow}>Profile Info</Text>
          <View style={{marginTop: 10}}>
            <TextInputWithTitle
              placeholder="Name"
              title="Name"
              changeText={value => {
                this.setState({name: value});
              }}
              value={this.state.name}
            />
          </View>

          <View style={{marginTop: 20}}>
            <TextInputWithTitle
              placeholder="Mobile"
              title="Mobile"
              changeText={value => {
                this.setState({mobile: value});
              }}
              value={this.state.mobile}
              keyboardType={'numeric'}
              maxLength={8}
            />
          </View>
          <View style={{marginTop: 20}}>
            <TextInputWithTitle
              placeholder="Email"
              title="Email"
              changeText={value => {
                if (!validation.validateEmail(value)) {
                  this.setState({errorEmail: 'Email is invalid'});
                } else {
                  this.setState({errorEmail: ''});
                }
                this.setState({email: value});
              }}
              value={this.state.email}
              message={this.state.errorEmail}
            />
          </View>
          {this.state.isShowDID ? (
            <View style={{marginTop: 20}}>
              <TextInputWithTitle
                placeholder="DID"
                title="DID"
                changeText={value => {
                  this.setState({did: value});
                }}
                value={this.state.did}
                keyboardType={'numeric'}
                maxLength={9}
              />
            </View>
          ) : (
            <View/>
          )}
          <Text style={styles.headTitleRow}>Notification Type</Text>
          <TouchableOpacity
            style={{height: 40, flexDirection: 'row', marginTop: 10}}
            onPress={() => {
              this.setState({isEmail: !this.state.isEmail});
            }}
          >
            <CheckBox
              normalIcon={Images.blankIcon}
              highlightIcon={Images.checked2Icon}
              active={this.state.isEmail}
              onPress={() => {
                this.setState({isEmail: !this.state.isEmail});
              }}
            />
            <Text
              style={{
                fontFamily: FontNames.RobotoRegular,
                fontSize: 16,
                color: AppColors.black60TextColor,
                marginLeft: 10
              }}
            >
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{height: 40, flexDirection: 'row'}}
            onPress={() => {
              this.setState({isMessage: !this.state.isMessage});
            }}
          >
            <CheckBox
              normalIcon={Images.blankIcon}
              highlightIcon={Images.checked2Icon}
              active={this.state.isMessage}
              onPress={() => {
                this.setState({isMessage: !this.state.isMessage});
              }}
            />
            <Text
              style={{
                fontFamily: FontNames.RobotoRegular,
                fontSize: 16,
                color: AppColors.black60TextColor,
                marginLeft: 10
              }}
            >
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{height: 40, flexDirection: 'row'}}
            onPress={() => {
              this.setState({isOther: !this.state.isOther});
            }}
          >
            <CheckBox
              normalIcon={Images.blankIcon}
              highlightIcon={Images.checked2Icon}
              active={this.state.isOther}
              onPress={() => {
                this.setState({isOther: !this.state.isOther});
              }}
            />
            <Text
              style={{
                fontFamily: FontNames.RobotoRegular,
                fontSize: 16,
                color: AppColors.black60TextColor,
                marginLeft: 10
              }}
            >
              Notification
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
        showLoading,
        editProfile,
        getUserInfo
      },
      dispatch
    )
)(UpdateUserProfileContainer);

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 120,
    marginTop: 15
  },
  avatarContainer: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: AppColors.avatarBackground,
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleBorder: {
    width: 59,
    height: 22,
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headTitleRow: {
    fontFamily: FontNames.RobotoBold,
    fontSize: 14,
    color: AppColors.blueTitle,
    marginTop: 10
  },
  logOutBtn: {
    backgroundColor: AppColors.redRoseBackground,
    height: 44,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35
  },
  titleBtn: {
    color: AppColors.errorTextColor,
    fontFamily: FontNames.RobotoRegular,
    fontSize: 16
  },
  row: {flexDirection: 'row', height: 45, alignItems: 'center'},
  label: {
    fontFamily: FontNames.RobotoMedium,
    fontSize: 13,
    color: AppColors.black60TextColor,
    textAlign: 'left',
    flex: 1
  },
  value: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 16,
    color: AppColors.black60TextColor,
    textAlign: 'right'
  }
});
