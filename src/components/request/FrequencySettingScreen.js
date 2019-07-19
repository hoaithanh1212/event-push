/**
 * Created by Hong HP on 4/8/19.
 */
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert, Keyboard, ScrollView, Modal, Image} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {Images} from '../../theme/images';
import {AppColors} from '../../theme/colors';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import {FontNames} from '../../theme/fonts';
import Toast from '@remobile/react-native-toast/index';
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import CalendarPicker from '../../common/CalendarPicker';
import RadioButton from '../../common/RadioButton';
import AutoCompleteComponent from '../../common/AutoCompleteComponent';
import {SafeAreaView} from 'react-navigation';
import MonthSelectorCalendar from 'react-native-month-selector'
import {
  getActivityByProgramType,
  getListCategoryByProgram,
  getListRecipesByCategory
} from '../../services/requestService';
import DropdownInput from '../../common/DropdownInput';
import DropdownMultipSelectionInput from '../../common/DropdownMultipleSelectionInput';
import {showLoading} from '../../actions/app';
import {ProgramTypes} from '../../contants/program-types';
import {RoleType} from '../../contants/profile-field';
import DropdownAutocomplete from '../../common/DropdownAutocomplete';

const NUTRITION_COOKING = 'NutritionCooking'
const NUTRITION_WORKSHOP = 'NutritionWorkshop'
const PARENT_WORKSHOP = 'ParentWorkshop'
const SUPERMARKET_TOUR = 'SupermarketTour'
const HAWKER_TRAIL = 'HawkerTrail'
const MITY = 'MITY'
const CPAP = 'CPAP'
const FIT = 'FITplus'
const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'
const EAT_RIGHT_GET_MOVING = 'Eat Right Get Moving'
const weekly = [
  {key: 0, value: 'S'},
  {key: 1, value: 'M'},
  {key: 2, value: 'T'},
  {key: 3, value: 'W'},
  {key: 4, value: 'T'},
  {key: 5, value: 'F'},
  {key: 6, value: 'S'},
]

const HeaderMonthly = ({onCollapse, onRemoveWeek, title}) => {
  return <TouchableOpacity
    style={styles.sessionTitle}
    onPress={() => {
      onCollapse()
    }}>
    <Text style={{color: '#128ff9', fontWeight: 'bold', flex: 1}}>{title}</Text>
    <TouchableOpacity onPress={() => {
      onRemoveWeek()
    }}>
      <Image source={Images.deleteIcon} style={[styles.styleIcon, {tintColor: '#e04949'}]}
             resizeMode={'contain'}/>
    </TouchableOpacity>
    <Image source={Images.downSmallIcon} style={[styles.styleIcon, {tintColor: '#128ff9', marginLeft: 10}]}
           resizeMode={'contain'}/>
  </TouchableOpacity>
}

class FrequencySettingScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const isEnable = navigation.getParam('isEnable')
    return {
      headerRight: <TouchableOpacity style={{marginRight: 20}}
                                     disabled={!isEnable}
                                     onPress={() => {
                                       const saveFrequencyData = navigation.getParam('saveFrequency')
                                       saveFrequencyData()
                                     }}
      >
        <Text style={[styles.buttonText, {
          fontSize: 16,
          color: isEnable ? AppColors.blueTextColor : AppColors.grayTextColor
        }]}>SAVE</Text>
      </TouchableOpacity>
    }
  }

  constructor(props) {
    super(props)
    this.data = props.navigation.getParam('data')
    this.state = {
      startTime: '',
      startDate: '',
      endDate: '',
      dayInWeek: '',
      applyAll: true,
      repeatDayOfMonth: '',
      isAdvanceSetting: false,
      listSession: [],
      listActivity: [],
      listCategory: '',
      program: '',
      category: '',
      activity: '',
      expectedAttendance: '',
      listProgram: [],
      listRecipes: [],
      showMonthPicker: false,
      typeSelect: '',
      ...this.data,
      repeat: this.data.repeat || DAILY,
    }
    this.program = props.navigation.getParam('program')
    this.minimumDate = moment().add(30, 'days').toDate();
  }


  componentDidMount() {
    const {typeRole} = this.props.userInfo;

    this.getActivityByProgramType(this.program.type)
    this.getListCategoryByProgram(this.program.type)
    this.props.navigation.setParams({
      saveFrequency: () => {
        this.saveFrequencyData()
      }
    })

    switch (typeRole) {
      case RoleType.SuperAdmin:
      case RoleType.PM:
      case RoleType.DataEntry:
        this.minimumDate = moment().toDate();
        break;
    }

    
  }

  componentDidUpdate() {
    this.validateInputData()
  }


  validateInputData = () => {
    const {
      repeat, startDate, endDate, program, activity, isAdvanceSetting, listSession, repeatDayOfMonth,
      recipe1, recipe2
    } = this.state
    const {settings} = this.props
    let isFieldEmpty = false

    if (!startDate) isFieldEmpty = true
    if (repeat !== DAILY)
      if (!endDate) isFieldEmpty = true
    if (repeat === WEEKLY) {
      if (isAdvanceSetting) {
        listSession.map(item => {
          if (program.type === NUTRITION_COOKING) {
            if (!item.recipe1Id || !item.recipe2Id) isFieldEmpty = true
          } else if (!item.activityId) isFieldEmpty = true
        })
      } else {
        if (program.type === NUTRITION_COOKING) {
          if (!recipe1 || !recipe2) isFieldEmpty = true
        } else if (!activity) isFieldEmpty = true
      }
    }
    if (repeat === MONTHLY) {
      if (repeatDayOfMonth.length < settings.minWeekRepeatMonthly)
        isFieldEmpty = true
      listSession.map(item => {
        if (program.type === NUTRITION_COOKING) {
          if (!item.recipe1Id || !item.recipe2Id) isFieldEmpty = true
        } else if (!item.activityId) isFieldEmpty = true
      })
    }
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

  saveFrequencyData = () => {
    const {listSession} = this.state
    let saveFrequencyData = this.props.navigation.getParam('saveFrequencyData')
    let data = {
      ...this.state,
    }
    this.props.showLoading(true);
    if (listSession.length > 0) {
      data = {
        ...data,
        category1: listSession[0].category1,
        category2: listSession[0].category2,
        recipe1: {
          id: listSession[0].recipe1Id,
          name: listSession[0].recipe1Name,
        },
        recipe2: {
          id: listSession[0].recipe2Id,
          name: listSession[0].recipe2Name,
        },
      }
    }
    if (this.program.type == ProgramTypes.NutritionCooking) {
      saveFrequencyData({...data})
    } else
      saveFrequencyData({...data, activityName: this.state.activity.name || listSession[0].activityName})

    this.props.showLoading(false);
    this.props.navigation.pop()
  }

  getListCategoryByProgram = (programType) => {
    switch (programType) {
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case PARENT_WORKSHOP:
        getListCategoryByProgram(programType).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              listCategory: res.data.result.list
            })
          }
        })
    }
  }
  getActivityByProgramType = (programType) => {
    switch (programType) {
      case NUTRITION_COOKING:
        break
      default:
        getActivityByProgramType(programType).then(res => {
          console.log('Activity: ', res)
          if (res.statusCode === 200) {
            this.setState({
              listActivity: res.data.result.list,
            })
          }
        })
    }
  }

  renderTypeRepeat = () => {
    const {repeat, endDate, dayInWeek, startDate, repeatDayOfMonth, startTime, isAdvanceSetting} = this.state
    switch (repeat) {
      case DAILY:
        return <View/>
      case WEEKLY:
        return <View>
          <DateTimeInputWithTitle
            placeholder={'End Date'}
            tailIcon={Images.dateIcon}
            minimumDate={!!startDate ? moment(startDate, 'DD/MM/YYYY').toDate() : this.minimumDate}
            date={endDate}
            changeText={(text) => {
              this.setState({endDate: moment(text).format('DD/MM/YYYY')})
              this.createListDayInMonth(startDate, moment(text).format('DD/MM/YYYY'), repeat, isAdvanceSetting, repeatDayOfMonth)
            }}
          />
          <Text style={styles.textStyle}>Frequency on</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 15}}>
            {
              weekly.map((item, index) => {
                return <TouchableOpacity
                  key={index.toString()}
                  disabled={true}
                  activeOpacity={0.5}
                  style={[styles.buttonWeekly, {backgroundColor: dayInWeek.key === item.key ? AppColors.buttonColor : '#d9d9d9'}]}
                  onPress={() => {
                    // this.setState({
                    //   dayInWeek: item,
                    // })
                    // this.selectedStartDate(moment(startDate, 'DD/MM/YYYY').day(item.key).format('DD/MM/YYYY'))
                    // this.createListDayInMonth(moment(startDate, 'DD/MM/YYYY').day(item.key).format('DD/MM/YYYY'), endDate, repeat, isAdvanceSetting, repeatDayOfMonth)
                  }}>
                  <Text style={[styles.textButtonWeekly,
                    {color: dayInWeek.key === item.key ? AppColors.whiteTitle : AppColors.black60}]}>{item.value}</Text>
                </TouchableOpacity>
              })
            }
          </View>
        </View>
      case MONTHLY:
        return <View>
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={() => {
              this.setState({
                showMonthPicker: true,
                typeSelect: 'startDate'
              })
            }}>
            <TextInputHeaderTitle
              title={'Start Date'}
              titleStyle={{
                color: '#333333',
                fontSize: 16, fontFamily: FontNames.RobotoRegular,
              }}
              value={startDate || 'mm/yyyy'}
              inputStyle={{textAlign: 'right', color: AppColors.black60}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={() => {
              this.setState({
                showMonthPicker: true,
                typeSelect: 'endDate'
              })
            }}>
            <TextInputHeaderTitle
              title={'End Date'}
              titleStyle={{
                color: '#333333',
                fontSize: 16, fontFamily: FontNames.RobotoRegular,
              }}
              value={endDate || 'mm/yyyy'}
              inputStyle={{textAlign: 'right', color: AppColors.black60}}
            />
          </TouchableOpacity>
          <CalendarPicker
            listValue={repeatDayOfMonth}
            onItemSelected={(data) => {
              let index = -1
              let tmp = []
              const {settings} = this.props
              if (!startDate && !endDate) {
                Toast.showShortBottom(`Please select start date and end date!`)
                return
              }
              if (data.week === 4 || data.week === 5) {
                index = repeatDayOfMonth.findIndex((item, index) => (item.week == 4 || item.week === 5))
              } else {
                index = repeatDayOfMonth.findIndex((item, index) => (item.week === data.week))
              }
              if (index >= 0) {
                if (repeatDayOfMonth[index].dayOfWeeks !== data.dayOfWeeks || repeatDayOfMonth[index].week !== data.week) {
                  repeatDayOfMonth[index] = data
                  tmp = repeatDayOfMonth
                } else {
                  tmp = repeatDayOfMonth.filter(item => item.week !== data.week)
                }
              } else {
                if (repeatDayOfMonth.length < settings.maxWeekRepeatMonthly) {
                  tmp = [...repeatDayOfMonth, data]
                } else {
                  tmp = repeatDayOfMonth
                  Toast.showShortBottom(`Cannot select more than ${settings.maxWeekRepeatMonthly} weeks!`)
                }
              }
              this.setState({
                repeatDayOfMonth: tmp
              })
              this.createListDayInMonth(startDate, endDate, repeat, isAdvanceSetting, tmp)

            }}/>
        </View>
    }
  }

  renderHeaderRepeat = () => {
    const {repeat, startTime, startDate, endDate,} = this.state
    return <View>
      <View style={styles.repeatWrapper}>
        <TouchableOpacity style={[styles.button, {
          backgroundColor: repeat === DAILY ? AppColors.buttonColor : AppColors.lightGray1
        }]}
                          onPress={() => {
                            if (repeat === MONTHLY)
                              this.setState({
                                repeat: DAILY,
                                repeatDayOfMonth: [],
                                startDate: '',
                                endDate: '',
                                isAdvanceSetting: false,
                                listSession: [],
                              })
                            else {
                              this.setState({
                                repeat: DAILY,
                                repeatDayOfMonth: [],
                                isAdvanceSetting: false,
                                listSession: [],
                              })
                            }
                          }}
        >
          <Text style={[styles.buttonText,
            {color: repeat === DAILY ? AppColors.whiteTitle : AppColors.grayTextColor}]}>SINGLE SESSION</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {
          marginHorizontal: 19,
          backgroundColor: repeat === WEEKLY ? AppColors.buttonColor : AppColors.lightGray1
        }]}
                          onPress={() => {
                            if (repeat === MONTHLY)
                              this.setState({
                                repeat: WEEKLY,
                                repeatDayOfMonth: [],
                                dayInWeek: '',
                                startDate: '',
                                endDate: ''
                              })
                            else {
                              this.setState({
                                repeat: WEEKLY,
                                repeatDayOfMonth: [],
                              })
                            }
                          }}>
          <Text style={[styles.buttonText,
            {color: repeat === WEEKLY ? AppColors.whiteTitle : AppColors.grayTextColor}
          ]}>WEEKLY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {
          backgroundColor: repeat === MONTHLY ? AppColors.buttonColor : AppColors.lightGray1
        }]}
                          onPress={() => {
                            this.setState({
                              repeat: MONTHLY,
                              repeatDayOfMonth: [],
                              dayInWeek: '',
                              startDate: '',
                              endDate: '',
                              listSession: [],
                            })
                          }}>
          <Text style={[styles.buttonText,
            {color: repeat === MONTHLY ? AppColors.whiteTitle : AppColors.grayTextColor}]}>CUSTOM</Text>
        </TouchableOpacity>
      </View>
    </View>
  }

  renderRepeat = (programType) => {
    const {repeat, startTime, startDate, endDate, repeatDayOfMonth, isAdvanceSetting} = this.state
    if (!programType) return <View/>
    if (repeat === MONTHLY) return <View>
      {this.renderHeaderRepeat()}
      <View style={{marginBottom: 16}}>
        {this.renderTypeRepeat()}
      </View>
    </View>
    switch (programType) {
      case MITY:
      case FIT:
        return <View>
          <DateTimeInputWithTitle
            placeholder={'Start Time (24-hr)'}
            mode={'time'}
            tailIcon={Images.timeIcon}
            time={startTime}
            minimumDate={this.minimumDate}
            changeText={(text) => {
              this.setState({startTime: text})
            }}
          />
          <DateTimeInputWithTitle
            placeholder={'Start Date'}
            tailIcon={Images.dateIcon}
            date={startDate}
            minimumDate={this.minimumDate}
            changeText={(text) => {
              this.setState({startDate: moment(text).format('DD/MM/YYYY')})
              this.createListDayInMonth(moment(text).format('DD/MM/YYYY'), endDate, repeat, isAdvanceSetting, repeatDayOfMonth)
            }}
          />
        </View>
      case NUTRITION_WORKSHOP:
        return <View/>
      default:
        return <View>
          {this.renderHeaderRepeat()}
          <DateTimeInputWithTitle
            placeholder={'Start Date'}
            tailIcon={Images.dateIcon}
            date={startDate}
            minimumDate={this.minimumDate}
            changeText={(text) => {
              this.selectedStartDate(moment(text).format('DD/MM/YYYY'))
              this.createListDayInMonth(moment(text).format('DD/MM/YYYY'), endDate, repeat, isAdvanceSetting, repeatDayOfMonth)
            }}
          />
          {this.renderTypeRepeat()}
        </View>
    }
  }

  selectedStartDate = (startDate) => {
    const {endDate} = this.state
    let mEndDate = moment(endDate, 'DD/MM/YYYY')
    let mStartDate = moment(startDate, 'DD/MM/YYYY')
    let dayInWeek = {
      key: mStartDate.day()
    }
    if (!!endDate) {
      if (mEndDate.diff(mStartDate) < 0) {
        this.setState({endDate: ''})
      }
    }
    this.setState({startDate, dayInWeek})
  }


  renderSelectApplySession = () => {
    const {startDate, endDate, repeat, isAdvanceSetting, repeatDayOfMonth} = this.state
    return <View>
      <View style={styles.applyView}>
        <RadioButton size={25}
                     onSelected={() => {
                       this.setState({isAdvanceSetting: false})
                       this.createListDayInMonth(startDate, endDate, repeat, false, repeatDayOfMonth)
                     }}
                     isChecked={!isAdvanceSetting}
        />
        <Text style={{fontSize: 16, marginLeft: 10, color: AppColors.black60}}>Apply Selected activity for all related
          days</Text>
      </View>
      <View style={styles.applyView}>
        <RadioButton size={25}
                     onSelected={() => {
                       this.setState({isAdvanceSetting: true})
                       this.createListDayInMonth(startDate, endDate, repeat, true, repeatDayOfMonth)
                     }}
                     isChecked={isAdvanceSetting}
        />
        <Text style={{fontSize: 16, marginLeft: 10, color: AppColors.black60}}>Custom each day</Text>
      </View>
    </View>
  }

  initData = (startDate, formatDate, repeatType, week, index) => {
    const {activity, recipe1, recipe2, category1, category2, listSession, repeat} = this.state
    let data = {
      date: moment(startDate, formatDate).add(index, repeatType).format(formatDate),
      activityId: activity.id,
      activityName: activity.name,
      dayOfWeeks: repeat === WEEKLY ? moment(startDate, formatDate).day() : 0,
      month: moment(startDate, formatDate).add(index, repeatType).month() + 1,
      ...week
    }
    if (recipe1) {
      data.recipe1Id = recipe1.id
      data.recipe1Name = recipe1.name
    }
    if (recipe2) {
      data.recipe2Id = recipe2.id
      data.recipe2Name = recipe2.name
    }
    if (category1) {
      data.category1 = category1
    }
    if (category2) {
      data.category2 = category2
    }

    let existItem = listSession.find(item => data.date == item.date && week.week === item.week)
    if (existItem) {
      data = existItem
    }
    return data
  }

  createListDayInMonth = (startDate, endDate, repeat, isAdvanceSetting, listRepeatDayOfMonth) => {
    let repeatDayOfMonth = listRepeatDayOfMonth.sort((a, b) => a.week - b.week)
    let listFullData = []
    if (repeat == DAILY) return
    let repeatType = repeat === WEEKLY ? 'weeks' : 'months'
    let formatDate = repeat === WEEKLY ? 'DD/MM/YYYY' : 'MM/YYYY'
    if (repeat === MONTHLY)
      repeatDayOfMonth.map(week => {
        if (isAdvanceSetting) {
          let countWeek = moment(endDate, formatDate).diff(moment(startDate, formatDate), repeatType) + 1
          for (let i = 0; i < countWeek; i++) {
            let data = this.initData(startDate, formatDate, repeatType, week, i)
            listFullData.push(data)
          }
        } else {
          let data = this.initData(startDate, formatDate, repeatType, week, 0)
          listFullData.push(data)
        }
      })
    else {
      if (isAdvanceSetting) {
        let countWeek = moment(endDate, formatDate).diff(moment(startDate, formatDate), repeatType) + 1
        for (let i = 0; i < countWeek; i++) {
          let data = this.initData(startDate, formatDate, repeatType, {}, i)
          listFullData.push(data)
        }
      }
    }
    this.setState({
      listSession: listFullData
    })
  }


  handleCollapse = (index) => {
    const {repeatDayOfMonth} = this.state
    let tmp = [...repeatDayOfMonth]
    tmp[index].isHide = !tmp[index].isHide
    this.setState({
      repeatDayOfMonth: tmp
    })
  }
  removeWeek = (week) => {
    const {repeatDayOfMonth, startDate, endDate, repeat, isAdvanceSetting} = this.state
    let tmp = repeatDayOfMonth.filter(item => item.week !== week)
    this.createListDayInMonth(startDate, endDate, repeat, isAdvanceSetting, tmp)
    this.setState({
      repeatDayOfMonth: tmp
    })
  }


  /**
   * render UI activity
   * @param key
   * @param activityName
   * @param onSelectItem
   * @returns {*}
   */
  renderSelectionActivity = (key, activityName, onSelectItem) => {
    const {listActivity} = this.state
    switch (key) {
      case FIT:
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case MITY:
        return <View/>
      default:
        return <ActivitySession listActivity={listActivity}
                                onSelectItem={onSelectItem}
                                activityName={activityName}
        />
    }
  }

  onItemActivitySelected(activity, index) {
    const {listSession} = this.state
    let tmp = [...listSession]
    tmp[index].activityName = activity.name
    tmp[index].activityId = activity.id
    this.setState({listSession: tmp, hideResultsActivity: {}})
  }

  /**
   * render advance setting for type frequency WEEKLY
   * @returns {*}
   */
  renderAdvanceSettingForWeekly = () => {
    const {listSession, listCategory} = this.state
    return <View>
      {
        listSession.map((item, index) => {
          return <View key={index.toString()}>
            <Text style={{marginVertical: 10, color: AppColors.black60, fontSize: 16}}>{item.date}</Text>
            {this.renderSelectionActivity(this.program.type, item.activityName, (activity) => {
              this.onItemActivitySelected(activity, index)
            })}
            <RecipeSession activity={{id: item.activityId, name: item.activityName}}
                           program={this.program}
                           listCategory={listCategory}
                           category1={item.category1}
                           category2={item.category2}
                           onRecipe1Select={(recipe, category) => {
                             this.onRecipeSelect(recipe, category, '', '', index)
                           }}
                           onRecipe2Select={(recipe, category) => {
                             this.onRecipeSelect('', '', recipe, category, index)
                           }}
            />
          </View>
        })
      }

    </View>
  }

  onRecipeSelect(recipe1, category1, recipe2, category2, index) {
    const {listSession} = this.state
    let tmp = [...listSession]
    if (recipe1) {
      tmp[index].recipe1Id = recipe1.id
      tmp[index].recipe1Name = recipe1.name
      tmp[index].category1 = category1

    }
    if (recipe2) {
      tmp[index].recipe2Id = recipe2.id
      tmp[index].recipe2Name = recipe2.name
      tmp[index].category2 = category2
    }
    this.setState({listSession: tmp})
  }

  renderAdvanceSettingForWeekly = (week) => {
    const {listSession, listCategory} = this.state
    return <View>
      {
        listSession.map((item, index) => {
          return <View key={index.toString()}>
            <Text style={{marginVertical: 10, color: AppColors.black60, fontSize: 16}}>{item.date}</Text>
            {this.renderSelectionActivity(this.program.type, item.activityName, (activity) => {
              this.onItemActivitySelected(activity, index)
            })}
            <RecipeSession activity={{id: item.activityId, name: item.activityName}}
                           program={this.program}
                           recipe1={{id: item.recipe1Id, name: item.recipe1Name}}
                           recipe2={{id: item.recipe2Id, name: item.recipe2Name}}
                           category1={item.category1 || {}}
                           category2={item.category2 || {}}
                           listCategory={listCategory}
                           onRecipe1Select={(recipe, category) => {
                             this.onRecipeSelect(recipe, category, '', '', index)
                           }}
                           onRecipe2Select={(recipe, category) => {
                             this.onRecipeSelect('', '', recipe, category, index)
                           }}
            />
          </View>
        })
      }

    </View>
  }
  renderAdvanceSettingForMonthly = (week) => {
    const {listSession, listCategory} = this.state
    return <View>
      {
        listSession.map((item, index) => {
          if (item.week === week)
            return <View key={index.toString()}>
              <Text style={{marginVertical: 10, color: AppColors.black60, fontSize: 16}}>{item.date}</Text>
              {this.renderSelectionActivity(this.program.type, item.activityName, (activity) => {
                this.onItemActivitySelected(activity, index)
              })}
              <RecipeSession activity={{id: item.activityId, name: item.activityName}}
                             program={this.program}
                             recipe1={{id: item.recipe1Id, name: item.recipe1Name}}
                             recipe2={{id: item.recipe2Id, name: item.recipe2Name}}
                             category1={item.category1 || {}}
                             category2={item.category2 || {}}
                             listCategory={listCategory}
                             onRecipe1Select={(recipe, category) => {
                               this.onRecipeSelect(recipe, category, '', '', index)
                             }}
                             onRecipe2Select={(recipe, category) => {
                               this.onRecipeSelect('', '', recipe, category, index)
                             }}
              />
            </View>
        })
      }

    </View>
  }

  /**
   * render UI for type frequency SINGLE SESSION
   * @returns {*}
   */
  renderRepeatTypeDaily = () => {
    const {activity, listCategory, recipe1, recipe2, category1, category2} = this.state
    return <View style={{paddingHorizontal: 20}}>
      {this.renderSelectionActivity(this.program.type, activity.name, (activity) => {
        this.setState({activity})
      })}
      <RecipeSession activity={activity}
                     recipe1={recipe1}
                     recipe2={recipe2}
                     category1={category1}
                     category2={category2}
                     program={this.program}
                     listCategory={listCategory}
                     onRecipe1Select={(recipe, category1) => {
                       this.setState({
                         recipe1: recipe,
                         category1
                       })
                     }}
                     onRecipe2Select={(recipe, category2) => {
                       this.setState({
                         recipe2: recipe,
                         category2
                       })
                     }}
      />
    </View>
  }
  /**
   * render UI for type frequency WEEKLY
   * @returns {*}
   */
  renderRepeatTypeWeekly = () => {
    const {isAdvanceSetting, activity, listCategory, recipe1, recipe2, category1, category2} = this.state
    if (isAdvanceSetting) {
      return <View style={{paddingHorizontal: 20}}>
        {this.renderAdvanceSettingForWeekly()}
      </View>
    } else {
      return <View style={{paddingHorizontal: 20}}>
        {this.renderSelectionActivity(this.program.type, activity.name, (activity) => {
          this.setState({activity})
        })}
        <RecipeSession activity={activity}
                       recipe1={recipe1}
                       recipe2={recipe2}
                       category1={category1}
                       category2={category2}
                       program={this.program}
                       listCategory={listCategory}
                       onRecipe1Select={(recipe) => {
                         this.setState({
                           recipe1: recipe
                         })
                       }}
                       onRecipe2Select={(recipe) => {
                         this.setState({
                           recipe2: recipe
                         })
                       }}
        />
      </View>
    }
  }

  /**
   * render UI for type frequency MONTHLY
   * @returns {*}
   */
  renderRepeatTypeMonthly = () => {
    const {isAdvanceSetting, listCategory, listSession, repeatDayOfMonth} = this.state
    return <View>
      {
        repeatDayOfMonth.map((data, index) => {
          return <View key={index.toString()}>
            <HeaderMonthly
              onCollapse={() => {
                this.handleCollapse(index)
              }}
              onRemoveWeek={() => {
                this.removeWeek(data.week)
              }}
              title={data.week < 5 ? 'WEEK ' + data.week.toString() : 'LAST WEEK'}
            />
            {isAdvanceSetting ?
              !data.isHide && <View style={{paddingHorizontal: 20}}>
                {this.renderAdvanceSettingForMonthly(data.week, listSession[index].activityName)}
              </View>
              :
              !data.isHide && <View style={{paddingHorizontal: 20}}>
                {this.renderSelectionActivity(this.program.type, listSession[index].activityName,
                  (activity) => {
                    this.onItemActivitySelected(activity, index)
                  })}
                <RecipeSession activity={{
                  id: listSession[index].activityId,
                  name: listSession[index].activityName
                }}
                               program={this.program}
                               recipe1={{id: listSession[index].recipe1Id, name: listSession[index].recipe1Name}}
                               recipe2={{id: listSession[index].recipe2Id, name: listSession[index].recipe2Name}}
                               listCategory={listCategory}
                               category1={listSession[index].category1 || {}}
                               category2={listSession[index].category2 || {}}
                               onRecipe1Select={(recipe, category) => {
                                 this.onRecipeSelect(recipe, category, '', '', index)
                               }}
                               onRecipe2Select={(recipe, category) => {
                                 this.onRecipeSelect('', '', recipe, category, index)
                               }}
                />
              </View>
            }
          </View>
        })
      }
    </View>
  }

  render() {
    const {repeatDayOfMonth, isAdvanceSetting, repeat, startDate, endDate} = this.state
    return <ScrollView style={styles.container}>
      <View style={{paddingHorizontal: 20}}>
        {this.renderRepeat(this.program.type)}
        {repeat !== DAILY && this.renderSelectApplySession()}
      </View>
      {repeat === DAILY && this.renderRepeatTypeDaily()}
      {repeat === WEEKLY && this.renderRepeatTypeWeekly()}
      {repeat === MONTHLY && this.renderRepeatTypeMonthly()}
      <Modal animationType="slide"
             transparent={true}
             visible={this.state.showMonthPicker}
             onRequestClose={() => {

             }}>
        <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}
                          onPress={() => {
                            this.setState({
                              showMonthPicker: false
                            })
                          }}
        >
        </TouchableOpacity>
        <SafeAreaView style={{backgroundColor: '#fff'}}>
          <MonthSelectorCalendar
            selectedDate={moment(this.state[this.state.typeSelect], 'MM/YYYY')}
            onMonthTapped={(date) => {
              this.setState({
                [this.state.typeSelect]: date.format('MM/YYYY'),
                showMonthPicker: false
              })
              if (this.state.typeSelect == 'endDate')
                this.createListDayInMonth(startDate, date.format('MM/YYYY'), repeat, isAdvanceSetting, repeatDayOfMonth)
              else
                this.createListDayInMonth(date.format('MM/YYYY'), endDate, repeat, isAdvanceSetting, repeatDayOfMonth)
            }}
            prevIcon={<Image source={require('../../assets/images/left.png')}
                             style={{width: 10, height: 20, marginLeft: 20}}
            />}
            nextIcon={<Image source={require('../../assets/images/right.png')}
                             style={{width: 10, height: 20, marginRight: 20}}
            />}
            yearTextStyle={{color: '#128ff9', fontSize: 24, fontFamily: FontNames.RobotoBold}}
            maxDate={moment('01/01/9999', 'DD/MM/YYYY')}
            minDate={this.state.typeSelect === 'startDate' ? moment(this.minimumDate) : moment(this.state.startDate, 'MM/YYYY')}
            selectedBackgroundColor={'#128ff9'}
          />
        </SafeAreaView>

      </Modal>
    </ScrollView>
  }
}

