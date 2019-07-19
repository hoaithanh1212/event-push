/**
 * Created by Hong HP on 4/24/19.
 */


import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import {connect} from 'react-redux';
import ButtonWithIcon from '../../common/ButtonWithIcon';
import {Images} from '../../theme/images';
import {getPODetails} from '../../services/poService';
import {FontNames} from '../../theme/fonts';
import {POItemView} from './component/POItemView';
import {AppColors} from '../../theme/colors';
import {RouteKey} from '../../contants/route-key';

PurchaseOrderDetails.navigationOptions = ({navigation}) => {
  let title = navigation.getParam('userSP')
  return {
    headerTitle: title,
    headerRight: <TouchableOpacity style={{marginRight: 20}}
                                   onPress={() => {
                                     let goToAddPO = navigation.getParam('goToAddPO')
                                     if (goToAddPO) {
                                       goToAddPO()
                                     }
                                   }}
    >
      <Text style={{
        fontSize: 16,
        color: AppColors.blueTextColor,
        fontFamily: FontNames.RobotoBold
      }}>ADD PO</Text>
    </TouchableOpacity>
  }
}
let programType = ''
let userSpId = ''

function PurchaseOrderDetails(props) {

  const [listPO, setListPO] = useState([])
  const [POSetting, setPOSetting] = useState({})

  useEffect(() => {
    programType = props.navigation.getParam('programType')
    userSpId = props.navigation.getParam('userSpId')
    getPOData(programType, userSpId)


  }, [])


  const goToAddPO = (data) => {
    props.navigation.navigate(RouteKey.PurchaseOrderSetting, {
      programId: data.programId,
      userSpId: data.userSpId,
      programType: programType,
      getListPO: () => {
        getPOData(programType, userSpId)
      }
    })
  }

  function getPOData(programType, userSpId) {
    getPODetails(programType, userSpId).then(res => {
      console.log('getPOData: ', res)
      if (res.statusCode === 200) {
        setListPO(res.data.results.list)
        setPOSetting(res.data.poSetting)
        props.navigation.setParams({
          goToAddPO: () => {
            goToAddPO(res.data.poSetting)
          }
        })
      }
    })
  }

  function renderHeader() {
    return <View style={styles.headerStyle}>
      <View style={[styles.showNumber, {borderRightWidth: 1}]}>
        <Text style={[styles.textStyle, {fontSize: 24}]}>{POSetting.totalUnit || 0}</Text>
        <Text style={[styles.textStyle, {color: '#9f9f9f'}]}>POs</Text>
        <Text style={[styles.textStyle]}>TOTAL</Text>
      </View>
      <View style={[styles.showNumber, {borderRightWidth: 1}]}>
        <Text style={[styles.textStyle, {fontSize: 24}]}>{POSetting.numberThresholds || 0}</Text>
        <Text style={[styles.textStyle, {color: '#9f9f9f'}]}>POs</Text>
        <Text style={[styles.textStyle]}>NOTIFICATION THRESHOLD</Text>
      </View>
      <View style={styles.showNumber}>
        <Text style={[styles.textStyle, {fontSize: 24}]}>{POSetting.numberSuspension || 0}</Text>
        <Text style={[styles.textStyle, {color: '#9f9f9f'}]}>POs</Text>
        <Text style={[styles.textStyle]}>SUSPENSION THRESHOLD</Text>
      </View>
    </View>
  }

  function goToNotificationThreshold() {
    props.navigation.navigate(RouteKey.NotificationThreshold, {
      POSetting: POSetting,
      getListPO: () => {
        getPOData(programType, userSpId)
      }
    })
  }

  function goToSuspensionThreshold() {
    props.navigation.navigate(RouteKey.SuspensionThreshold, {
      POSetting: POSetting,
      getListPO: () => {
        getPOData(programType, userSpId)
      }
    })
  }

  function goToUpdatePODetail(data) {
    props.navigation.navigate(RouteKey.PurchaseOrderSetting, {
      dataPO: data,
      programType: programType,
      getListPO: () => {
        getPOData(programType, userSpId)
      }
    })
  }

  return <View style={styles.container}>
    <ButtonWithIcon icon={Images.notificationIcon}
                    title={'Notification Threshold'}
                    tailIcon={Images.rightIcon}
                    onPress={() => {
                      goToNotificationThreshold()
                    }}
                    iconStyle={{width: 16, height: 16}}
                    textStyle={{fontSize: 16, color: AppColors.black60, fontFamily: FontNames.RobotoRegular}}
                    containerStyle={{paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#d8d8d8'}}
    />
    <ButtonWithIcon icon={Images.suspensionIcon}
                    title={'Suspension Threshold'}
                    tailIcon={Images.rightIcon}
                    onPress={() => {
                      goToSuspensionThreshold()
                    }}
                    iconStyle={{width: 16, height: 16}}
                    textStyle={{fontSize: 16, color: AppColors.black60, fontFamily: FontNames.RobotoRegular}}
                    containerStyle={{paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#d8d8d8'}}
    />

    <FlatList
      data={listPO}
      ListHeaderComponent={renderHeader()}
      keyExtrator={(item, index) => index.toString()}
      renderItem={({item, index}) => <POItemView data={item}
                                                 goToUpdatePODetail={() => {
                                                   goToUpdatePODetail(item)
                                                 }}
      />}
    />

  </View>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  textStyle: {
    fontSize: 11,
    color: '#1a1a1a',
    fontFamily: FontNames.RobotoBold,
    textAlign: 'center'
  },
  showNumber: {
    alignItems: 'center',
    flex: 1,
    borderColor: '#d8d8d8'
  }
})


export default connect(null, null)(PurchaseOrderDetails)