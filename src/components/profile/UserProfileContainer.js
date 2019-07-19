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
import ConfirmationModal from "../../common/ConfirmationModalComponent";
import {LoginManager} from "react-native-fbsdk";
import {GoogleSignin} from "react-native-google-signin";
import {resetNav, pushNav} from "../../actions/navigate";
import {RouteKey} from "../../contants/route-key";
import {
  RoleType,
  RequestType,
  Roles,
  AvailableRequestStatusKey,
  AvailableRequestStatusValue,
  TrainerMapWithFields,
  SPMapWithFields,
  HPMMapWithFields,
  SMMapWithFields,
  PLMapWithFields,
  DataEntryMapWithFields,
  PMMapWithFields,
  PartnerMapWithFields,
  AICMapWithFields,
  SuperAdminMapWithFields,
  FieldUserProfile
} from '../../contants/profile-field';
import {getTrainers} from '../../services/requestService';
import {getSkillSets} from '../../services/skillSetService';

const BreakLine = () => {
  return <View style={{height: 1, backgroundColor: AppColors.breakLineColor}} />
}

const Row = (props) => {
  let {label, component} = props
  if (typeof component === 'string' || typeof component === 'number') {
    return <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{component}</Text>
    </View>
  }
  return <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {component}
  </View>
}

