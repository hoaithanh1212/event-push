import React, {Component} from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator,
  ScrollView,
  StyleSheet, Switch,
  AppRegistry,
  Dimensions,
  TextInput, Modal
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getRequestDetail} from '../../../services/requestService';
import * as ProgramTypes from '../../../contants/program-types';

var get = require('lodash.get');
import {Images} from '../../../theme/images';
import {FontNames} from '../../../theme/fonts';
import {AppColors} from '../../../theme/colors';
import {
  RoleType, AvailableRequestStatusKey
} from '../../../contants/profile-field';
import {Status, DuplicateStatus} from '../../../common/Status';
import RequestHelper from '../../helper/RequestHelper';

class ViewRequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: {},
      columns: [],
    };
  }

  componentDidMount() {
    const nav = this.props.navigation.state.params;
    console.log('view request detail id', nav.id)
    getRequestDetail(nav.id).then(response => {
      console.log('view request detail request', response)
      if (response.statusCode == 200) {
        this.setState({request: response.data});
      } else {
      }
    });

    let convertedColumns = this.state.columns.length == 0 ?
      (ProgramTypes.Fields ? ProgramTypes.Fields.map(item => {
        return {...item, selected: true}
      }) : []) : this.state.columns

    this.state.columns.length == 0 && this.setState({columns: convertedColumns})
  }

  renderStatus = (status, isDuplicate, statusTitle) => {
    let title = statusTitle
    let backgroundColor = ''
    switch (status) {
      case AvailableRequestStatusKey.Pending:
      case AvailableRequestStatusKey.Approve:
      case AvailableRequestStatusKey.ChangeRequest:
      case AvailableRequestStatusKey.CancelRequest: {
        backgroundColor = AppColors.yellowBackground
        break
      }
      case AvailableRequestStatusKey.Reject:
      case AvailableRequestStatusKey.Cancel: {
        backgroundColor = AppColors.rejectBtnBackground
        break
      }
      case AvailableRequestStatusKey.Confirm: {
        backgroundColor = AppColors.greenBackground
        break
      }
    }

    return <View style={{flexDirection: 'row', paddingLeft: 20, paddingRight: 12, marginBottom: 12}}>
      <Text style={{
        width: 100, fontFamily: FontNames.RobotoRegular, fontSize: 13,
        color: AppColors.black60TextColor
      }}>Status</Text>
      <Status status={title}
        color={backgroundColor} />
      {isDuplicate && <DuplicateStatus />}
    </View>
  }


  renderRow = (item, index) => {
    if (item.length) {

      let id = get(item.find(item => item.label === ProgramTypes.PropertyName.id), 'value', '')
      let requestDetailNo = get(item.find(item => item.label === ProgramTypes.PropertyName.requestDetailNo), 'value', 0)
      let isOutOfTime = get(item.find(item => item.label === ProgramTypes.PropertyName.isOutOfTime), 'value', false)
      let status = get(item.find(item => item.label === ProgramTypes.PropertyName.status), 'value', false)
      let isDuplicate = get(item.find(item => item.label === ProgramTypes.PropertyName.isDuplicate), 'value', false)
      let changeStatus = get(item.find(item => item.label === ProgramTypes.PropertyName.changeStatus), 'value', 0)
      let statusTitle = get(item.find(item => item.label === ProgramTypes.PropertyName.statusTitle), 'value', '')

      return <TouchableOpacity activeOpacity={1} onPress={() => {
      }}
        key={index}>
        <View style={{
          height: 44,
          backgroundColor: 'blue',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isOutOfTime ? AppColors.redRoseBackground : AppColors.headerRowBackground,
          paddingLeft: 20,
          paddingRight: 12,
          marginBottom: 12
        }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={{
              fontFamily: FontNames.RobotoMedium,
              fontSize: 18, color: AppColors.titleRowColor
            }}>{requestDetailNo}</Text>
            {isOutOfTime && <TouchableOpacity
              style={{marginLeft: 15}}
              activeOpacity={0.9} onPress={() => {
                this.setState({showOutOfItimeMessage: index})
                setTimeout(() => {
                  this.setState({showOutOfItimeMessage: ''})
                }, 3000)
              }}>
              <Image
                style={{width: 20, height: 20}}
                source={Images.infoIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>}
          </View>
        </View>
        {item && item.map((data, index) => {
          if (data.label !== ''
            && data.label !== ProgramTypes.PropertyName.id
            && data.label !== ProgramTypes.PropertyName.status
            && data.label !== ProgramTypes.PropertyName.isOutOfTime
            && data.label !== ProgramTypes.PropertyName.requestDetailNo
            && data.label !== ProgramTypes.PropertyName.isDuplicate
            && data.label !== ProgramTypes.PropertyName.changeStatus
            && data.label !== ProgramTypes.PropertyName.statusTitle) {
            return <View style={{flexDirection: 'row', paddingLeft: 20, paddingRight: 12, marginBottom: 12}}
              key={index}>
              <Text style={{
                width: 100, fontFamily: FontNames.RobotoRegular, fontSize: 13,
                color: AppColors.black60TextColor
              }}>{data.label}</Text>
              <Text style={{
                fontFamily: FontNames.RobotoRegular, fontSize: 13, flex: 1,
                color: AppColors.valueRowColor, paddingLeft: 15
              }}>{data.value}</Text>
            </View>
          }
        })}
        {this.renderStatus(status, isDuplicate, statusTitle)}
        {isOutOfTime && this.state.showOutOfItimeMessage === index && this.renderOutOfTimeMessageAlert()}
      </TouchableOpacity>
    }
  }

  render() {
    let convertData = RequestHelper.getInstance().getData(this.state.columns, [this.state.request])
    return <FlatList
      style={{flex: 1}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      data={convertData}
      extraData={this.state}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        return this.renderRow(item, index)
      }}
    />;
  }
}

