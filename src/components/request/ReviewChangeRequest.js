/**
 * Created by Hong HP on 3/5/19.
 */
import {View, StyleSheet, TouchableOpacity, Text, ScrollView} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import {TextInputHeaderTitle} from '../../common/TextInputHeaderTitle';
import {AppColors} from '../../theme/colors';
import {FontNames} from '../../theme/fonts';
import {acceptChangeRequest, getChangeRequestDetails, getChangeRequestDetailsGetOld, confirmChangeRequest} from '../../services/requestService';
import {bindActionCreators} from 'redux';
import {getRequestsAction} from '../../actions/request';
import {RoleType, AvailableRequestStatusKey} from '../../contants/profile-field';
import moment from 'moment';
var get = require('lodash.get');

const DAILY = 'DAILY'
const WEEKLY = 'WEEKLY'
const MONTHLY = 'MONTHLY'

class ReviewChangeRequest extends React.Component {
  constructor() {
    super()
    this.state = {
      newRequestDetails: '',
      oldRequestDetail: '',
      requestNo: ''
    }
  }

  componentDidMount() {
    this.requestId = this.props.navigation.getParam('requestId')
    const requestNo = this.props.navigation.getParam('requestNo')
    // const editRequestObject = this.props.navigation.getParam('requestDetail')

    let item = {};
    this.props.requests.map(request => {
      if (request.id == this.requestId) return (item = request);
    });
    console.log('item', item)
    if (item.status == AvailableRequestStatusKey.EndSession) {
      getChangeRequestDetailsGetOld(this.requestId).then(res => {
        if (res.statusCode === 200 && !!res.data) {
          console.log('ddd', item)
          console.log('ddd1', res.data)
          this.setState({
            requestNo: requestNo,
            newRequestDetails: item,
            oldRequestDetail: res.data,
          })
        }
      })
    } else {
      getChangeRequestDetails(this.requestId).then(res => {
        if (res.statusCode === 200 && !!res.data) {
          console.log('ddd', item)
          console.log('ddd1', res.data)
          this.setState({
            requestNo: requestNo,
            newRequestDetails: res.data,
            oldRequestDetail: item,
          })
        }
      })
    }
  }

  acceptChangeRequest = (isApprove) => {
    acceptChangeRequest([this.requestId], isApprove).then(res => {
      if (res.statusCode === 200) {
        this.searchRequest()
        this.props.navigation.pop()
      } else {
        alert(res.message)
      }
    })
  }