class UserProfileContainer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      trainers: [],
      skillSets: []
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: <UserProfileHeader
        title={"My Profile"}
        leftIcon={Images.backIcon}
        leftAction={() => {
          navigation.goBack();
        }}
        rightTitle={'Edit'}
        rightAction={() => {
          navigation.navigate(RouteKey.UpdateUserProfile);
        }}
      />
    }
  }

  componentDidMount() {
    this.getListTrainer(this.props.role)
    this.getListSkillSets()
  }

  getListTrainer = (role) => {
    if (role === RoleType.SP) {
      getTrainers(get(this.props, 'userInfo.id', '')).then(res => {
        if (res.statusCode === 200) {
          console.log('trainers', get(res, 'data.list', []))
          this.setState({
            trainers: get(res, 'data.list', [])
          })
        }
      })
    }
  }

  getListSkillSets = () => {
    getSkillSets().then(res => {
      if (res.statusCode === 200) {
        console.log('skillSets', get(res, 'data.list', []))
        this.setState({
          skillSets: get(res, 'data.list', [])
        })
      }
    })
  }


  getListProgramInvoled = (ids) => {
    let programs = ''
    let count = 1
    get(this.props, 'programTypes', []).map(programType => {
      ids.map(item => {
        if (programType.id === item) {
          if (ids.length === count) {
            programs += programType.description
          } else {
            programs += `${programType.description},  `
          }
          count++
        }
      })
    })
    return programs
  }

  getListDistricts = (ids) => {
    let districts = ''
    let count = 1
    get(this.props, 'districts', []).map(district => {
      ids.map(item => {
        if (district.id === item) {
          if (ids.length === count) {
            districts += district.name
          } else {
            districts += `${district.name},  `
          }
          count++
        }
      })
    })
    return districts
  }

  getListDivisions = (ids) => {
    let divisons = ''
    let count = 1
    get(this.props, 'divisions', []).map(division => {
      ids.map(item => {
        if (division.id === item) {
          if (ids.length === count) {
            divisons += division.name
          } else {
            divisons += `${division.name},  `
          }
          count++
        }
      })
    })
    return divisons
  }

  getListGRCs = (ids) => {
    let grcs = ''
    let count = 1
    get(this.props, 'grcs', []).map(grc => {
      ids.map(item => {
        if (grc.id === item) {
          if (ids.length === count) {
            grcs += grc.name
          } else {
            grcs += `${grc.name},  `
          }
          count++
        }
      })
    })
    return grcs
  }


  getListTrainers = (ids) => {
    let trainers = ''
    let count = 1
    get(this.state, 'trainers', []).map(trainer => {
      ids.map(item => {
        if (trainer.id === item) {
          if (ids.length === count) {
            grcs += trainer.name
          } else {
            grcs += `${trainer.name},  `
          }
          count++
        }
      })
    })
    return trainers
  }

  getListSkillSet = (ids) => {
    let skillSets = ''
    let count = 1
    get(this.state, 'skillSets', []).map(skillSet => {
      ids.map(item => {
        if (skillSet.id === item) {
          if (ids.length === count) {
            skillSets += skillSet.name
          } else {
            skillSets += `${skillSet.name},  `
          }
          count++
        }
      })
    })
    return skillSets
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

  renderRow = (profile, userInfo) => {
    return profile.filter(item => item.editable == true).map((item, index) => {
      let data = get(userInfo, `${item.field}`, '')
      if (typeof data == 'number' || typeof data == 'string') {
        if (item.field == FieldUserProfile.name) {
          let name = this.getName()
          return <View key={index} >
            <Row label={get(item, "name", "").toUpperCase()}
              component={name} />
            <BreakLine />
          </View>
        } else {
          return <View key={index} >
            <Row label={get(item, "name", "").toUpperCase()}
              component={data} />
            <BreakLine />
          </View>
        }

      }

      if (Array.isArray(data)) {
        let title = item.name
        let strData = ''
        switch (item.field) {
          case FieldUserProfile.programId: {
            strData = this.getListProgramInvoled(data)
            break
          }
          case FieldUserProfile.divisionsId: {
            strData = this.getListDivisions(data)
            break
          }
          case FieldUserProfile.districtsId: {
            strData = this.getListDistricts(data)
            break
          }
          case FieldUserProfile.grcsId: {
            strData = this.getListGRCs(data)
            break
          }
          case FieldUserProfile.trainerSpId: {
            strData = this.getListTrainer(data)
            break
          }
          case FieldUserProfile.skillSetsId: {
            strData = this.getListSkillSet(data)
            break
          }

        }

        return <View style={[styles.row, {
          flexDirection: 'column', alignItems: "flex-start",
          paddingTop: 10, paddingBottom: 10
        }]} key={index}>
          <Text style={[styles.label, {textAlign: 'left'}]}>{title.length != 0 && title.toUpperCase()}</Text>
          <Text style={[styles.value, {textAlign: 'left', marginTop: 5}]}>{strData}</Text>
        </View>
      }

      if (typeof data == 'object' && item.field === FieldUserProfile.userSettings) {
        let str = ""
        let isEmail = get(userInfo, "userSettings.isSentEmail", false)
        let isMessage = get(userInfo, "userSettings.isSentSms", false)
        let isOther = get(userInfo, "userSettings.isSentNotification", false)

        if (isEmail) {
          str += "Email "
        }
        if (isMessage) {
          str += "Message "
        }
        if (isOther) {
          str += "Notification "
        }
        let convert = str.trim().replace(/ /g, ", ")
        
        return <View style={[styles.row, {
          flexDirection: 'column', alignItems: "flex-start",
          paddingTop: 10,
        }]} key={index}>
          <Text style={[styles.label, {textAlign: 'left'}]}>{item.name.toUpperCase()}</Text>
          <Text style={[styles.value, {textAlign: 'left', marginTop: 8}]}>{convert}</Text>
        </View>
      }
    })
  }

  renderProfileInfo = (role) => {
    switch (role) {
      case RoleType.SuperAdmin: {
        return this.renderRow(SuperAdminMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.PM: {
        return this.renderRow(PMMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.PL: {
        return this.renderRow(PLMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.Partner: {
        return this.renderRow(PartnerMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.AIC: {
        return this.renderRow(AICMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.DataEntry: {
        return this.renderRow(DataEntryMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.HPM: {
        return this.renderRow(HPMMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.SM: {
        return this.renderRow(SMMapWithFields, get(this.props, "userInfo", []))
      }
      case RoleType.SP: {
        return this.renderRow(SPMapWithFields, get(this.props, "userInfo", []))
      }
      default: {
        return this.renderRow(TrainerMapWithFields, get(this.props, "userInfo", []))
      }
    }
  }

  getName = () => {
    let {userInfo} = this.props;
    return userInfo && userInfo.pocName && userInfo.pocName != ""
      ? userInfo.pocName
      : get(userInfo, "name", "")
  }

  render() {

    let name = this.getName()

    return <ScrollView style={{marginLeft: 20, marginRight: 20}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Image
            style={{width: 22, height: 22}}
            source={Images.userIcon}
            resizeMode="contain"
          />
        </View>

        <Text>Welcome, <Text>{name}</Text></Text>
        <View style={styles.roleBorder}>
          <Text style={{}}>{get(this.props.userInfo, "typeRole", '')}</Text>
        </View>

      </View>
      <Text style={styles.headTitleRow}>PROFILE INFO</Text>
      {this.renderProfileInfo(this.props.role)}
      <Text style={[styles.headTitleRow, {marginTop: 10}]}>ACCOUNT INFO</Text>
      <Row label={'USERNAME'} component={get(this.props.userInfo, "userName", '')} />
      <BreakLine />
      <Row label={'PASSWORD'}
        component={<TouchableOpacity
          onPress={() => this.props.pushNav(RouteKey.ChangePassword)}>
          <Text style={{color: AppColors.blueTitle}}>Change password</Text>
        </TouchableOpacity>} />
      <BreakLine />
      <TouchableOpacity
        style={styles.logOutBtn}
        onPress={() => this.setState({showModal: true})}>
        <Text style={styles.titleBtn}>Log out</Text>
      </TouchableOpacity>

      <ConfirmationModal
        show={this.state.showModal}
        message="Are you sure to log out."
        confirmAction={() => {
          this.handleLogout();
          this.setState({showModal: false});
          this.props.resetNav("Login");
        }}
        cancelAction={() => {
          this.setState({showModal: false});
        }}
      />
    </ScrollView>
  }
}

export default connect(state => ({
  userInfo: state.auth.userInfo,
  programTypes: state.app.programTypes,
  role: get(state.auth.userInfo, 'typeRole', ''),
  districts: state.app.districts,
  divisions: state.app.divisions,
  grcs: state.app.grcs,
}),
  dispatch => (bindActionCreators({
    logout,
    resetNav,
    pushNav
  }, dispatch))
)(UserProfileContainer)

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
    height: 22, borderRadius: 3,
    paddingLeft: 3, paddingRight: 3,
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
    marginTop: 35, marginBottom: 15
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