class ActivitySession extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hideResultsActivity: true,
      activityName: props.activityName || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activityName != this.props.activityName) {
      this.setState({
        activityName: nextProps.activityName
      })
    }
  }

  findActivities() {
    const {activityName} = this.state;
    const {listActivity} = this.props
    // const regex = new RegExp(`${activityName.trim()}`, 'i');

    if (activityName === '') {
      return [];
    }

    return listActivity.filter(activity => activity.name.toLowerCase().includes(activityName.toLowerCase().trim()));
  }

  render() {
    const {hideResultsActivity, activityName} = this.state
    const {onSelectItem} = this.props
    const activities = this.findActivities()
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return <View style={{paddingTop: 5, paddingBottom: 5, marginTop: 5, marginBottom: 5}}><AutoCompleteComponent
      editable={true}
      hideResults={hideResultsActivity}
      value={activityName}
      placeholder={'Select Activity'}
      data={activities.length === 1 && comp(this.state.activityName, activities[0].name) ? [] : activities}
      onChangeText={text => {
        this.setState({activityName: text, hideResultsActivity: text.length > 0 ? false : true})
      }}
      renderItem={({item, index}) => {
        return <TouchableOpacity
          onPress={() => {
            onSelectItem(item)
            this.setState({
              activityName: item.name,
              hideResultsActivity: true
            })
          }}>
          <Text style={{margin: 10}}>{item.name}</Text>
        </TouchableOpacity>
      }}
    /></View>
  }
}

