import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RouteKey } from "../../../contants/route-key";
import { Images } from "../../../theme/images";
import { AppColors } from "../../../theme/colors";
import { FontNames } from "../../../theme/fonts";
import Avatar from "../../../common/Avatar";
import moment from "moment";
import ItemDashboard from "./ItemDashboard";
import { pushNav, resetNav, replaceNav } from "../../../actions/navigate";
import {
  filterDataAction,
  filterDateRangeAction
} from "../../../actions/request";
import {
  RoleType,
  FilterDashBoardStatus
} from "../../../contants/profile-field";
import { getDashboardData } from "../../../services/requestService";
import { showLoading } from "../../../actions/app";

var get = require("lodash.get");

class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dashboards: {}
    };
  }

  componentDidMount() {
    this._getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dashboard != nextProps.dashboard) {
      this.setState({
        dashboards: nextProps.dashboard
      });
    }
  }

  _getData = () => {
    this.props.showLoading(true);
    getDashboardData().then(response => {
      this.props.showLoading(false);
      if (response.statusCode === 200) {
        console.log("dashboards item", response.data);
        this.setState({ dashboards: response.data });
      } else {
        if (
          response.statusCode === 400 &&
          response.message == "Token does not exist"
        ) {
          this.props.resetNav("Login");
        }
      }
    });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    getDashboardData().then(response => {
      this.setState({ refreshing: false });
      if (response.statusCode === 200) {
        this.setState({ dashboards: response.data });
      } else {
        if (
          response.statusCode === 400 &&
          response.message == "Token does not exist"
        ) {
          this.props.resetNav("Login");
        }
      }
    });
  };

  checkDate = item => {
    let isToday = false;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var today = dd + "/" + mm + "/" + yyyy;

    let itemDate = Date.parse(moment(item.startDate, "DD/MM/YYYY"));
    let currentDate = Date.parse(moment(today, "DD/MM/YYYY"));
    if (itemDate == currentDate) {
      isToday = true;
    }
    return isToday;
  };

  renderItem = ({ item, index }) => {
    return (
      <ItemDashboard
        item={item}
        index={index}
        today={this.checkDate(item)}
        onPressItem={() => {
          this.props.pushNav(RouteKey.ViewRequestDetail, { id: item.id });
        }}
      />
    );
  };

  onResetFilter = () => {
    let programs = this.props.lstFilterData.programs.map(program => {
      if (!program.selected) {
        program.selected = true;
      }
      return program;
    });

    let status = this.props.lstFilterData.status.map(stt => {
      if (!stt.selected) {
        stt.selected = true;
      }
      return stt;
    });

    let districts = this.props.lstFilterData.districts.map(district => {
      if (!district.selected) {
        district.selected = true;
      }
      return district;
    });

    let grcs = this.props.lstFilterData.grcs.map(grc => {
      if (!grc.selected) {
        grc.selected = true;
      }
      return grc;
    });

    let divisions = this.props.lstFilterData.divisions.map(division => {
      if (!division.selected) {
        division.selected = true;
      }
      return division;
    });

    let lstFilterData = {
      programs: programs,
      districts: districts,
      grcs: grcs,
      divisions: divisions,
      status: status,
      isActFilterProgram: false,
      isActFilterStatus: false,
      isActFilterDistrict: false,
      isActFilterDivision: false,
      isActFilterGRC: false
    };

    let lstFilterRangeData = {
      endDate: "",
      range: "",
      startDate: ""
    };

    this.props.filterDataAction(lstFilterData);
    this.props.filterDateRangeAction(lstFilterRangeData);
  };

  navigateToRequestList = status => {
    this.onResetFilter();
    this.props.replaceNav(RouteKey.ListRequest, {
      dashboardstatus: status
    });
  };

  render() {
    let { userInfo } = this.props;
    let { dashboards } = this.state;
    let name =
      userInfo && userInfo.pocName && userInfo.pocName != ""
        ? userInfo.pocName
        : get(userInfo, "name", "");
    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 2
              }}
            >
              <Avatar size={46} />
            </View>
            <View style={{ flex: 8 }}>
              <View style={{ marginLeft: 20, justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: FontNames.RobotoMedium,
                    fontSize: 18
                  }}
                >
                  {"Welcome, " + name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  marginTop: 5,
                  marginLeft: 20
                }}
              >
                <View
                  style={{
                    width: 120,
                    borderColor: AppColors.grayTextColor,
                    borderWidth: 0.7,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      marginTop: 3,
                      marginBottom: 3
                    }}
                  >
                    {get(userInfo, "typeRole", "")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: AppColors.blackTextColor,
              fontSize: 14,
              fontFamily: FontNames.RobotoBold,
              marginTop: 15,
              marginBottom: 5
            }}
          >
            QUICK SHORTCUT
          </Text>

          <View style={{ flexDirection: "row" }}>
            {(userInfo && userInfo.typeRole == RoleType.SP) ||
            userInfo.typeRole == RoleType.Trainer ||
            userInfo.typeRole == RoleType.PL ? (
              <View />
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.pushNav(RouteKey.CreateNewRequestScreen);
                }}
                style={{
                  height: 80,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  marginRight: 5
                }}
              >
                <Image
                  source={Images.addSolicIcon}
                  style={{ width: 24, height: 24 }}
                />
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: FontNames.RobotoMedium,
                    fontSize: 12,
                    color: "#666666"
                  }}
                >
                  Submit Request
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.navigateToRequestList("");
              }}
              style={{
                height: 80,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                marginLeft: 5,
                marginRight: 5
              }}
            >
              <Image
                source={Images.requestBlueIcon}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: FontNames.RobotoMedium,
                  fontSize: 12,
                  color: "#666666"
                }}
              >
                View Requests
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this.props.pushNav(RouteKey.Analytic);
              }}
              style={{
                height: 80,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                marginLeft: 5
              }}
            >
              <Image
                source={Images.analyticSmallIcon}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: FontNames.RobotoMedium,
                  fontSize: 12,
                  color: "#666666"
                }}
              >
                View Analytics
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: AppColors.blackTextColor,
              fontSize: 14,
              fontFamily: FontNames.RobotoBold,
              marginTop: 15,
              marginBottom: 5
            }}
          >
            ACTIVITY SUMMARY
          </Text>

          {dashboards && dashboards.activitySummary ? (
            <View
              style={{
                justifyContent: "center",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start"
              }}
            >
              {get(dashboards, "activitySummary.numberConfirmedBlock", "") !==
              null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(FilterDashBoardStatus.CONFIRMED);
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#7ed321",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardConfirmIcon}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.numberConfirmedBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Confirmed
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {get(dashboards, "activitySummary.numberNewRequestsBlock", "") !==
              null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.NEW_REQUESTS
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5a623",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardNewRequest}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white",
                      justifyContent: "center"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.numberNewRequestsBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    New Requests
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {get(
                dashboards,
                "activitySummary.numberChangeRequestsBlock",
                ""
              ) !== null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.CHANGE_REQUESTS
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#3b79bf",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardChangeRequest}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.numberChangeRequestsBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Change{"\n"} Requests
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {get(
                dashboards,
                "activitySummary.numberPendingTrainerConfirmationBlock",
                ""
              ) !== null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.PENDING_TRAINER
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5a623",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardTrainerIcon}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary
                        .numberPendingTrainerConfirmationBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Pending Trainer Confirmation
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {get(
                dashboards,
                "activitySummary.numberUpcomingActivitiesBlock",
                ""
              ) !== null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.UPCOMING_ACTIVITIES
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#7ed321",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardUpcomingIcon}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.numberUpcomingActivitiesBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Upcoming Activities
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {get(dashboards, "activitySummary.numberNonCheckinBlock", "") !==
              null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.NON_CHECK_IN
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#7961ca",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardNonCheckinIcon}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.numberNonCheckinBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      justifyContent: "center"
                    }}
                  >
                    Non Check-in
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {get(
                dashboards,
                "activitySummary.numberUnacknowledgedReminderBlock",
                ""
              ) !== null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.UNACKNOWLEDGED_REMINDER
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#84a3a7",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardUnacknowledgedIcon}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary
                        .numberUnacknowledgedReminderBlock}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Unacknowledged Reminder
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {get(dashboards, "activitySummary.numberRenewCpap", "") !==
              null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.RENEW_CPAP
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#84a3a7",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardUnacknowledgedIcon}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.numberRenewCpap}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Row Number Reference
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {get(dashboards, "activitySummary.yetToCheckIn2Hour", "") !==
              null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.YET_TO_CHECK_IN
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#7961ca",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardNonCheckinIcon}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.yetToCheckIn2Hour}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      justifyContent: "center"
                    }}
                  >
                    Pending Check-in
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              {get(dashboards, "activitySummary.yetToAcknowledge", "") !==
              null ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    this.navigateToRequestList(
                      FilterDashBoardStatus.YET_TO_ACKNOWLEDGE
                    );
                  }}
                  style={{
                    height: 110,
                    width: 95,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#84a3a7",
                    margin: 4
                  }}
                >
                  <Image
                    source={Images.dashboardUnacknowledgedIcon}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontFamily: FontNames.RobotoMedium,
                      fontSize: 24,
                      color: "white"
                    }}
                  >
                    {dashboards &&
                      dashboards.activitySummary &&
                      dashboards.activitySummary.yetToAcknowledge}
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: FontNames.RobotoLight,
                      fontSize: 12,
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Reminder Activities
                  </Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8"
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 4,
    flexDirection: "row"
  }
});

export default connect(
  state => ({
    programTypes: state.app.programTypes,
    districts: state.app.districts,
    grcs: state.app.grcs,
    divisions: state.app.divisions,
    userInfo: state.auth.userInfo,
    dashboards: state.request.dashboards,
    lstFilterData: state.request.filterData,
    dashboard: state.app.dashboard
  }),
  dispatch =>
    bindActionCreators(
      {
        pushNav,
        resetNav,
        filterDataAction,
        showLoading,
        replaceNav,
        filterDateRangeAction
      },
      dispatch
    )
)(DashBoard);
