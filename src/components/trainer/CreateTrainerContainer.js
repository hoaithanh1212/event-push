import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, Platform, ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

var get = require('lodash.get');
import {Images} from '../../theme/images';
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
import DropdownMultipleSelectionInput from '../../common/DropdownMultipleSelectionInput';
import PasswordInput from '../../common/PasswordInput';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import NavigationBar from '../../common/NavigationBar';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import {getSkillSets} from '../../actions/skillSet';

import * as validation from '../../utils/validation';
import {getTrainerAction} from '../../actions/user';
import {createTrainer} from '../../services/userService';
import {RoleType} from '../../contants/profile-field';
import moment from 'moment';
import Checkbox from './../../common/Checkbox';

class CreateTrainerContainer extends Component {
  constructor(props) {
    super(props);
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
  }

  static navigationOptions = ({navigation}) => {
    const isEnable = navigation.getParam('isEnable')
    return {
      headerRight: <TouchableOpacity style={{marginRight: 20}}
                                     disabled={!isEnable}
                                     onPress={() => {
                                       const createTrainer = navigation.getParam('createTrainer')
                                       createTrainer()
                                     }}
      >
        <Text style={[styles.buttonText, {
          fontSize: 16,
          color: isEnable ? AppColors.blueTextColor : AppColors.grayTextColor
        }]}>ADD</Text>
      </TouchableOpacity>
    }
  }

  componentDidMount() {

    this.props.navigation.setParams({
      createTrainer: () => {
        this.createTrainer()
      }
    })
  }

  componentDidUpdate() {
    this.validateData()
  }

