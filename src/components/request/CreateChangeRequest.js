/**
 * Created by Hong HP on 6/13/19.
 */


import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {changeRequest, getActivityByProgramType} from '../../services/requestService';
import {getRequestsAction} from '../../actions/request';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading} from '../../actions/app';
import moment from 'moment/moment';
import {Images} from '../../theme/images';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import {AppColors} from '../../theme/colors';
import TextInputWithoutTitle from '../../common/TextInputWithoutTitle';
import Checkbox from '../../common/Checkbox';
import {RoleType} from '../../contants/profile-field';

var get = require('lodash.get');

let repeatType = 0
let minimumDate = moment().add(30, 'days').toDate();
let requestId = ''

function CreateChangeRequest(props) {

  const [requestData, setRequestData] = useState({})
  const [isAllowAll, setAllowAll] = useState(true)
  const [disableChangeDate, setDisableChangeDate] = useState(false)

  useEffect(() => {
    const {typeRole} = props.userInfo;
    let request = props.navigation.getParam('request')
    let data = {
      startDate: request.date,
      startTime: request.startTime,
      venue: request.venue,
      venuePostalCode: request.venuePostalCode,
      remarks: request.remarks
    }
    repeatType = request.repeatType
    requestId = request.id
    setRequestData(data)
    switch (typeRole) {
      case RoleType.SuperAdmin:
      case RoleType.PM:
      case RoleType.DataEntry:
        minimumDate = moment().toDate();
        break;
    }
    if (Date.parse(moment(request.date, 'DD/MM/YYYY')) - Date.parse(moment().toDate()) > (14 * 1000 * 60 * 60 * 24)) {
      setDisableChangeDate(false)
    } else {
      setDisableChangeDate(true)
    }
  }, [])


  const getIdsForSearching = data => {
    let ids = [];
    data.filter(item => item.selected)
      .map((item, index) => {
        ids.push(item.id);
      });

    return ids;
  };


  const searchRequest = () => {

    let searchDetail = []

    const navParams = props.navigation.state.params
    if (navParams && get(navParams, 'dashboardstatus', '')) {
      let value = get(navParams, 'dashboardstatus', '')
      value && searchDetail.push({key: 'dashboardstatus', value: value})
    }
    console.log('searchDetail', searchDetail)

    props.searchKey && props.columns
      .filter(item => item.selected == true)
      .map(item => {
        return searchDetail.push({
          key: item.value,
          value: props.searchKey
        })
      })

    let grcIds = getIdsForSearching(
      get(props.filterData, 'grcs', [])
    );
    let districtsIds = getIdsForSearching(
      get(props.filterData, 'districts', [])
    );
    let programsIds = getIdsForSearching(
      get(props.filterData, 'programs', [])
    );
    let divsionsIds = getIdsForSearching(
      get(props.filterData, 'divisions', [])
    );

    let status = [];
    get(props.filterData, 'status', [])
      .filter(item => item.selected)
      .map(item => {
        return status.push(item.type);
      });

    let startDate = get(props, 'filterDateRange.startDate', '')
    let endDate = get(props, 'filterDateRange.endDate', '')

    let isActFilterProgram = get(props.filterData, 'isActFilterProgram', false)
    let isActFilterDistrict = get(props.filterData, 'isActFilterDistrict', false)
    let isActFilterDivision = get(props.filterData, 'isActFilterDivision', false)
    let isActFilterGRC = get(props.filterData, 'isActFilterGRC', false)
    let isActFilterStatus = get(props.filterData, 'isActFilterStatus', false)

    props.getRequestsAction(
      isActFilterProgram ? programsIds : [],
      isActFilterGRC ? grcIds : [],
      isActFilterDistrict ? districtsIds : [],
      isActFilterDivision ? divsionsIds : [],
      isActFilterStatus ? status : [],
      startDate, endDate, searchDetail, 0, true,
    );
  };


  const submitChangeRequest = () => {
    changeRequest({...requestData, isAllowAll}, requestId).then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        alert(res.message)
        searchRequest()
        props.navigation.pop()
      } else {
        alert(res.message)
      }
    })
  }

  return <View style={{flex: 1, paddingHorizontal: 20}}>
    <DateTimeInputWithTitle
      placeholder={'Start Time'}
      tailIcon={Images.dateIcon}
      time={requestData.startTime}
      mode={'time'}
      minimumDate={minimumDate}
      changeText={(text) => {
        setRequestData({
          ...requestData,
          startTime: moment(text).format('HH:mm')
        })
      }}
    />
    <DateTimeInputWithTitle
      placeholder={'Start Date'}
      tailIcon={Images.dateIcon}
      date={requestData.startDate}
      minimumDate={minimumDate}
      disable={disableChangeDate}
      changeText={(text) => {
        setRequestData({
          ...requestData,
          startDate: moment(text).format('DD/MM/YYYY')
        })
        setAllowAll(false)
      }}
    />
    <TextInputWithoutTitle
      placeholder="Venue Postal Code"
      value={requestData.venuePostalCode}
      maxLength={6}
      keyboardType={'numeric'}
      changeText={value => {
        setRequestData({
          ...requestData,
          venuePostalCode: value
        })
      }}
    />
    <TextInputWithoutTitle
      placeholder="Venue Description"
      value={requestData.venue}
      changeText={value => {
        setRequestData({
          ...requestData,
          venue: value
        })
      }}
    />
    <TextInputWithoutTitle
      placeholder="Remarks"
      value={requestData.remarks}
      multiline={true}
      styleTextInput={{height: 80}}
      style={{height: 80}}
      changeText={value => {
        setRequestData({
          ...requestData,
          remarks: value
        })
      }}
    />
    {
      repeatType !== 1 &&
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
                        disabled={isAllowAll}
                        onPress={() => {
                          setAllowAll(!isAllowAll)
                        }}
      >
        <Checkbox normalIcon={Images.blankIcon}
                  highlightIcon={Images.checked2Icon}
                  active={isAllowAll}/>
        <Text style={{marginLeft: 10}}>Allow to all related request</Text>
      </TouchableOpacity>
    }
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        style={styles.btnSubmit}
        onPress={() => {
          submitChangeRequest()
        }}>
        <Text style={{color: '#fff'}}>Submit</Text>
      </TouchableOpacity>
    </View>
  </View>
}

const styles = StyleSheet.create({
  btnSubmit: {
    height: 40,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: AppColors.blueBackgroundColor
  },
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
}, dispatch)))(CreateChangeRequest)