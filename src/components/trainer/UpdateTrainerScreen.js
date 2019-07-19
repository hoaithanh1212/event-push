/**
 * Created by Hong HP on 3/12/19.
 */

import React from 'react';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform} from 'react-native';
import {Images} from '../../theme/images';
import moment from 'moment/moment';
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
import DropdownMultipleSelectionInput from '../../common/DropdownMultipleSelectionInput';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import {connect} from 'react-redux';
import {AppColors} from '../../theme/colors';
import * as validation from '../../utils/validation';
import {FontNames} from '../../theme/fonts';
import {updateUser} from '../../services/userService';
import {getTrainerAction} from '../../actions/user';
import {bindActionCreators} from 'redux';
import Checkbox from './../../common/Checkbox';
import {RoleType} from '../../contants/profile-field';

class UpdateTrainerScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const isEnable = navigation.getParam('isEnable')
    return {
      headerRight: <TouchableOpacity style={{marginRight: 20}}
                                     disabled={!isEnable}
                                     onPress={() => {
                                       const updateTrainer = navigation.getParam('updateTrainer')
                                       updateTrainer()
                                     }}
      >
        <Text style={[styles.buttonText, {
          fontSize: 16,
          color: isEnable ? AppColors.blueTextColor : AppColors.grayTextColor
        }]}>Update</Text>
      </TouchableOpacity>
    }
  }

  constructor() {
    super()
    this.state = {
      name: '',
      userName: '',
      password: '',
      mobile: '',
      email: '',
      AEDDate: '',
      CPRDate: '',
      bankName: '',
      accountNumber: '',
      bankInfo: '',
      skillSet: [],

      nameErr: '',
      userNameErr: '',
      passwordErr: '',
      mobileErr: '',
      emailErr: '',
      AEDDateErr: '',
      CPRDateErr: '',
      bankNameErr: '',
      accountNumberErr: '',
      bankInfoErr: '',
      skillSetErr: '',
      isSelected: false
    };
    this.trainserId = ''
  }

  componentDidMount() {
    let navigationParams = this.props.navigation.getParam('trainerInfo')
    this.trainserId = navigationParams.id
    const trainerInfo = this.props.trainers.find(item => item.id === this.trainserId)
    let skillSet = []
    if (!!trainerInfo.skillSetsId)
      skillSet = trainerInfo.skillSetsId.map(skillSetId => {
        let skillSet = this.props.skillSets.find(item => item.id == skillSetId)
        return skillSet
      })
    if (!!trainerInfo) {
      this.setState({
        name: trainerInfo.name,
        userName: trainerInfo.userName,
        mobile: trainerInfo.phoneNumber,
        email: trainerInfo.email,
        AEDDate: trainerInfo.aedDate,
        CPRDate: trainerInfo.cprDate,
        bankName: trainerInfo.bankAccount.name,
        accountNumber: trainerInfo.bankAccount.accountNumber,
        bankInfo: trainerInfo.bankAccount.bankInfo,
        skillSet: skillSet,
        isSelected: trainerInfo.aedDate == '' && trainerInfo.cprDate == '' ? true: false
      })
    }

    this.props.navigation.setParams({
      updateTrainer: () => {
        this.updateTrainer()
      }
    })
  }

  componentDidUpdate() {
    this.validateData()
  }

  updateTrainer = () => {
    const {userName, email, name, mobile, AEDDate, CPRDate, bankName, bankInfo, accountNumber, skillSet, isSelected} = this.state
    let skillSetsId = skillSet.map(item => item.id)
    let data = {
      userName,
      editBankAccount: {
        name: bankName,
        accountNumber,
        bankInfo
      },
      email,
      name,
      phoneNumber: mobile,
      aedDate: isSelected ? '' : AEDDate,
      cprDate: isSelected ? '' : CPRDate,
      typeRole: RoleType.Trainer,
      skillSetsId
    }
    console.log('123', JSON.stringify(data));
    updateUser(data, this.trainserId).then(res => {
      console.log('updateUser');
      if (res.statusCode == 200) {
        alert('Update trainer successfully.')
        let getTrainerInfo = this.props.navigation.getParam('getTrainerInfo')
        getTrainerInfo()
        this.props.getTrainerAction()
        this.props.navigation.pop()
      } else {
        alert(res.message)
      }
    })
  }

  validateData = () => {
    const {userName, email, name, mobile, AEDDate, CPRDate, bankName, bankInfo, accountNumber, skillSet, isSelected} = this.state
    let isFieldEmpty = false

    if (!userName) isFieldEmpty = true
    if (!email) isFieldEmpty = true
    if (!name) isFieldEmpty = true
    if (!mobile) isFieldEmpty = true
    if (!AEDDate && !isSelected) isFieldEmpty = true
    if (!CPRDate && !isSelected) isFieldEmpty = true
    if (!bankName) isFieldEmpty = true
    if (!bankInfo) isFieldEmpty = true
    if (!accountNumber) isFieldEmpty = true
    if (!skillSet) isFieldEmpty = true
    let isEnable = this.props.navigation.getParam('isEnable')
    if (isFieldEmpty) {
      if (!!isEnable)
        this.props.navigation.setParams({
          isEnable: !isEnable
        })
    } else {
      if (!isEnable)
        this.props.navigation.setParams({
          isEnable: !isEnable
        })
    }

  }

  inputName = (value) => {
    if (!value) {
      this.setState({name: value, nameErr: 'Name is empty'})
      return
    }
    this.setState({name: value, nameErr: ''})
  }

  inputUserName = (value) => {
    if (!value) {
      this.setState({userName: value, userNameErr: 'User name is empty'})
      return
    }
    this.setState({userName: value, userNameErr: ''})
  }

  inputPassword = (value) => {
    if (!value) {
      this.setState({password: value, passwordErr: 'Password is empty'})
      return
    }

    if (!validation.validatePassword(value)) {
      this.setState({password: value, passwordErr: 'Password is incorrect'})
      return
    }

    this.setState({password: value, passwordErr: ''})
  }

  inputMobile = (value) => {
    if (!value) {
      this.setState({mobile: value, mobileErr: 'Mobile is empty'})
      return
    }
    this.setState({mobile: value, mobileErr: ''})
  }

  inputEmail = (value) => {
    if (!value) {
      this.setState({email: value, emailErr: 'Email is empty'})
      return
    }

    if (!validation.validateEmail(value)) {
      this.setState({email: value, emailErr: 'Email is incorrect'})
      return
    }

    this.setState({email: value, emailErr: ''})
  }

  inputAEDDate = (value) => {
    if (!value) {
      this.setState({AEDDate: value, AEDDateErr: 'AED Date is empty'})
      return
    }
    this.setState({AEDDate: value, AEDDateErr: ''})
  }

  inputCPRDate = (value) => {
    if (!value) {
      this.setState({CPRDate: value, CPRDateErr: 'CPR Date is empty'})
      return
    }
    this.setState({CPRDate: value, CPRDateErr: ''})
  }

  inputBankName = (value) => {
    if (!value) {
      this.setState({bankName: value, bankNameErr: 'Bank name is empty'})
      return
    }
    this.setState({bankName: value, bankNameErr: ''})
  }

  inputAccountNumber = (value) => {
    if (!value) {
      this.setState({accountNumber: value, accountNumberErr: 'Account number is empty'})
      return
    }
    this.setState({accountNumber: value, accountNumberErr: ''})
  }

  inputBankInfo = (value) => {
    if (!value) {
      this.setState({bankInfo: value, bankInfoErr: 'Bank info is empty'})
      return
    }
    this.setState({bankInfo: value, bankInfoErr: ''})
  }

  inputSkillSet = (value) => {
    console.log('DATA', value)
  }


  formatMulValue = (fieldShow) => {
    const {skillSet} = this.state
    let text = ''
    if (!!skillSet && skillSet.length > 0) {
      skillSet.map(item => {
        if (!!text) {
          text = text + ',' + '\n' + item[fieldShow]
        } else {
          text = item[fieldShow]
        }

      })
    }
    return text
  }

  onCheckPress = () => {
    this.setState({isSelected: !this.state.isSelected});``
  }

  render() {
    const {skillSets} = this.props
    const {skillSet, AEDDate, CPRDate, name, accountNumber, bankInfo, bankName, email, mobile, userName} = this.state
    return <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{marginTop: 15}}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.group]}>
          <Text style={styles.title}>ACCOUNT INFO</Text>
          <TextInputWithoutTitle
            placeholder="Username"
            message={this.state.userNameErr}
            value={userName}
            style={{backgroundColor: AppColors.lightGray1}}
            editable={false}
            changeText={this.inputUserName}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>PERSONAL INFO</Text>
          <TextInputWithoutTitle
            placeholder="Trainer Name"
            message={this.state.nameErr}
            value={name}
            changeText={this.inputName}/>
          <TextInputWithoutTitle
            placeholder="Email"
            value={email}
            message={this.state.emailErr}
            changeText={this.inputEmail}/>
          <TextInputWithoutTitle
            placeholder="Mobile"
            value={mobile}
            keyboardType={'numeric'}
            message={this.state.mobileErr}
            changeText={this.inputMobile}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>WORKING INFO</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox normalIcon={Images.blankIcon}
                      highlightIcon={Images.checked2Icon}
                      active={this.state.isSelected}
                      onPress={() => {
                        this.onCheckPress()
                      }}/>
            <Text style={{marginLeft: 5}}>NA</Text>
          </View>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <DropdownMultipleSelectionInput
              placeholder={'Skill Set'}
              title={'Skill Set'}
              dataSource={skillSets}
              fieldShow={'name'}
              value={this.formatMulValue('name')}
              selectedData={skillSet}
              onSelected={(items) => {
                this.setState({
                  skillSet: items,
                })
              }}
              onUnselected={(item) => {
                this.setState({
                  skillSet: skillSet.filter(data => data.id !== item.id)

                })
              }}
            />
          </View>
          {
            this.state.isSelected ? <View /> : <View>
            <DateTimeInputWithTitle
                placeholder={'AED Date'}
                tailIcon={Images.dateIcon}
                date={AEDDate}
                changeText={(text) => {
                  this.inputAEDDate(moment(text).format('DD/MM/YYYY'))
                }}
              />
              <DateTimeInputWithTitle
                placeholder={'CPR Date'}
                tailIcon={Images.dateIcon}
                date={CPRDate}
                changeText={(text) => {
                  this.inputCPRDate(moment(text).format('DD/MM/YYYY'))
                }}
              />
            </View>
          }
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>BANK INFO</Text>
          <TextInputWithoutTitle
            placeholder="Bank Name"
            value={bankInfo}
            message={this.state.bankNameErr}
            changeText={this.inputBankName}/>
          <TextInputWithoutTitle
            placeholder="The Account Holder Name"
            message={this.state.bankInfoErr}
            value={bankName}
            changeText={this.inputBankInfo}/>
          <TextInputWithoutTitle
            placeholder="Account Number"
            value={accountNumber}
            message={this.state.accountNumberErr}
            changeText={this.inputAccountNumber}/>
        </View>
      </ScrollView>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  group: {
    marginBottom: 25, justifyContent: 'center',
    marginLeft: 16,
    marginRight: 16,
  },
  title: {
    color: AppColors.registerTitleColor,
    fontSize: 12,
    fontFamily: FontNames.RobotoBold,
    marginTop: 5, marginBottom: 5
  },
  note: {
    color: AppColors.grayTextColor,
    fontSize: 12, fontFamily: FontNames.RobotoRegular
  },
  border: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10
  },
  input: {
    marginLeft: 5,
    color: '#333333',
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    height:
      Platform.OS.toLocaleUpperCase() === 'ios'.toLocaleUpperCase() ? 30 : 40
  },
  autocompleteContainer: {
    flex: 1,
    borderRadius: 5,
  },
  buttonText: {
    color: AppColors.grayTextColor,
    fontFamily: FontNames.RobotoBold,
    fontSize: 12
  },
})

export default connect(state => ({
  skillSets: state.skillSet.skillSets,
  trainers: state.user.trainers
}), dispatch => (bindActionCreators({
  getTrainerAction,
}, dispatch)))(UpdateTrainerScreen)