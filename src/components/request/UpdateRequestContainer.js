import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Images } from "../../theme/images";
import { FontNames } from "../../theme/fonts";
import { AppColors } from "../../theme/colors";
import DateTimeInputWithTitle from "../../common/DateTimeInputWithTitle";
import TextInputWithTitle from "../../common/TextInputWithTitle";
import Checkbox from "../../common/Checkbox";
import { RoleType } from "../../contants/profile-field";
import { ProgramTypes } from "../../contants/program-types";
import {
  updateRequestDetail,
  getSPForAssign,
  getTrainers,
  getActivityByProgramType,
  getListRecipesByCategory,
  getListCategoryByProgram,
  getLanguage
} from "../../services/requestService";
import { showLoading } from "../../actions/app";
import { getRequestsAction } from "../../actions/request";
import DropdownInput from "../../common/DropdownInput";
import CalendarStrip from "react-native-calendar-strip";
import TextInputWithoutTitle from "../../common/TextInputWithoutTitle";
import DropdownAutocomplete from '../../common/DropdownAutocomplete';
import {Message, showMessage} from '../../common/Message';
import AutoCompleteComponent from '../../common/AutoCompleteComponent';

var get = require("lodash.get");

const DAILY = "Daily";
const WEEKLY = "Weekly";
const MONTHLY = "Monthly";

const RECIPE_1 = "RECIPE_1";
const RECIPE_2 = "RECIPE_2";

const requestType = [
  {value: 'Type A', id: 1},
  {value: 'Type B', id: 2},
]

// -  Data Entry, PM and SuperAdmin: change Date (repeat), time, venue, activity,
//    recipe with programType (NutritionCooking), programme type
// -  Data Entry role, PM and SuperAdmin can update purple fields
// -  Option for change to apply singular or to future whole series of program
// -  PM, SM and SuperAdmin changes SP of a session
// -  SP assign Trainer
// -  Trainer assign other trainer

class UpdateRequestContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},

      applyAllSessions: false,

      isChangeDate: false,
      isChangeTime: false,
      isChangeVenue: false,
      isChangeApply: false,
      isChangeSP: false,
      isSPChangeTrainer: false,
      isTrainerChangeTrainer: false,
      isChangeActivity: false,
      isChangeRecipe: false,

      isNatureOfVenue: false,
      isAlternateSite: false,
      isAEDLocation: false,
      isRam: false,
      isRemark: false,
      isNumberOfPax: false,
      isLanguage: false,

      disableDate: false,
      disableTime: false,
      disableApply: false,

      date: "",
      startTime: "",
      venueNature: "",
      alternativeSite: "",
      aedLocation: "",
      ram: "",
      venue: "",
      venuePostalCode: "",
      dateDefault: "",
      requestTypeItem: {},
      remarks: "",

      spId: "",
      spName: "",

      trainerId: "",
      trainerName: "",

      sps: [],
      sp: {},
      listFilterSP: [],
      keywordSP: "",
      spEmail: "",
      spPhone: "",

      trainers: [],
      trainer: {},

      listActivity: [],
      activity: {},
      preferredDomainB: {},
      preferredDomainAorC: {},

      listCategory: [],
      itemCategory1Selected: {},
      itemCategory2Selected: {},

      listRecipes1: [],
      listRecipes2: [],
      itemRecipe1Selected: {},
      itemRecipe2Selected: {},

      startDate: "",
      endDate: "",
      listLanguage: '',
      language: '',
      expectedNumberOfPax: '',

      programTypeName: '',
      activityName: ''
    };
    this.minimumDate = moment().toDate();
  }

  componentDidMount() {
    let { navigation, userInfo, requests } = this.props;
    let id = get(navigation, "state.params.id", "");
    let item = {};
    requests.map(request => {
      if (request.id == id) return (item = request);
    });
    let listRequestDetailId = [];
    listRequestDetailId.push(id)

    this.checkTypeRole(userInfo.typeRole, item);
    this.checkProgramTypes(item.programType);
    this.getSPS(listRequestDetailId);
    this.getTrainers(item);
    this.getActivityByProgramType(item.programType);

    getLanguage().then(res => {
      if (res.statusCode === 200) {
        let languages = res.data.list
        let lang = {};
        languages.map(language => {
          if (language.id == item.languageId) return (lang = language);
        });
        this.setState({
          listLanguage: languages,
          language: lang
        })
      }
    })

    getListCategoryByProgram(item.programType).then(res => {
      if (res.statusCode === 200) {
        let data = res.data.result.list;
        let itemCategory1Selected = {};
        let itemCategory2Selected = {};

        data.filter(it => it.id == item.category1Id)
          .map(it => {
            itemCategory1Selected = it;
          })

        data.filter(it => it.id == item.category2Id)
          .map(it => {
            itemCategory2Selected = it;
          })

        this.setState({
          listCategory: data,
          itemCategory1Selected: itemCategory1Selected,
          itemCategory2Selected: itemCategory2Selected
        })
      }
    })

    this.getListRecipes(item.programType, item.category1Id, item.recipe1Id, RECIPE_1);
    this.getListRecipes(item.programType, item.category2Id, item.recipe2Id, RECIPE_2);

    let dates = item.listAllDayOfWeenkInMonthly;
    if (dates && dates.length > 0) {
      dates.map(date => {
        if (date.length > 0) {
          if (date.length == 1) {
            this.setState({
              startDate: dates[0],
              endDate: dates[0]
            });
          }
          if (date.length >= 2) {
            this.setState({
              startDate: dates[0],
              endDate: dates[dates.length - 1]
            });
          }
        }
      });
    }

    let reType = {};
    requestType.map((request) => {
      if (request.id == item.requestType) {
        reType = request;
      }
    })

    this.setState({
      item: item,
      date: item.date,
      startTime: item.startTime,
      venueNature: item.venueNature,
      alternativeSite: item.alternativeSite,
      aedLocation: item.aedLocation,
      ram: item.ram,
      venue: item.venue,
      venuePostalCode: item.venuePostalCode,
      dateDefault: item.date,
      spId: item.spId,
      spName: item.spName,
      keywordSP: item.spName,
      spEmail: item.spEmail,
      spPhone: item.spHandPhone,
      trainerId: item.trainerId,
      trainerName: item.trainerName,
      activity: {
        id: item.activityId,
        name: item.activityName
      },
      preferredDomainB: {
        id: item.preferredDomainB,
        name: item.preferredDomainBName
      },
      preferredDomainAorC: {
        id: item.preferredDomainAorC,
        name: item.preferredDomainAorCName
      },
      requestTypeItem: reType,
      remarks: item.remarks,
      expectedNumberOfPax: item.expectedNumberOfPax,
      programTypeName: item.programTypeName,
      activityName: item.activityName
    });
    console.log('load len', item);
  }

  getListRecipes = (programType, categoryId, recipeId, type) => {
    getListRecipesByCategory(programType, categoryId).then(res => {
      if (res.statusCode === 200) {
        let recipes = get(res, "data.result.list", []);
        let recipeSelected = {};
        recipes.filter(item => item.id == recipeId)
          .map(item => {
            recipeSelected = item;
          })
        
        switch(type) {
          case RECIPE_1:
            this.setState({
              listRecipes1: recipes,
              itemRecipe1Selected: recipeSelected,
            });
            break;
          case RECIPE_2:
            this.setState({
              listRecipes2: recipes,
              itemRecipe2Selected: recipeSelected,
            });
            break;
        }
      }
    });
  }
  
  checkTypeRole = (role, item) => {
    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.PM: {
        this.setState({
          isChangeDate: true,
          isChangeTime: true,
          isChangeVenue: true,
          isChangeApply: true,
          isChangeSP: true,
          isRemark: true,
          isNumberOfPax: true,
          isLanguage: true
        });

        if (item.frequency == DAILY) {
          this.setState({
            isChangeApply: false
          });
        }

        if (item.programType == ProgramTypes.NutritionCooking) {
          this.setState({
            isChangeRecipe: true
          });
        }

        break;
      }
      case RoleType.SM: {
        this.setState({
          isChangeSP: true
        });
        break;
      }
      case RoleType.SP: {
        this.setState({
          isSPChangeTrainer: true
        });
        break;
      }
      case RoleType.Trainer: {
        this.setState({
          isTrainerChangeTrainer: true
        });
        break;
      }
      default: {
        break;
      }
    }
  };

  checkProgramTypes = programType => {
    switch (programType) {
      case ProgramTypes.CPAP: {
        this.setState({
          isNatureOfVenue: true,
          isAlternateSite: true,
          isAEDLocation: true,
          isRam: true
        });
        break;
      }
      case ProgramTypes.MITY: {
        this.setState({
          isAlternateSite: true,
          isRam: true
        });
        break;
      }
      case ProgramTypes.FITplus: {
        this.setState({
          isAlternateSite: true,
          isRam: true
        });
        break;
      }
      case ProgramTypes.MWO: {
        this.setState({
          isRam: true
        });
        break;
      }
      case ProgramTypes.SATP: {
        this.setState({
          isRam: true
        });
        break;
      }
      case ProgramTypes.Customized: {
        this.setState({
          isAlternateSite: true,
          isChangeActivity: true,
        });
        break;
      }
      default: {
        this.setState({
          isChangeActivity: true
        });
        break;
      }
    }
  };

  onUpdateRequestDetail() {
    let {
      item,
      date,
      startTime,
      venueNature,
      alternativeSite,
      aedLocation,
      ram,
      venue,
      venuePostalCode,
      applyAllSessions,
      spId,
      trainerId,
      activity,
      preferredDomainB,
      preferredDomainAorC,
      itemRecipe1Selected,
      itemRecipe2Selected,
      isChangeRecipe,
      remarks,
      requestTypeItem,
      language,
      expectedNumberOfPax
    } = this.state;

    let dataUpdate = {
      date: date,
      ram: ram,
      startTime: startTime,
      venue: venue,
      venuePostalCode: venuePostalCode,
      venueNature: venueNature,
      alternativeSite: alternativeSite,
      aedLocation: aedLocation,
      spId: spId,
      trainerId: trainerId,
      isApply: applyAllSessions,
      activityId: activity.id || null,
      preferredDomainAorC: preferredDomainAorC.id || null,
      preferredDomainB: preferredDomainB.id || null,
      recipe1Id: isChangeRecipe ? itemRecipe1Selected.id : null,
      recipe2Id: isChangeRecipe ? itemRecipe2Selected.id : null,
      remarks: remarks,
      requestType: requestTypeItem.id,
      languageId: language.id,
      expectedNumberOfPax: expectedNumberOfPax
    };
    
    if (isChangeRecipe) {
      if (itemRecipe1Selected && itemRecipe1Selected.id && itemRecipe2Selected && itemRecipe2Selected.id) {
        this.props.showLoading(true);
        console.log("update request detail", dataUpdate);
        updateRequestDetail(dataUpdate, item.id).then(data => {
          console.log(data);
          this.props.showLoading(false);
          if (data.statusCode === 200) {
            this.searchRequest()
            this.props.navigation.pop();
          } else {
            alert(data.message);
          }
        });
      } else {
        showMessage('Please selected Recipe1 and Recipe2')
      }
    } else {
      console.log("update request detail", dataUpdate);
        updateRequestDetail(dataUpdate, item.id).then(data => {
          console.log(data);
          this.props.showLoading(false);
          if (data.statusCode === 200) {
            this.searchRequest()
            this.props.navigation.pop();
          } else {
            alert(data.message);
          }
        });
    }
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
      get(this.props.filterData, "grcs", [])
    );
    let districtsIds = this.getIdsForSearching(
      get(this.props.filterData, "districts", [])
    );
    let programsIds = this.getIdsForSearching(
      get(this.props.filterData, "programs", [])
    );
    let divsionsIds = this.getIdsForSearching(
      get(this.props.filterData, "divisions", [])
    );

    let status = [];
    get(this.props.filterData, "status", [])
      .filter(item => item.selected)
      .map(item => {
        return status.push(item.type);
      });

    let startDate = get(this.props, 'filterDateRange.startDate', '')
    let endDate = get(this.props, 'filterDateRange.endDate', '')

    let isActFilterProgram = get(this.props.filterData, "isActFilterProgram", false)
    let isActFilterDistrict = get(this.props.filterData, "isActFilterDistrict", false)
    let isActFilterDivision = get(this.props.filterData, "isActFilterDivision", false)
    let isActFilterGRC = get(this.props.filterData, "isActFilterGRC", false)
    let isActFilterStatus = get(this.props.filterData, "isActFilterStatus", false)

    this.props.getRequestsAction(
      isActFilterProgram ? programsIds : [],
      isActFilterGRC ? grcIds : [],
      isActFilterDistrict ? districtsIds : [],
      isActFilterDivision ? divsionsIds : [],
      isActFilterStatus ? status : [],
      startDate, endDate, searchDetail, 0, true,
      );
  };

  formatDate = date => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    }
    return "";
  };

  getSPS = (id) => {
    getSPForAssign(id).then(response => {
      if (response.statusCode === 200) {
        console.log("get sps: ", response.data);
        this.setState({ sps: response.data});
      } else {
        console.log('getSPS error', response);
      }
    });
  };

  getTrainers = item => {
    let id = "";
    let typeRole = get(this.props, "userInfo.typeRole", "");

    if (typeRole == RoleType.SP) {
      id = get(this.props, "userInfo.id", "");
    } else {
      id = get(item, "spId", "");
    }

    getTrainers(id).then(response => {
      if (response.statusCode === 200) {
        if (typeRole == RoleType.SP) {
          console.log("get trainers: ", response.data);
          this.setState({ trainers: response.data });
        } else {
          let userId = get(this.props, "userInfo.id", "");
          let tns = [];
          response.data.length > 0 &&
            response.data.map(trainer => {
              if (trainer.id != userId) {
                tns.push(trainer);
              }
            });
          console.log("get trainers: ", tns);
          this.setState({ trainers: tns });
        }
      }
    });
  };

  getActivityByProgramType = programType => {
    switch (programType) {
      case ProgramTypes.NutritionCooking:
        break;
      default:
        getActivityByProgramType(programType).then(res => {
          console.log("Activity: ", res);
          if (res.statusCode === 200) {
            this.setState({
              listActivity: res.data.result.list
            });
          }
        });
    }
  };

  renderSelectionActivity = key => {
    const {
      activity,
      listActivity,
      preferredDomainB,
      preferredDomainAorC
    } = this.state;
    switch (key) {
      case ProgramTypes.NutritionCooking:
      case ProgramTypes.ParentWorkshop:
        break;
      case ProgramTypes.NutritionWorkshop: {
        activity && activity.id ? (
          <View>
            <Text
              style={{
                color: AppColors.black2,
                fontSize: 12,
                fontFamily: FontNames.RobotoMedium,
                marginTop: 10,
                marginBottom: 5
              }}
            >Activity</Text>
            <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
              <DropdownAutocomplete
                placeholder={'Activity'}
                value={activity}
                data={listActivity}
                onSelected={(item) => {
                  this.setState({ activity: item });
                }}
              />
            </View>
          </View>
        ) : (
            <View />
          );
        break;
      }
      case ProgramTypes.MITY:
        return (
          <View>
            <View>
              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoMedium,
                  marginTop: 10,
                  marginBottom: 5
                }}
              >Preferred Domain B</Text>
              <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
                <DropdownAutocomplete
                  placeholder={'Preferred Domain B'}
                  value={preferredDomainB}
                  data={listActivity}
                  onSelected={(item) => {
                    this.setState({ preferredDomainB: item });
                  }}
                />
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoMedium,
                  marginTop: 10,
                  marginBottom: 5
                }}
              >Preferred Domain A or C</Text>
              <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
                <DropdownAutocomplete
                  placeholder={'Preferred Domain A or C'}
                  value={preferredDomainAorC}
                  data={listActivity}
                  onSelected={(item) => {
                    this.setState({ preferredDomainAorC: item });
                  }}
                />
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View>
            <Text
              style={{
                color: AppColors.black2,
                fontSize: 12,
                fontFamily: FontNames.RobotoMedium,
                marginTop: 10,
                marginBottom: 5
              }}
            >Activity</Text>
            <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
              <DropdownAutocomplete
                placeholder={'Activity'}
                value={activity}
                data={listActivity}
                onSelected={(item) => {
                  this.setState({ activity: item });
                }}
              />
            </View>
          </View>
        );
    }
  };

  filterSP = (text) => {
    this.setState({ keywordSP: text })
    let sps = this.state.sps.filter(item => item.pocName && item.pocName.toLowerCase().includes(text.toLowerCase()))
    if (sps) {
      this.setState({ listFilterSP: sps })
    } else {
      this.setState({ listFilterSP: this.state.sps })
    }
  }

  render() {
    let { item } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Message />
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text
              style={{
                color: AppColors.registerTitleColor,
                fontSize: 12,
                fontFamily: FontNames.RobotoBold,
                marginTop: 10,
                marginBottom: 5
              }}
            >
              {"Activity ID: " + get(item, "requestDetailNo", 0)}
            </Text>
            {item.frequency && item.frequency != "" ? (
              <View style={{ marginTop: 10 }}>
                <TextInputWithTitle
                  placeholder={item.frequency}
                  value={item.frequency}
                  title="Frequency"
                  editable={false}
                />
              </View>
            ) : (
                <View />
              )}
            {this.state.isChangeDate ? (
              <View>
                <Text
                  style={{
                    color: AppColors.black2,
                    fontSize: 12,
                    fontFamily: FontNames.RobotoMedium,
                    marginTop: 10,
                    marginBottom: 5
                  }}
                >
                  Date
                </Text>

                <DateTimeInputWithTitle
                  placeholder={"Start Date"}
                  mode={"date"}
                  tailIcon={Images.dateIcon}
                  minimumDate={this.minimumDate}
                  changeText={text => {
                    this.setState({ date: this.formatDate(text) });
                    const dateF = moment(text)
                      .format("DD/MM/YYYY")
                      .toString();
                      if (
                        Date.parse(moment(dateF, "DD/MM/YYYY")) !=
                        Date.parse(
                          moment(this.state.dateDefault, "DD/MM/YYYY")
                        )
                      ) {
                        this.setState({
                          disableApply: true,
                          applyAllSessions: false
                        });
                      } else {
                        this.setState({ disableApply: false });
                      }
                  }}
                  date={this.state.date ? this.state.date : ""}
                  disable={this.state.disableDate}
                />
              </View>
            ) : (
                <View />
              )}

            {this.state.isChangeTime ? (
              <View>
                <Text
                  style={{
                    color: AppColors.black2,
                    fontSize: 12,
                    fontFamily: FontNames.RobotoMedium,
                    marginTop: 10,
                    marginBottom: 5
                  }}
                >
                  Time
                </Text>
                <DateTimeInputWithTitle
                  placeholder={"Start Time"}
                  mode={"time"}
                  tailIcon={Images.timeIcon}
                  changeText={text => {
                    this.setState({ startTime: text });
                  }}
                  time={this.state.startTime}
                  disable={this.state.disableTime}
                />
              </View>
            ) : (
                <View />
              )}

            <View style={{ marginTop: 10 }}>
              <TextInputWithTitle
                placeholder="Program name"
                title="Program name"
                value={this.state.programTypeName}
                editable={false}
              />
            </View>
            
            {this.state.isChangeRecipe ? <View>
              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoMedium,
                  marginTop: 10,
                  marginBottom: 5
                }}
              >
              Category 1
              </Text>
              <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
                <DropdownAutocomplete
                  placeholder={'Choose Category 1'}
                  value={this.state.itemCategory1Selected}
                  data={this.state.listCategory}
                  onSelected={(it) => {
                    this.getListRecipes(item.programType, it.id, '', RECIPE_1);
                    this.setState({itemCategory1Selected: it, itemRecipe1Selected: {}})
                  }}
                />
              </View>

              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoMedium,
                  marginTop: 10,
                  marginBottom: 5
                }}
              >
              Recipe 1
              </Text>
              <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
                <DropdownAutocomplete
                  placeholder={'Choose Recipe 1'}
                  value={this.state.itemRecipe1Selected}
                  data={this.state.listRecipes1}
                  onSelected={(item) => {
                    this.setState({itemRecipe1Selected: item})
                  }}
                />
              </View>

              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoMedium,
                  marginTop: 10,
                  marginBottom: 5
                }}
              >
              Category 2
              </Text>
              <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
                <DropdownAutocomplete
                  placeholder={'Choose Category 2'}
                  value={this.state.itemCategory2Selected}
                  data={this.state.listCategory}
                  onSelected={(it) => {
                    this.getListRecipes(item.programType, it.id, '', RECIPE_2);
                    this.setState({itemCategory2Selected: it, itemRecipe2Selected: {}})
                  }}
                />
              </View>

              <Text
                style={{
                  color: AppColors.black2,
                  fontSize: 12,
                  fontFamily: FontNames.RobotoMedium,
                  marginTop: 10,
                  marginBottom: 5
                }}
              >
                Recipe 2
              </Text>
              <View style={{borderColor: 'black', borderRadius: 5, borderWidth: 0.5, paddingTop: 5, paddingBottom: 5}}>
                <DropdownAutocomplete
                  placeholder={'Choose Recipe 2'}
                  value={this.state.itemRecipe2Selected}
                  data={this.state.listRecipes2}
                  onSelected={(item) => {
                    this.setState({itemRecipe2Selected: item})
                  }}
                />
              </View>
            </View> : <View />}

            {this.state.isChangeActivity ? (
              <View>
                {this.renderSelectionActivity(item.programType)}
              </View>
            ) : (
              <View style={{ marginTop: 10 }}>
                <TextInputWithTitle
                  placeholder="Activity"
                  title="Activity"
                  value={this.state.activityName}
                  editable={false}
                />
              </View>
              )}

            {
              this.state.isLanguage && <View>
                <Text
                  style={{
                    color: AppColors.black2,
                    fontSize: 12,
                    fontFamily: FontNames.RobotoMedium,
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
            }

            {this.state.isChangeSP ? (
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    color: AppColors.black2,
                    fontSize: 12,
                    fontFamily: FontNames.RobotoMedium,
                    marginBottom: 5
                  }}
                >
                Assign SP
                </Text>
                <View style={{padding: 8, borderWidth: 0.5, borderColor: 'gray', borderRadius: 8}}>
                  <AutoCompleteComponent
                    editable={true}
                    hideResults={this.state.listFilterSP.length == 0}
                    placeholder={'SP Name'}
                    data={this.state.listFilterSP}
                    value={this.state.keywordSP}
                    onChangeText={text => {
                      this.filterSP(text);
                    }}
                    renderItem={({item}) => {
                      return <TouchableOpacity style={{backgroundColor: 'white'}}
                                              onPress={() => {
                                                console.log('ischangesp', item)
                                                this.setState({
                                                  sp: item,
                                                  spName: item.pocName,
                                                  spId: item.id,
                                                  keywordSP: item.pocName,
                                                  listFilterSP: [],
                                                  spEmail: item.pocEmail,
                                                  spPhone: item.pocMobile,
                                                });
                                              }}>
                        <Text style={{margin: 10, fontFamily: FontNames.RobotoRegular}}>{item.pocName}</Text>
                      </TouchableOpacity>
                    }}
                  />
                  <View style={{ marginTop: 10 }}>
                    <TextInputWithTitle
                      placeholder="SP Email"
                      title="SP Email"
                      editable={false}
                      value={this.state.spEmail}
                    />
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <TextInputWithTitle
                      placeholder="SP Phone"
                      title="SP Phone"
                      editable={false}
                      value={this.state.spPhone}
                    />
                  </View>
                </View>
              </View>
            ) : (
                <View />
              )}

            {this.state.isSPChangeTrainer ? (
              <View style={{ marginTop: 10 }}>
                <DropdownInput
                  title={"Assign Trainer"}
                  placeholder={"Assign Trainer"}
                  dataSource={this.state.trainers}
                  fieldShow={"name"}
                  value={this.state.trainerName}
                  onSelected={item => {
                    this.setState({
                      trainer: item,
                      trainerName: item.name,
                      trainerId: item.id
                    });
                  }}
                />
              </View>
            ) : (
                <View />
              )}

            {this.state.isTrainerChangeTrainer ? (
              <View style={{ marginTop: 10 }}>
                <DropdownInput
                  title={"Assign Trainer"}
                  placeholder={"Assign Trainer"}
                  dataSource={this.state.trainers}
                  fieldShow={"name"}
                  value={this.state.trainerName}
                  onSelected={item => {
                    this.setState({
                      trainer: item,
                      trainerName: item.name,
                      trainerId: item.id
                    });
                  }}
                />
              </View>
            ) : (
                <View />
              )}

            {this.state.isAlternateSite ? (
              <View style={{ marginTop: 10 }}>
                <TextInputWithTitle
                  placeholder="Alternate Site"
                  title="Alternate Site"
                  changeText={value => {
                    this.setState({ alternativeSite: value });
                  }}
                  value={this.state.alternativeSite}
                />
              </View>
            ) : (
                <View />
              )}

            {this.state.isAEDLocation ? (
              <View style={{ marginTop: 10 }}>
                <TextInputWithTitle
                  placeholder="AED Location"
                  title="AED Location"
                  changeText={value => {
                    this.setState({ aedLocation: value });
                  }}
                  value={this.state.aedLocation}
                />
              </View>
            ) : (
                <View />
              )}
            {this.state.isRam ? (
              <View>
                <Text
                  style={{
                    color: AppColors.black2,
                    fontSize: 12,
                    fontFamily: FontNames.RobotoMedium,
                    marginTop: 10,
                    marginBottom: 5
                  }}
                >
                  RAM
                </Text>
                <DateTimeInputWithTitle
                  placeholder={"RAM"}
                  mode={"date"}
                  tailIcon={Images.dateIcon}
                  changeText={text => {
                    this.setState({ ram: this.formatDate(text) });
                  }}
                  date={this.state.ram ? this.state.ram : ""}
                />
              </View>
            ) : (
                <View />
              )}

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
                      fontFamily: FontNames.RobotoMedium,
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

            {this.state.isChangeApply && !this.state.disableApply ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    applyAllSessions: !this.state.applyAllSessions
                  });
                }}
                style={{ height: 40, flexDirection: "row", marginTop: 10 }}
              >
                <Checkbox
                  normalIcon={Images.blankIcon}
                  highlightIcon={Images.checked2Icon}
                  active={this.state.applyAllSessions}
                  onPress={() => {
                    this.setState({
                      applyAllSessions: !this.state.applyAllSessions
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
                  Apply for all sessions
                </Text>
              </TouchableOpacity>
            ) : (
                <View />
              )}
          </View>
        </ScrollView>
        <View style={{ justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: AppColors.buttonColor,
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
              fontFamily: FontNames.RobotoMedium
            }}
            onPress={() => {
              this.onUpdateRequestDetail();
            }}
          >
            <Text style={{ color: AppColors.titleButtonColor }}>UPDATE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(
  state => ({
    userInfo: state.auth.userInfo,
    requests: state.request.requests,
    filterDateRange: state.request.filterDateRange,
    filterData: state.request.filterData,
    columns: state.request.columns,
    searchKey: state.request.searchKey
  }),
  dispatch =>
    bindActionCreators(
      {
        showLoading: visible => dispatch(showLoading(visible)),
        getRequestsAction
      },
      dispatch
    )
)(UpdateRequestContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: AppColors.lightGray1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  },
  buttonText: {
    color: AppColors.grayTextColor,
    fontFamily: FontNames.RobotoBold,
    fontSize: 12
  },
  breakLine: {
    height: 1,
    backgroundColor: "rgba(180, 180, 180, 0.5)"
  }
});



