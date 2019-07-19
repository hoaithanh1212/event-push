/**
 * Created by Hong HP on 2/20/19.
 */
import React from 'react';
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, Modal, Image} from 'react-native';
import {connect} from 'react-redux';
import DropdownInput from '../../common/DropdownInput';
import TextInputWithTitle from '../../common/TextInputWithTitle';
import {
  createRequest, editRequest,
  getActivityByProgramType, getLanguage,
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
import {SafeAreaView} from 'react-navigation';
import MonthSelectorCalendar from 'react-native-month-selector'
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import Toast from '@remobile/react-native-toast/index';
import {RouteKey} from '../../contants/route-key';
import {ProgramTypes} from '../../contants/program-types';
import ReviewFrequency from '../../common/ReviewFrequency';
import _ from 'lodash'
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
  {key: 0, value: 'S', description: 'Sunday'},
  {key: 1, value: 'M', description: 'Monday'},
  {key: 2, value: 'T', description: 'Tuesday'},
  {key: 3, value: 'W', description: 'Wednesday'},
  {key: 4, value: 'T', description: 'Thursday'},
  {key: 5, value: 'F', description: 'Friday'},
  {key: 6, value: 'S', description: 'Saturday'},
]

class UpdateProgammeScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const isEnable = navigation.getParam('isEnable')
    return {
      headerRight: <TouchableOpacity style={{marginRight: 20}}
                                     disabled={!isEnable}
                                     onPress={() => {
                                       const updateRequest = navigation.getParam('updateRequest')
                                       updateRequest()
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
      program: '',
      recipe1: '',
      recipe2: '',
      category: '',
      activity: '',
      activity2: '',
      activity3: '',
      venuePostalCode: '',
      venue: '',
      venueNature: '',
      programType: 'Type B',
      expectedAttendance: '',
      listProgram: [],
      listCategory: [],
      listRecipes: [],
      listActivity: [],
      repeatDayOfMonth: [],
      repeat: DAILY,
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
      showMonthPicker: false,
      typeSelect: '',
      language: '',
      listLanguage: '',
      isShowReview: false,
      isAdvanceSetting: false,
      listSession: [],
      remarks: '',
      cpapIds: [],
      cpapId: '',
      renewCPAPActive: false,
      category1: '',
      category2: '',
      listRecipe1: [],
      listRecipe2: [],
    }
    this.partnerInfo = ''
    this.minimumDate = moment().add(30, 'days').toDate();
    this.requestId = ''
  }

  componentDidMount() {
    const {typeRole} = this.props.userInfo;

    this.partnerInfo = this.props.navigation.getParam('partnerInfo')
    getListPrograms().then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        this.setState({
          listProgram: res.data.list
        })
      }
    })
    getLanguage().then(res => {
      if (res.statusCode === 200)
        this.setState({
          listLanguage: res.data.list
        })
    })
    let requestData = this.props.navigation.getParam('requestData')

    this.getCPAPIds(requestData.renewCpapText);

    let dayInWeek = requestData.listDayOfWeeks.length > 0 ?
      weekly.find(item => item.description.toLowerCase() === requestData.listDayOfWeeks[0].toLowerCase()) : ''
    if (!!requestData) {
      console.log('Update: ', requestData)
      this.requestId = requestData.id
      let category = ''
      if (requestData.category1Id || requestData.category2Id)
        category = [{
          id: requestData.category1Id, name: requestData.category1Name
        }, {
          id: requestData.category2Id, name: requestData.category2Name
        }]
      //Get list data
      this.getActivityByProgramType(requestData.programType)
      this.getListCategoryByProgram(requestData.programType)
      this.getListRecipesByCategory(requestData.programType, category)
      let listSession = requestData.repeatDayOfMonth
      let repeatDayOfMonth = requestData.repeatDayOfMonth
      if (requestData.isAdvanceSetting) {
        //Format listSession
        listSession = requestData.repeatDayOfMonth.map(item => {
          if (item.recipe1) {
            item.recipe1Name = item.recipe1.name
          }
          if (item.recipe2) {
            item.recipe2Name = item.recipe2.name
          }
          if (item.activity) {
            item.activityName = item.activity.name
          }
          return item
        })
        //Format list repeatDayOfMonth
        repeatDayOfMonth = _.uniqBy(requestData.repeatDayOfMonth, 'week')
      }

      //Init data
      let data = {
        program: {description: requestData.programName, type: requestData.programType},
        recipe1: {id: requestData.recipe1Id, name: requestData.recipe1Name,},
        recipe2: {id: requestData.recipe2Id, name: requestData.recipe2Name,},
        category: category,
        activity: {id: requestData.activityId, name: requestData.activityName},
        activity2: {id: requestData.activity2Id, name: requestData.activity2Name},
        activity3: {id: requestData.activity3Id, name: requestData.activity3Name},
        venuePostalCode: requestData.venuePostalCode,
        venue: requestData.venue,
        programType: {
          value: requestData.requestType == 1 ? 'Type A' : 'Type B',
          id: requestData.requestType
        },
        language: {id: requestData.languageId, name: requestData.languageName},
        expectedAttendance: requestData.expectedAttendance,
        repeatDayOfMonth: repeatDayOfMonth,
        listSession: listSession,
        startDate: requestData.repeatType == 3 ? moment(requestData.startDate, 'DD/MM/YYYY').format('MM/YYYY') : requestData.startDate,
        endDate: requestData.repeatType == 3 ? moment(requestData.endDate, 'DD/MM/YYYY').format('MM/YYYY') : requestData.endDate,
        startTime: requestData.startTime,
        preferredDomainB: {id: requestData.preferredDomainB, name: requestData.preferredDomainBName},
        preferredDomainAorC: {id: requestData.preferredDomainAorC, name: requestData.preferredDomainAorCName},
        startTime2: requestData.startTime2,
        startDate2: requestData.startDate2,
        startTime3: requestData.startTime3,
        startDate3: requestData.startDate3,
        dayInWeek: dayInWeek,
        repeat: requestData.repeatType == 1 ? DAILY : requestData.repeatType == 2 ? WEEKLY : requestData.repeatType == 3 ? MONTHLY : null,
        isAdvanceSetting: requestData.isAdvanceSetting,
        remarks: requestData.remarks,
        cpapId: requestData.renewCpapText,
        renewCPAPActive: requestData.renewCpap
      }
      this.setState({...data})
    }
    this.props.navigation.setParams({
      updateRequest: () => {
        this.updateRequest()
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
      startTime,
      programType,
      repeat,
      expectedAttendance,
      preferredDomainAorC,
      preferredDomainB,
      startTime2,
      startDate2,
      startTime3,
      startDate3,
      dayInWeek,
      repeatDayOfMonth,
      language
    } = this.state
    const {typeRole} = this.props.userInfo
    let isFieldEmpty = false
    if (!startDate) isFieldEmpty = true
    if (!startTime) isFieldEmpty = true
    if (!venue) isFieldEmpty = true
    if (!language) isFieldEmpty = true
    if (!venuePostalCode) isFieldEmpty = true
    if (program.type !== MITY && program.type !== NUTRITION_COOKING)
      if (!activity) isFieldEmpty = true
    if (!expectedAttendance) isFieldEmpty = true
    if (!programType) isFieldEmpty = true
    if (repeat == WEEKLY && !dayInWeek) isFieldEmpty = true
    if (repeat == MONTHLY && repeatDayOfMonth.length < 2) isFieldEmpty = true
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
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
        if (!recipe1) isFieldEmpty = true
        if (!recipe2) isFieldEmpty = true
        break;
      case CPAP:
        if (this.state.renewCPAPActive && !this.state.cpapId) {
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

  updateRequest = () => {
    const {
      startDate,
      endDate,
      venue,
      venuePostalCode,
      venueNature,
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
      language,
      listSession,
      isAdvanceSetting,
      program,
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
      venue,
      venuePostalCode,
      venueNature,
      expectedAttendance,
      recipe1Id: recipe1.id || null,
      recipe2Id: recipe2.id || null,
      activityId: activity.id || null,
      activity2Id: activity2.id || null,
      activity3Id: activity3.id || null,
      repeatType: repeat === DAILY ? 1 : repeat === WEEKLY ? 2 : repeat === MONTHLY ? 3 : null,
      dayOfWeeks: dayOfWeeks,
      requestType: programType === 'Type B' ? 2 : 1,
      preferredDomainAorC: preferredDomainAorC.id || null,
      preferredDomainB: preferredDomainB.id || null,
      startTime,
      startDate: repeat === MONTHLY && startDate.length === 7 ? '01/' + startDate : startDate,
      endDate: repeat === MONTHLY && endDate.length === 7 ? '01/' + endDate : (endDate || startDate),
      startTime2,
      startDate2,
      startTime3,
      startDate3,
      repeatDayOfMonth: !!repeatDayOfMonth && repeatDayOfMonth.length > 0 ? repeatDayOfMonth : null,
      languageId: language.id,
      isAdvanceSetting,
      remarks,
      renewCpap: renewCPAPActive,
      renewCpapText: renewCPAPActive ? cpapId : ''
    }
    this.props.showLoading(true)
    editRequest(dataRequest, this.requestId).then(data => {
      this.props.showLoading(false)
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


  renderSelectionCategory = (key) => {
    const {category, listCategory, program, activity, recipe1, recipe2, listRecipes} = this.state
    if (!program) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING: {
        return <View>
          <DropdownInput
            placeholder={'Select Category 1'}
            dataSource={listCategory}
            fieldShow={'name'}
            value={category[0].name}
            onSelected={(item) => {
              let items = [];
              items.push(item);
              items.push(category[1]);

              this.setState({
                category: items,
                recipe1: '',
              })
              getListRecipesByCategory(key, item.id).then(res => {
                if (res.statusCode === 200) {
                  this.setState({listRecipe1: res.data.result.list})
                }
              })
            }}
          />
          <DropdownInput
            placeholder={'Select Recipe 1'}
            dataSource={this.state.listRecipe1}
            fieldShow={'name'}
            value={recipe1.name}
            onSelected={(item) => {
              this.setState({recipe1: item})
            }}
          />
          <DropdownInput
            placeholder={'Select Category 1'}
            dataSource={listCategory}
            fieldShow={'name'}
            value={category[1].name}
            onSelected={(item) => {
              let items = [];
              items.push(category[0]);
              items.push(item);
              
              this.setState({
                category: items,
                recipe2: '',
              })
              getListRecipesByCategory(key, item.id).then(res => {
                if (res.statusCode === 200) {
                  this.setState({listRecipe2: res.data.result.list})
                }
              })
            }}
          />
          <DropdownInput
            placeholder={'Select Recipe 2'}
            dataSource={this.state.listRecipe2}
            fieldShow={'name'}
            value={recipe2.name}
            onSelected={(item) => {
              this.setState({recipe2: item})
            }}
          />
        </View>
      }
      case NUTRITION_WORKSHOP:
        return <DropdownMultipSelectionInput
          placeholder={'Select Category'}
          dataSource={listCategory}
          fieldShow={'name'}
          onSelected={(items) => {
            this.setState({
              category: items,
              recipe: ''
            })
            this.getListRecipesByCategory(key, items)
          }}
          onUnselected={(item) => {
            this.setState({
              category: category.filter(data => data.id !== item.id)

            })
          }}
        />
      default:
        return <View/>
    }
  }
  renderSelectionRecipe = (key) => {
    const {recipe1, recipe2, listRecipes, category, activity} = this.state
    if (!category) return <View/>
    switch (key) {
      case PARENT_WORKSHOP:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING: {
        return <View />
      }
      case NUTRITION_WORKSHOP:
        return <View>
          <DropdownInput
            placeholder={'Select Recipe 1'}
            dataSource={listRecipes}
            fieldShow={'name'}
            value={recipe1.name}
            onSelected={(item) => {
              this.setState({recipe1: item})
            }}
          />
          <DropdownInput
            placeholder={'Select Recipe 2'}
            dataSource={listRecipes}
            fieldShow={'name'}
            value={recipe2.name}
            onSelected={(item) => {
              this.setState({recipe2: item})
            }}
          />
        </View>
      default:
        return <View/>
    }
  }

  renderSelectionActivity = (key) => {
    const {activity, listActivity, preferredDomainB, preferredDomainAorC} = this.state
    switch (key) {
      case FIT:
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
        return <View/>
      case MITY:
        return <View>
          <DropdownInput
            placeholder={'Preferred Domain B'}
            dataSource={listActivity}
            fieldShow={'name'}
            value={preferredDomainB.name}
            onSelected={(item) => {
              this.setState({preferredDomainB: item})
            }}
          />
          <DropdownInput
            placeholder={'Preferred Domain A or C'}
            dataSource={listActivity}
            fieldShow={'name'}
            value={preferredDomainAorC.name}
            onSelected={(item) => {
              this.setState({preferredDomainAorC: item})
            }}
          />
        </View>
      default:
        return <DropdownInput
          placeholder={'Select Activity'}
          dataSource={listActivity}
          fieldShow={'name'}
          value={activity.name}
          onSelected={(item) => {
            this.setState({activity: item})
          }}
        />
    }
  }

  getListRecipesByCategory = (programType, categorys) => {
    switch (programType) {
      case NUTRITION_COOKING: {
        this.props.showLoading(true)
        Promise.all(categorys.map(item => {
          return getListRecipesByCategory(programType, item.id)
        })).then(data => {
          this.props.showLoading(false)
          let listRecipe1 = []
          let listRecipe2 = []
          listRecipe1 = data[0].data.result.list;
          listRecipe2 = data[1].data.result.list;
          this.setState({listRecipe1: listRecipe1, listRecipe2: listRecipe2})
        })
      }
      case NUTRITION_WORKSHOP:
      case PARENT_WORKSHOP:
        this.props.showLoading(true)
        Promise.all(categorys.map(item => {
          return getListRecipesByCategory(programType, item.id)
        })).then(data => {
          this.props.showLoading(false)
          let listRecipe = []
          data.map(item => {
            if (item.statusCode === 200) {
              listRecipe = [...listRecipe, ...item.data.result.list]
            }
          })
          this.setState({listRecipes: listRecipe})
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
            this.setState({
              listActivity: res.data.result.list,
            })
          }
        })
    }
  }

  renderViewForNutriWorkShop = () => {
    const {activity, listActivity, activity2, startDate, startTime, startTime2, startDate2, startDate3} = this.state
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
        value={activity.name}
        onSelected={(item) => {
          this.setState({activity: item})
        }}
      />
      {/*session 2*/}
      <DateTimeInputWithTitle
        placeholder={'2nd Session Start Time (24-hr)'}
        mode={'time'}
        tailIcon={Images.timeIcon}
        time={startTime2}
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
        value={activity2.name}
        onSelected={(item) => {
          this.setState({activity2: item})
        }}
      />
      {/*session 3*/}
      <DateTimeInputWithTitle
        placeholder={'3rd Session Start Time (24-hr)'}
        mode={'time'}
        minimumDate={this.minimumDate}
        tailIcon={Images.timeIcon}
        changeText={(text) => {
          this.setState({startTime3: text})
        }}
      />
      <DateTimeInputWithTitle
        placeholder={'3rd Session Start Date'}
        tailIcon={Images.dateIcon}
        minimumDate={this.minimumDate}
        date={startDate3}
        changeText={(text) => {
          this.setState({startDate3: moment(text).format('DD/MM/YYYY')})
        }}
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

  renderHeaderRepeat = () => {
    const {repeat, startTime, startDate, endDate} = this.state
    return <View>
      <Text style={styles.title}>Frequency</Text>
      <View style={styles.repeatWrapper}>
        <TouchableOpacity
          style={[styles.button, {
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
        <TouchableOpacity
          style={[styles.button, {
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
                repeatDayOfMonth: []
              })
            }
          }}>
          <Text style={[styles.buttonText,
            {color: repeat === WEEKLY ? AppColors.whiteTitle : AppColors.grayTextColor}
          ]}>WEEKLY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {
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
          <Text style={styles.textStyle}>Repeat on</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 15}}>
            {
              weekly.map((item, index) => {
                return <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.5}
                  style={[styles.buttonWeekly, {backgroundColor: dayInWeek.key === item.key ? AppColors.buttonColor : '#d9d9d9'}]}
                  onPress={() => {
                    this.setState({dayInWeek: item})
                  }}>
                  <Text style={[styles.textButtonWeekly,
                    {color: dayInWeek.key === item.key ? AppColors.whiteTitle : AppColors.black60}]}>{item.value}</Text>
                </TouchableOpacity>
              })
            }
          </View>
          <Text style={styles.textStyle}>
            <Text>End on </Text>
            <Text style={{color: '#128ff9'}}>{!!endDate ? moment(endDate).format('dddd, DD/MM/YYYY') : ''}</Text>
          </Text>
          <Text style={styles.textStyle}>(You have set End Date in Programme Selection Panel)</Text>
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
                if (repeatDayOfMonth.length < 3) {
                  this.setState({
                    repeatDayOfMonth: [...repeatDayOfMonth, data]
                  })
                } else {
                  Toast.showShortBottom('Cannot select more than 3 week!')
                }
              }

            }}/>
        </View>
    }
  }

  renderRepeat = (programType) => {
    const {repeat, startTime, startDate, endDate, program} = this.state
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

  selectedStartDate = (startDate) => {
    const {endDate} = this.state
    let mEndDate = moment(endDate, 'DD/MM/YYYY')
    let mStartDate = moment(startDate, 'DD/MM/YYYY')
    if (!!endDate) {
      if (mEndDate.diff(mStartDate) < 0) {
        this.setState({endDate: ''})
      }
    }
    this.setState({startDate})
  }

  saveFrequencyData = (data) => {
    this.setState({...data, isShowReview: false})
  }


  render() {
    const {
      program, listProgram, expectedAttendance, venue, venuePostalCode, language, listLanguage, isShowReview,
      listSession, dayInWeek, repeatDayOfMonth, isAdvanceSetting, repeat, remarks
    } = this.state
    const {userInfo} = this.props
    const {typeRole} = userInfo
    return <ScrollView style={styles.container}>
      {(typeRole === RoleType.HPM ||
        typeRole === RoleType.SM ||
        typeRole === RoleType.DataEntry ||
        typeRole === RoleType.SuperAdmin) && <DropdownInput
        placeholder={'Programme Type'}
        dataSource={programType}
        fieldShow={'value'}
        value={this.state.programType.value}
        onSelected={(item) => {
          this.setState({programType: item})
        }}
      />}
      <DropdownInput
        placeholder={'Programme'}
        dataSource={listProgram}
        fieldShow={'description'}
        value={program.description}
        disabled={true}
        onSelected={(item) => {
          this.setState({
            program: item,
            category: '',
            recipe: ''
          })
          if (item.type === NUTRITION_WORKSHOP) {
            this.setState({repeat: ''})
          }
          this.getListCategoryByProgram(item.type)
          this.getActivityByProgramType(item.type)
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
      {this.renderSelectionCategory(program.type)}
      {program.type === NUTRITION_WORKSHOP && this.renderViewForNutriWorkShop()}
      {this.renderSelectionRecipe(program.type)}

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
        value={expectedAttendance + ''}
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
            minDate={this.state.typeSelect === 'startDate' ? moment() : moment(this.state.startDate, 'MM/YYYY')}
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
                           data: {...this.state, isUpdate: 0},
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
  userInfo: state.auth.userInfo
}), dispatch => ({
  showLoading: (visible) => dispatch(showLoading(visible))
}))(UpdateProgammeScreen)