/**
 * Created by Hong HP on 5/13/19.
 */


import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Platform, StyleSheet, Alert, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import {FontNames} from '../../theme/fonts';
import Autocomplete from 'react-native-autocomplete-input';
import {AppColors} from '../../theme/colors';
import {assignRequest, getListSP} from '../../services/requestService';
import {showMessage} from '../../common/Message';
import AutoCompleteComponent from '../../common/AutoCompleteComponent';

function AssignSPScreen(props) {
  const {selectedRequests, navigation} = props
  const [listSP, setListSP] = useState([])
  const [userSPSelected, setUserSPSelected] = useState('')
  const [dataFilter, setDataFilter] = useState([])
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    getListSP(selectedRequests).then(data => {
      if (data.statusCode === 200) {
        setListSP(data.data)
      }
    })
  }, [])

  function filterUserSP(keyword) {
    setKeyword(keyword)
    let listFilterSP = listSP.filter(item => item.pocName && item.pocName.toLowerCase().includes(keyword.toLowerCase()))
    if (listFilterSP) {
      setDataFilter(listFilterSP)
    } else {
      setDataFilter(listSP)
    }
  }

  function assignTrainerAction(userSPId, ids) {
    assignRequest(userSPId, ids).then((res) => {
      if (res.statusCode === 200) {
        Alert.alert('Alert', 'The request have been successfully assigned', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
        let getData = navigation.getParam('getData')
        if (getData) getData()
        navigation.pop()
      } else {
        showMessage(res.message)
      }
    })
  }

  return <View style={styles.container}>
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <Text style={{
        fontFamily: FontNames.RobotoBold,
        fontSize: 15, color: AppColors.grayTextColor
      }}>Search SP Name</Text>
      <AutoCompleteComponent
        style={{zIndex: 999, position: 'absolute', top: 25, left: 20}}
        editable={true}
        hideResults={dataFilter.length == 0}
        placeholder={'Search SP'}
        data={dataFilter}
        value={keyword}
        onChangeText={text => {
          filterUserSP(text);
        }}
        renderItem={({item}) => {
          return <TouchableOpacity style={{backgroundColor: 'white'}}
                                   onPress={() => {
                                     setUserSPSelected(item)
                                     setDataFilter([])
                                   }}>
            <Text style={{margin: 10, fontFamily: FontNames.RobotoRegular}}>{item.pocName}</Text>
          </TouchableOpacity>
        }}
      />
      {!!userSPSelected && <View style={{marginTop: 70}}>
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <Text style={styles.titleStyle}>POC Name</Text>
          <Text style={styles.contentStyle}>{userSPSelected.pocName}</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <Text style={styles.titleStyle}>POC Email</Text>
          <Text style={styles.contentStyle}>{userSPSelected.pocEmail}</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <Text style={styles.titleStyle}>POC Mobile</Text>
          <Text style={styles.contentStyle}>{userSPSelected.pocMobile}</Text>
        </View>
      </View>}
    </View>
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.button}
      onPress={() => {
        assignTrainerAction(userSPSelected.id, selectedRequests)
      }}>
      <Text style={{
        fontFamily: FontNames.RobotoBold,
        fontSize: 16, color: AppColors.whiteTitle
      }}>Confirm</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputContainer: {
    paddingLeft: 5, paddingRight: 5,
    height: Platform.OS == 'android' ? 45 : 50,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 15,
  },
  button: {
    height: 45,
    backgroundColor: AppColors.blueBackgroundColor,
    justifyContent: 'center', alignItems: 'center'
  },
  titleStyle: {
    width: 150,
    fontFamily: FontNames.RobotoBold,
    fontSize: 15, color: AppColors.grayTextColor
  },
  contentStyle: {
    flex: 1,
    fontFamily: FontNames.RobotoRegular,
    fontSize: 15, color: AppColors.grayTextColor
  }
})

export default connect(state => ({
  selectedRequests: state.request.selectedRequests,
  userInfo: state.auth.userInfo,
}), dispatch => ({}))(AssignSPScreen)