export default connect(
  state => ({}),
  dispatch => bindActionCreators({}, dispatch)
)
  (ViewRequestDetail);

const styles = StyleSheet.create({
  titleBtn: {fontFamily: FontNames.RobotoBold, fontSize: 12},
  btn: {
    flex: 1, height: 32, borderRadius: 3,
    backgroundColor: AppColors.backgroundColor,
    alignItems: 'center', justifyContent: 'center',
  },
  rowAlert: {
    flexDirection: 'row', width: 228, justifyContent: 'flex-end',
    alignItems: 'center', position: 'absolute', left: -5, top: 0, bottom: 0
  },
  alertGroupBtn: {
    width: 230, flexDirection: 'row',
    justifyContent: 'space-between', paddingLeft: 22,
    alignItems: 'center'
  },

  topHeaderContainer: {
    flexDirection: 'row', height: 52, alignItems: 'center',
    paddingLeft: 26, paddingRight: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.17)',
  },
  headerContainer: {
    height: 76, flexDirection: 'row',
    alignItems: 'center', paddingLeft: 12, paddingRight: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.17)',
  },
  groupCircleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
  },
  setRangeTitle: {fontFamily: FontNames.RobotoRegular, fontSize: 16, color: AppColors.blueTextColor},
  dateRangeTxt: {flex: 1, marginLeft: 10, fontFamily: FontNames.RobotoRegular, color: AppColors.grayTextColor},
  btn: {
    width: 84, height: 32, borderRadius: 3,
    backgroundColor: AppColors.backgroundColor,
    alignItems: 'center', justifyContent: 'center',
  },
  titleBtn: {fontFamily: FontNames.RobotoBold, fontSize: 12},
  alert: {
    flexDirection: 'row', height: 60, backgroundColor: AppColors.blueBackgroundColor, alignItems: 'center',
    paddingLeft: 20, paddingRight: 20
  },
  contentAlert: {
    flex: 1, fontFamily: FontNames.RobotoRegular, fontSize: 13,
    color: AppColors.whiteTitle
  },
  groupAlertBtn: {width: 175, flexDirection: 'row', justifyContent: 'space-between'},

  header: {height: 50, backgroundColor: '#537791'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
  settingContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: AppColors.backgroundColor,
    paddingLeft: 24, paddingTop: 20
  },
  selectColumnTitileSetting: {fontFamily: FontNames.RobotoRegular, fontSize: 15, color: AppColors.blackTextColor},
  rowSetting: {flexDirection: 'row', height: 36, marginBottom: 16, alignItems: 'center'},
  alertPopupContainer: {
    height: 112,
    paddingRight: 20, paddingLeft: 20, paddingTop: 12, paddingBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.17)',
  },
  alertPopTxt: {
    fontFamily: FontNames.RobotoRegular, fontSize: 12,
    color: AppColors.grayTextColor, alignSelf: 'flex-start'
  },
  btnAlertPopupGroup: {
    flex: 1, alignItems: 'flex-end',
    flexDirection: 'row', justifyContent: 'space-between',
  },
  statusTxtContainer: {
    width: 88, height: 19, borderRadius: 9,
    marginLeft: 15,
    textAlign: 'center', alignItems: 'center', justifyContent: 'center'
  },
  statusTxt: {
    fontFamily: FontNames.RobotoBold, fontSize: 11,
    color: AppColors.whiteTitle,
  },
  statusFilter: {
    width: 10, height: 10, borderRadius: 10 / 2,
    backgroundColor: '#7ed321', position: 'absolute',
    right: 0, bottom: 0, marginRight: 2, marginBottom: 2
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: AppColors.confirmAlertBackground
  },
  buttonPartnerAction: {
    borderRadius: 5,
    height: 40,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    color: '#fff',
    fontFamily: FontNames.RobotoBold
  }
})
