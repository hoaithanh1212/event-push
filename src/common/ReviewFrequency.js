/**
 * Created by Hong HP on 4/11/19.
 */
import React from 'react';
import {View, StyleSheet, Modal, Text, Dimensions, FlatList, TouchableOpacity, Image, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {AppColors} from '../theme/colors';
import moment from 'moment/moment';
import {SafeAreaView} from 'react-navigation';
import {Images} from '../theme/images';
import {FontNames} from '../theme/fonts';
import {ProgramTypes} from '../contants/program-types';

const {height} = Dimensions.get('window')
const weekly = [
  {key: 0, value: 'S'},
  {key: 1, value: 'M'},
  {key: 2, value: 'T'},
  {key: 3, value: 'W'},
  {key: 4, value: 'T'},
  {key: 5, value: 'F'},
  {key: 6, value: 'S'},
]
const WEEK = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
}


const titleWeekly = ''
const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'

class ReviewFrequency extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedWeek: '',
      listDataWeek: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.repeatDayOfMonth && this.state.selectedWeek != nextProps.repeatDayOfMonth) {
      this.setState({selectedWeek: nextProps.repeatDayOfMonth[0] || {}})
    }
  }

  renderRepeatTypeWeekly = () => {
    const {dayInWeek} = this.props
    return <View>
      <Text style={{fontSize: 12, color: AppColors.black60}}>Frequency on</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 15}}>
        {
          weekly.map((item, index) => {
            return <View
              key={index.toString()}
              activeOpacity={0.5}
              style={[styles.buttonWeekly, {backgroundColor: dayInWeek.key === item.key ? AppColors.buttonColor : '#d9d9d9'}]}>
              <Text style={[styles.textButtonWeekly,
                {color: dayInWeek.key === item.key ? AppColors.whiteTitle : AppColors.black60}]}>{item.value}</Text>
            </View>
          })
        }
      </View>
    </View>
  }

  renderRepeatTypeMonthly = () => {
    const {dayInWeek, repeatDayOfMonth} = this.props
    const {selectedWeek} = this.state
    return <View>
      <ScrollView style={{marginTop: 5, marginBottom: 15}}
                  horizontal
                  showsHorizontalScrollIndicator={false}
      >
        {
          repeatDayOfMonth.map((item, index) => {
            return <TouchableOpacity
              style={{
                marginRight: 32,
                borderBottomWidth: selectedWeek.week === item.week ? 2 : 0,
                paddingVertical: 5,
                borderColor: AppColors.buttonColor
              }}
              key={index.toString()}
              activeOpacity={0.5}
              onPress={() => {
                this.setState({
                  selectedWeek: item
                })
              }}>
              <Text style={[styles.textButtonWeekly, {
                color: selectedWeek.week === item.week ? AppColors.buttonColor : AppColors.black60,
                fontFamily: FontNames.RobotoBold,
                fontSize: 12
              }]
              }>{item.week < 5 ? 'WEEK' + item.week : 'LAST WEEK'}: {WEEK[item.dayOfWeeks]}</Text>
            </TouchableOpacity>
          })
        }
      </ScrollView>
    </View>
  }

  filterWeek = (week) => {
    const {listSession} = this.props
    return listSession.filter(item => item.week === week)
  }

  render() {
    const {title, frequencyType, listSession, isShow, onEdit, dayInWeek, onClose, isAdvanceSetting, programType} = this.props
    const {selectedWeek} = this.state
    return <View style={styles.container}>
      <Modal animationType="slide"
             transparent={true}
             visible={isShow}
             onRequestClose={() => {
             }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)'}}/>
        <SafeAreaView style={{maxHeight: height * 2 / 3, backgroundColor: '#fff', paddingHorizontal: 20}}>
          <View style={{marginVertical: 24, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 20, flex: 1, fontFamily: FontNames.RobotoMedium}}>Frequency Info
              ({frequencyType === WEEKLY ? 'Weekly' : 'Monthly'})</Text>
            <TouchableOpacity
              onPress={() => {
                onClose()
              }}
            >
              <Image source={Images.closeIcon} style={{tintColor: '#000'}}/>
            </TouchableOpacity>
          </View>

          {frequencyType === WEEKLY && this.renderRepeatTypeWeekly()}
          {frequencyType === MONTHLY && this.renderRepeatTypeMonthly()}

          <FlatList data={frequencyType == WEEKLY ? listSession : this.filterWeek(selectedWeek.week)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => <ItemView item={item}
                                                             programType={programType}
                                                             isAdvanceSetting={isAdvanceSetting}
                    />}
          />
          <TouchableOpacity style={{
            backgroundColor: AppColors.buttonColor,
            height: 44,
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 20
          }}
                            onPress={() => {
                              onEdit()
                            }}
          >
            <Text style={{color: '#fff'}}>EDIT</Text>
          </TouchableOpacity>
        </SafeAreaView>

      </Modal>
    </View>
  }
}

class ItemView extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {item, programType, isAdvanceSetting} = this.props
    return <View>
      {
        programType === ProgramTypes.NutritionCooking ?
          <View style={{flexDirection: 'row', marginBottom: 5}}>
            <Text style={{flex: 1, color: AppColors.black60, fontSize: 16}}>{isAdvanceSetting ? item.date : ''}</Text>
            <View style={{flex: 3}}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Text style={{flex: 2, fontSize: 16}}
                      numberOfLines={1}>{item.category1.name}</Text>
                <Text style={{flex: 1, fontSize: 16}}
                      numberOfLines={1}>{item.recipe1Name}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 2, fontSize: 16}}
                      numberOfLines={1}>{item.category2.name}</Text>
                <Text style={{flex: 1, fontSize: 16}}
                      numberOfLines={1}>{item.recipe2Name}</Text>
              </View>
            </View>
          </View>
          : <View style={{flexDirection: 'row', marginBottom: 5}}>
            <Text style={{flex: 1, color: AppColors.black60, fontSize: 16}}>{isAdvanceSetting ? item.date : ''}</Text>
            <Text style={{flex: 2, fontSize: 16}}
                  numberOfLines={1}>{item.activityName}</Text>
          </View>
      }
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonWeekly: {
    width: 32,
    height: 32,
    backgroundColor: '#d9d9d9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textButtonWeekly: {
    color: AppColors.black60
  }
})

export default connect(state => ({}), dispatch => ({}))(ReviewFrequency)