/**
 * Created by Hong HP on 3/5/19.
 */

import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, ScrollView} from 'react-native';
import {Images} from '../../theme/images';
import {AppColors} from '../../theme/colors';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import TextInputWithTitle from '../../common/TextInputWithTitle';
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
import {ProgramTypes} from '../../contants/program-types';
import moment from 'moment/moment';
import {FontNames} from '../../theme/fonts';
import {connect} from 'react-redux';
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import Checkbox from '../../common/Checkbox';
import {
  changeRequest,
  getActivityByProgramType,
  getListCategoryByProgram,
  getListRecipesByCategory,
  getLanguage
} from '../../services/requestService';
import {bindActionCreators} from 'redux';
import {getRequestsAction} from '../../actions/request';
import DropdownMultipSelectionInput from '../../common/DropdownMultipleSelectionInput';
import {showLoading} from '../../actions/app';
import {RoleType} from '../../contants/profile-field';
import DropdownAutocomplete from '../../common/DropdownAutocomplete';
import {getPartnerName, searchPartner} from '../../services/userService';

var get = require('lodash.get');

const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'CUSTOM'
const NUTRITION_COOKING = 'NutritionCooking'
const NUTRITION_WORKSHOP = 'NutritionWorkshop'
const MITY = 'MITY'
const EAT_RIGHT_GET_MOVING = 'Eat Right Get Moving'

class ChangeRequestScreen extends React.Component {

  constructor() {
    super()
    this.state = {
      isAllowAll: false,
      startDate: '',
      startTime: '',
      disable: false,
      listActivity: [],
      activity: '',
      activity2: '',
      preferredDomainB: '',
      preferredDomainAorC: '',
      listAllDayOfWeenkInMonthly: [],
      recipe1: '',
      recipe2: '',
      category: '',
      listRecipe1: [],
      listRecipe2: [],
      listCategory: [],
      disableChangeDate: false,
      listLanguage: '',
      language: '',

      programTypeName: '',
      venue: '',
      venuePostalCode: '',
      remarks: '',
      expectedNumberOfPax: '',

      isChangeVenue: false,
      isRemark: false,
      isNumberOfPax: false,
      isLanguage: false,

      partners: [],
      partner: {},
      listPOCName: [],
      pocName: {},

      startTimeDefault: '',
      startDateDefault: '',
      isAllowAllDefault: false,
      activityDefault: '',
      activity2Default: '',
      preferredDomainAorCDefault: '',
      preferredDomainBDefault: '',
      recipe1Default: '',
      recipe2Default: '',
      venueDefault: '',
      venuePostalCodeDefault: '',
      remarksDefault: '',
      languageDefault: '',
      expectedNumberOfPaxDefault: '',
      pocNameDefault: {},
      partnerDefault: {}
    }
    this.request = ''
    this.minimumDate = moment().add(30, 'days').toDate();
  }