class RecipeSession extends React.Component {
  constructor(props) {
    super(props)
    this.program = props.program
    this.listCategory = props.listCategory
    this.state = {
      category1: props.category1,
      category2: props.category2,
      recipe1: props.recipe1,
      recipe2: props.recipe2,
      listRecipes: [],
      activity: props.activity,
      listRecipe1: [],
      listRecipe2: []
    }
  }

  componentDidMount() {
    const {program, category1, category2} = this.props
    if (category1 && category1.id)
      this.getListRecipesByCategory(program.type, category1, 'listRecipe1')
    if (category1 && category2.id)
      this.getListRecipesByCategory(program.type, category2, 'listRecipe2')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activity.id !== this.props.activity.id) {
      this.setState({
        activity: nextProps.activity
      })
    }
  }

  getListRecipesByCategory = (programType, category, param) => {
    switch (programType) {
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case PARENT_WORKSHOP:
        getListRecipesByCategory(programType, category.id).then(res => {
          let listRecipe = []
          if (res.statusCode === 200) {
            listRecipe = res.data.result.list
          }
          this.setState({
            [param]: listRecipe
          })
        })
    }
  }

  renderSelectionCategory1 = (key) => {
    const {category1, activity, listRecipe1, recipe1} = this.state
    const {onRecipe1Select} = this.props
    if (!this.program) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity && activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
        return <View>
          <DropdownInput
            placeholder={'Select Category 1'}
            dataSource={this.listCategory}
            fieldShow={'name'}
            value={category1 && category1.name}
            onSelected={(item) => {
              this.setState({
                category1: item,
                recipe1: '',
              })
              this.getListRecipesByCategory(key, item, 'listRecipe1')
            }}
            onUnselected={(item) => {
              this.setState({
                category1: '',
                recipe1: '',
                listRecipe1: []
              })
            }}
          />
          {(listRecipe1.length > 0 || !!recipe1) && <View style={styles.borderDropdown}>
            <DropdownAutocomplete
              placeholder={'Select Recipe 1'}
              value={recipe1}
              data={listRecipe1}
              onSelected={(item) => {
                this.setState({recipe1: item})
                onRecipe1Select(item, category1)
              }}
            /></View>}
        </View>
      default:
        return <View/>
    }
  }
  renderSelectionCategory2 = (key) => {
    const {category2, activity, listRecipe2, recipe2} = this.state
    const {onRecipe2Select} = this.props
    if (!this.program) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity && activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
        return <View>
          <DropdownInput
            placeholder={'Select Category 2'}
            dataSource={this.listCategory}
            fieldShow={'name'}
            value={category2 && category2.name}
            onSelected={(item) => {
              this.setState({
                category2: item,
                recipe2: '',
              })
              this.getListRecipesByCategory(key, item, 'listRecipe2')
            }}
            onUnselected={() => {
              this.setState({
                category1: '',
                recipe1: '',
                listRecipe1: []
              })
            }}
          />
          {(listRecipe2.length > 0 || !!recipe2) && <View style={styles.borderDropdown}>
            <DropdownAutocomplete
              placeholder={'Select Recipe 2'}
              value={recipe2}
              data={listRecipe2}
              onSelected={(item) => {
                this.setState({recipe2: item})
                onRecipe2Select(item, category2)
              }}
            /></View>}
        </View>
      default:
        return <View/>
    }
  }

  render() {
    return <View>
      {this.renderSelectionCategory1(this.program.type)}
      {this.renderSelectionCategory2(this.program.type)}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    color: '#333333'
  },
  repeatWrapper: {
    flexDirection: 'row',
    height: 44,
    marginBottom: 12,
    marginTop: 8
  },
  button: {
    backgroundColor: AppColors.lightGray1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: AppColors.grayTextColor,
    fontFamily: FontNames.RobotoBold,
    fontSize: 12
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
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    color: AppColors.black60
  },
  textStyle: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 12,
    color: AppColors.black60
  },
  itemStyle: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: AppColors.normalTextInputBorderColor,
    paddingHorizontal: 5,
    marginTop: 5
  },
  applyView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  sessionTitle: {
    backgroundColor: '#e3f2ff',
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16
  },
  styleIcon: {
    width: 18,
    height: 18
  },
  borderDropdown: {
    borderColor: 'black',
    borderWidth: 0.3,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginBottom: 10
  }
})

export default connect(state => ({
  settings: state.app.settings,
  userInfo: state.auth.userInfo,
}), dispatch => ({
  showLoading: (visible) => dispatch(showLoading(visible))
}))(FrequencySettingScreen)