  confirmChangeRequest = (isApprove) => {
    confirmChangeRequest([this.requestId], isApprove).then(res => {
      if (res.statusCode === 200) {
        this.searchRequest()
        this.props.navigation.pop()
      } else {
        alert(res.message)
      }
    })
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

  renderButton() {
    this.requestId = this.props.navigation.getParam('requestId')
    let item = {};
    this.props.requests.map(request => {
      if (request.id == this.requestId) return (item = request);
    });
    const {userInfo} = this.props
    switch(userInfo.typeRole) {
      case RoleType.HPM: {
        if (item.status == AvailableRequestStatusKey.ChangeRequest) {
          return <View style={styles.actionWrapper}>
              <TouchableOpacity
                  style={[styles.btnStyles, {backgroundColor: AppColors.approveBtnBackground}]}
                  onPress={() => {
                    this.confirmChangeRequest(true)
                  }}>
                  <Text style={{color: '#fff'}}>APPROVE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnStyles, {backgroundColor: AppColors.rejectBtnBackground}]}
                onPress={() => {
                  this.confirmChangeRequest(false)
                }}>
                <Text style={{color: '#fff'}}>REJECT</Text>
              </TouchableOpacity>
            </View>
        }
        break;
      }
      case RoleType.SP: {
        if (item.status == AvailableRequestStatusKey.EndSession) {
          return <View style={styles.actionWrapperAccept}>
            <TouchableOpacity
              style={[styles.btnStyles, {backgroundColor: AppColors.approveBtnBackground}]}
              onPress={() => {
                this.acceptChangeRequest(true)
              }}>
              <Text style={{color: '#fff'}}>ACCEPT</Text>
            </TouchableOpacity>
          </View>
        }
        break;
      }
      default: {
        return <View />
      }
    }
  }

  render() {
    const {newRequestDetails, oldRequestDetail, requestNo} = this.state
    const {userInfo} = this.props
    return <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      style={{flex: 1}}
    >
      <View style={styles.container}>
      <Text style={{color: AppColors.black60, fontSize: 16, marginTop: 12}}
        numberOfLines={1}
      >Activity ID: {requestNo}</Text>
      <View style={styles.dataContainer}>
        <TextInputHeaderTitle
          title={'NEW REQUEST'}
          titleStyle={{color: AppColors.blueTextColor}}
        />
        <TextInputHeaderTitle
          title={'Start Date'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.startDate ? newRequestDetails.startDate : newRequestDetails.date}
        />
        <TextInputHeaderTitle
          title={'Start Time'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.startTime}
        />
        <TextInputHeaderTitle
          title={'Partner Name'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.partnerName}
        />
        <TextInputHeaderTitle
          title={'POC Name'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.partnerPoc && newRequestDetails.partnerPoc != '' ? newRequestDetails.partnerPoc : newRequestDetails.userPartner}
        />
        {!!newRequestDetails.activityName && <TextInputHeaderTitle
          title={'Activity Name'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.activityName}
        />}
        {!!newRequestDetails.venue && <TextInputHeaderTitle
          title={'Venue'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.venue}
        />}

        {!!newRequestDetails.venuePostalCode && <TextInputHeaderTitle
          title={'Venue Postal Code'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.venuePostalCode}
        />}
        {!!newRequestDetails.remarks && <TextInputHeaderTitle
          title={'Remarks'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.remarks}
        />}
        {!!newRequestDetails.language && <TextInputHeaderTitle
          title={'Language'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.language}
        />}
        {!!newRequestDetails.expectedNumberOfPax && <TextInputHeaderTitle
          title={'Expected Attendance'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={newRequestDetails.expectedNumberOfPax}
        />}
      </View>
      <View style={styles.dataContainer}>
        <TextInputHeaderTitle
          title={'OLD REQUEST'}
          titleStyle={{color: AppColors.blueTextColor}}
        />
        <TextInputHeaderTitle
          title={'Start Date'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.startDate ? oldRequestDetail.startDate : oldRequestDetail.date}
        />
        <TextInputHeaderTitle
          title={'Start Time'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.startTime}
        />
        <TextInputHeaderTitle
          title={'Partner Name'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.partnerName}
        />
        <TextInputHeaderTitle
          title={'POC Name'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.partnerPoc && oldRequestDetail.partnerPoc != '' ? oldRequestDetail.partnerPoc : oldRequestDetail.userPartner}
        />
        {!!oldRequestDetail.activityName && <TextInputHeaderTitle
          title={'Activity Name'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.activityName}
        />}
        {!!oldRequestDetail.venue && <TextInputHeaderTitle
          title={'Venue'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.venue}
        />}

        {!!oldRequestDetail.venuePostalCode && <TextInputHeaderTitle
          title={'Venue Postal Code'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.venuePostalCode}
        />}
        {!!oldRequestDetail.remarks && <TextInputHeaderTitle
          title={'Remarks'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.remarks}
        />}
        {!!oldRequestDetail.language && <TextInputHeaderTitle
          title={'Language'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.language}
        />}
        {!!oldRequestDetail.expectedNumberOfPax && <TextInputHeaderTitle
          title={'Expected Attendance'}
          titleStyle={{flex: 1}}
          inputStyle={styles.textStyle}
          value={oldRequestDetail.expectedNumberOfPax}
        />}
      </View>
      {this.renderButton()}
    </View>
    </ScrollView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 10
  },
  dataContainer: {
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
    paddingHorizontal: 10
  },
  textStyle: {
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    color: AppColors.black60
  },
  actionWrapperAccept: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30
  },
  actionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30
  },
  btnStyles: {
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  }
})

export default connect(state => ({
  userInfo: state.auth.userInfo,
  filterDateRange: state.request.filterDateRange,
  filterData: state.request.filterData,
  columns: state.request.columns,
  searchKey: state.request.searchKey,
  requests: state.request.requests,
}), dispatch => (bindActionCreators({
  getRequestsAction
}, dispatch)))(ReviewChangeRequest)