// {item.frequency == WEEKLY || item.frequency == MONTHLY ? (
//   item.frequency == WEEKLY ? (
//     <View>
//       <TextInputWithoutTitle
//         placeholder="Date"
//         value={this.state.dateDefault ? this.state.dateDefault : ""}
//         editable={false}
//       />
//       <CalendarStrip
//         calendarAnimation={{ type: "sequence", duration: 10 }}
//         daySelectionAnimation={{
//           type: "background",
//           duration: 100,
//           highlightColor: AppColors.blueBackgroundColor
//         }}
//         style={{ height: 100, paddingTop: 5, paddingBottom: 5 }}
//         calendarHeaderStyle={{ color: "black" }}
//         calendarColor={"white"}
//         dateNumberStyle={{ color: "black" }}
//         dateNameStyle={{ color: "black" }}
//         highlightDateNameStyle={{ color: "white" }}
//         highlightDateNumberStyle={{ color: "white" }}
//         leftSelector={[]}
//         rightSelector={[]}
//         selectedDate={moment(this.state.date, "DD/MM/YYYY")}
//         onDateSelected={value => {
//           console.log(
//             "date selected",
//             moment(value).format("DD/MM/YYYY")
//           );
//           this.setState({ date: this.formatDate(value) });
//         }}
//         useIsoWeekday={false}
//         startingDate={moment(moment(this.state.date, "DD/MM/YYYY")).startOf('week')}
//       />
//     </View>
//   ) : (
//       <View>
//         <TextInputWithoutTitle
//           placeholder="Date"
//           value={this.state.dateDefault ? this.state.dateDefault : ""}
//           editable={false}
//         />
//         <CalendarStrip
//           calendarAnimation={{ type: "sequence", duration: 10 }}
//           daySelectionAnimation={{
//             type: "background",
//             duration: 100,
//             highlightColor: AppColors.blueBackgroundColor
//           }}
//           style={{ height: 100, paddingTop: 5, paddingBottom: 5 }}
//           calendarHeaderStyle={{ color: "black" }}
//           calendarColor={"white"}
//           dateNumberStyle={{ color: "black" }}
//           dateNameStyle={{ color: "black" }}
//           highlightDateNameStyle={{ color: "white" }}
//           highlightDateNumberStyle={{ color: "white" }}
//           onDateSelected={value => {
//             console.log(
//               "date selected",
//               moment(value).format("DD/MM/YYYY")
//             );
//             this.setState({ date: this.formatDate(value) });
//           }}
//           selectedDate={moment(this.state.date, "DD/MM/YYYY")}
//           datesWhitelist={[
//             {
//               start: moment(this.state.startDate, "DD/MM/YYYY"),
//               end: moment(this.state.endDate, "DD/MM/YYYY")
//             }
//           ]}
//           useIsoWeekday={false}
//           startingDate={moment(this.state.startDate, "DD/MM/YYYY")}
//           leftSelector={[]}
//           rightSelector={[]}
//         />
//       </View>
//     )
// ) : (
//     <DateTimeInputWithTitle
//       placeholder={"Start Date"}
//       mode={"date"}
//       tailIcon={Images.dateIcon}
//       changeText={text => {
//         this.setState({ date: this.formatDate(text) });
//         const dateF = moment(text)
//           .format("DD/MM/YYYY")
//           .toString();
//         if (item.frequency == DAILY || item.frequency == "") {
//           if (
//             Date.parse(moment(dateF, "DD/MM/YYYY")) !=
//             Date.parse(
//               moment(this.state.dateDefault, "DD/MM/YYYY")
//             )
//           ) {
//             this.setState({
//               disableApply: true,
//               applyAllSessions: false
//             });
//           } else {
//             this.setState({ disableApply: false });
//           }
//         }
//       }}
//       date={this.state.date ? this.state.date : ""}
//       disable={this.state.disableDate}
//     />
//   )}


// { this.state.isChangeRequestType && <View style={{ marginTop: 10 }}>
//               <DropdownInput
//                 title={"Select Request Type"}
//                 placeholder={"Select Request Type"}
//                 dataSource={requestType}
//                 fieldShow={"value"}
//                 value={this.state.requestTypeItem.value}
//                 onSelected={item => {
//                   this.setState({ requestTypeItem: item });
//                 }}
//               />
//             </View> }