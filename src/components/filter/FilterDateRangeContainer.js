import React, {Component} from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Images} from "../../theme/images";
import {FontNames} from "../../theme/fonts";
import {AppColors} from "../../theme/colors";
import FilterHeader from "./presenters/FilterHeader";
import DateTimeInputWithTitle from "../../common/DateTimeInputWithTitle";
import moment from "moment";
import {
  filterDateRangeAction,
  getRequestsAction
} from "../../actions/request";
import {Message} from "../../common/Message";
import {showMessage} from "../../common/Message";
var get = require("lodash.get");

const TODAY = "TODAY";
const YESTERDAY = "YESTERDAY";
const THIS_WEEK = "THIS WEEK";
const THIS_MONTH = "THIS MONTH";
const PAST_3_MONTHS = "PAST 3 MONTHS";

class FilterDateRangeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range: "",
      startDate: "",
      endDate: ""
    };
  }

  componentDidMount() {
    let {filterDateRange} = this.props;
    if (filterDateRange) {
      this.setState({
        range: filterDateRange.range,
        startDate: filterDateRange.startDate,
        endDate: filterDateRange.endDate
      });
    }
  }

  formatDate = date => {
    if (date) {
      return moment(date).format("DD/MM/YYYY");
    }
    return "";
  };

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
      isActFilterStatus ? status : [], this.state.startDate,
      this.state.endDate, searchDetail, 0, true,
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FilterHeader
          title={"SET ACTIVITY DATE RANGE"}
          leftAction={() => {
            this.props.navigation.goBack();
          }}
          rightAction={() => {
            lstFilterDateRange = {
              range: this.state.range,
              startDate: this.state.startDate,
              endDate: this.state.endDate
            };
            if (this.state.startDate && this.state.endDate) {
              if (this.state.startDate == '' || this.state.endDate == '') {
                showMessage("Please selected Start Date and End Date");
              } else {
                if (
                  Date.parse(moment(this.state.startDate, "DD/MM/YYYY")) > Date.parse(moment(this.state.endDate, "DD/MM/YYYY"))
                ) {
                  showMessage("End Date must be greater than Start Date");
                } else {
                  this.props.filterDateRangeAction(lstFilterDateRange);
                  // this.searchRequest();
                  // this.props.navigation.goBack();
                  let value = '';

                  const navParams = this.props.navigation.state.params
                  if (navParams && get(navParams, 'dashboardstatus', '')) {
                    value = get(navParams, 'dashboardstatus', '')
                  }
                  
                  setTimeout(() => {
                    this.props.navigation.state.params.onGoBack(value);
                    this.props.navigation.goBack();
                  }, 1000)
                }
              }
            } else {
              showMessage("Please selected Start Date and End Date");
            }
          }}
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={{marginLeft: -24, marginRight: -24}}>
              <Message />
            </View>
            <Text
              style={{
                color: AppColors.registerTitleColor,
                fontSize: 14,
                fontFamily: FontNames.RobotoBold,
                marginTop: 30,
                marginBottom: 5
              }}
            >
              CUSTOM RANGE
            </Text>
            <DateTimeInputWithTitle
              placeholder={"Start Date"}
              mode={"date"}
              tailIcon={Images.dateIcon}
              changeText={text => {
                this.setState({startDate: this.formatDate(text)});
              }}
              date={this.state.startDate}
            />
            <DateTimeInputWithTitle
              placeholder={"End Date"}
              mode={"date"}
              tailIcon={Images.dateIcon}
              changeText={text => {
                this.setState({endDate: this.formatDate(text)});
              }}
              date={this.state.endDate}
            />
            <Text
              style={{
                color: AppColors.registerTitleColor,
                fontSize: 14,
                fontFamily: FontNames.RobotoBold,
                marginTop: 30,
                marginBottom: 5
              }}
            >
              QUICK RANGE
            </Text>
            <View style={{flexDirection: "row", height: 44, marginTop: 10}}>
              <View style={{flex: 1, marginRight: 5}}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        this.state.range === TODAY
                          ? AppColors.buttonColor
                          : AppColors.lightGray1
                    }
                  ]}
                  onPress={() => {
                    let date = moment(new Date());
                    this.setState({
                      range: TODAY,
                      startDate: this.formatDate(date),
                      endDate: this.formatDate(date)
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          this.state.range === TODAY
                            ? AppColors.whiteTitle
                            : AppColors.grayTextColor
                      }
                    ]}
                  >
                    TODAY
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        this.state.range === YESTERDAY
                          ? AppColors.buttonColor
                          : AppColors.lightGray1
                    }
                  ]}
                  onPress={() => {
                    let date = moment()
                      .subtract(1, "days")
                      .startOf("day");
                    this.setState({
                      range: YESTERDAY,
                      startDate: this.formatDate(date),
                      endDate: this.formatDate(date)
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          this.state.range === YESTERDAY
                            ? AppColors.whiteTitle
                            : AppColors.grayTextColor
                      }
                    ]}
                  >
                    YESTERDAY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flexDirection: "row", height: 44, marginTop: 10}}>
              <View style={{flex: 1, marginRight: 5}}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        this.state.range === THIS_WEEK
                          ? AppColors.buttonColor
                          : AppColors.lightGray1
                    }
                  ]}
                  onPress={() => {
                    let strDate = moment().day("Monday");
                    let eDate = moment().day("Friday");
                    this.setState({
                      range: THIS_WEEK,
                      startDate: this.formatDate(strDate),
                      endDate: this.formatDate(eDate)
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          this.state.range === THIS_WEEK
                            ? AppColors.whiteTitle
                            : AppColors.grayTextColor
                      }
                    ]}
                  >
                    THIS_WEEK
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        this.state.range === THIS_MONTH
                          ? AppColors.buttonColor
                          : AppColors.lightGray1
                    }
                  ]}
                  onPress={() => {
                    let date = new Date();
                    let firstDay = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      1
                    );
                    let lastDay = new Date(
                      date.getFullYear(),
                      date.getMonth() + 1,
                      0
                    );
                    let strDate = moment(firstDay);
                    let eDate = moment(lastDay);
                    this.setState({
                      range: THIS_MONTH,
                      startDate: this.formatDate(strDate),
                      endDate: this.formatDate(eDate)
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          this.state.range === THIS_MONTH
                            ? AppColors.whiteTitle
                            : AppColors.grayTextColor
                      }
                    ]}
                  >
                    THIS_MONTH
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flexDirection: "row", height: 44, marginTop: 10}}>
              <View style={{flex: 1, marginRight: 5}}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        this.state.range === PAST_3_MONTHS
                          ? AppColors.buttonColor
                          : AppColors.lightGray1
                    }
                  ]}
                  onPress={() => {
                    let date = new Date();
                    let firstDay = moment()
                      .subtract(2, "months")
                      .startOf("month");
                    let lastDay = new Date(
                      date.getFullYear(),
                      date.getMonth() + 1,
                      0
                    );
                    let strDate = moment(firstDay);
                    let eDate = moment(lastDay);
                    this.setState({
                      range: PAST_3_MONTHS,
                      startDate: this.formatDate(strDate),
                      endDate: this.formatDate(eDate)
                    });
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          this.state.range === PAST_3_MONTHS
                            ? AppColors.whiteTitle
                            : AppColors.grayTextColor
                      }
                    ]}
                  >
                    PAST_3_MONTHS
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1, marginLeft: 5}} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => ({
    filterDateRange: state.request.filterDateRange,
    filterData: state.request.filterData,
    columns: state.request.columns,
    searchKey: state.request.searchKey
  }),
  dispatch =>
    bindActionCreators(
      {
        filterDateRangeAction,
        getRequestsAction
      },
      dispatch
    )
)(FilterDateRangeContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    marginLeft: 24,
    marginRight: 24,
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
  }
});
