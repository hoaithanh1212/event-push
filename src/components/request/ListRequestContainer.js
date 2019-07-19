import React, {Component} from 'react';
import {
  View, Alert
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

var get = require('lodash.get');

import {pushNav} from '../../actions/navigate';
import {Message} from '../../common/Message';
import {
  ActionRequestType,
  getRequestsAction, selectRequest
} from '../../actions/request';
import Option2ListRequest from './presenters/Option2ListRequest';
import DashBoardHeader from '../dashboard/presenters/DashBoardHeader';
import {RouteKey} from '../../contants/route-key';
import {
  approveCancelRequest, confirmChangeRequest,
  checkInRequest, handleRequest
} from '../../services/requestService';
import {showMessage} from '../../common/Message';
import {Images} from '../../theme/images';

class ListRequestContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      refreshing: false,
    };
  }

  static navigationOptions = ({navigation}) => ({
    header: <DashBoardHeader
      title={'Request Management'}
      leftAction={() => {
        navigation.openDrawer();
      }}
      rightAction={() => {
        navigation.navigate(RouteKey.CalendarScreen)
      }}
      rightIcon={Images.dateIcon}
    />
  })

  componentDidMount() {
  }

  //Normal case

  approve = (ids) => {
    console.log('ids approve------>', ids)
    handleRequest(ids, ActionRequestType.Approve).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully approved', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  trainerConfirm = (ids) => {
    console.log('ids trainer confirm------>', ids)
    handleRequest(ids, ActionRequestType.Approve).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully confirmed', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  reject = (ids) => {
    console.log('ids reject------>', ids)
    handleRequest(ids, ActionRequestType.Reject).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully rejected', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message'))
      }
    })
  }

  //Pending Cancel case
  approveForPendingCancel = (ids) => {
    console.log('ids approveForPendingCancel------>', ids)
    approveCancelRequest(ids, ActionRequestType.Approve).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully approved', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  rejectForPendingCancel = (ids) => {
    console.log('ids rejectForPendingCancel------>', ids)
    approveCancelRequest(ids, ActionRequestType.Reject).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully rejected', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  //Change case
  approveForChanged = (ids) => {
    console.log('ids approveForChanged------>', ids)
    confirmChangeRequest(ids, ActionRequestType.Approve).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully approved', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  rejectForChanged = (ids) => {
    console.log('ids rejectForChanged------>', ids)
    confirmChangeRequest(ids, ActionRequestType.Reject).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully rejected', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  checkInForRequest = (ids) => {
    console.log('ids check in------>', ids)
    checkInRequest(ids).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully checked in', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        this.getData(0, true)
      } else {
        showMessage(get(res, 'message', ''))
      }
    })
  }

  assignFacilitator = (id) => {
    this.props.selectRequest(id)
    this.props.pushNav(RouteKey.AssignRequest, {
      dashboardstatus: get(this.props.navigation.state.params, 'dashboardstatus', ''),
      isAssignFacilitator: true
    })
  }

  selectRequest = (id) => {
    this.props.selectRequest(id)
    this.props.pushNav(RouteKey.AssignRequest, {
      dashboardstatus: get(this.props.navigation.state.params, 'dashboardstatus', '')
    })
  }

  goToAssignSPScreen = (id, callback) => {
    this.props.selectRequest(id)
    this.props.navigation.navigate(RouteKey.AssignSP, {
      getData: () => {
        if (callback) callback()
        this.getData(0, false)
      }
    })
  }



  //Search data
  getIdsForSearching = (data) => {
    let ids = []
    data.filter((item) => item.selected)
      .map((item) => {
        ids.push(item.id)
      })

    return ids
  }

  getData = (page, showLoading) => {
    let searchDetail = []

    const navParams = this.props.navigation.state.params
    if (navParams && get(navParams, 'dashboardstatus', '')) {
      let value = get(navParams, 'dashboardstatus', '')
      value && searchDetail.push({key: 'dashboardstatus', value: value})
    }
    console.log('searchDetail', searchDetail)

    this.props.columns
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
      startDate, endDate, searchDetail, page, showLoading
    );
  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE'
        }}
      >
        <ActivityIndicator animating size="large"/>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Message/>
        <Option2ListRequest
          data={this.props.requests}
          role={this.props.role}
          approve={this.approve}
          trainerConfirm={this.trainerConfirm}
          reject={this.reject}
          approveForPendingCancel={this.approveForPendingCancel}
          rejectForPendingCancel={this.rejectForPendingCancel}
          approveForChanged={this.approveForChanged}
          rejectForChanged={this.rejectForChanged}
          checkInForRequest={this.checkInForRequest}
          renderFooter={this.renderFooter}
          refreshing={this.state.refreshing}
          pushNav={this.props.pushNav}
          selectRequest={this.selectRequest}
          navigation={this.props.navigation}
          goToAssignSPScreen={this.goToAssignSPScreen}
          assignFacilitator={this.assignFacilitator}
        />

      </View>
    );
  }
}

export default connect(state => ({
    requests: state.request.requests,
    role: get(state.auth.userInfo, 'typeRole', ''),
    filterDateRange: state.request.filterDateRange,
    filterData: state.request.filterData,
    columns: state.request.columns,
    searchKey: state.request.searchKey
  }),
  dispatch => (bindActionCreators({
    pushNav,
    getRequestsAction,
    selectRequest,
  }, dispatch))
)(ListRequestContainer)