  validateData = () => {
    const {userName, password, email, name, mobile, AEDDate, CPRDate, bankName, bankInfo, accountNumber, skillSet, isSelected} = this.state
    let isFieldEmpty = false

    if (!userName) isFieldEmpty = true
    if (!password) isFieldEmpty = true
    if (!email) isFieldEmpty = true
    if (!name) isFieldEmpty = true
    if (!mobile) isFieldEmpty = true
    if (!AEDDate && !isSelected) isFieldEmpty = true
    if (!CPRDate && !isSelected) isFieldEmpty = true
    if (!bankName) isFieldEmpty = true
    if (!userName) isFieldEmpty = true
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

  createTrainer = () => {
    const {userName, password, email, name, mobile, AEDDate, CPRDate, bankName, bankInfo, accountNumber, skillSet, isSelected} = this.state
    let skillSetsId = skillSet.map(item => item.id)
    let data = {
      userName,
      newBankAccount: {
        name: bankName,
        accountNumber,
        bankInfo
      },
      password,
      email,
      typeRole: RoleType.Trainer,
      name,
      phoneNumber: mobile,
      aedDate: isSelected ? '' : AEDDate,
      cprDate: isSelected ? '' : CPRDate,
      skillSetsId
    }
    createTrainer(data).then(res => {
      console.log('createTrainer', res)
      if (res.statusCode == 200) {
        alert('Create trainer successfully.')
        this.props.getTrainerAction()
        this.props.navigation.pop()
      } else {
        alert(res.message)
      }
    })
  }

  inputName = (value) => {
    if (!value) {
      this.setState({nameErr: 'Name is empty'})
      return
    }
    this.setState({name: value, nameErr: ''})
  }

  inputUserName = (value) => {
    if (!value) {
      this.setState({userNameErr: 'User name is empty'})
      return
    }
    this.setState({userName: value, userNameErr: ''})
  }

  inputPassword = (value) => {
    if (!value) {
      this.setState({passwordErr: 'Password is empty'})
      return
    }

    if (!validation.validatePassword(value)) {
      this.setState({passwordErr: 'Password is incorrect'})
      return
    }

    this.setState({password: value, passwordErr: ''})
  }

  inputMobile = (value) => {
    if (!value) {
      this.setState({mobileErr: 'Mobile is empty'})
      return
    }
    this.setState({mobile: value, mobileErr: ''})
  }

  inputEmail = (value) => {
    if (!value) {
      this.setState({emailErr: 'Email is empty'})
      return
    }

    if (!validation.validateEmail(value)) {
      this.setState({emailErr: 'Email is incorrect'})
      return
    }

    this.setState({email: value, emailErr: ''})
  }

  inputAEDDate = (value) => {
    if (!value) {
      this.setState({AEDDateErr: 'AED Date is empty'})
      return
    }
    this.setState({AEDDate: value, AEDDateErr: ''})
  }

  inputCPRDate = (value) => {
    if (!value) {
      this.setState({CPRDateErr: 'CPR Date is empty'})
      return
    }
    this.setState({CPRDate: value, CPRDateErr: ''})
  }

  inputBankName = (value) => {
    if (!value) {
      this.setState({bankNameErr: 'Bank name is empty'})
      return
    }
    this.setState({bankName: value, bankNameErr: ''})
  }

  inputAccountNumber = (value) => {
    if (!value) {
      this.setState({accountNumberErr: 'Account number is empty'})
      return
    }
    this.setState({accountNumber: value, accountNumberErr: ''})
  }

  inputBankInfo = (value) => {
    if (!value) {
      this.setState({bankInfoErr: 'Bank info is empty'})
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
    const {skillSet, AEDDate, CPRDate} = this.state
    return <View style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.group]}>
          <Text style={styles.title}>ACCOUNT INFO</Text>
          <TextInputWithoutTitle
            placeholder="Username"
            message={this.state.userNameErr}
            changeText={this.inputUserName}/>
          <PasswordInput
            placeholder="Password"
            isShowTitle={false}
            secureTextEntry={true}
            message={this.state.passwordErr}
            changeText={this.inputPassword}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>PERSONAL INFO</Text>
          <TextInputWithoutTitle
            placeholder="Trainer Name"
            message={this.state.nameErr}
            changeText={this.inputName}/>
          <TextInputWithoutTitle
            placeholder="Email"
            message={this.state.emailErr}
            changeText={this.inputEmail}/>
          <TextInputWithoutTitle
            placeholder="Mobile"
            keyboardType={'numeric'}
            message={this.state.mobileErr}
            changeText={this.inputMobile}
            maxLength={8}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>WORKING INFO</Text>
          {/*<DropdownMultipleSelectionInput placeholder="Skill Set"*/}
          {/*dataSource={data}*/}
          {/*message={this.state.skillSetErr}*/}
          {/*onSelected={this.inputSkillSet}/>*/}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Checkbox normalIcon={Images.blankIcon}
                      highlightIcon={Images.checked2Icon}
                      active={this.state.isSelected}
                      onPress={() => {
                        this.onCheckPress()
                      }}/>
            <Text style={{marginLeft: 5}}>NA</Text>
          </View>
          <View style={{marginTop: 10}}>
            <DropdownMultipleSelectionInput
              placeholder={'Skill Set'}
              title={'Skill Set'}
              dataSource={skillSets}
              fieldShow={'name'}
              value={this.formatMulValue('name')}
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
            message={this.state.bankNameErr}
            changeText={this.inputBankName}/>
          <TextInputWithoutTitle
            placeholder="The Account Holder Name"
            message={this.state.bankInfoErr}
            changeText={this.inputBankInfo}/>
          <TextInputWithoutTitle
            placeholder="Account Number"
            message={this.state.accountNumberErr}
            changeText={this.inputAccountNumber}/>
        </View>
      </ScrollView>

    </View>
  }
}

export default connect(state => ({
    skillSets: state.skillSet.skillSets
  }),
  dispatch => (bindActionCreators({
    getSkillSets,
    getTrainerAction,
  }, dispatch))
)(CreateTrainerContainer)

const styles = StyleSheet.create({
  container: {
    flex: 1
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
});