  componentDidMount() {
    const {typeRole} = this.props.userInfo;
    this.request = this.props.navigation.getParam('request')
    console.log('Request: ', this.request)
    getLanguage().then(res => {
      if (res.statusCode === 200) {
        let languages = res.data.list
        let lang = {};
        languages.map(language => {
          if (language.id == this.request.languageId) return (lang = language);
        });
        this.setState({
          listLanguage: languages,
          language: lang,
          languageDefault: lang,
        })
      }
    })
    getActivityByProgramType(this.request.programType).then(res => {
      console.log('Activity: ', res)
      if (res.statusCode === 200) {
        this.setState({
          listActivity: res.data.result.list
        })
      }
    })

    let category = ''
    if (this.request.category1Id || this.request.category2Id)
      category = [{
        id: this.request.category1Id, name: this.request.category1Name
      }, {
        id: this.request.category2Id, name: this.request.category2Name
      }]
    //Get list data
    this.getListCategoryByProgram(this.request.programType)
    this.getListRecipesByCategory(this.request.programType, category)
    this.setState({
      startDate: this.request.date,
      startTime: this.request.startTime,
      activity: {
        id: this.request.activityId,
        name: this.request.activityName
      },
      activity2: {
        id: this.request.activity2Id,
        name: this.request.activity2Name
      },
      preferredDomainB: {
        id: this.request.preferredDomainB,
        name: this.request.preferredDomainBName
      },
      preferredDomainAorC: {
        id: this.request.preferredDomainAorC,
        name: this.request.preferredDomainAorCName
      },
      recipe1: {id: this.request.recipe1Id, name: this.request.recipe1Name,},
      recipe2: {id: this.request.recipe2Id, name: this.request.recipe2Name,},
      category: category,
      listAllDayOfWeenkInMonthly: !!this.request.listAllDayOfWeenkInMonthly ? this.request.listAllDayOfWeenkInMonthly.map(item => moment(item, 'DD/MM/YYYY')) : [],
      programTypeName: this.request.programTypeName,
      venue: this.request.venue,
      venuePostalCode: this.request.venuePostalCode,
      remarks: this.request.remarks,
      expectedNumberOfPax: this.request.expectedNumberOfPax,

      startTimeDefault: this.request.startTime,
      startDateDefault: this.request.date,
      activityDefault: {
        id: this.request.activityId,
        name: this.request.activityName
      },
      activity2Default: {
        id: this.request.activity2Id,
        name: this.request.activity2Name
      },
      preferredDomainAorCDefault: {
        id: this.request.preferredDomainAorC,
        name: this.request.preferredDomainAorCName
      },
      preferredDomainBDefault: {
        id: this.request.preferredDomainB,
        name: this.request.preferredDomainBName
      },
      recipe1Default: {id: this.request.recipe1Id, name: this.request.recipe1Name},
      recipe2Default: {id: this.request.recipe2Id, name: this.request.recipe2Name},
      venueDefault: this.request.venue,
      venuePostalCodeDefault: this.request.venuePostalCode,
      remarksDefault: this.request.remarks,
      expectedNumberOfPaxDefault: this.request.expectedNumberOfPax
    })

    switch (typeRole) {
      case RoleType.SuperAdmin:
      case RoleType.PM:
      case RoleType.Partner:
        this.minimumDate = moment().toDate();
        this.setState({
          isChangeVenue: true,
          isRemark: true,
          isNumberOfPax: true,
          isLanguage: true
        });
        break;
    }

    if (Date.parse(moment(this.request.date, "DD/MM/YYYY")) - Date.parse(moment().toDate()) > (14 * 1000 * 60 * 60 * 24)) {
      this.setState({disableChangeDate: false})
    } else {
      this.setState({disableChangeDate: true})
    }

    this.searchPartner(this.request.partnerName);
    this.getPartnerName(this.request.partnerNameId, true);

    let partner = {
      id: this.request.partnerNameId,
      name: this.request.partnerName
    }
    this.setState({partner: partner, partnerDefault: partner})
  }

  searchPartner = (text) => {
    searchPartner(text).then(res => {
      if (res.statusCode === 200) {
        console.log('thanh searchPartner', res.data.list)
        this.setState({partners: res.data.list})
      }
    })
  }

  getPartnerName = (partnerNameId, isFirst) => {
    getPartnerName(partnerNameId).then(res => {
      console.log('thanh getPartnerName', res.data)
      if (res.statusCode == 200) {
        this.setState({listPOCName: res.data})
        isFirst && this.setState({pocNameDefault: res.data[0], pocName: res.data[0]})
      }
    })
  }

  componentDidUpdate() {
    if (this.request.date !== this.state.startDate) {
      if (!this.state.disable)
        this.setState({
          disable: true
        })
    } else {
      if (this.state.disable) {
        this.setState({disable: false})
      }
    }
  }

