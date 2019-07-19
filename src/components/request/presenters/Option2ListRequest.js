import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  Keyboard,
  Alert
} from "react-native";

var get = require("lodash.get");
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as ProgramTypes from "../../../contants/program-types";
import { Images } from "../../../theme/images";
import { FontNames } from "../../../theme/fonts";
import { AppColors } from "../../../theme/colors";
import CircleButton from "../../../common/CircleButton";
import CheckBox from "../../../common/Checkbox";
import SearchInput from "../../../common/SearchInput";
import { RouteKey } from "../../../contants/route-key";
import {
  RoleType,
  RequestType,
  Roles,
  AvailableRequestStatusKey,
  AvailableRequestStatusValue
} from "../../../contants/profile-field";
import {
  getRequestsAction,
  inputSearchKey,
  saveColumnsSetting,
  ActionRequestType,
  clearRequestData
} from "../../../actions/request";
import { pushNav } from "../../../actions/navigate";
import ButtonWithIcon from "../../../common/ButtonWithIcon";
import { SafeAreaView } from "react-navigation";
import {
  approveCancelRequest,
  cancelRequest,
  hpmCancelRequest,
  exportExcel,
  revertCancelRequest
} from "../../../services/requestService";
import ConfirmationModal from "../../../common/ConfirmationModalComponent";
import { Status, DuplicateStatus } from "../../../common/Status";
import RequestHelper from "../../helper/RequestHelper";
import { isEmpty } from "../../../utils/utils";
import moment from "moment";
import { showLoading } from "../../../actions/app";
import Toast from "@remobile/react-native-toast";

let rejectMsgPopup = "Are you sure you want to reject the request?";
let cancelMsgPopup = "";
let allRelatedRequestMsg = "Apply to all future events of this series.";

const CHECK_IN = "CHECK_IN";
const READY = "READY";
const END_SESSION = "END_SESSION";

