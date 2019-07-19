import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {DrawerActions} from 'react-navigation';
import {getUserInfo} from "../../actions/auth";
import DashBoardHeader from '../dashboard/presenters/DashBoardHeader';
import DashBoard from './presenters/DashBoard';
import {getAvailableRequestStatus} from '../../services/appService';
import {saveAvailableRequestStatus} from '../../actions/app';
import {filterDataAction} from "../../actions/request";
import {RouteKey} from '../../contants/route-key';
import {showMessage, Message} from '../../common/Message';
var get = require('lodash.get');

class DashBoardContainer extends Component {

  static navigationOptions = ({navigation}) => ({
    header: <DashBoardHeader
      title={'dashboard'}
      leftAction={() => {
        navigation.dispatch(DrawerActions.openDrawer());
      }}
      // notifcationAction={() => {
      //   navigation.navigate(RouteKey.Notification)
      // }}
      rightAction={() => {
        navigation.navigate(RouteKey.UserProfile)
      }} />
  })

  componentDidMount() {
    getAvailableRequestStatus().then(res => {
      if (res.statusCode === 200) {
        this.props.saveAvailableRequestStatus(get(res, 'data.list', []))
        try {
          let result = get(res, 'data.list', []);
          let lstStatus = [];
          lstSt = [];

          if (result) {
            lstStatus = result.map(st => {
              return {...st, selected: true};
            });

            lstStatus.map(st => {
              if (st.nameStatus != "NA") {
                lstSt.push(st);
              }
            })

            let lstFilterData = {
              programs: this.props.lstFilterData.programs,
              districts: this.props.lstFilterData.districts,
              grcs: this.props.lstFilterData.grcs,
              divisions: this.props.lstFilterData.divisions,
              status: lstSt,
              isActFilterProgram: false,
              isActFilterStatus: false,
              isActFilterDistrict: false,
              isActFilterDivision: false,
              isActFilterGRC: false
            };
            this.props.filterDataAction(lstFilterData);
          }
        } catch (err) {
          showMessage(get(err, "message", ""))
        }
      }
    })
  }

  render() {
    return <View style={{flex: 1}}>
      <Message />
      <DashBoard {...this.props} />
    </View>
  }
}

export default connect(
  state => ({
    lstFilterData: state.request.filterData
  }),
  dispatch =>
    bindActionCreators(
      {
        getUserInfo,
        saveAvailableRequestStatus,
        filterDataAction
      },
      dispatch
    )
)(DashBoardContainer);