  getListCategoryByProgram = (programType) => {
    switch (programType) {
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case ProgramTypes.ParentWorkshop:
        getListCategoryByProgram(programType).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              listCategory: res.data.result.list
            })
          }
        })
    }
  }

  getListRecipesByCategory = (programType, categorys) => {
    switch (programType) {
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
      case ProgramTypes.ParentWorkshop:
        this.props.showLoading(true)
        Promise.all(categorys && categorys.map(item => {
          return getListRecipesByCategory(programType, item.id)
        })).then(data => {
          this.props.showLoading(false)
          let listRecipe1 = []
          let listRecipe2 = []
          data.map((item, index) => {
            if (item.statusCode === 200) {
              if (index === 0) {
                listRecipe1 = item.data.result.list
              }
              if (index === 1) {
                listRecipe2 = item.data.result.list
              }
            }
          })
          this.setState({
            listRecipe1,
            listRecipe2
          })
        })
    }
  }

  submitChangeRequest = () => {
    const {
      startTime,
      startDate,
      isAllowAll,
      activity,
      activity2,
      preferredDomainAorC,
      preferredDomainB,
      recipe1,
      recipe2,
      venue,
      venuePostalCode,
      remarks,
      language,
      expectedNumberOfPax,
      partner,
      pocName,
      startTimeDefault,
      startDateDefault,
      isAllowAllDefault,
      activityDefault,
      activity2Default,
      preferredDomainAorCDefault,
      preferredDomainBDefault,
      recipe1Default,
      recipe2Default,
      venueDefault,
      venuePostalCodeDefault,
      remarksDefault,
      languageDefault,
      expectedNumberOfPaxDefault,
      pocNameDefault,
      partnerDefault
    } = this.state

    let dataDefault = {
      id: this.request.id,
      startTime: startTimeDefault,
      startDate: startDateDefault,
      isAllowAll: isAllowAllDefault,
      activityId: activityDefault.id || null,
      activity2Id: activity2Default.id || null,
      preferredDomainAorC: preferredDomainAorCDefault.id || null,
      preferredDomainB: preferredDomainBDefault.id || null,
      recipe1Id: recipe1Default.id || null,
      recipe2Id: recipe2Default.id || null,
      venue: venueDefault,
      venuePostalCode: venuePostalCodeDefault,
      remarks: remarksDefault,
      languageId: languageDefault.id,
      expectedNumberOfPax: expectedNumberOfPaxDefault,
      userPartnerId: pocNameDefault.id,
      partnerNameId: partnerDefault.id
    }

    let data = {
      id: this.request.id,
      startTime: startTime,
      startDate: startDate,
      isAllowAll: isAllowAll,
      activityId: activity.id || null,
      activity2Id: activity2.id || null,
      preferredDomainAorC: preferredDomainAorC.id || null,
      preferredDomainB: preferredDomainB.id || null,
      recipe1Id: recipe1.id || null,
      recipe2Id: recipe2.id || null,
      venue: venue,
      venuePostalCode: venuePostalCode,
      remarks: remarks,
      languageId: language.id,
      expectedNumberOfPax: expectedNumberOfPax,
      userPartnerId: pocName.id,
      partnerNameId: partner.id
    }
    if (data.startTime == dataDefault.startTime && data.startDate == dataDefault.startDate &&
      data.isAllowAll == dataDefault.isAllowAll && data.activityId == dataDefault.activityId &&
      data.activity2Id == dataDefault.activity2Id && data.preferredDomainAorC == dataDefault.preferredDomainAorC &&
      data.preferredDomainB == dataDefault.preferredDomainB && data.recipe1Id == dataDefault.recipe1Id &&
      data.recipe2Id == dataDefault.recipe2Id && data.venue == dataDefault.venue &&
      data.venuePostalCode == dataDefault.venuePostalCode && data.remarks == dataDefault.remarks &&
      data.languageId == dataDefault.languageId && data.expectedNumberOfPax == dataDefault.expectedNumberOfPax &&
      data.userPartnerId == dataDefault.userPartnerId && data.partnerNameId == dataDefault.partnerNameId)
        alert('Same data');
    else
      changeRequest(data, this.request.id).then(res => {
        if (res.statusCode === 200) {
          alert(res.message)
          this.searchRequest()
          this.props.navigation.pop()
        } else {
          alert(res.message)
        }
      })
  }

  formatMulValue = (fieldShow) => {
    const {category} = this.state
    let text = ''
    if (!!category && category.length > 0) {
      category.map(item => {
        if (!!text) {
          text = text + ', ' + item[fieldShow]
        } else {
          text = item[fieldShow]
        }

      })
    }
    return text
  }


  getIdsForSearching = data => {
    let ids = [];
    data.filter(item => item.selected)
      .map((item, index) => {
        ids.push(item.id);
      });

    return ids;
  };

  searchRequest = () => {

    let searchDetail = []

    const navParams = this.props.navigation.state.params
    if (navParams && get(navParams, 'dashboardstatus', '')) {
      let value = get(navParams, 'dashboardstatus', '')
      value && searchDetail.push({key: 'dashboardstatus', value: value})
    }
    console.log('searchDetail', searchDetail)

    this.props.searchKey && this.props.columns
      .filter(item => item.selected == true)
      .map(item => {
        return searchDetail.push({
          key: item.value,
          value: this.props.searchKey
        })
      })

    let grcIds = this.getIdsForSearching(
      get(this.props.filterData, 'grcs', [])
    );
    let districtsIds = this.getIdsForSearching(
      get(this.props.filterData, 'districts', [])
    );
    let programsIds = this.getIdsForSearching(
      get(this.props.filterData, 'programs', [])
    );
    let divsionsIds = this.getIdsForSearching(
      get(this.props.filterData, 'divisions', [])
    );

    let status = [];
    get(this.props.filterData, 'status', [])
      .filter(item => item.selected)
      .map(item => {
        return status.push(item.type);
      });

    let startDate = get(this.props, 'filterDateRange.startDate', '')
    let endDate = get(this.props, 'filterDateRange.endDate', '')

    let isActFilterProgram = get(this.props.filterData, 'isActFilterProgram', false)
    let isActFilterDistrict = get(this.props.filterData, 'isActFilterDistrict', false)
    let isActFilterDivision = get(this.props.filterData, 'isActFilterDivision', false)
    let isActFilterGRC = get(this.props.filterData, 'isActFilterGRC', false)
    let isActFilterStatus = get(this.props.filterData, 'isActFilterStatus', false)

    this.props.getRequestsAction(
      isActFilterProgram ? programsIds : [],
      isActFilterGRC ? grcIds : [],
      isActFilterDistrict ? districtsIds : [],
      isActFilterDivision ? divsionsIds : [],
      isActFilterStatus ? status : [],
      startDate, endDate, searchDetail, 0, true,
    );
  };

  renderSelectionActivity = (key) => {
    const {activity, listActivity, preferredDomainB, preferredDomainAorC} = this.state
    if (key === ProgramTypes.CPAP || key === ProgramTypes.MITY ||
      key === ProgramTypes.FITplus || key === ProgramTypes.MWO || key === ProgramTypes.SATP ||
      key === ProgramTypes.SHCCore || key === ProgramTypes.SHCElective || key === ProgramTypes.ParentWorkshop) {
      switch (key) {
        case NUTRITION_COOKING:
        case NUTRITION_WORKSHOP: {
          if (!!activity.id) {
            return 
            <View>
              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoRegular,
                  marginTop: 10,
                  marginBottom: 5
                }}>Activity Name</Text>
                <View style={styles.borderDropdown}><DropdownAutocomplete
                  placeholder={'Select Activity'}
                  value={activity}
                  data={listActivity}
                  onSelected={(item) => {
                    this.setState({activity: item})
                  }}
                /></View>
            </View>
          } else {
            return <View/>
          }
        }
        case ProgramTypes.ParentWorkshop:
          return <View/>
        case MITY:
          return <View>
            <Text
              style={{
                color: AppColors.black2,
                fontSize: 12,
                fontFamily: FontNames.RobotoRegular,
                marginTop: 10,
                marginBottom: 5
              }}>Preferred Domain</Text>
              <View>
              <View style={styles.borderDropdown}><DropdownAutocomplete
                placeholder={'Preferred Domain B'}
                value={preferredDomainB}
                data={listActivity}
                onSelected={(item) => {
                  this.setState({preferredDomainB: item})
                }}
              /></View>
              <View style={styles.borderDropdown}><DropdownAutocomplete
                placeholder={'Preferred Domain A or C'}
                value={preferredDomainAorC}
                data={listActivity}
                onSelected={(item) => {
                  this.setState({preferredDomainAorC: item})
                }}
              /></View>
            </View>
          </View>
        default:
          return <View>
            <Text
              style={{
                color: AppColors.black2,
                fontSize: 12,
                fontFamily: FontNames.RobotoRegular,
                marginTop: 10,
                marginBottom: 5
              }}>Activity Name</Text>
              <View style={styles.borderDropdown}><DropdownAutocomplete
                placeholder={'Select Activity'}
                value={activity}
                data={listActivity}
                onSelected={(item) => {
                  this.setState({activity: item})
                }}
              /></View>
          </View>
      }
    }
  }

  renderSelectionCategory = (key) => {
    const {category, listCategory, activity} = this.state
    switch (key) {
      case ProgramTypes.ParentWorkshop:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_COOKING:
      case NUTRITION_WORKSHOP:
        return <DropdownMultipSelectionInput
          placeholder={'Select Category'}
          dataSource={listCategory}
          fieldShow={'name'}
          limitSelected={2}
          value={this.formatMulValue('name')}
          onSelected={(items) => {
            this.setState({
              category: items,
              recipe1: '',
              recipe2: ''
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
    const {recipe1, recipe2, listRecipe1, category, activity, listRecipe2} = this.state
    if (!category) return <View/>
    switch (key) {
      case ProgramTypes.ParentWorkshop:
        if (activity.name !== EAT_RIGHT_GET_MOVING) {
          break
        }
      case NUTRITION_WORKSHOP:
      case NUTRITION_COOKING:
        return <View>
          {listRecipe1.length > 0 && <View style={styles.borderDropdown}><DropdownAutocomplete
            placeholder={'Select Recipe 1'}
            value={recipe1}
            data={listRecipe1}
            onSelected={(item) => {
              this.setState({recipe1: item})
            }}
          /></View>}
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

  render() {
    const {isAllowAll, startTime, startDate} = this.state
    return <View style={{flex: 1}}><ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      style={{flex: 1}}
      bounces={false}
    > 
      <View style={styles.container}>
        <TextInputHeaderTitle
          title={'FREQUENCY'}
          inputStyle={styles.textStyle}
          value={this.request.repeatType == 1 ? DAILY : this.request.repeatType === 2 ? WEEKLY : MONTHLY}
        />

        <View>
          <Text
            style={{
              color: AppColors.black2,
              fontSize: 12,
              fontFamily: FontNames.RobotoRegular,
              marginTop: 10,
              marginBottom: 5
            }}>Organisation Name</Text>
          <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
            <DropdownAutocomplete
              placeholder={'Organisation Name'}
              value={this.state.partner}
              data={this.state.partners}
              onSelected={(item) => {
                this.setState({partner: item, pocName: {}})
                this.getPartnerName(item.id)
              }}
              onChangeText={(text) => {
                this.searchPartner(text)
              }}
            />
          </View>
        </View>

        <View>
          <Text
            style={{
              color: AppColors.black2,
              fontSize: 12,
              fontFamily: FontNames.RobotoRegular,
              marginTop: 10,
              marginBottom: 5
            }}>POC Name</Text>
          <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
            <DropdownAutocomplete
              placeholder={'Organisation Name'}
              value={this.state.pocName}
              data={this.state.listPOCName}
              onSelected={(item) => {
                this.setState({pocName: item})
              }}
            />
          </View>
        </View>
        
        {this.renderSelectionActivity(this.request.programType)}
        {this.renderSelectionCategory(this.request.programType)}
        {this.renderSelectionRecipe(this.request.programType)}
        <DateTimeInputWithTitle
          placeholder={'Start Time'}
          tailIcon={Images.dateIcon}
          time={startTime}
          mode={'time'}
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
          disable={this.state.disableChangeDate}
          changeText={(text) => {
            this.setState({startDate: moment(text).format('DD/MM/YYYY'), isAllowAll: false})
          }}
        />

        <View style={{ marginTop: 10 }}>
          <TextInputWithTitle
            placeholder="Program name"
            title="Program name"
            value={this.state.programTypeName}
            editable={false}
          />
        </View>

        <View>
          <Text
            style={{
              color: AppColors.black2,
              fontSize: 12,
              fontFamily: FontNames.RobotoRegular,
              marginTop: 10,
              marginBottom: 5
            }}
          >
            Language
          </Text>
          <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
            <DropdownAutocomplete
              placeholder={'Language'}
              value={this.state.language}
              data={this.state.listLanguage}
              onSelected={(item) => {
                this.setState({language: item})
              }}
            />
          </View>
        </View>
      

      {this.state.isChangeVenue ? (
        <View>
          <View style={{ marginTop: 10 }}>
            <TextInputWithTitle
              placeholder="Venue"
              title="Venue"
              changeText={value => {
                this.setState({ venue: value });
              }}
              value={this.state.venue}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <TextInputWithTitle
              placeholder="Venue Postal Code"
              title="Venue Postal Code"
              changeText={value => {
                if (value.length < 7) {
                  this.setState({ venuePostalCode: value });
                }
              }}
              value={this.state.venuePostalCode}
              keyboardType={"number-pad"}
            />
          </View>
        </View>
      ) : (
          <View />
        )}

      {
        this.state.isNumberOfPax && <View style={{ marginTop: 10 }}>
          <TextInputWithTitle
            placeholder="Expected Attendance"
            title="Expected Attendance"
            changeText={value => {
              this.setState({ expectedNumberOfPax: value });
            }}
            value={this.state.expectedNumberOfPax && this.state.expectedNumberOfPax.toString()}
          />
        </View>
      }

      {
        this.state.isRemark && <View>
          <Text
              style={{
                color: AppColors.black2,
                fontSize: 12,
                fontFamily: FontNames.RobotoRegular,
                marginTop: 10,
                marginBottom: 5
              }}
            >Remarks</Text>
          <TextInputWithoutTitle
            placeholder="Remarks"
            value={this.state.remarks}
            multiline={true}
            styleTextInput={{height: 80}}
            style={{height: 80}}
            changeText={value => {
              this.setState({remarks: value})
            }}
          />
        </View>
      }

      {
        this.request.repeatType !== 1 ? <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
          disabled={this.state.disable}
          onPress={() => {
            this.setState({
              isAllowAll: !isAllowAll
            })
          }}
          >
          <Checkbox normalIcon={Images.blankIcon}
            highlightIcon={Images.checked2Icon}
            active={isAllowAll}/>
          <Text style={{marginLeft: 10}}>Apply for all future sessions</Text>
          </TouchableOpacity> : <View />
      }
    </View>
    </ScrollView>
    <TouchableOpacity
      style={styles.btnSubmit}
      onPress={() => {
        this.submitChangeRequest()
      }}>
      <Text style={{color: '#fff', fontSize: 14, fontFamily: FontNames.RobotoMedium}}>SUBMIT</Text>
    </TouchableOpacity>
    </View>
  }
}

const
  styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      marginBottom: 10
    },
    textStyle: {
      textAlign: 'right',
      fontSize: 16,
      fontFamily: FontNames.RobotoRegular,
      color: AppColors.black60
    },
    btnSubmit: {
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: AppColors.blueBackgroundColor
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
  filterDateRange: state.request.filterDateRange,
  filterData: state.request.filterData,
  columns: state.request.columns,
  searchKey: state.request.searchKey,
  userInfo: state.auth.userInfo,
}), dispatch => (bindActionCreators({
  getRequestsAction,
  showLoading,
}, dispatch)))(ChangeRequestScreen)