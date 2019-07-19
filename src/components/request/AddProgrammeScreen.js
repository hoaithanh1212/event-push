/**
 * Created by Hong HP on 2/20/19.
 */
import React from 'react';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, Image, Alert, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import DropdownInput from '../../common/DropdownInput';
import TextInputWithTitle from '../../common/TextInputWithTitle';
import {
  createRequest,
  getActivityByProgramType, getLanguage, getLastActivityNutrition,
  getListCategoryByProgram,
  getListPrograms,
  getListRecipesByCategory,
  getCPAPActivityId
} from '../../services/requestService';
import {showLoading} from '../../actions/app';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import DropdownMultipSelectionInput from '../../common/DropdownMultipleSelectionInput';
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
import {Images} from '../../theme/images';
import {FontNames} from '../../theme/fonts';
import {AppColors} from '../../theme/colors';
import {Roles, RoleType} from '../../contants/profile-field';
import moment from 'moment';
import CalendarPicker from '../../common/CalendarPicker';
import MonthSelectorCalendar from 'react-native-month-selector'
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import {SafeAreaView} from 'react-navigation';
import Toast from '@remobile/react-native-toast'
import AutoCompleteComponent from '../../common/AutoCompleteComponent';
import {AlertButton} from './presenters/Option2ListRequest';
import {RouteKey} from '../../contants/route-key';
import ReviewFrequency from '../../common/ReviewFrequency';
import {ProgramTypes} from '../../contants/program-types';
import DropdownAutocomplete from '../../common/DropdownAutocomplete';
import DropdownAutocompleteString from '../../common/DropdownAutocompleteString';
import Checkbox from "../../common/Checkbox";

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

const programType = [
  {value: 'Type A', id: 1},
  {value: 'Type B', id: 2},
]
const weekly = [
  {key: 0, value: 'S'},
  {key: 1, value: 'M'},
  {key: 2, value: 'T'},
  {key: 3, value: 'W'},
  {key: 4, value: 'T'},
  {key: 5, value: 'F'},
  {key: 6, value: 'S'},
]

class AddProgrammeScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const isEnable = navigation.getParam('isEnable')
    return {
      headerRight: <TouchableOpacity style={{marginRight: 20}}
                                     disabled={!isEnable}
                                     onPress={() => {
                                       const createRequest = navigation.getParam('createRequest')
                                       createRequest()
                                     }}
      >
        <Text style={[styles.buttonText, {
          fontSize: 16,
          color: isEnable ? AppColors.blueTextColor : AppColors.grayTextColor
        }]}>SAVE</Text>
      </TouchableOpacity>
    }
  }

  constructor() {
    super()
    this.state = {
      program: '',
      recipe1: '',
      recipe2: '',
      category1: '',
      category2: '',
      activity: '',
      activity2: '',
      activity3: '',
      venuePostalCode: '',
      venue: '',
      venueNature: '',
      programType: programType[1],
      expectedAttendance: '',
      listProgram: [],
      listCategory: [],
      listRecipes: [],
      listActivity: [],
      repeatDayOfMonth: [],
      repeat: '',
      startDate: '',
      endDate: '',
      startTime: '',
      preferredDomainB: '',
      preferredDomainAorC: '',
      startTime2: '',
      startDate2: '',
      startTime3: '',
      startDate3: '',
      dayInWeek: '',
      isDuplicate: false,
      showMonthPicker: false,
      typeSelect: '',
      language: '',
      listLanguage: '',
      hideResultsActivity: true,
      activityName: '',
      hideResultsPreferredDomainB: true,
      preferredDomainBName: '',
      hideResultsPreferredDomainAorC: true,
      preferredDomainAorCName: '',
      listSession: [],
      isShowReview: false,
      isAdvanceSetting: false,
      listRecipe1: [],
      listRecipe2: [],
      remarks: '',
      listProgramTypeB: [],
      cpapIds: [],
      cpapId: '',
      renewCPAPActive: false
    }
    this.partnerInfo = ''
    this.partnerNameId = ''
    this.minimumDate = moment().add(30, 'days').toDate();
  }

  componentDidMount() {
    const {typeRole} = this.props.userInfo;
    this.partnerInfo = this.props.navigation.getParam('partnerInfo')
    this.partnerNameId = this.props.navigation.getParam('partnerNameId')
    getListPrograms().then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        console.log('list ne', res.data.list)
        let listProgramTypeA = [];
        let listProgramTypeB = [];
        res.data.list && res.data.list.map(item => {
          if (item.type != ProgramTypes.MITY &&
            item.type != ProgramTypes.FITplus &&
            item.type != ProgramTypes.SATP) {
            listProgramTypeA.push(item);
          }
          if (item.type == ProgramTypes.SHCCore ||
            item.type == ProgramTypes.SHCElective ||
            item.type == ProgramTypes.NutritionCooking ||
            item.type == ProgramTypes.CPAP ||
            item.type == ProgramTypes.HawkerTrail ||
            item.type == ProgramTypes.SupermarketTour ||
            item.type == ProgramTypes.MITY ||
            item.type == ProgramTypes.FITplus ||
            item.type == ProgramTypes.MWO ||
            item.type == ProgramTypes.SATP) {
            listProgramTypeB.push(item);
          }
        });
        this.setState({
          listProgram: listProgramTypeA,
          listProgramTypeB: listProgramTypeB
        })
      }
    })
    this.props.navigation.setParams({
      createRequest: () => {
        this.createRequest()
      }
    })
    getLanguage().then(res => {
      if (res.statusCode === 200)
        this.setState({
          listLanguage: res.data.list
        })
    })
    this.getCPAPIds('');

    switch (typeRole) {
      case RoleType.SuperAdmin:
      case RoleType.PM:
      case RoleType.DataEntry:
        this.minimumDate = moment().toDate();
        break;
    }
  }

  getCPAPIds = (search) => {
    getCPAPActivityId(search).then(res => {
      if (res.statusCode === 200)
        this.setState({
          cpapIds: res.data
        })
    })
  }

  componentDidUpdate() {
    this.validateInputData()
  }

  validateInputData = () => {
    const {
      program,
      startDate,
      endDate,
      venue,
      venuePostalCode,
      recipe1,
      recipe2,
      activity,
      activity2,
      activity3,
      startTime,
      dayInWeek,
      programType,
      repeat,
      expectedAttendance,
      preferredDomainAorC,
      preferredDomainB,
      startTime2,
      startDate2,
      startTime3,
      startDate3,
      repeatDayOfMonth,
      language,
      isAdvanceSetting,
      cpapId
    } = this.state
    const {typeRole} = this.props.userInfo
    const {settings} = this.props
    let isFieldEmpty = false
    if (!startDate) isFieldEmpty = true
    if (!startTime) isFieldEmpty = true
    if (!venue) isFieldEmpty = true
    if (!language) isFieldEmpty = true
    if (!venuePostalCode) isFieldEmpty = true
    if (program.type !== MITY && program.type !== NUTRITION_COOKING) {
      if (isAdvanceSetting) {

      } else {
        if (!activity) isFieldEmpty = true
      }
    }

    if (!expectedAttendance) isFieldEmpty = true
    if (!programType) isFieldEmpty = true
    if (repeat == WEEKLY && !dayInWeek) isFieldEmpty = true
    if (repeat == MONTHLY && repeatDayOfMonth.length < settings.minWeekRepeatMonthly) isFieldEmpty = true
    switch (program.type) {
      case NUTRITION_WORKSHOP:
      case MITY:
      case FIT:
        break
      default:
        if (repeat !== DAILY)
          if (!endDate) isFieldEmpty = true
        if (!repeat) isFieldEmpty = true
    }
    switch (program.type) {
      case MITY:
        if (!preferredDomainAorC) isFieldEmpty = true
        if (!preferredDomainB) isFieldEmpty = true
        break;
      case NUTRITION_WORKSHOP:
        if (!startDate2) isFieldEmpty = true
        if (!startTime2) isFieldEmpty = true
        if (!startDate3) isFieldEmpty = true
        if (!startTime3) isFieldEmpty = true
        if (!activity2) isFieldEmpty = true
        if (!activity3) isFieldEmpty = true
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
        if (isAdvanceSetting) {

        } else {
          if (!recipe1) isFieldEmpty = true
          if (!recipe2) isFieldEmpty = true
        }
        break;
      case CPAP:
        if (this.state.renewCPAPActive && !cpapId) {
          isFieldEmpty = true
        }
        break
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

  createRequest = () => {
    const {
      startDate,
      endDate,
      venue,
      venuePostalCode,
      recipe1,
      recipe2,
      activity,
      startTime,
      programType,
      repeat,
      expectedAttendance,
      preferredDomainAorC,
      preferredDomainB,
      activity2,
      activity3,
      startTime2,
      startDate2,
      startTime3,
      startDate3,
      dayInWeek,
      program,
      language,
      listSession,
      isAdvanceSetting,
      remarks,
      cpapId,
      renewCPAPActive
    } = this.state

    let dayOfWeeks = []
    if (!!dayInWeek)
      dayOfWeeks = [dayInWeek.key]
    let repeatDayOfMonth = []
    switch (program.type) {
      case ProgramTypes.SHCElective:
      case ProgramTypes.NutritionCooking:
      case ProgramTypes.SHCCore:
        if (repeat === MONTHLY) {
          repeatDayOfMonth = listSession.map(item => {
            return {
              ...item,
              date: moment(item.date, 'MM/YYYY').format('DD/MM/YYYY'),
            }
          })
        } else {
          repeatDayOfMonth = listSession
        }
        break;
      default:
        repeatDayOfMonth = this.state.repeatDayOfMonth
    }

    let dataRequest = {
      userPartnerId: this.partnerInfo.id,
      partnerNameId: this.partnerNameId,
      venue,
      venuePostalCode,
      programType: program.type,
      expectedAttendance,
      recipe1Id: recipe1.id || null,
      recipe2Id: recipe2.id || null,
      activityId: activity.id || null,
      activity2Id: activity2.id || null,
      activity3Id: activity3.id || null,
      repeatType: repeat === DAILY ? 1 : repeat === WEEKLY ? 2 : repeat === MONTHLY ? 3 : null,
      dayOfWeeks: dayOfWeeks,
      requestType: programType.id | null,
      preferredDomainAorC: preferredDomainAorC.id || null,
      preferredDomainB: preferredDomainB.id || null,
      startTime,
      startDate: repeat === MONTHLY && startDate.length === 7 ? '01/' + startDate : startDate,
      endDate: repeat === MONTHLY && endDate.length === 7 ? '01/' + endDate : (endDate || startDate),
      startTime2,
      startDate2,
      startTime3,
      startDate3,
      repeatDayOfMonth: repeatDayOfMonth.length > 0 ? repeatDayOfMonth : null,
      languageId: language.id,
      isAdvanceSetting,
      remarks,
      renewCpap: renewCPAPActive,
      renewCpapText: renewCPAPActive ? cpapId : ''
    }
    console.log('dataRequest', dataRequest)

    this.props.showLoading(true);
    createRequest(dataRequest).then(data => {
      this.props.showLoading(false);
      console.log(data)
      if (data.statusCode === 200) {
        let getRequest = this.props.navigation.getParam('getRequest')
        getRequest()
        this.props.navigation.pop()
      } else {
        alert(data.message)
      }
    })
  }


  renderSelectionCategory1 = (key) => {
    const {category1, listCategory, program, activity, listRecipe1, recipe1} = this.state
    if (!program) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
        return <View>
          <DropdownInput
            placeholder={'Select Category 1'}
            dataSource={listCategory}
            fieldShow={'name'}
            value={category1.name}
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
              }}
            /></View>}
        </View>
      default:
        return <View/>
    }
  }
  renderSelectionCategory2 = (key) => {
    const {category2, listCategory, program, activity, listRecipe2, recipe2} = this.state
    if (!program) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
        return <View>
          <DropdownInput
            placeholder={'Select Category 2'}
            dataSource={listCategory}
            fieldShow={'name'}
            value={category2.name}
            onSelected={(item) => {
              this.setState({
                category2: item,
                recipe2: '',
              })
              this.getListRecipesByCategory(key, item, 'listRecipe2')
            }}
            onUnselected={() => {
              this.setState({
                category2: '',
                recipe2: '',
                listRecipe2: []
              })
            }}
          />
          {(listRecipe2.length > 0 || !!recipe2)&& <View style={styles.borderDropdown}>
            <DropdownAutocomplete
              placeholder={'Select Recipe 2'}
              value={recipe2}
              data={listRecipe2}
              onSelected={(item) => {
                this.setState({recipe2: item})
              }}
            /></View>}
        </View>
      default:
        return <View/>
    }
  }
  renderSelectionRecipe = (key) => {
    const {recipe1, recipe2, listRecipe1, category, activity, listRecipe2} = this.state
    if (!category) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_WORKSHOP:
      case NUTRITION_COOKING:
        return <View>

          {listRecipe2.length > 0 && <View style={[styles.borderDropdown, {marginTop: 10}]}><DropdownAutocomplete
            placeholder={'Select Recipe 2'}
            value={recipe2}
            data={listRecipe2}
            onSelected={(item) => {
              this.setState({recipe2: item})
            }}
          /></View>}
        </View>
      default:
        return <View/>
    }
  }

  renderSelectionActivity = (key) => {
    const activities = this.findActivities();
    const preferredDomainB = this.findPreferredDomainB();
    const preferredDomainAorC = this.findPreferredDomainAorC();
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const {program} = this.state
    switch (key) {
      case FIT:
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case ProgramTypes.SupermarketTour:
        return <View/>
      case MITY:
        return <View>
          <View style={{marginTop: 5, marginBottom: 10}}>
            <AutoCompleteComponent
              editable={true}
              hideResults={this.state.hideResultsPreferredDomainB}
              value={this.state.preferredDomainBName}
              placeholder={'Preferred Domain B'}
              data={preferredDomainB.length === 1 && comp(this.state.preferredDomainBName, preferredDomainB[0].name) ? [] : preferredDomainB}
              onChangeText={text => {
                this.setState({preferredDomainBName: text, hideResultsPreferredDomainB: false})
              }}
              renderItem={({item, index}) => {
                return <TouchableOpacity
                  onPress={() => {
                    this.onItemPreferredDomainBSelected(item)
                  }}>
                  <Text style={{margin: 10}}>{item.name}</Text>
                </TouchableOpacity>
              }}
            />
          </View>
          <View style={{marginTop: 5, marginBottom: 10}}>
            <AutoCompleteComponent
              editable={true}
              hideResults={this.state.hideResultsPreferredDomainAorC}
              value={this.state.preferredDomainAorCName}
              placeholder={'Preferred Domain A or C'}
              data={preferredDomainAorC.length === 1 && comp(this.state.preferredDomainAorCName, preferredDomainAorC[0].name) ? [] : preferredDomainAorC}
              onChangeText={text => {
                this.setState({
                  preferredDomainAorCName: text,
                  hideResultsPreferredDomainAorC: false
                })
              }}
              renderItem={({item, index}) => {
                return <TouchableOpacity
                  onPress={() => {
                    this.onItemPreferredDomainAorCSelected(item)
                  }}>
                  <Text style={{margin: 10}}>{item.name}</Text>
                </TouchableOpacity>
              }}
            />
          </View>
        </View>
      default:
        return <View style={styles.borderDropdown}><DropdownAutocomplete
          placeholder={'Select Activity'}
          value={this.state.activity}
          data={activities}
          onSelected={(item) => {
            this.setState({activity: item})
          }}
        /></View>
    }
  }

  onItemActivitySelected(activity) {
    this.setState({activityName: activity.name, activity: activity, hideResultsActivity: true})
  }

  findActivities() {
    const {activityName, listActivity} = this.state;

    if (activityName === '') {
      return listActivity;
    }

    return listActivity.filter(activity => activity.name.toLowerCase().includes(activityName.toLowerCase().trim()));
  }

  onItemPreferredDomainBSelected(activity) {
    this.setState({preferredDomainBName: activity.name, preferredDomainB: activity, hideResultsPreferredDomainB: true})
  }

  findPreferredDomainB() {
    const {preferredDomainBName, listActivity} = this.state;

    if (preferredDomainBName === '') {
      return listActivity;
    }

    return listActivity.filter(activity => activity.name.toLowerCase().includes(preferredDomainBName.toLowerCase().trim()));
  }

  onItemPreferredDomainAorCSelected(activity) {
    this.setState({
      preferredDomainAorCName: activity.name,
      preferredDomainAorC: activity,
      hideResultsPreferredDomainAorC: true
    })
  }

  findPreferredDomainAorC() {
    const {preferredDomainAorCName, listActivity} = this.state;

    if (preferredDomainAorCName === '') {
      return listActivity;
    }

    return listActivity.filter(activity => activity.name.toLowerCase().includes(preferredDomainAorCName.toLowerCase().trim()));
  }

  getListRecipesByCategory = (programType, category, param) => {
    switch (programType) {
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case PARENT_WORKSHOP:
        this.props.showLoading(true)
        getListRecipesByCategory(programType, category.id).then(res => {
          this.props.showLoading(false)
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
            if (programType === ProgramTypes.NutritionWorkshop) {
              let list = res.data.result.list
              let activity = ''
              let activity2 = ''
              let activity3 = ''
              if (list[0]) {
                activity = list[0]
              }
              if (list[1]) {
                activity2 = list[1]
              }
              if (list[2]) {
                activity3 = list[2]
              }
              this.setState({activity, activity2, activity3})
            } else {
              let defaultActivity = ''
              switch (programType) {
                case ProgramTypes.FITplus:
                case ProgramTypes.SupermarketTour:
                  defaultActivity = res.data.result.list[0]
                  break
                default:
                  defaultActivity = ''
              }
              this.setState({
                listActivity: res.data.result.list,
                activity: defaultActivity
              })
            }

          }
        })
    }
  }

  renderViewForNutriWorkShop = () => {
    const {
      activity,
      listActivity,
      activity2,
      startDate,
      startTime,
      startTime2,
      startDate2,
      startDate3,
      startTime3,
      activity3
    } = this.state
    return <View>
      <DateTimeInputWithTitle
        placeholder={'1st Session Start Time (24-hr)'}
        mode={'time'}
        tailIcon={Images.timeIcon}
        time={startTime}
        minimumDate={this.minimumDate}
        changeText={(text) => {
          this.setState({startTime: text})
        }}
      />
      <DateTimeInputWithTitle
        placeholder={'1st Session Start Date'}
        tailIcon={Images.dateIcon}
        date={startDate}
        minimumDate={this.minimumDate}
        changeText={(text) => {
          this.setState({startDate: moment(text).format('DD/MM/YYYY')})
        }}
      />
      <DropdownInput
        placeholder={'1st Session Activity'}
        dataSource={listActivity}
        fieldShow={'name'}
        disabled={true}
        value={activity.name}
        // onSelected={(item) => {
        //   this.setState({activity: item})
        // }}
      />
      {/*session 2*/}
      <DateTimeInputWithTitle
        placeholder={'2nd Session Start Time (24-hr)'}
        mode={'time'}
        tailIcon={Images.timeIcon}
        time={startTime2}
        minimumDate={this.minimumDate}
        changeText={(text) => {
          this.setState({startTime2: text})
        }}
      />
      <DateTimeInputWithTitle
        placeholder={'2nd Session Start Date'}
        tailIcon={Images.dateIcon}
        date={startDate2}
        minimumDate={this.minimumDate}
        changeText={(text) => {
          this.setState({startDate2: moment(text).format('DD/MM/YYYY')})
        }}
      />
      <DropdownInput
        placeholder={'2nd Session Activity'}
        dataSource={listActivity}
        fieldShow={'name'}
        disabled={true}
        value={activity2.name}
        // onSelected={(item) => {
        //   this.setState({activity2: item})
        // }}
      />
      {/*session 3*/}
      <DateTimeInputWithTitle
        placeholder={'3rd Session Start Time (24-hr)'}
        mode={'time'}
        tailIcon={Images.timeIcon}
        minimumDate={this.minimumDate}
        time={startTime3}
        changeText={(text) => {
          this.setState({startTime3: text})
        }}
      />
      <DateTimeInputWithTitle
        placeholder={'3rd Session Start Date'}
        tailIcon={Images.dateIcon}
        date={startDate3}
        minimumDate={this.minimumDate}
        changeText={(text) => {
          this.setState({startDate3: moment(text).format('DD/MM/YYYY')})
        }}
      />
      <DropdownInput
        placeholder={'3rd Session Activity'}
        dataSource={listActivity}
        fieldShow={'name'}
        disabled={true}
        value={activity3.name}
        // onSelected={(item) => {
        //   this.setState({activity2: item})
        // }}
      />
    </View>
  }

  selectDayInWeek = (item) => {
    const {weekly} = this.state
    let tmp = weekly.map(dx => {
      if (dx.key === item.key) {
        return {
          ...dx,
          isSelected: !dx.isSelected
        }
      } else {
        return dx
      }
    })
    this.setState({
      weekly: tmp
    })
  }

  renderTypeRepeat = () => {
    const {repeat, endDate, dayInWeek, startDate, repeatDayOfMonth, startTime} = this.state
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
                    // this.setState({dayInWeek: item})
                    // this.selectedStartDate(moment(startDate, 'DD/MM/YYYY').day(item.key).format('DD/MM/YYYY'))
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
              const {settings} = this.props
              if (data.week === 4 || data.week === 5) {
                index = repeatDayOfMonth.findIndex((item, index) => (item.week == 4 || item.week === 5))
              } else {
                index = repeatDayOfMonth.findIndex((item, index) => (item.week === data.week))
              }
              if (index >= 0) {
                if (repeatDayOfMonth[index].dayOfWeeks !== data.dayOfWeeks || repeatDayOfMonth[index].week !== data.week) {
                  repeatDayOfMonth[index] = data
                  this.setState({repeatDayOfMonth})
                } else {
                  let tmpList = repeatDayOfMonth.filter(item => item.week !== data.week)
                  this.setState({repeatDayOfMonth: tmpList})
                }
              } else {
                if (repeatDayOfMonth.length < settings.maxWeekRepeatMonthly) {
                  this.setState({
                    repeatDayOfMonth: [...repeatDayOfMonth, data]
                  })
                } else {
                  Toast.showShortBottom(`Cannot select more than ${settings.maxWeekRepeatMonthly} weeks!`)
                }
              }

            }}/>
        </View>
    }
  }

  renderHeaderRepeat = () => {
    const {repeat, startTime, startDate, endDate} = this.state
    return <View>
      <Text style={styles.title}>Frequency</Text>
      <View style={styles.repeatWrapper}>
        <TouchableOpacity style={[styles.button, {
          backgroundColor: repeat === DAILY ? AppColors.buttonColor : AppColors.lightGray1
        }]}
                          onPress={() => {
                            if (repeat === MONTHLY)
                              this.setState({
                                repeat: DAILY,
                                repeatDayOfMonth: [],
                                dayInWeek: '',
                                startDate: '',
                                endDate: ''
                              })
                            else {
                              this.setState({
                                repeat: DAILY,
                                repeatDayOfMonth: [],
                                dayInWeek: '',
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
                              endDate: ''
                            })
                          }}>
          <Text style={[styles.buttonText,
            {color: repeat === MONTHLY ? AppColors.whiteTitle : AppColors.grayTextColor}]}>CUSTOM</Text>
        </TouchableOpacity>
      </View>
    </View>
  }

  renderRepeat = (programType) => {
    const {repeat, startTime, startDate, program} = this.state
    if (!programType) return <View/>
    switch (programType) {
      case NUTRITION_COOKING:
      case ProgramTypes.SHCCore:
      case ProgramTypes.SHCElective:
        break;
      default:
        if (repeat === MONTHLY) return <View>
          {this.renderHeaderRepeat()}
          <View style={{marginBottom: 16}}>
            {this.renderTypeRepeat()}
          </View>
        </View>
    }
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
            }}
          />
        </View>
      case NUTRITION_WORKSHOP:
        return <View/>
      case NUTRITION_COOKING:
      case ProgramTypes.SHCCore:
      case ProgramTypes.SHCElective:
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
              this.selectedStartDate(moment(text).format('DD/MM/YYYY'))
            }}
          />
          <TouchableOpacity style={styles.itemStyle}
                            onPress={() => {
                              if (repeat && repeat !== DAILY) {
                                this.setState({
                                  isShowReview: true
                                })
                              } else {
                                this.props.navigation.navigate(RouteKey.FrequencySettingScreen, {
                                  program,
                                  data: this.state,
                                  saveFrequencyData: (data) => {
                                    this.saveFrequencyData(data)
                                  }
                                })
                              }
                            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{flex: 1}}>Frequency</Text>
              {!!repeat && <Text style={{color: '#128ff9', paddingHorizontal: 10}}>{repeat}</Text>}
              {!!repeat && <Image source={Images.infoOutline} style={{width: 24, height: 24, tintColor: '#128ff9'}}/>}
            </View>
          </TouchableOpacity>
        </View>
      default:
        return <View>
          <DateTimeInputWithTitle
            placeholder={'Start Time (24-hr)'}
            mode={'time'}
            time={startTime}
            tailIcon={Images.timeIcon}
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
              this.selectedStartDate(moment(text).format('DD/MM/YYYY'))
            }}
          />
          {this.renderHeaderRepeat()}
          <View style={{marginVertical: 16}}>
            {this.renderTypeRepeat()}
          </View>
        </View>
    }
  }

  clearData = () => {
    this.setState({
      category: '',
      recipe: '',
      repeat: '',
      activity: '',
      activity2: '',
      startDate: '',
      endDate: '',
      startTime: '',
      preferredDomainB: '',
      preferredDomainAorC: '',
      startTime2: '',
      startDate2: '',
      startTime3: '',
      startDate3: '',
      dayInWeek: '',
      recipe1: '',
      recipe2: '',
      venuePostalCode: '',
      venue: '',
      venueNature: '',
      listSession: [],
      remark: ''
    })
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

  getLastActivityNutrition = () => {
    getLastActivityNutrition().then(res => {
      if (res.statusCode === 200) {
        if (res.data.activity1Id) {
          const {data} = res
          this.setState({
            activity: {
              id: data.activity1Id,
              name: data.activity1Name
            },
            activity2: {
              id: data.activity2Id,
              name: data.activity2Name
            },
          })
        }
      }
    })
  }

  saveFrequencyData = (data) => {
    this.setState({...data, isShowReview: false})
  }


  render() {
    const {
      repeat, program,
      listProgram, expectedAttendance, venue, venuePostalCode, language, listLanguage, listSession,
      isShowReview, dayInWeek, repeatDayOfMonth, isAdvanceSetting, remarks, listProgramTypeB
    } = this.state
    const {userInfo} = this.props
    const {typeRole} = userInfo
    return <ScrollView style={styles.container}>
      {(typeRole === RoleType.HPM ||
        typeRole === RoleType.SM ||
        typeRole === RoleType.DataEntry ||
        typeRole === RoleType.SuperAdmin) &&
      <DropdownInput
        placeholder={'Programme Type'}
        dataSource={programType}
        fieldShow={'value'}
        value={this.state.programType.value}
        onSelected={(item) => {
          this.setState({programType: item, program: {}})
        }}
      />}
      <DropdownInput
        placeholder={'Programme'}
        dataSource={this.state.programType && this.state.programType.id == 2 ? listProgramTypeB : listProgram}
        fieldShow={'description'}
        value={program.description}
        onSelected={(item) => {
          this.setState({program: item})
          this.clearData()
          this.getListCategoryByProgram(item.type)
          this.getActivityByProgramType(item.type)
          if (item.type === NUTRITION_WORKSHOP) {
            // this.getLastActivityNutrition()
          }
        }}
      />
      <DropdownInput
        placeholder={'Language'}
        dataSource={listLanguage}
        fieldShow={'name'}
        value={language.name}
        onSelected={(item) => {
          this.setState({language: item})
        }}
      />
      {this.renderSelectionActivity(program.type)}
      {program.type === NUTRITION_WORKSHOP && this.renderViewForNutriWorkShop()}
      {this.renderSelectionCategory1(program.type)}
      {this.renderSelectionCategory2(program.type)}

      <TextInputWithoutTitle
        placeholder="Venue Postal Code"
        value={venuePostalCode}
        maxLength={6}
        keyboardType={'numeric'}
        changeText={value => {
          this.setState({venuePostalCode: value})
        }}
      />
      <TextInputWithoutTitle
        placeholder="Venue Description"
        value={venue}
        changeText={value => {
          this.setState({venue: value})
        }}
      />
      {/*{this.renderVenueNature(program.type, typeRole)}*/}
      {this.renderRepeat(program.type)}
      <TextInputWithoutTitle
        placeholder="Expected Attendance"
        keyboardType={'numeric'}
        maxLength={4}
        value={expectedAttendance}
        changeText={value => {
          this.setState({expectedAttendance: value})
        }}
        style={{borderColor: !!expectedAttendance && expectedAttendance <= 20 ? AppColors.errorTextColor : AppColors.normalTextInputBorderColor}}
      />
      <TextInputWithoutTitle
        placeholder="Remarks"
        value={remarks}
        multiline={true}
        styleTextInput={{height: 80}}
        style={{height: 80}}
        changeText={value => {
          this.setState({remarks: value})
        }}
      />
      {program.type == ProgramTypes.CPAP && <TouchableOpacity
        onPress={() => {
          this.setState({
            renewCPAPActive: !this.state.renewCPAPActive
          });
        }}
        style={{ height: 40, flexDirection: "row", marginTop: 10 }}
      >
        <Checkbox
          normalIcon={Images.blankIcon}
          highlightIcon={Images.checked2Icon}
          active={this.state.renewCPAPActive}
          onPress={() => {
            this.setState({
              renewCPAPActive: !this.state.renewCPAPActive
            });
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
          Row Number Reference
        </Text>
      </TouchableOpacity>}
      {this.state.renewCPAPActive && program.type == ProgramTypes.CPAP && <View style={styles.borderDropdown}>
        <DropdownAutocompleteString
          placeholder={'CPAP Activity Id'}
          value={this.state.cpapId}
          data={this.state.cpapIds}
          onSelected={(item) => {
            this.setState({cpapId: item})
          }}
          onChangeText={(text) => {
            this.getCPAPIds(text)
          }}
        />
      </View>}
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
              console.log('MonthSelectorCalendar: ', date.format('MM/YYYY'))
              this.setState({
                [this.state.typeSelect]: date.format('MM/YYYY'),
                showMonthPicker: false
              })
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
      <ReviewFrequency isShow={isShowReview}
                       onClose={() => {
                         this.setState({isShowReview: false})
                       }}
                       listSession={listSession}
                       dayInWeek={dayInWeek}
                       frequencyType={repeat}
                       repeatDayOfMonth={repeatDayOfMonth}
                       onEdit={() => {
                         this.setState({isShowReview: false})
                         this.props.navigation.navigate(RouteKey.FrequencySettingScreen, {
                           program,
                           data: this.state,
                           saveFrequencyData: (data) => {
                             this.saveFrequencyData(data)
                           }
                         })
                       }}
                       programType={program.type}
                       isAdvanceSetting={isAdvanceSetting}

      />
    </ScrollView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20
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
  userInfo: state.auth.userInfo,
  settings: state.app.settings
}), dispatch => ({
  showLoading: (visible) => dispatch(showLoading(visible))
}))(AddProgrammeScreen)