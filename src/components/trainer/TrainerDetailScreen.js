/**
 * Created by Hong HP on 3/12/19.
 */
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import {deleteUser, getUserInfo} from '../../services/userService';
import {getTrainerAction} from '../../actions/user';
import {pushNav} from '../../actions/navigate';
import {bindActionCreators} from 'redux';
import {RouteKey} from '../../contants/route-key';

class TrainerDetailScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const headerTitle = navigation.getParam('headerTitle')
    return {
      headerRight: <TouchableOpacity style={{marginRight: 20}}
                                     onPress={() => {
                                       const editTrainer = navigation.getParam('editTrainer')
                                       editTrainer()
                                     }}
      >
        <Text style={[styles.buttonText, {
          fontSize: 16,
          color: AppColors.blueTextColor
        }]}>Edit</Text>
      </TouchableOpacity>,
      headerTitle: headerTitle || 'Trainer Info'
    }
  }

  constructor() {
    super()
    this.state = {
      trainerInfo: {
        bankAccount: '',
      },
      showConfirmDelete: false
    }
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
    this.props.navigation.setParams({
      headerTitle: trainerInfo.name,
      editTrainer: () => {
        this.props.pushNav(RouteKey.UpdateTrainerInfo, {
          trainerInfo,
          getTrainerInfo: () => {
            this.getTrainerInfo()
          }
        })
      }
    })
    console.log(trainerInfo)
    this.setState({trainerInfo, skillSet})
  }

  componentWillReceiveProps(nextProps) {
    console.log('1234', nextProps);
    if (nextProps && nextProps.trainers) {
      let navigationParams = this.props.navigation.getParam('trainerInfo')
      this.trainserId = navigationParams.id
      const trainerInfo = nextProps.trainers.find(item => item.id === this.trainserId)
      let skillSet = []
      if (!!trainerInfo.skillSetsId)
        skillSet = trainerInfo.skillSetsId.map(skillSetId => {
          let skillSet = this.props.skillSets.find(item => item.id == skillSetId)
          return skillSet
        })
      console.log(trainerInfo)
      this.setState({trainerInfo, skillSet})
    }
  }

  getTrainerInfo = () => {
    const {trainerInfo} = this.state
    getUserInfo(trainerInfo.id).then(res => {
      console.log('getTrainerInfo');
      this.setState({
        trainerInfo: res.data
      })
    })
  }

  deleteTrainer = () => {
    const {trainerInfo} = this.state
    deleteUser(trainerInfo.id).then(data => {
      if (data.statusCode == 200) {
        this.props.getTrainerAction('', '', '', 0, true)
        this.props.navigation.pop()
      }
    })
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

  render() {
    const {trainerInfo, showConfirmDelete} = this.state
    const {bankAccount} = trainerInfo
    return <View style={styles.container}>
      <ScrollView style={{flex: 1}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TextInputHeaderTitle
          title={'PERSONAL INFO'}
          titleStyle={{color: AppColors.blueTextColor, fontFamily: FontNames.RobotoBold}}
        />
        <TextInputHeaderTitle
          title={'TRAINER NAME'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={trainerInfo.name}
        />
        <TextInputHeaderTitle
          title={'EMAIL'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={trainerInfo.email}
        />
        <TextInputHeaderTitle
          title={'MOBILE'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={trainerInfo.phoneNumber}
        />
        <TextInputHeaderTitle
          title={'WORKING INFO'}
          titleStyle={{color: AppColors.blueTextColor, fontFamily: FontNames.RobotoBold}}
        />
        <TextInputHeaderTitle
          title={'SKILLSET'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={this.formatMulValue('name')}
        />
        <TextInputHeaderTitle
          title={'AED DATE'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={trainerInfo.aedDate}
        />
        <TextInputHeaderTitle
          title={'CPR DATE'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={trainerInfo.cprDate}
        />
        <TextInputHeaderTitle
          title={'BANK ACCOUNT DETAILS'}
          titleStyle={{color: AppColors.blueTextColor, fontFamily: FontNames.RobotoBold}}
        />
        <TextInputHeaderTitle
          title={'BANK NAME'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={bankAccount.bankInfo}
        />
        <TextInputHeaderTitle
          title={'ACCOUNT HOLDERS'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={bankAccount.name}
        />
        <TextInputHeaderTitle
          title={'ACCOUNT NUMBER'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={bankAccount.accountNumber}
        />
        <TextInputHeaderTitle
          title={'ACCOUNT INFO'}
          titleStyle={{color: AppColors.blueTextColor, fontFamily: FontNames.RobotoBold}}
        />
        <TextInputHeaderTitle
          title={'USERNAME'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={trainerInfo.userName}
        />
        <TextInputHeaderTitle
          title={'PASSWORD'}
          titleStyle={{flex: 1}}
          inputStyle={[styles.textStyle, {color: AppColors.blueTextColor}]}
          value={'Change Password'}
          onPress={() => {

          }}
        />

        <TouchableOpacity style={styles.buttonStyle}
                          onPress={() => {
                            this.setState({showConfirmDelete: true})
                          }}
        >
          <Text style={{color: '#e04949', fontSize: 16, fontFamily: FontNames.RobotoRegular}}>Delete Trainer</Text>
        </TouchableOpacity>

        <Modal animationType="fade"
               transparent={true}
               visible={showConfirmDelete}
               onRequestClose={() => {
               }}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{backgroundColor: '#fff', width: '80%', padding: 24, borderRadius: 5}}>
              <Text style={{fontSize: 20, fontFamily: FontNames.RobotoMedium, marginBottom: 10}}>Delete this
                Trainer?</Text>
              <Text style={{color: AppColors.black60, fontSize: 16}}>Please ensure that you want to delete this
                Trainer.</Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15}}>
                <TouchableOpacity style={styles.buttonActionStyle}
                                  onPress={() => {
                                    this.setState({showConfirmDelete: false})
                                    this.deleteTrainer()
                                  }}
                >
                  <Text style={{color: '#e04949', fontFamily: FontNames.RobotoMedium}}>DELETE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonActionStyle, {backgroundColor: AppColors.blueBackgroundColor}]}
                                  onPress={() => this.setState({showConfirmDelete: false})}
                >
                  <Text style={{color: '#fff', fontFamily: FontNames.RobotoMedium}}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Modal>
      </ScrollView>
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  textStyle: {
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    color: AppColors.black60,
    textAlign: 'right'
  },
  buttonStyle: {
    height: 44,
    backgroundColor: '#ffe3e3',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32
  },
  buttonActionStyle: {
    width: 88,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  }
})

export default connect(state => ({
  skillSets: state.skillSet.skillSets,
  trainers: state.user.trainers
}), dispatch => (bindActionCreators({
  getTrainerAction,
  pushNav
}, dispatch)))(TrainerDetailScreen)