export const AlertButton = props => {
  let { title, titleColor, buttonColor, action, width, style } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.btn,
        { width: width },
        { backgroundColor: buttonColor },
        style
      ]}
      onPress={() => {
        action && action();
      }}
    >
      <Text style={[styles.titleBtn, { color: titleColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export const MoreButton = props => {
  let { action } = props;
  return (
    <TouchableOpacity
      style={{ padding: 5 }}
      onPress={() => {
        action && action();
      }}
    >
      <Image
        style={{ width: 20, height: 20 }}
        source={Images.moreIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

class ColumnFilter extends PureComponent {
  render() {
    let { item, action } = this.props;
    return (
      <TouchableOpacity
        style={styles.rowSetting}
        onPress={() => action && action(item.value)}
      >
        <CheckBox
          normalIcon={Images.blankIcon}
          highlightIcon={Images.checked2Icon}
          active={item.selected}
          onPress={() => action && action(item.value)}
        />
        <Text
          style={{
            fontFamily: FontNames.RobotoRegular,
            fontSize: 16,
            color: AppColors.black60TextColor,
            marginLeft: 12
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }
}

class Option2ListRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      columns: [],
      selectedRowId: "",

      selectedFilterBtn: false,
      selectedCheckAllBtn: false,
      selectedSettingBtn: false,

      selectedRequests: [],
      enableSearchInput: false,
      keyword: "",
      searchData: {},
      refreshing: false,

      showOutOfItimeMessage: "",
      showPartnerAction: false,
      showAction: false,
      isShowButtonReview: false,
      isShowButtonChange: false,
      showAlertCancel: false,
      isAllowAll: false,
      isShowActionCancel: false,
      isPendingChange: false,

      isShowButtonTrainerAcknowledged: false,
      isShowButtonTrainerCheckIn: false,

      enableReasonCancelRequestInput: false,
      reasonCancelRequest: "",
      errMsgForCancelRequest: "",

      showConfirmRejectPopup: false,
      warningApplyFilter: false
    };

    this.searchInput = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidMount() {
    this.getData(0, true);

    let convertedColumns =
      this.state.columns.length == 0
        ? this.initColumnFilter()
        : this.state.columns;

    this.state.columns.length == 0 &&
      this.setState({ columns: convertedColumns });
  }

  initColumnFilter = () => {
    return ProgramTypes.Fields
      ? ProgramTypes.Fields.map(item => {
          switch (item.value) {
            case ProgramTypes.PropertyName.grcName:
            case ProgramTypes.PropertyName.divisionName:
            case ProgramTypes.PropertyName.partnerName:
            case ProgramTypes.PropertyName.programTypeName:
            case ProgramTypes.PropertyName.activityName:
            case ProgramTypes.PropertyName.date:
            case ProgramTypes.PropertyName.spName:
            case ProgramTypes.PropertyName.spHandPhone:
            case ProgramTypes.PropertyName.spEmail:
            case ProgramTypes.PropertyName.dayOfWeek: {
              return { ...item, selected: true };
            }
            default: {
              return { ...item, selected: false };
            }
          }
        })
      : [];
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.data != nextProps.data && this.state.selectedCheckAllBtn) {
      this.setState({
        selectedCheckAllBtn: false
      });
    }
  }

  renderTopHeader = () => {
    let { filterDateRange, pushNav } = this.props;
    return (
      <View style={styles.topHeaderContainer}>
        <Image
          style={{ width: 20, height: 20 }}
          source={Images.dateIcon}
          resizeMode="contain"
        />
        {filterDateRange && filterDateRange.startDate ? (
          <Text style={styles.dateRangeTxt}>
            {filterDateRange.startDate + " - " + filterDateRange.endDate}
          </Text>
        ) : (
          <Text style={styles.dateRangeTxt}>Activity Date Range</Text>
        )}
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ height: 52, justifyContent: "center" }}
          onPress={() => {
            this.props.pushNav(RouteKey.FilterDateRange, {
              dashboardstatus: get(
                this.props.navigation.state.params,
                "dashboardstatus",
                ""
              ),
              onGoBack: value => {
                this.setState({ warningApplyFilter: false });
                if (value && value != "") {
                  this.getRequest(0, true);
                } else {
                  if (
                    this.state.keyword !== "" ||
                    this.props.filterData.isActFilterStatus ||
                    this.props.filterData.isActFilterDistrict ||
                    this.props.filterData.isActFilterDivision ||
                    this.props.filterData.isActFilterGRC ||
                    this.props.filterData.isActFilterProgram ||
                    this.props.filterDateRange.startDate !== ""
                  ) {
                    this.getRequest(0, true);
                    this.setState({ warningApplyFilter: false });
                  } else {
                    this.setState({ warningApplyFilter: true });
                  }
                }
              }
            });
          }}
        >
          <Text style={styles.setRangeTitle}>Set Range</Text>
        </TouchableOpacity>
      </View>
    );
  };

  getIdsForSearching = data => {
    let ids = [];
    data
      .filter(item => item.selected)
      .map(item => {
        ids.push(item.id);
      });

    return ids;
  };

  getData = (page, showLoading) => {
    let value = "";

    const navParams = this.props.navigation.state.params;
    if (navParams && get(navParams, "dashboardstatus", "")) {
      value = get(navParams, "dashboardstatus", "");
    }

    this.setState({ warningApplyFilter: false });
    if (value && value != "") {
      this.getRequest(page, showLoading);
    } else {
      if (
        this.state.keyword !== "" ||
        this.props.filterData.isActFilterStatus ||
        this.props.filterData.isActFilterDistrict ||
        this.props.filterData.isActFilterDivision ||
        this.props.filterData.isActFilterGRC ||
        this.props.filterData.isActFilterProgram ||
        this.props.filterDateRange.startDate !== ""
      ) {
        this.getRequest(page, showLoading);
        this.setState({ warningApplyFilter: false });
      } else {
        this.setState({ warningApplyFilter: true });
      }
    }
  };

  getRequest = (page, showLoading) => {
    let searchDetail = [];
    let value = "";

    const navParams = this.props.navigation.state.params;
    if (navParams && get(navParams, "dashboardstatus", "")) {
      value = get(navParams, "dashboardstatus", "");
      value && searchDetail.push({ key: "dashboardstatus", value: value });
    }

    this.state.keyword &&
      this.state.columns
        .filter(item => item.selected == true)
        .map(item => {
          return searchDetail.push({
            key: item.value,
            value: this.state.keyword
          });
        });

    this.state.keyword &&
      searchDetail.push({
        key: "requestDetailNo",
        value: this.state.keyword
      });

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

    //Filter data
    grcIds = this.props.filterData.isActFilterGRC ? grcIds : [];
    districtsIds = this.props.filterData.isActFilterDistrict
      ? districtsIds
      : [];
    programsIds = this.props.filterData.isActFilterProgram ? programsIds : [];
    divsionsIds = this.props.filterData.isActFilterDivision ? divsionsIds : [];
    status = this.props.filterData.isActFilterStatus ? status : [];

    let startDate = get(this.props, "filterDateRange.startDate", "");
    let endDate = get(this.props, "filterDateRange.endDate", "");

    this.props.getRequestsAction(
      programsIds,
      grcIds,
      districtsIds,
      divsionsIds,
      status,
      startDate,
      endDate,
      searchDetail,
      page,
      showLoading
    );
  };

  onExportExcel = () => {
    let searchDetail = [];
    let columnExportName = [];

    const navParams = this.props.navigation.state.params;
    if (navParams && get(navParams, "dashboardstatus", "")) {
      let value = get(navParams, "dashboardstatus", "");
      value && searchDetail.push({ key: "dashboardstatus", value: value });
    }
    console.log("searchDetail", searchDetail);

    this.state.keyword &&
      this.state.columns
        .filter(item => item.selected == true)
        .map(item => {
          return searchDetail.push({
            key: item.value,
            value: this.state.keyword
          });
        });

    this.state.columns
      .filter(item => item.selected == true)
      .map(item => {
        return columnExportName.push({
          key: item.value,
          title: item.label
        });
      });

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

    // Filter data
    grcIds = this.props.filterData.isActFilterGRC ? grcIds : [];
    districtsIds = this.props.filterData.isActFilterDistrict
      ? districtsIds
      : [];
    programsIds = this.props.filterData.isActFilterProgram ? programsIds : [];
    divsionsIds = this.props.filterData.isActFilterDivision ? divsionsIds : [];
    status = this.props.filterData.isActFilterStatus ? status : [];

    let startDate = get(this.props, "filterDateRange.startDate", "");
    let endDate = get(this.props, "filterDateRange.endDate", "");

    let model = {
      programId: programsIds,
      grcId: grcIds,
      districtId: districtsIds,
      divisionId: divsionsIds,
      status: status,
      startDate: startDate,
      endDate: endDate,
      searchDetail: searchDetail,
      repeatType: null,
      reminder: null,
      checkIn: null,
      sortDetail: null,
      isSearchOfMobile: true,
      columnExportName: columnExportName,
      pageIndex: 0,
      pageSize: this.props.totalItem,
      search: ""
    };
    console.log("onExportExcel", model);
    console.log("JSON onExportExcel --->", JSON.stringify(model));

    this.props.showLoading(true);
    exportExcel(model).then(res => {
      this.props.showLoading(false);
      if (res.statusCode === 200) {
        Toast.showShortBottom("Send selected list to your email");
      } else {
        Toast.showShortBottom(res.message);
      }
    });
  };

  goActionHandle = () => {
    this.props.inputSearchKey(this.state.keyword);
    this.getData(0, true);
  };

  closeActionHandle = () => {
    this.setState({
      keyword: ""
    });
    this.searchInput.current.searchInput.current.blur();
    this.props.inputSearchKey("");
  };

  backActionHandle = () => {
    this.setState(
      {
        keyword: "",
        enableSearchInput: false
      },
      () => {
        this.getData(0, true);
      }
    );
    this.searchInput.current.searchInput.current.blur();
    this.props.inputSearchKey("");
  };

  renderFilterHeader = () => {
    return (
      <View style={styles.headerContainer}>
        {this.state.enableSearchInput && (
          <CircleButton
            normalIcon={Images.backIcon}
            highlightIcon={Images.backIcon}
            action={() => {
              this.backActionHandle();
            }}
            style={{
              marginRight: 2
            }}
          />
        )}
        <SearchInput
          ref={this.searchInput}
          value={this.state.keyword}
          onFocus={() => {
            this.setState({
              enableSearchInput: true,
              selectedCheckAllBtn: false,
              selectColumnTitileSetting: false,
              selectedFilterBtn: false
            });
            this.props.clearRequestData();
          }}
          changeText={value => this.setState({ keyword: value })}
          goAction={this.goActionHandle}
          closeAction={this.closeActionHandle}
          enableSearchInput={this.state.enableSearchInput}
        />
        {this.state.activeCloseAction && this.props.data.length > 0 && (
          <CircleButton
            normalIcon={Images.exportExcelIcon}
            highlightIcon={Images.exportExcelIcon}
            action={() => {
              this.onExportExcel();
            }}
            style={{
              marginLeft: 2,
              marginRight: 2
            }}
          />
        )}
        {!this.state.enableSearchInput && (
          <View style={styles.groupCircleBtn}>
            <View>
              <CircleButton
                normalIcon={Images.filterIcon}
                highlightIcon={Images.filterWIcon}
                action={() => {
                  this.setState({
                    // selectedFilterBtn: !this.state.selectedFilterBtn,
                    selectedCheckAllBtn: false,
                    selectedSettingBtn: false,
                    selectedRowId: "",
                    selectedRequests: []
                  });
                  this.props.pushNav(RouteKey.Filter, {
                    dashboardstatus: get(
                      this.props.navigation.state.params,
                      "dashboardstatus",
                      ""
                    ),
                    onGoBack: value => {
                      this.setState({ warningApplyFilter: false });
                      if (value && value != "") {
                        this.getRequest(0, true);
                      } else {
                        if (
                          this.state.keyword !== "" ||
                          this.props.filterData.isActFilterStatus ||
                          this.props.filterData.isActFilterDistrict ||
                          this.props.filterData.isActFilterDivision ||
                          this.props.filterData.isActFilterGRC ||
                          this.props.filterData.isActFilterProgram ||
                          this.props.filterDateRange.startDate !== ""
                        ) {
                          this.getRequest(0, true);
                          this.setState({ warningApplyFilter: false });
                        } else {
                          this.setState({ warningApplyFilter: true });
                        }
                      }
                    }
                  });
                }}
                active={this.state.selectedFilterBtn}
                style={{ marginLeft: 2, marginRight: 2 }}
              />
              {(this.props.filterData &&
                this.props.filterData.isActFilterProgram) ||
              this.props.filterData.isActFilterStatus ||
              this.props.filterData.isActFilterDistrict ||
              this.props.filterData.isActFilterDivision ||
              this.props.filterData.isActFilterGRC ? (
                <View style={styles.statusFilter} />
              ) : (
                <View />
              )}
            </View>
            {this.checkPermissionOfAllCheckboxBtn(this.props.role)}
            <CircleButton
              normalIcon={Images.settingsIcon}
              highlightIcon={Images.settingsWIcon}
              action={() => {
                this.setState({
                  selectedSettingBtn: !this.state.selectedSettingBtn,
                  selectedFilterBtn: false,
                  selectedCheckAllBtn: false,
                  selectedRowId: "",
                  selectedRequests: []
                });
              }}
              active={this.state.selectedSettingBtn}
              style={{ marginLeft: 2, marginRight: 2 }}
            />
            <CircleButton
              normalIcon={Images.exportExcelIcon}
              highlightIcon={Images.exportExcelIcon}
              action={() => {
                this.onExportExcel();
              }}
              style={{ marginLeft: 2, marginRight: 2 }}
            />
          </View>
        )}
      </View>
    );
  };

  selectRequest = id => {
    switch (this.props.role) {
      case RoleType.SuperAdmin: {
        if (this.state.selectedCheckAllBtn) {
          let existedData = this.state.selectedRequests.find(
            item => item === id
          );
          var data = this.state.selectedRequests;
          let objs = get(this.props, "data", []);
          let firstItem = objs.find(item => item.id == get(data, "[0]", ""));
          let currentItem = objs.find(item => item.id == id);
          if (existedData) {
            var index = data.indexOf(id);

            if (index > -1) {
              let checkspId =
                get(firstItem, "spId", "") === get(currentItem, "spId", "");
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Pending &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Pending
              ) {
                data.splice(index, 1);
                this.setState({ selectedRequests: data });
                return;
              }
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Approve &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Approve
              ) {
                data.splice(index, 1);
                this.setState({ selectedRequests: data });
                return;
              }
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm
              ) {
                data.splice(index, 1);
                this.setState({ selectedRequests: data });
                return;
              }
            }
          } else {
            if (firstItem && currentItem) {
              let checkspId =
                get(firstItem, "spId", "") === get(currentItem, "spId", "");

              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Pending &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Pending
              ) {
                data.push(id);
                this.setState({ selectedRequests: data });
                return;
              }
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm
              ) {
                data.push(id);
                this.setState({ selectedRequests: data });
                return;
              }
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Approve &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Approve
              ) {
                data.push(id);
                this.setState({ selectedRequests: data });
                return;
              }
            } else {
              data.push(id);
            }
          }
          this.setState({ selectedRequests: data });
          return;
        }
        this.setState({ selectedRequests: [id] });
        return;
      }
      case RoleType.SP: {
        if (this.state.selectedCheckAllBtn) {
          let existedData = this.state.selectedRequests.find(
            item => item === id
          );
          var data = this.state.selectedRequests;
          let objs = get(this.props, "data", []);
          let firstItem = objs.find(item => item.id == get(data, "[0]", ""));
          let currentItem = objs.find(item => item.id == id);
          if (existedData) {
            var index = data.indexOf(id);

            if (index > -1) {
              let checkspId =
                get(firstItem, "spId", "") === get(currentItem, "spId", "");

              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Approve &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Approve
              ) {
                data.splice(index, 1);
                this.setState({ selectedRequests: data });
                return;
              }
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm
              ) {
                data.splice(index, 1);
                this.setState({ selectedRequests: data });
                return;
              }
            }
          } else {
            if (firstItem && currentItem) {
              let checkspId =
                get(firstItem, "spId", "") === get(currentItem, "spId", "");
              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Confirm
              ) {
                data.push(id);
                this.setState({ selectedRequests: data });
                return;
              }
              if (
                gcheckspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Approve &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Approve
              ) {
                data.push(id);
                this.setState({ selectedRequests: data });
                return;
              }
            } else {
              data.push(id);
            }
          }
          this.setState({ selectedRequests: data });
          return;
        }
        this.setState({ selectedRequests: [id] });
        return;
      }
      default: {
        if (this.state.selectedCheckAllBtn) {
          let existedData = this.state.selectedRequests.find(
            item => item === id
          );
          var data = this.state.selectedRequests;
          let objs = get(this.props, "data", []);
          let firstItem = objs.find(item => item.id == get(data, "[0]", ""));
          let currentItem = objs.find(item => item.id == id);
          if (existedData) {
            var index = data.indexOf(id);

            if (index > -1) {
              let checkspId =
                get(firstItem, "spId", "") === get(currentItem, "spId", "");

              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Pending &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Pending
              ) {
                data.splice(index, 1);
                this.setState({ selectedRequests: data });
                return;
              }
            }
          } else {
            if (firstItem && currentItem) {
              let checkspId =
                get(firstItem, "spId", "") === get(currentItem, "spId", "");

              if (
                checkspId &&
                get(firstItem, "status", "") ==
                  AvailableRequestStatusKey.Pending &&
                get(currentItem, "status", "") ==
                  AvailableRequestStatusKey.Pending
              ) {
                data.push(id);
                this.setState({ selectedRequests: data });
                return;
              }
            } else {
              data.push(id);
            }
          }
          this.setState({ selectedRequests: data });
          return;
        }
        this.setState({ selectedRequests: [id] });
        return;
      }
    }
  };

  checkRequestOfCoveringHpm = id => {
    const { userName } = this.props.userInfo;
    if (userName == "hpm@minmed" && this.props.role == RoleType.HPM) {
      return true;
    } else {
      const requestData = this.props.data.find(item => item.id === id);
      // console.log('checkRequestOfCoveringHpm', requestData);
      let isHpmCovering = get(requestData, "isHpmCovering", false);

      if (this.props.role == RoleType.HPM && isHpmCovering) return true;
      return false;
    }
  };

  checkPermissionOfCheckboxBtn = (id, role, status) => {
    const requestData = this.props.data.find(item => item.id === id);
    if (isEmpty(requestData)) return;

    let checkbox = <View />;
    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.SM:
      case RoleType.HPM:
      case RoleType.PM:
      case RoleType.DataEntry: {
        switch (status) {
          case AvailableRequestStatusKey.Pending:
          case AvailableRequestStatusKey.CancelRequest:
          case AvailableRequestStatusKey.ChangeRequest: {
            if (this.checkRequestOfCoveringHpm(id)) {
              break;
            } else {
              checkbox = (
                <CheckBox
                  normalIcon={Images.blankIcon}
                  highlightIcon={Images.checked2Icon}
                  active={this.state.selectedRequests.includes(id)}
                  onPress={() => {
                    this.selectRequest(id);
                  }}
                />
              );
            }

            break;
          }
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm: {
            if (role == RoleType.SuperAdmin) {
              checkbox = (
                <CheckBox
                  normalIcon={Images.blankIcon}
                  highlightIcon={Images.checked2Icon}
                  active={this.state.selectedRequests.includes(id)}
                  onPress={() => {
                    this.selectRequest(id);
                  }}
                />
              );
            }
            break;
          }
        }
        break;
      }
      case RoleType.SP: {
        switch (status) {
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm: {
            checkbox = (
              <CheckBox
                normalIcon={Images.blankIcon}
                highlightIcon={Images.checked2Icon}
                active={this.state.selectedRequests.includes(id)}
                onPress={() => {
                  this.selectRequest(id);
                }}
              />
            );
            break;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
    return checkbox;
  };
  //Render check all button in header
  checkPermissionOfAllCheckboxBtn = role => {
    let checkbox = <View />;
    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.SM:
      case RoleType.HPM:
      case RoleType.PM:
      case RoleType.SP:
      case RoleType.DataEntry: {
        checkbox = (
          <CircleButton
            normalIcon={Images.checkedCheckboxIcon}
            highlightIcon={Images.uncheckedIcon}
            action={() => {
              this.setState({
                selectedCheckAllBtn: !this.state.selectedCheckAllBtn,
                selectedFilterBtn: false,
                selectedSettingBtn: false,
                selectedRowId: "",
                selectedRequests: []
              });
            }}
            active={this.state.selectedCheckAllBtn}
            style={{ marginLeft: 2, marginRight: 2 }}
          />
        );
        break;
      }
      default: {
        break;
      }
    }
    return checkbox;
  };
  //Render Status
  renderStatus = (status, isDuplicate, statusTitle) => {
    let title = statusTitle;
    let backgroundColor = "";
    switch (status) {
      case AvailableRequestStatusKey.Pending:
      case AvailableRequestStatusKey.Approve:
      case AvailableRequestStatusKey.ChangeRequest:
      case AvailableRequestStatusKey.CancelRequest:
      case AvailableRequestStatusKey.EndSession: {
        backgroundColor = AppColors.yellowBackground;
        break;
      }
      case AvailableRequestStatusKey.Reject:
      case AvailableRequestStatusKey.Cancel: {
        backgroundColor = AppColors.rejectBtnBackground;
        break;
      }
      case AvailableRequestStatusKey.Confirm: {
        backgroundColor = AppColors.greenBackground;
        break;
      }
    }
    let forTextTitle = "";
    let forBkg = AppColors.gray2Background;
    let forTesting = false;
    if (true || __DEV__) {
      switch (status) {
        case AvailableRequestStatusKey.Pending: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.Pending
            : AvailableRequestStatusKey.Pending;
          forBkg = AppColors.yellowBackground;
          break;
        }
        case AvailableRequestStatusKey.Approve: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.Approve
            : AvailableRequestStatusKey.Approve;
          forBkg = AppColors.approveBtnBackground;
          break;
        }
        case AvailableRequestStatusKey.ChangeRequest: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.ChangeRequest
            : AvailableRequestStatusKey.ChangeRequest;
          forBkg = AppColors.blueBackgroundColor;
          break;
        }
        case AvailableRequestStatusKey.CancelRequest: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.CancelRequest
            : AvailableRequestStatusKey.CancelRequest;
          forBkg = AppColors.grayBackground;
          break;
        }
        case AvailableRequestStatusKey.Reject: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.Reject
            : AvailableRequestStatusKey.Reject;
          forBkg = AppColors.rejectBtnBackground;
          break;
        }
        case AvailableRequestStatusKey.Cancel: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.Cancel
            : AvailableRequestStatusKey.Cancel;
          forBkg = AppColors.redRoseBackground;
          break;
        }
        case AvailableRequestStatusKey.Confirm: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.Confirm
            : AvailableRequestStatusKey.Confirm;
          forBkg = AppColors.greenBackground;
          break;
        }
        case AvailableRequestStatusKey.EndSession: {
          forTextTitle = forTesting
            ? AvailableRequestStatusValue.Pending
            : AvailableRequestStatusKey.EndSession;
          forBkg = AppColors.grayBackground;
          break;
        }
      }
    }

    return (
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 20,
          paddingRight: 12,
          marginBottom: 12
        }}
      >
        <Text
          style={{
            width: 100,
            fontFamily: FontNames.RobotoRegular,
            fontSize: 13,
            color: AppColors.black60TextColor
          }}
        >
          Status
        </Text>
        <Status status={title} color={backgroundColor} />
        {(true || __DEV__) && <Status status={forTextTitle} color={forBkg} />}
        {isDuplicate && <DuplicateStatus />}
      </View>
    );
  };

  checkUpdateRequest = item => {
    let id = item
      .filter(item => item.label === ProgramTypes.PropertyName.id)
      .map(item => item.value);
    let status = item
      .filter(item => item.label === ProgramTypes.PropertyName.status)
      .map(item => item.value);
    const { typeRole } = this.props.userInfo;
    switch (typeRole) {
      case RoleType.SuperAdmin:
      case RoleType.PM: {
        if (this.checkRequestOfCoveringHpm(id[0])) {
          break;
        } else {
          this.props.pushNav(RouteKey.UpdateRequest, {
            id: id[0],
            dashboardstatus: get(
              this.props.navigation.state.params,
              "dashboardstatus",
              ""
            )
          });
          break;
        }
      }
      // case RoleType.Trainer: {
      //   let userId = get(this.props, 'userInfo.id', '');
      //   let trainerId = item.filter(item => item.label === ProgramTypes.PropertyName.trainerId).map(item => item.value)
      //   if (trainerId == userId && status[0] == AvailableRequestStatusKey.Confirm) {
      //     this.props.pushNav(RouteKey.UpdateRequest, {
      //       id: id[0],
      //       dashboardstatus: get(this.props.navigation.state.params, 'dashboardstatus', '')
      //     })
      //   }
      //   break;
      // }
      // case RoleType.HPM: {
      //   if (this.checkRequestOfCoveringHpm(id[0])) {
      //     this.props.pushNav(RouteKey.UpdateRequest, {
      //       id: id[0],
      //       dashboardstatus: get(this.props.navigation.state.params, 'dashboardstatus', '')
      //     })
      //     break;
      //   } else {
      //     const requestData = this.props.data.find(item => item.id === id[0])
      //     let hpmId = get(requestData, 'hpmId', '');
      //     let userId = get(this.props, 'userInfo.id', '');

      //     if (hpmId == userId) {
      //       this.props.pushNav(RouteKey.UpdateRequest, {
      //         id: id[0],
      //         dashboardstatus: get(this.props.navigation.state.params, 'dashboardstatus', '')
      //       })
      //     }
      //     break;
      //   }
      // }
      default: {
        break;
      }
    }
  };

  onReviewPress = () => {
    const { selectedRowId } = this.state;
    const requestData = this.props.data.find(item => item.id === selectedRowId);
    if (!!requestData) {
      this.props.pushNav(RouteKey.ReviewChangeRequest, {
        requestId: requestData.id,
        requestNo: requestData.requestDetailNo,
        requestDetail: {
          startDate: requestData.date,
          startTime: requestData.startTime,
          repeatType: requestData.repeatType,
          venue: requestData.venue,
          venuePostalCode: requestData.venuePostalCode,
          remarks: requestData.remarks
        },
        dashboardstatus: get(
          this.props.navigation.state.params,
          "dashboardstatus",
          ""
        )
      });
    }
    this.setState({
      selectedRowId: "",
      showAction: false,
      isShowButtonReview: false
    });
  };

  onCancelPress = reason => {
    const { selectedRowId, isAllowAll } = this.state;
    console.log("CANCEL REASON--->", reason);
    switch (this.props.role) {
      case RoleType.SuperAdmin:
      case RoleType.HPM:
      case RoleType.PL:
      case RoleType.PM:
      case RoleType.SM: {
        hpmCancelRequest(selectedRowId, isAllowAll, reason).then(res => {
          if (res.statusCode === 200) {
            this.getData(0, true);
          } else {
            alert(res.message);
          }
        });
        break;
      }
      case RoleType.Partner: {
        cancelRequest(selectedRowId, isAllowAll, reason).then(res => {
          if (res.statusCode === 200) {
            this.getData(0, true);
          } else {
            alert(res.message);
          }
        });
        break;
      }
    }
  };

  onRevertCancel = () => {
    const { selectedRowId } = this.state;
    switch (this.props.role) {
      case RoleType.SuperAdmin: {
        revertCancelRequest(selectedRowId).then(res => {
          if (res.statusCode === 200) {
            this.getData(0, true);
          } else {
            alert(res.message);
          }
        });
        break;
      }
    }
  };

  onChangeRequestPress = () => {
    const { selectedRowId } = this.state;
    const requestData = this.props.data.find(item => item.id === selectedRowId);
    if (!!requestData) {
      this.props.pushNav(RouteKey.ChangeRequest, {
        request: requestData,
        dashboardstatus: get(
          this.props.navigation.state.params,
          "dashboardstatus",
          ""
        )
      });
    }
    this.setState({
      selectedRowId: "",
      showAction: false,
      isShowButtonChange: false
    });
  };

  onCancelRequestPress = value => {
    const { selectedRowId } = this.state;
    this.setState({
      selectedRowId: "",
      showAction: false,
      isShowActionCancel: false
    });
    approveCancelRequest([selectedRowId], value).then(res => {
      console.log("onCancelRequestPress", res);
      if (res.statusCode === 200) {
        this.getData(0, true);
      } else {
        alert(res.message);
      }
    });
  };

  allowCancelSession = date => {
    const { role } = this.props;
    if ([RoleType.SM, RoleType.HPM, RoleType.Partner].includes(role))
      return moment(date, "DD/MM/YYYY") > moment().add(13, "days");
    else if ([RoleType.PM, RoleType.SuperAdmin].includes(role)) return true;
    else return false;
  };

  //Render more button in row
  renderMoreButton = request => {
    const { role } = this.props;
    let id = get(
      request.find(item => item.label === ProgramTypes.PropertyName.id),
      "value",
      ""
    );
    let showRevertCancel = role === RoleType.SuperAdmin || role === RoleType.PM ? true : false;
    const requestData = this.props.data.find(item => item.id === id);
    if (isEmpty(requestData)) return;

    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.PM:
      case RoleType.SM:
        switch (requestData.status) {
          case AvailableRequestStatusKey.Pending:
            return <View />;
          case AvailableRequestStatusKey.CancelRequest:
          case AvailableRequestStatusKey.ChangeRequest:
          case AvailableRequestStatusKey.EndSession: {
            if (this.checkRequestOfCoveringHpm(id)) {
              if (
                requestData.status == AvailableRequestStatusKey.ChangeRequest
              ) {
                return (
                  <MoreButton
                    action={() => {
                      this.setState({
                        showAction: true,
                        selectedRowId: id
                      });
                    }}
                  />
                );
              } else {
                return <View />;
              }
            } else {
              return (
                <MoreButton
                  action={() => {
                    this.setState({
                      showAction: true,
                      selectedRowId: id
                    });
                  }}
                />
              );
            }
          }
          case AvailableRequestStatusKey.EndSession: {
            return <View />;
          }
          case AvailableRequestStatusKey.Reject: {
            return <View />;
          }
          case AvailableRequestStatusKey.Cancel: {
            if (showRevertCancel) {
              return (
                <MoreButton
                  action={() => {
                    this.setState({
                      showAction: true,
                      selectedRowId: id
                    });
                  }}
                />
              );
            }
            return <View />;
          }
          default: {
            if (
              requestData.status === AvailableRequestStatusKey.Approve ||
              requestData.status === AvailableRequestStatusKey.Confirm
            ) {
              if (this.checkRequestOfCoveringHpm(id)) {
                return <View />;
              }
            }
            if (
              requestData.status !== AvailableRequestStatusKey.Reject &&
              requestData.status !== AvailableRequestStatusKey.Cancel
            ) {
              return (
                <MoreButton
                  action={() => {
                    this.setState({
                      isShowButtonChange: true,
                      showAction: true,
                      selectedRowId: id
                    });
                  }}
                />
              );
            }

            return (
              <MoreButton
                action={() => {
                  this.setState({
                    selectedRowId: requestData.id,
                    showAction: true,
                    isShowButtonReview:
                      requestData.status ===
                      AvailableRequestStatusKey.ChangeRequest
                  });
                }}
              />
            );
          }
        }
      case RoleType.SP: {
        switch (requestData.status) {
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm:
          case AvailableRequestStatusKey.ChangeRequest:
          case AvailableRequestStatusKey.EndSession: {
            return (
              <MoreButton
                action={() => {
                  this.setState({
                    showAction: true,
                    selectedRowId: id
                  });
                }}
              />
            );
          }
        }
      }
      case RoleType.Trainer: {
        switch (requestData.status) {
          case AvailableRequestStatusKey.Confirm: {
            return (
              <MoreButton
                action={() => {
                  this.setState({
                    selectedRowId: requestData.id,
                    showAction: true,
                    isShowButtonChange: true,
                    isShowButtonReview:
                      requestData.status ===
                      AvailableRequestStatusKey.ChangeRequest
                  });
                }}
              />
            );
          }
          default: {
            return;
          }
        }
      }
      case RoleType.DataEntry:
      case RoleType.Partner: {
        switch (requestData.status) {
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm:
          case AvailableRequestStatusKey.ChangeRequest:
          case AvailableRequestStatusKey.EndSession: {
            return (
              <MoreButton
                action={() => {
                  this.setState({
                    selectedRowId: requestData.id,
                    showAction: true,
                    isShowButtonChange: true,
                    isShowButtonReview:
                      requestData.status ===
                      AvailableRequestStatusKey.ChangeRequest
                  });
                }}
              />
            );
          }
          default: {
            return <View />;
          }
        }
      }
      case RoleType.HPM:
        switch (requestData.status) {
          case AvailableRequestStatusKey.Pending:
          case AvailableRequestStatusKey.CancelRequest:
          case AvailableRequestStatusKey.ChangeRequest:
          case AvailableRequestStatusKey.EndSession: {
            if (this.checkRequestOfCoveringHpm(id)) {
              if (
                requestData.status == AvailableRequestStatusKey.ChangeRequest ||
                requestData.status == AvailableRequestStatusKey.Pending
              ) {
                return (
                  <MoreButton
                    action={() => {
                      this.setState({
                        showAction: true,
                        selectedRowId: id
                      });
                    }}
                  />
                );
              } else {
                const requestData = this.props.data.find(
                  item => item.id === id
                );
                let hpmId = get(requestData, "hpmId", "");
                let userId = get(this.props, "userInfo.id", "");

                if (hpmId == userId) {
                  return (
                    <MoreButton
                      action={() => {
                        this.setState({
                          showAction: true,
                          selectedRowId: id
                        });
                      }}
                    />
                  );
                } else {
                  return <View />;
                }
              }
            } else {
              const requestData = this.props.data.find(item => item.id === id);
              let hpmId = get(requestData, "hpmId", "");
              let userId = get(this.props, "userInfo.id", "");

              if (hpmId == userId) {
                return (
                  <MoreButton
                    action={() => {
                      this.setState({
                        showAction: true,
                        selectedRowId: id
                      });
                    }}
                  />
                );
              }
            }
          }
          case AvailableRequestStatusKey.EndSession: {
            return <View />;
          }
          case AvailableRequestStatusKey.Reject:
          case AvailableRequestStatusKey.Cancel: {
            return <View />;
          }
          default: {
            if (
              requestData.status === AvailableRequestStatusKey.Approve ||
              requestData.status === AvailableRequestStatusKey.Confirm
            ) {
              if (this.checkRequestOfCoveringHpm(id)) {
                return <View />;
              }
            }
            if (
              requestData.status !== AvailableRequestStatusKey.Reject &&
              requestData.status !== AvailableRequestStatusKey.Cancel
            ) {
              return (
                <MoreButton
                  action={() => {
                    this.setState({
                      isShowButtonChange: true,
                      showAction: true,
                      selectedRowId: id
                    });
                  }}
                />
              );
            }

            return (
              <MoreButton
                action={() => {
                  this.setState({
                    selectedRowId: requestData.id,
                    showAction: true,
                    isShowButtonReview:
                      requestData.status ===
                      AvailableRequestStatusKey.ChangeRequest
                  });
                }}
              />
            );
          }
        }
      default:
        return <View />;
    }
  };

  //Important: Render Row
  renderRow = (item, index) => {
    if (item.length) {
      let id = get(
        item.find(item => item.label === ProgramTypes.PropertyName.id),
        "value",
        ""
      );
      let requestDetailNo = get(
        item.find(
          item => item.label === ProgramTypes.PropertyName.requestDetailNo
        ),
        "value",
        0
      );
      let isOutOfTime = get(
        item.find(item => item.label === ProgramTypes.PropertyName.isOutOfTime),
        "value",
        false
      );
      let status = get(
        item.find(item => item.label === ProgramTypes.PropertyName.status),
        "value",
        false
      );
      let isDuplicate = get(
        item.find(item => item.label === ProgramTypes.PropertyName.isDuplicate),
        "value",
        false
      );
      let statusTitle = get(
        item.find(item => item.label === ProgramTypes.PropertyName.statusTitle),
        "value",
        ""
      );
      let requestNoStr = get(
        item.find(
          item => item.label === ProgramTypes.PropertyName.requestNoStr
        ),
        "value",
        ""
      );

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // if (!this.state.selectedCheckAllBtn)
            //   this.checkUpdateRequest(item)
          }}
          key={index}
        >
          <View
            style={{
              height: 44,
              backgroundColor: "blue",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isOutOfTime
                ? AppColors.redRoseBackground
                : AppColors.headerRowBackground,
              paddingLeft: 20,
              paddingRight: 12,
              marginBottom: 12
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text
                style={{
                  fontFamily: FontNames.RobotoMedium,
                  fontSize: 18,
                  color: AppColors.titleRowColor
                }}
              >
                {requestDetailNo}
              </Text>
              {isOutOfTime && (
                <TouchableOpacity
                  style={{ marginLeft: 15 }}
                  activeOpacity={0.9}
                  onPress={() => {
                    this.setState({ showOutOfItimeMessage: index });
                    setTimeout(() => {
                      this.setState({ showOutOfItimeMessage: "" });
                    }, 3000);
                  }}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={Images.infoIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>

            {this.state.selectedCheckAllBtn
              ? this.checkPermissionOfCheckboxBtn(id, this.props.role, status)
              : this.renderMoreButton(item)}
          </View>
          {item &&
            item.map((data, index) => {
              if (data.label !== "" && data.isShow) {
                switch (data.label) {
                  case ProgramTypes.PropertyName.requestNoStr: {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          paddingLeft: 20,
                          paddingRight: 12,
                          marginBottom: 12
                        }}
                        key={index}
                      >
                        <Text
                          style={{
                            width: 100,
                            fontFamily: FontNames.RobotoRegular,
                            fontSize: 13,
                            color: AppColors.black60TextColor
                          }}
                        >
                          Series Number
                        </Text>
                        <Text
                          style={{
                            fontFamily: FontNames.RobotoRegular,
                            fontSize: 13,
                            flex: 1,
                            color: AppColors.valueRowColor,
                            paddingLeft: 15
                          }}
                        >
                          {requestNoStr}
                        </Text>
                      </View>
                    );
                  }
                  case ProgramTypes.PropertyName.status: {
                    return (
                      <View key={index}>
                        {this.renderStatus(status, isDuplicate, statusTitle)}
                      </View>
                    );
                  }
                  default: {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          paddingLeft: 20,
                          paddingRight: 12,
                          marginBottom: 12
                        }}
                        key={index}
                      >
                        <Text
                          style={{
                            width: 100,
                            fontFamily: FontNames.RobotoRegular,
                            fontSize: 13,
                            color: AppColors.black60TextColor
                          }}
                        >
                          {data.label}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FontNames.RobotoRegular,
                            fontSize: 13,
                            flex: 1,
                            color: AppColors.valueRowColor,
                            paddingLeft: 15
                          }}
                        >
                          {data.value}
                        </Text>
                      </View>
                    );
                  }
                }
              }
            })}
          {isOutOfTime &&
            this.state.showOutOfItimeMessage === index &&
            this.renderOutOfTimeMessageAlert()}
        </TouchableOpacity>
      );
    }
  };

  renderOutOfTimeMessageAlert = () => {
    return (
      <View style={{ position: "absolute", top: 33, left: 30 }}>
        <View>
          <View style={[styles.triangle, { marginLeft: 18 }]} />
          <View
            style={{
              height: 50,
              width: 196,
              backgroundColor: AppColors.confirmAlertBackground,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontFamily: FontNames.RobotoRegular,
                fontSize: 12,
                color: AppColors.whiteTitle
              }}
            >
              This request were not processed more than 3 days.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  onChangeAllSelected = active => {
    let columns = get(this.state, "columns", []).map(item => {
      return { ...item, selected: active };
    });
    this.setState({ columns: columns });
  };

  //Setting Column
  renderColumnSetting = () => {
    let data = get(this.state, "columns", []);
    return this.state.selectedSettingBtn ? (
      <View style={styles.settingContainer}>
        <Text style={styles.selectColumnTitileSetting}>
          Select Data you want to show:
        </Text>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <TouchableOpacity
            onPress={() => {
              this.onChangeAllSelected(true);
            }}
          >
            <Text style={{ color: "#128ff9" }}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 15 }}
            onPress={() => {
              this.onChangeAllSelected(false);
            }}
          >
            <Text style={{ color: "#e04949" }}>Deselect All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ flex: 1, marginTop: 24 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={data}
          //extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <ColumnFilter
                item={item}
                key={{ index }}
                action={() => this.pressCheckBoxInColumnSetting(item.value)}
              />
            );
          }}
        />
      </View>
    ) : (
      <View />
    );
  };

  pressCheckBoxInColumnSetting = value => {
    let columnsSetting = this.state.columns.map(item => {
      if (item.value == value) item.selected = !item.selected;
      return item;
    });
    this.setState({ columns: columnsSetting });
  };

  handleRequestWithType = (type, ids) => {
    if (ids && ids.length > 0) {
      let firstItem = get(this.props, "data", []).find(
        item => item.id == get(ids, "[0]", "")
      );
      if (firstItem) {
        switch (get(firstItem, "status", "")) {
          case AvailableRequestStatusKey.CancelRequest: {
            if (type == ActionRequestType.Approve) {
              this.props.approveForPendingCancel(ids);
            } else {
              this.props.rejectForPendingCancel(ids);
            }
            break;
          }
          case AvailableRequestStatusKey.ChangeRequest: {
            if (type == ActionRequestType.Approve) {
              this.props.approveForChanged(ids);
            } else {
              this.props.rejectForChanged(ids);
            }
            break;
          }
          default: {
            if (
              get(firstItem, "status", "") == AvailableRequestStatusKey.Pending
            ) {
              if (type == ActionRequestType.Approve) {
                this.props.approve(ids);
              } else {
                this.props.reject(ids);
              }
            }
            break;
          }
        }
      }
    }
  };

  renderAlertPopup = role => {
    var activeStatus = this.state.selectedRequests.length > 0;
    let btn = <View />;
    switch (role) {
      case RoleType.SuperAdmin: {
        let firstItem = this.props.data.find(
          item => item.id == get(this.state.selectedRequests, "[0]", {})
        );
        switch (get(firstItem, "status", "")) {
          case AvailableRequestStatusKey.Approve: {
            return (
              <View style={styles.alertPopupContainer}>
                {/*<Text*/}
                {/*style={styles.alertPopTxt}>{this.state.selectedRequests.length} {this.state.selectedRequests.length > 1 ? 'Items' : 'Item'} Selected</Text>*/}
                <View style={styles.btnAlertPopupGroup}>
                  <AlertButton
                    title={"CONFIRM"}
                    titleColor={AppColors.whiteTitle}
                    buttonColor={
                      activeStatus
                        ? AppColors.blueBackgroundColor
                        : AppColors.grayBackground
                    }
                    action={() => {
                      if (activeStatus) {
                        this.setState({ selectedCheckAllBtn: false });
                        this.props.approve(this.state.selectedRequests);
                      }
                    }}
                    style={{ flex: 1, marginRight: "2%" }}
                  />
                  <AlertButton
                    title={"ASSIGN TRAINER"}
                    titleColor={AppColors.whiteTitle}
                    buttonColor={
                      activeStatus
                        ? AppColors.blueBackgroundColor
                        : AppColors.grayBackground
                    }
                    action={() => {
                      if (activeStatus) {
                        // this.setState({selectedCheckAllBtn: false})
                        this.props.selectRequest(this.state.selectedRequests);
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
                <AlertButton
                  title={"ASSIGN SP"}
                  titleColor={AppColors.whiteTitle}
                  buttonColor={
                    activeStatus
                      ? AppColors.blueBackgroundColor
                      : AppColors.grayBackground
                  }
                  action={() => {
                    if (activeStatus) {
                      // this.setState({selectedCheckAllBtn: false})
                      this.props.goToAssignSPScreen(
                        this.state.selectedRequests,
                        () => {
                          this.setState({ selectedCheckAllBtn: false });
                        }
                      );
                    }
                  }}
                  style={{ width: "49%", marginTop: 5 }}
                />
              </View>
            );
          }
          case AvailableRequestStatusKey.Confirm: {
            btn = (
              <View style={{ flexDirection: "row" }}>
                <AlertButton
                  title={"ASSIGN TRAINER"}
                  titleColor={AppColors.whiteTitle}
                  buttonColor={
                    activeStatus
                      ? AppColors.blueBackgroundColor
                      : AppColors.grayBackground
                  }
                  action={() => {
                    if (activeStatus) {
                      // this.setState({selectedCheckAllBtn: false})
                      this.props.selectRequest(this.state.selectedRequests);
                    }
                  }}
                  style={{ flex: 1, marginRight: 20 }}
                />
                <AlertButton
                  title={"ASSIGN SP"}
                  titleColor={AppColors.whiteTitle}
                  buttonColor={
                    activeStatus
                      ? AppColors.blueBackgroundColor
                      : AppColors.grayBackground
                  }
                  action={() => {
                    if (activeStatus) {
                      // this.setState({selectedCheckAllBtn: false})
                      this.props.goToAssignSPScreen(
                        this.state.selectedRequests,
                        () => {
                          this.setState({ selectedCheckAllBtn: false });
                        }
                      );
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            );
            break;
          }
          default: {
            return (
              <View style={styles.alertPopupContainer}>
                <Text style={styles.alertPopTxt}>
                  {this.state.selectedRequests.length}{" "}
                  {this.state.selectedRequests.length > 1 ? "Items" : "Item"}{" "}
                  Selected
                </Text>
                <View style={styles.btnAlertPopupGroup}>
                  <AlertButton
                    title={"REJECT"}
                    titleColor={AppColors.whiteTitle}
                    buttonColor={
                      activeStatus
                        ? AppColors.rejectBtnBackground
                        : AppColors.gray2Background
                    }
                    action={() => {
                      if (activeStatus) {
                        this.setState({
                          selectedCheckAllBtn: false,
                          showConfirmRejectPopup: true
                        });
                      }
                    }}
                    width={154}
                  />
                  <AlertButton
                    title={"APPROVE"}
                    titleColor={AppColors.whiteTitle}
                    buttonColor={
                      activeStatus
                        ? AppColors.approveBtnBackground
                        : AppColors.grayBackground
                    }
                    action={() => {
                      if (activeStatus) {
                        this.setState({ selectedCheckAllBtn: false });
                        this.handleRequestWithType(
                          ActionRequestType.Approve,
                          this.state.selectedRequests
                        );
                      }
                    }}
                    width={154}
                  />
                </View>
              </View>
            );
          }
        }
        return (
          <View style={styles.alertPopupContainer}>
            <Text style={styles.alertPopTxt}>
              {this.state.selectedRequests.length}{" "}
              {this.state.selectedRequests.length > 1 ? "Items" : "Item"}{" "}
              Selected
            </Text>
            <View style={styles.btnAlertPopupGroup}>{activeStatus && btn}</View>
          </View>
        );
      }
      case RoleType.SP: {
        let firstItem = this.props.data.find(
          item => item.id == get(this.state.selectedRequests, "[0]", {})
        );

        switch (get(firstItem, "status", "")) {
          case AvailableRequestStatusKey.Approve: {
            btn = (
              <AlertButton
                title={"CONFIRM"}
                titleColor={AppColors.whiteTitle}
                buttonColor={
                  activeStatus
                    ? AppColors.blueBackgroundColor
                    : AppColors.grayBackground
                }
                action={() => {
                  if (activeStatus) {
                    this.setState({ selectedCheckAllBtn: false });
                    this.props.approve(this.state.selectedRequests);
                  }
                }}
                style={{ flex: 1 }}
              />
            );
            break;
          }
          case AvailableRequestStatusKey.Confirm: {
            btn = (
              <View style={{ flexDirection: "row" }}>
                {/*<AlertButton
                  title={"ASSIGN FACILITATOR"}
                  titleColor={AppColors.whiteTitle}
                  buttonColor={
                    activeStatus
                      ? AppColors.blueBackgroundColor
                      : AppColors.grayBackground
                  }
                  action={() => {
                    if (activeStatus) {
                      this.props.assignFacilitator(this.state.selectedRequests);
                    }
                  }}
                  style={{ flex: 1, marginLeft: 5, marginRight: 5 }}
                />*/}
                <AlertButton
                  title={"ASSIGN TRAINER"}
                  titleColor={AppColors.whiteTitle}
                  buttonColor={
                    activeStatus
                      ? AppColors.blueBackgroundColor
                      : AppColors.grayBackground
                  }
                  action={() => {
                    if (activeStatus) {
                      // this.setState({selectedCheckAllBtn: false})
                      this.props.selectRequest(this.state.selectedRequests);
                    }
                  }}
                  style={{ flex: 1, marginLeft: 5, marginRight: 5 }}
                />
              </View>
            );
            break;
          }
        }
        return (
          <View style={styles.alertPopupContainer}>
            <Text style={styles.alertPopTxt}>
              {this.state.selectedRequests.length}{" "}
              {this.state.selectedRequests.length > 1 ? "Items" : "Item"}{" "}
              Selected
            </Text>
            <View style={styles.btnAlertPopupGroup}>{activeStatus && btn}</View>
          </View>
        );
      }
      case RoleType.PM: {
        return (
          <View>
            <AlertButton
              title={"ASSIGN SP"}
              titleColor={AppColors.whiteTitle}
              buttonColor={
                activeStatus
                  ? AppColors.blueBackgroundColor
                  : AppColors.grayBackground
              }
              action={() => {
                if (activeStatus) {
                  // this.setState({selectedCheckAllBtn: false})
                  this.props.goToAssignSPScreen(
                    this.state.selectedRequests,
                    () => {
                      this.setState({ selectedCheckAllBtn: false });
                    }
                  );
                }
              }}
              style={{ width: "49%", marginTop: 5 }}
            />
          </View>
        );
      }
      default: {
        return (
          <View style={styles.alertPopupContainer}>
            <Text style={styles.alertPopTxt}>
              {this.state.selectedRequests.length}{" "}
              {this.state.selectedRequests.length > 1 ? "Items" : "Item"}{" "}
              Selected
            </Text>
            <View style={styles.btnAlertPopupGroup}>
              <AlertButton
                title={"REJECT"}
                titleColor={AppColors.whiteTitle}
                buttonColor={
                  activeStatus
                    ? AppColors.rejectBtnBackground
                    : AppColors.gray2Background
                }
                action={() => {
                  if (activeStatus) {
                    this.setState({
                      selectedCheckAllBtn: false,
                      showConfirmRejectPopup: true
                    });
                  }
                }}
                width={154}
              />
              <AlertButton
                title={"APPROVE"}
                titleColor={AppColors.whiteTitle}
                buttonColor={
                  activeStatus
                    ? AppColors.approveBtnBackground
                    : AppColors.grayBackground
                }
                action={() => {
                  if (activeStatus) {
                    this.setState({ selectedCheckAllBtn: false });
                    this.handleRequestWithType(
                      ActionRequestType.Approve,
                      this.state.selectedRequests
                    );
                  }
                }}
                width={154}
              />
            </View>
          </View>
        );
      }
    }
  };

  renderColumnsSettingPopup = () => {
    return (
      <View style={styles.alertPopupContainer}>
        <Text style={styles.alertPopTxt}>Data Density Setting</Text>
        <View style={styles.btnAlertPopupGroup}>
          <AlertButton
            title={"APPLY"}
            titleColor={AppColors.whiteTitle}
            buttonColor={AppColors.blueBackgroundColor}
            action={() => {
              this.setState({
                selectedSettingBtn: !this.state.selectedSettingBtn,
                selectedFilterBtn: false,
                selectedCheckAllBtn: false,
                selectedRowId: ""
              });
              this.props.saveColumnsSetting(this.state.columns);
            }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    );
  };

  handleRefresh = () => {
    this.setState({
      refreshing: true
    });

    this.getData(0, true);

    setTimeout(() => {
      this.setState({
        refreshing: false
      });
    });
  };

  handleLoadMore = () => {
    console.log("INDEX -before", this.props.page);
    console.log("TOTAL PAGE", this.props.totalPage);
    if (this.props.totalPage > this.props.page + 1) {
      this.getData(this.props.page + 1, true);
    }
  };

  renderButtonsWithRole = (id, role) => {
    let obj = get(this.props, "data", []).find(item => item.id === id);
    if (!obj) return;
    let status = get(obj, "status", "");

    let isShowAssignSp = role === RoleType.PM ? true : false;
    let isShowRevertCancel = role === RoleType.SuperAdmin || role === RoleType.PM ? true : false;

    let grpBtns = <View />;
    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.PM:
      case RoleType.HPM:
      case RoleType.PL:
      case RoleType.SM: {
        switch (status) {
          case AvailableRequestStatusKey.Pending: {
            if (this.checkRequestOfCoveringHpm(id)) {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Approve"}
                    icon={Images.approveIcon}
                    onPress={() => {
                      this.setState({ selectedRowId: "", showAction: false });
                      this.handleRequestWithType(ActionRequestType.Approve, [
                        id
                      ]);
                    }}
                  />
                  <ButtonWithIcon
                    title={"Reject"}
                    icon={Images.rejectIcon}
                    onPress={() => {
                      this.setState({
                        showAction: false,
                        showConfirmRejectPopup: true
                      });
                    }}
                  />
                  {this.allowCancelSession(get(obj, "date", new Date())) && (
                    <ButtonWithIcon
                      title={"Cancel"}
                      icon={Images.cancelIcon}
                      onPress={() => {
                        this.setState({
                          showAction: false,
                          showAlertCancel: true
                        });
                      }}
                    />
                  )}
                </View>
              );
            } else {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Approve"}
                    icon={Images.approveIcon}
                    onPress={() => {
                      this.setState({ selectedRowId: "", showAction: false });
                      this.handleRequestWithType(ActionRequestType.Approve, [
                        id
                      ]);
                    }}
                  />
                  <ButtonWithIcon
                    title={"Reject"}
                    icon={Images.rejectIcon}
                    onPress={() => {
                      this.setState({
                        showAction: false,
                        showConfirmRejectPopup: true
                      });
                    }}
                  />
                  {isShowAssignSp && (
                    <ButtonWithIcon
                      title={"Assign SP"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.goToAssignSPScreen([id]);
                      }}
                    />
                  )}
                  {this.allowCancelSession(get(obj, "date", new Date())) && (
                    <ButtonWithIcon
                      title={"Cancel"}
                      icon={Images.cancelIcon}
                      onPress={() => {
                        this.setState({
                          showAction: false,
                          showAlertCancel: true
                        });
                      }}
                    />
                  )}
                </View>
              );
            }
            break;
          }
          case AvailableRequestStatusKey.CancelRequest: {
            if (this.checkRequestOfCoveringHpm(id)) {
              grpBtns = <View />;
            } else {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Approve"}
                    icon={Images.approveIcon}
                    onPress={() => {
                      this.setState({ selectedRowId: "", showAction: false });
                      this.handleRequestWithType(ActionRequestType.Approve, [
                        id
                      ]);
                    }}
                  />
                  <ButtonWithIcon
                    title={"Reject"}
                    icon={Images.rejectIcon}
                    onPress={() => {
                      this.setState({
                        showAction: false,
                        showConfirmRejectPopup: true
                      });
                    }}
                  />
                  {isShowAssignSp && (
                    <ButtonWithIcon
                      title={"Assign SP"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.goToAssignSPScreen([id]);
                      }}
                    />
                  )}
                </View>
              );
            }

            break;
          }
          case AvailableRequestStatusKey.Cancel: {
            grpBtns = (
              <View style={{}}>
                {isShowRevertCancel && (
                  <ButtonWithIcon
                    title={"Revert Cancel"}
                    icon={Images.cancelIcon}
                    onPress={() => {
                      this.onRevertCancel();
                    }}
                  />
                )}
              </View>
            );
            break;
          }
          case AvailableRequestStatusKey.EndSession: {
            if (this.checkRequestOfCoveringHpm(id)) {
              grpBtns = <View />;
            } else {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Compare Changes"}
                    icon={Images.compareChangesIcon}
                    onPress={() => {
                      this.onReviewPress();
                    }}
                  />
                </View>
              );
            }
            break;
          }
          case AvailableRequestStatusKey.ChangeRequest: {
            if (this.checkRequestOfCoveringHpm(id)) {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Compare Changes"}
                    icon={Images.compareChangesIcon}
                    onPress={() => {
                      this.onReviewPress();
                    }}
                  />
                  {isShowAssignSp && (
                    <ButtonWithIcon
                      title={"Assign SP"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.goToAssignSPScreen([id]);
                      }}
                    />
                  )}
                  {this.allowCancelSession(get(obj, "date", new Date())) && (
                    <ButtonWithIcon
                      title={"Cancel"}
                      icon={Images.cancelIcon}
                      onPress={() => {
                        this.setState({
                          showAction: false,
                          showAlertCancel: true
                        });
                      }}
                    />
                  )}
                </View>
              );
            } else {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Approve"}
                    icon={Images.approveIcon}
                    onPress={() => {
                      this.setState({ selectedRowId: "", showAction: false });
                      this.handleRequestWithType(ActionRequestType.Approve, [
                        id
                      ]);
                    }}
                  />
                  <ButtonWithIcon
                    title={"Reject"}
                    icon={Images.rejectIcon}
                    onPress={() => {
                      this.setState({
                        showAction: false,
                        showConfirmRejectPopup: true
                      });
                    }}
                  />
                  <ButtonWithIcon
                    title={"Compare Changes"}
                    icon={Images.compareChangesIcon}
                    onPress={() => {
                      this.onReviewPress();
                    }}
                  />
                  {isShowAssignSp && (
                    <ButtonWithIcon
                      title={"Assign SP"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.goToAssignSPScreen([id]);
                      }}
                    />
                  )}
                  {this.allowCancelSession(get(obj, "date", new Date())) && (
                    <ButtonWithIcon
                      title={"Cancel"}
                      icon={Images.cancelIcon}
                      onPress={() => {
                        this.setState({
                          showAction: false,
                          showAlertCancel: true
                        });
                      }}
                    />
                  )}
                </View>
              );
            }
            break;
          }
          case AvailableRequestStatusKey.Approve: {
            switch (role) {
              case RoleType.SuperAdmin: {
                grpBtns = (
                  <View style={{}}>
                    <ButtonWithIcon
                      title={"Confirm"}
                      icon={Images.approveIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.approve([id]);
                      }}
                    />
                    <ButtonWithIcon
                      title={"Assign Trainer"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.selectRequest([id]);
                      }}
                    />
                    <ButtonWithIcon
                      title={"Assign Facilitator"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.assignFacilitator([id]);
                      }}
                    />
                    {isShowAssignSp && (
                      <ButtonWithIcon
                        title={"Assign SP"}
                        icon={Images.assignTrainerIcon}
                        onPress={() => {
                          this.setState({
                            selectedRowId: "",
                            showAction: false
                          });
                          this.props.goToAssignSPScreen([id]);
                        }}
                      />
                    )}
                    {
                      <ButtonWithIcon
                        title={"Change Request"}
                        icon={Images.changeRequestIcon}
                        onPress={() => {
                          this.onChangeRequestPress();
                        }}
                      />
                    }
                    {this.allowCancelSession(get(obj, "date", new Date())) && (
                      <ButtonWithIcon
                        title={"Cancel"}
                        icon={Images.cancelIcon}
                        onPress={() => {
                          this.setState({
                            showAction: false,
                            showAlertCancel: true
                          });
                        }}
                      />
                    )}
                  </View>
                );
                break;
              }
              default: {
                if (this.checkRequestOfCoveringHpm(id)) {
                  grpBtns = (
                    <View>
                      {role !== RoleType.PL && (
                        <ButtonWithIcon
                          title={"Change Request"}
                          icon={Images.changeRequestIcon}
                          onPress={() => {
                            this.onChangeRequestPress();
                          }}
                        />
                      )}
                      {this.allowCancelSession(
                        get(obj, "date", new Date())
                      ) && (
                        <ButtonWithIcon
                          title={"Cancel"}
                          icon={Images.cancelIcon}
                          onPress={() => {
                            this.setState({
                              showAction: false,
                              showAlertCancel: true
                            });
                          }}
                        />
                      )}
                    </View>
                  );
                } else {
                  grpBtns = (
                    <View style={{}}>
                      {role !== RoleType.PL && (
                        <ButtonWithIcon
                          title={"Change Request"}
                          icon={Images.changeRequestIcon}
                          onPress={() => {
                            this.onChangeRequestPress();
                          }}
                        />
                      )}
                      {this.allowCancelSession(
                        get(obj, "date", new Date())
                      ) && (
                        <ButtonWithIcon
                          title={"Cancel"}
                          icon={Images.cancelIcon}
                          onPress={() => {
                            this.setState({
                              showAction: false,
                              showAlertCancel: true
                            });
                          }}
                        />
                      )}
                    </View>
                  );
                }

                break;
              }
            }
            break;
          }
          case AvailableRequestStatusKey.Confirm: {
            if (role == RoleType.SuperAdmin) {
              grpBtns = (
                <View style={{}}>
                  <ButtonWithIcon
                    title={"Assign Trainer"}
                    icon={Images.assignTrainerIcon}
                    onPress={() => {
                      this.setState({ selectedRowId: "", showAction: false });
                      this.props.selectRequest([id]);
                    }}
                  />
                  <ButtonWithIcon
                    title={"Assign Facilitator"}
                    icon={Images.assignTrainerIcon}
                    onPress={() => {
                      this.setState({ selectedRowId: "", showAction: false });
                      this.props.assignFacilitator([id]);
                    }}
                  />
                  {isShowAssignSp && (
                    <ButtonWithIcon
                      title={"Assign SP"}
                      icon={Images.assignTrainerIcon}
                      onPress={() => {
                        this.setState({ selectedRowId: "", showAction: false });
                        this.props.goToAssignSPScreen([id]);
                      }}
                    />
                  )}
                  {role !== RoleType.PL && (
                    <ButtonWithIcon
                      title={"Change Request"}
                      icon={Images.changeRequestIcon}
                      onPress={() => {
                        this.onChangeRequestPress();
                      }}
                    />
                  )}
                  {this.allowCancelSession(get(obj, "date", new Date())) && (
                    <ButtonWithIcon
                      title={"Cancel"}
                      icon={Images.cancelIcon}
                      onPress={() => {
                        this.setState({
                          showAction: false,
                          showAlertCancel: true
                        });
                      }}
                    />
                  )}
                </View>
              );
            } else {
              if (this.checkRequestOfCoveringHpm(id)) {
                grpBtns = (
                  <View>
                    {role === RoleType.PM && (
                      <ButtonWithIcon
                        title={"Assign SP"}
                        icon={Images.assignTrainerIcon}
                        onPress={() => {
                          this.setState({
                            selectedRowId: "",
                            showAction: false
                          });
                          this.props.goToAssignSPScreen([id]);
                        }}
                      />
                    )}
                    {
                      <ButtonWithIcon
                        title={"Change Request"}
                        icon={Images.changeRequestIcon}
                        onPress={() => {
                          this.onChangeRequestPress();
                        }}
                      />
                    }
                    {this.allowCancelSession(get(obj, "date", new Date())) && (
                      <ButtonWithIcon
                        title={"Cancel"}
                        icon={Images.cancelIcon}
                        onPress={() => {
                          this.setState({
                            showAction: false,
                            showAlertCancel: true
                          });
                        }}
                      />
                    )}
                  </View>
                );
              } else {
                grpBtns = (
                  <View style={{}}>
                    {role === RoleType.PM && (
                      <ButtonWithIcon
                        title={"Assign SP"}
                        icon={Images.assignTrainerIcon}
                        onPress={() => {
                          this.setState({
                            selectedRowId: "",
                            showAction: false
                          });
                          this.props.goToAssignSPScreen([id]);
                        }}
                      />
                    )}
                    {role !== RoleType.PL && (
                      <ButtonWithIcon
                        title={"Change Request"}
                        icon={Images.changeRequestIcon}
                        onPress={() => {
                          this.onChangeRequestPress();
                        }}
                      />
                    )}
                    {this.allowCancelSession(get(obj, "date", new Date())) && (
                      <ButtonWithIcon
                        title={"Cancel"}
                        icon={Images.cancelIcon}
                        onPress={() => {
                          this.setState({
                            showAction: false,
                            showAlertCancel: true
                          });
                        }}
                      />
                    )}
                  </View>
                );
              }
            }
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case RoleType.SP: {
        switch (status) {
          case AvailableRequestStatusKey.Approve: {
            grpBtns = (
              <View style={{}}>
                <ButtonWithIcon
                  title={"Confirm"}
                  icon={Images.approveIcon}
                  onPress={() => {
                    this.setState({ selectedRowId: "", showAction: false });
                    this.props.approve([id]);
                  }}
                />
                <ButtonWithIcon
                  title={"Assign Trainer"}
                  icon={Images.assignTrainerIcon}
                  onPress={() => {
                    this.setState({ selectedRowId: "", showAction: false });
                    this.props.selectRequest([id]);
                  }}
                />
                <ButtonWithIcon
                  title={"Assign Facilitator"}
                  icon={Images.assignTrainerIcon}
                  onPress={() => {
                    this.setState({ selectedRowId: "", showAction: false });
                    this.props.assignFacilitator([id]);
                  }}
                />
              </View>
            );
            break;
          }
          case AvailableRequestStatusKey.Confirm: {
            grpBtns = (
              <View style={{}}>
                <ButtonWithIcon
                  title={"Assign Facilitator"}
                  icon={Images.assignTrainerIcon}
                  onPress={() => {
                    this.setState({ selectedRowId: "", showAction: false });
                    this.props.assignFacilitator([id]);
                  }}
                />
                <ButtonWithIcon
                  title={"Assign Trainer"}
                  icon={Images.assignTrainerIcon}
                  onPress={() => {
                    this.setState({ selectedRowId: "", showAction: false });
                    this.props.selectRequest([id]);
                  }}
                />
              </View>
            );
            break;
          }
          case AvailableRequestStatusKey.ChangeRequest: {
            grpBtns = (
              <View>
                <ButtonWithIcon
                  title={"Compare Changes"}
                  icon={Images.compareChangesIcon}
                  onPress={() => {
                    this.onReviewPress();
                  }}
                />
              </View>
            );
            break;
          }
          case AvailableRequestStatusKey.EndSession: {
            grpBtns = (
              <View>
                <ButtonWithIcon
                  title={"Compare Changes"}
                  icon={Images.compareChangesIcon}
                  onPress={() => {
                    this.onReviewPress();
                  }}
                />
              </View>
            );
            break;
          }
          default: {
            grpBtns = <View />;
          }
        }
        break;
      }
      case RoleType.Trainer: {
        switch (status) {
          case AvailableRequestStatusKey.Confirm: {
            let isShowButtonTrainerAcknowledged = get(
              obj,
              "isShowButtonTrainerAcknowledged",
              false
            );
            let isShowButtonTrainerCheckIn = get(
              obj,
              "isShowButtonTrainerCheckIn",
              false
            );
            grpBtns = (
              <View style={{}}>
                {isShowButtonTrainerAcknowledged && (
                  <ButtonWithIcon
                    title={"Trainer Confirm"}
                    icon={Images.cancelIcon}
                    onPress={() => {
                      this.props.trainerConfirm([this.state.selectedRowId]);
                      this.setState({
                        selectedRowId: "",
                        showAction: false
                      });
                    }}
                  />
                )}
                {isShowButtonTrainerCheckIn && (
                  <ButtonWithIcon
                    title={"Trainer Checkin"}
                    icon={Images.cancelIcon}
                    onPress={() => {
                      this.props.checkInForRequest([this.state.selectedRowId]);
                      this.setState({ selectedRowId: "", showAction: false });
                    }}
                  />
                )}
              </View>
            );
            break;
          }
        }
        break;
      }
      case RoleType.Partner: {
        switch (status) {
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm: {
            grpBtns = (
              <View>
                <ButtonWithIcon
                  title={"Change Request"}
                  icon={Images.changeRequestIcon}
                  onPress={() => {
                    this.onChangeRequestPress();
                  }}
                />
                {this.allowCancelSession(get(obj, "date", new Date())) && (
                  <ButtonWithIcon
                    title={"Cancel"}
                    icon={Images.cancelIcon}
                    onPress={() => {
                      this.setState({
                        showAction: false,
                        showAlertCancel: true
                      });
                    }}
                  />
                )}
              </View>
            );
            break;
          }
          case AvailableRequestStatusKey.ChangeRequest: {
            grpBtns = (
              <View>
                <ButtonWithIcon
                  title={"Compare Changes"}
                  icon={Images.compareChangesIcon}
                  onPress={() => {
                    this.onReviewPress();
                  }}
                />
                {this.allowCancelSession(get(obj, "date", new Date())) && (
                  <ButtonWithIcon
                    title={"Cancel"}
                    icon={Images.cancelIcon}
                    onPress={() => {
                      this.setState({
                        showAction: false,
                        showAlertCancel: true
                      });
                    }}
                  />
                )}
              </View>
            );
            break;
          }
          case AvailableRequestStatusKey.EndSession: {
            grpBtns = (
              <View>
                <ButtonWithIcon
                  title={"Compare Changes"}
                  icon={Images.compareChangesIcon}
                  onPress={() => {
                    this.onReviewPress();
                  }}
                />
              </View>
            );
            break;
          }
        }
        break;
      }
      case RoleType.DataEntry: {
        if (
          status == AvailableRequestStatusKey.Confirm ||
          status == AvailableRequestStatusKey.Approve
        ) {
          grpBtns = (
            <View>
              <ButtonWithIcon
                title={"Change Request"}
                icon={Images.changeRequestIcon}
                onPress={() => {
                  this.onChangeRequestPress();
                }}
              />
            </View>
          );
        }
      }
      default: {
        break;
      }
    }
    return grpBtns;
  };

  renderConfirmationPopup = (id, role) => {
    let obj = get(this.props, "data", []).find(item => item.id === id);
    if (!obj) return;
    let status = get(obj, "status", "");
    let popup = <View />;

    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.HPM:
      case RoleType.PL:
      case RoleType.SM:
      case RoleType.PM: {
        switch (status) {
          case AvailableRequestStatusKey.Pending: {
            if (this.checkRequestOfCoveringHpm(id)) {
              popup = <View />;
            } else {
              popup = (
                <ConfirmationModal
                  message={rejectMsgPopup}
                  confirmAction={() => {
                    this.setState({
                      showConfirmRejectPopup: false
                    });
                    this.handleRequestWithType(ActionRequestType.Reject, [id]);
                  }}
                  cancelAction={() => {
                    this.setState({
                      showConfirmRejectPopup: false
                    });
                  }}
                  show={this.state.showConfirmRejectPopup}
                  negativeTitle={"No"}
                  positiveTitle={"Yes"}
                />
              );
            }

            break;
          }
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm: {
            if (this.checkRequestOfCoveringHpm(id)) {
              popup = <View />;
            } else {
              popup = (
                <ConfirmationModal
                  message={cancelMsgPopup}
                  confirmAction={() => {
                    if (this.state.reasonCancelRequest.length !== 0) {
                      this.setState({
                        showAlertCancel: false,
                        isAllowAll: false,
                        reasonCancelRequest: ""
                      });
                      this.onCancelPress(this.state.reasonCancelRequest);
                    } else {
                      this.setState({
                        reasonCancelRequest: "",
                        errMsgForCancelRequest: "Cancel reason can't be empty"
                      });
                    }
                  }}
                  cancelAction={() => {
                    this.setState({
                      showAlertCancel: false,
                      isAllowAll: false
                    });
                  }}
                  show={this.state.showAlertCancel}
                  onCheckPress={() => {
                    this.setState({ isAllowAll: !this.state.isAllowAll });
                  }}
                  checkTitle={allRelatedRequestMsg}
                  isSelected={this.state.isAllowAll}
                  negativeTitle={"No"}
                  positiveTitle={"Yes"}
                  enableInput={true}
                  placeholder={"Reason for cancel request"}
                  value={this.state.reasonCancelRequest}
                  errMessage={this.state.errMsgForCancelRequest}
                  changeText={value => {
                    if (value.length === 0) {
                      this.setState({
                        reasonCancelRequest: "",
                        errMsgForCancelRequest: "Cancel reason can't be empty"
                      });
                    } else {
                      this.setState({
                        reasonCancelRequest: value,
                        errMsgForCancelRequest: ""
                      });
                    }
                  }}
                />
              );
            }

            break;
          }
          case AvailableRequestStatusKey.ChangeRequest: {
            if (this.checkRequestOfCoveringHpm(id)) {
              popup = <View />;
            } else {
              popup = (
                <View>
                  <ConfirmationModal
                    message={rejectMsgPopup}
                    confirmAction={() => {
                      this.setState({
                        showConfirmRejectPopup: false
                      });
                      this.handleRequestWithType(ActionRequestType.Reject, [
                        id
                      ]);
                    }}
                    cancelAction={() => {
                      this.setState({
                        showConfirmRejectPopup: false
                      });
                    }}
                    show={this.state.showConfirmRejectPopup}
                    negativeTitle={"No"}
                    positiveTitle={"Yes"}
                  />
                  <ConfirmationModal
                    message={cancelMsgPopup}
                    confirmAction={() => {
                      if (this.state.reasonCancelRequest.length !== 0) {
                        this.setState({
                          showAlertCancel: false,
                          isAllowAll: false,
                          reasonCancelRequest: ""
                        });
                        this.onCancelPress(this.state.reasonCancelRequest);
                      } else {
                        this.setState({
                          reasonCancelRequest: "",
                          errMsgForCancelRequest: "Cancel reason can't be empty"
                        });
                      }
                    }}
                    cancelAction={() => {
                      this.setState({
                        showAlertCancel: false,
                        isAllowAll: false
                      });
                    }}
                    show={this.state.showAlertCancel}
                    onCheckPress={() => {
                      this.setState({ isAllowAll: true });
                    }}
                    checkTitle={allRelatedRequestMsg}
                    isSelected={this.state.isAllowAll}
                    negativeTitle={"No"}
                    positiveTitle={"Yes"}
                    enableInput={true}
                    placeholder={"Reason for cancel request"}
                    value={this.state.reasonCancelRequest}
                    errMessage={this.state.errMsgForCancelRequest}
                    changeText={value => {
                      if (value.length === 0) {
                        this.setState({
                          reasonCancelRequest: "",
                          errMsgForCancelRequest: "Cancel reason can't be empty"
                        });
                      } else {
                        this.setState({
                          reasonCancelRequest: value,
                          errMsgForCancelRequest: ""
                        });
                      }
                    }}
                  />
                </View>
              );
            }
            break;
          }
          case AvailableRequestStatusKey.CancelRequest: {
            if (this.checkRequestOfCoveringHpm(id)) {
              popup = <View />;
            } else {
              if (this.state.showConfirmRejectPopup) {
                popup = (
                  <ConfirmationModal
                    message={rejectMsgPopup}
                    confirmAction={() => {
                      this.setState({
                        showConfirmRejectPopup: false
                      });
                      this.handleRequestWithType(ActionRequestType.Reject, [
                        id
                      ]);
                    }}
                    cancelAction={() => {
                      this.setState({
                        showConfirmRejectPopup: false
                      });
                    }}
                    show={true}
                    negativeTitle={"No"}
                    positiveTitle={"Yes"}
                  />
                );
              }
              if (this.state.showAlertCancel) {
                popup = (
                  <ConfirmationModal
                    message={cancelMsgPopup}
                    confirmAction={() => {
                      this.setState({
                        showAlertCancel: false,
                        isAllowAll: false
                      });
                      this.onCancelPress();
                    }}
                    cancelAction={() => {
                      this.setState({
                        showAlertCancel: false,
                        isAllowAll: false
                      });
                    }}
                    show={true}
                    onCheckPress={() => {
                      this.setState({ isAllowAll: true });
                    }}
                    checkTitle={allRelatedRequestMsg}
                    isSelected={this.state.isAllowAll}
                    negativeTitle={"No"}
                    positiveTitle={"Yes"}
                    enableInput={false}
                  />
                );
              }
            }
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case RoleType.Partner: {
        switch (status) {
          case AvailableRequestStatusKey.Approve:
          case AvailableRequestStatusKey.Confirm:
          case AvailableRequestStatusKey.ChangeRequest: {
            popup = (
              <ConfirmationModal
                message={cancelMsgPopup}
                confirmAction={() => {
                  if (this.state.reasonCancelRequest.length !== 0) {
                    this.setState({
                      showAlertCancel: false,
                      isAllowAll: false,
                      reasonCancelRequest: ""
                    });
                    this.onCancelPress(this.state.reasonCancelRequest);
                  } else {
                    this.setState({
                      reasonCancelRequest: "",
                      errMsgForCancelRequest: "Cancel reason can't be empty"
                    });
                  }
                }}
                cancelAction={() => {
                  this.setState({
                    showAlertCancel: false,
                    isAllowAll: false
                  });
                }}
                show={this.state.showAlertCancel}
                onCheckPress={() => {
                  this.setState({ isAllowAll: true });
                }}
                checkTitle={allRelatedRequestMsg}
                isSelected={this.state.isAllowAll}
                negativeTitle={"No"}
                positiveTitle={"Yes"}
                enableInput={true}
                placeholder={"Reason for cancel request"}
                value={this.state.reasonCancelRequest}
                errMessage={this.state.errMsgForCancelRequest}
                changeText={value => {
                  if (value && value.length === 0) {
                    this.setState({
                      reasonCancelRequest: "",
                      errMsgForCancelRequest: "Cancel reason can't be empty"
                    });
                  } else {
                    this.setState({
                      reasonCancelRequest: value,
                      errMsgForCancelRequest: ""
                    });
                  }
                }}
              />
            );
            break;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
    return popup;
  };

  renderMultipleSelectionConfirmationPopup = (ids, role) => {
    if (ids.length <= 0) return;
    let popup = <View />;

    switch (role) {
      case RoleType.SuperAdmin:
      case RoleType.HPM:
      case RoleType.PL:
      case RoleType.SM:
      case RoleType.PM: {
        popup = (
          <ConfirmationModal
            message={rejectMsgPopup}
            confirmAction={() => {
              this.setState({
                showConfirmRejectPopup: false
              });
              this.handleRequestWithType(ActionRequestType.Reject, ids);
            }}
            cancelAction={() => {
              this.setState({
                showConfirmRejectPopup: false
              });
            }}
            show={this.state.showConfirmRejectPopup}
            negativeTitle={"No"}
            positiveTitle={"Yes"}
            negativeColor={"blue"}
            positiveColor={"red"}
          />
        );
        break;
      }
    }
    return popup;
  };

  getListData = convertData => {
    if (this.state.enableSearchInput) {
      if (this.state.keyword == "") {
        return (
          <Text
            style={{
              fontFamily: FontNames.RobotoRegular,
              fontSize: 16,
              color: AppColors.grayTextColor,
              textAlign: "center"
            }}
          >
            Input keyword to search
          </Text>
        );
      } else {
        if (this.props.data && this.props.data.length > 0) {
          return (
            <FlatList
              style={{ flex: 1 }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={convertData}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return this.renderRow(item, index);
              }}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
              ListFooterComponent={this.props.renderFooter}
            />
          );
        } else {
          return (
            <Text
              style={{
                fontFamily: FontNames.RobotoRegular,
                fontSize: 16,
                color: AppColors.grayTextColor,
                textAlign: "center"
              }}
            >
              No Results
            </Text>
          );
        }
      }
    } else {
      if (this.state.warningApplyFilter) {
        return (
          <Text
            style={{
              fontFamily: FontNames.RobotoRegular,
              fontSize: 16,
              color: AppColors.grayTextColor,
              textAlign: "center"
            }}
          >
            Please apply search input or filter using any of the parameters to
            load the requests.
          </Text>
        );
      } else {
        return convertData.length > 0 ? (
          <FlatList
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={convertData}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return this.renderRow(item, index);
            }}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            ListFooterComponent={this.props.renderFooter}
          />
        ) : (
          <Text
            style={{
              fontFamily: FontNames.RobotoRegular,
              fontSize: 16,
              color: AppColors.grayTextColor,
              textAlign: "center"
            }}
          >
            No data
          </Text>
        );
      }
    }
  };

  render() {
    // let sortData = this.props.data.sort((a, b) => {
    //   return b.requestDetailNo - a.requestDetailNo
    // })
    let convertData = RequestHelper.getInstance().getData(
      this.state.columns,
      this.props.data
    );
    const {
      showAction,
      isShowButtonReview,
      isShowButtonChange,
      isAllowAll,
      showAlertCancel,
      isShowActionCancel
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {!this.state.selectedCheckAllBtn &&
          !this.state.selectedSettingBtn &&
          this.renderTopHeader()}
        {this.state.selectedCheckAllBtn &&
          this.renderAlertPopup(this.props.role)}
        {this.state.selectedSettingBtn && this.renderColumnsSettingPopup()}
        {this.renderFilterHeader()}
        {this.props.data ? (
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center" }}
            activeOpacity={0.9}
            onPress={() => {
              // if (this.state.keyword === '') {
              //   Keyboard.dismiss();
              //   this.setState({
              //     keyword: '',
              //     enableSearchInput: false,
              //     activeGoAction: false,
              //     activeCloseAction: false,
              //   }, () => {
              //     // this.getData(0, true)
              //   })
              //   this.searchInput.current.searchInput.current.blur()
              //   this.props.inputSearchKey('')
              // }
            }}
          >
            {this.getListData(convertData)}
            {this.renderColumnSetting()}
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAction}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                this.setState({
                  showAction: false
                });
              }}
            />
            <SafeAreaView
              style={{
                backgroundColor: "#fff",
                paddingHorizontal: 20,
                borderTopWidth: 1
              }}
            >
              {this.renderButtonsWithRole(
                this.state.selectedRowId,
                this.props.role
              )}
            </SafeAreaView>
          </View>
        </Modal>
        {this.renderConfirmationPopup(
          this.state.selectedRowId,
          this.props.role
        )}
        {this.renderMultipleSelectionConfirmationPopup(
          this.state.selectedRequests,
          this.props.role
        )}
      </View>
    );
  }
}

export default connect(
  state => ({
    filterData: state.request.filterData,
    totalPage: state.request.totalPage,
    page: state.request.page,
    filterDateRange: state.request.filterDateRange,
    data: state.request.requests,
    userInfo: state.auth.userInfo,
    totalItem: state.request.totalItem
  }),
  dispatch =>
    bindActionCreators(
      {
        getRequestsAction,
        inputSearchKey,
        saveColumnsSetting,
        pushNav,
        showLoading,
        clearRequestData
      },
      dispatch
    )
)(Option2ListRequest);

const styles = StyleSheet.create({
  titleBtn: { fontFamily: FontNames.RobotoBold, fontSize: 12 },
  btn: {
    flex: 1,
    height: 32,
    borderRadius: 3,
    backgroundColor: AppColors.backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  },
  rowAlert: {
    flexDirection: "row",
    width: 228,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    left: -5,
    top: 0,
    bottom: 0
  },
  alertGroupBtn: {
    width: 230,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 22,
    alignItems: "center"
  },

  topHeaderContainer: {
    flexDirection: "row",
    height: 52,
    alignItems: "center",
    paddingLeft: 26,
    paddingRight: 20,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.17)"
  },
  headerContainer: {
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.17)"
  },
  groupCircleBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 5
  },
  setRangeTitle: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 16,
    color: AppColors.blueTextColor
  },
  dateRangeTxt: {
    flex: 1,
    marginLeft: 10,
    fontFamily: FontNames.RobotoRegular,
    color: AppColors.grayTextColor
  },
  btn: {
    width: 84,
    height: 32,
    borderRadius: 3,
    backgroundColor: AppColors.backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  },
  titleBtn: { fontFamily: FontNames.RobotoBold, fontSize: 12 },
  alert: {
    flexDirection: "row",
    height: 60,
    backgroundColor: AppColors.blueBackgroundColor,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  contentAlert: {
    flex: 1,
    fontFamily: FontNames.RobotoRegular,
    fontSize: 13,
    color: AppColors.whiteTitle
  },
  groupAlertBtn: {
    width: 175,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
  settingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.backgroundColor,
    paddingLeft: 24,
    paddingTop: 20
  },
  selectColumnTitileSetting: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 15,
    color: AppColors.blackTextColor
  },
  rowSetting: {
    flexDirection: "row",
    height: 36,
    marginBottom: 16,
    alignItems: "center"
  },
  alertPopupContainer: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.17)"
  },
  alertPopTxt: {
    fontFamily: FontNames.RobotoRegular,
    fontSize: 12,
    color: AppColors.grayTextColor,
    alignSelf: "flex-start"
  },
  btnAlertPopupGroup: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  statusTxtContainer: {
    width: 88,
    height: 19,
    borderRadius: 9,
    marginLeft: 15,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  statusTxt: {
    fontFamily: FontNames.RobotoBold,
    fontSize: 11,
    color: AppColors.whiteTitle
  },
  statusFilter: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#7ed321",
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 2,
    marginBottom: 2
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: AppColors.confirmAlertBackground
  },
  buttonPartnerAction: {
    borderRadius: 5,
    height: 40,
    width: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  textButton: {
    color: "#fff",
    fontFamily: FontNames.RobotoBold
  }
});
