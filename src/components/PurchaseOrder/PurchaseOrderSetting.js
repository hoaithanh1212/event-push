/**
 * Created by Hong HP on 4/24/19.
 */


import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Alert} from 'react-native';
import moment from 'moment/moment';
import {Images} from '../../theme/images';
import DateTimeInputWithTitle from '../../common/DateTimeInputWithTitle';
import TextInputWithTitle from '../../common/TextInputWithTitle';
import {addNewPO, updateDataPO} from '../../services/poService';
import {AppColors} from '../../theme/colors';
import {connect} from 'react-redux';
import {getListPOProgramme, getListSPByProgramme} from '../../actions/poAction';


PurchaseOrderSetting.navigationOptions = ({navigation}) => {
  let title = navigation.getParam('title', 'ADD PO')
  return {
    headerTitle: title
  }
}

let programId = ''
let userSpId = ''
let poId = ''

function PurchaseOrderSetting(props) {
  const [startDate, setStartDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [unit, setUnit] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    programId = props.navigation.getParam('programId')
    userSpId = props.navigation.getParam('userSpId')
    let dataPO = props.navigation.getParam('dataPO')
    if (dataPO) {
      props.navigation.setParams({
        title: `PO NO.${dataPO.poNumber}`
      })
      setStartDate(dataPO.startDate)
      setExpiryDate(dataPO.expiryDate)
      setUnit(dataPO.unit)
      setIsUpdate(true)
      poId = dataPO.id

    }

  }, [])

  useEffect(() => {
    if (startDate && expiryDate && unit) {
      setDisabled(false)
    } else {
      if (!disabled) {
        setDisabled(true)
      }
    }
  }, [startDate, expiryDate, unit])

  function submitNewPO() {
    addNewPO(programId, userSpId, unit, expiryDate, startDate).then(data => {
      if (data.statusCode === 200) {
        let getListPO = props.navigation.getParam('getListPO')
        let programType = props.navigation.getParam('programType')
        if (getListPO) getListPO()
        props.getListPOProgramme()
        props.getListSPByProgramme(programType)
        props.navigation.pop()
        Alert.alert('', 'Add purchase order successfully!', [{
          text: 'Ok'
        }])
      } else {

      }
    })
  }

  function updateData() {
    updateDataPO(poId, unit, expiryDate, startDate).then(data => {
      if (data.statusCode === 200) {
        let getListPO = props.navigation.getParam('getListPO')
        let programType = props.navigation.getParam('programType')
        if (getListPO) getListPO()
        props.getListPOProgramme()
        props.getListSPByProgramme(programType)
        props.navigation.pop()
        Alert.alert('', 'Update purchase order successfully!', [{
          text: 'Ok'
        }])
      } else {
        Alert.alert('', 'Update failure. Please try again!', [{
          text: 'Ok'
        }])
      }
    })
  }

  return <View style={styles.container}>
    <DateTimeInputWithTitle
      placeholder={'Start Date'}
      title={'Start Date'}
      tailIcon={Images.dateIcon}
      date={startDate}
      minimumDate={new Date()}
      changeText={(text) => {
        setStartDate(moment(text).format('DD/MM/YYYY'))
      }}
      containerStyle={{marginBottom: 16}}
    />
    <DateTimeInputWithTitle
      placeholder={'Expiry Date'}
      title={'Expiry Date'}
      tailIcon={Images.dateIcon}
      date={expiryDate}
      minimumDate={new Date()}
      changeText={(text) => {
        setExpiryDate(moment(text).format('DD/MM/YYYY'))
      }}
      containerStyle={{marginBottom: 16}}
    />

    <TextInputWithTitle
      placeholder={'Unit(s)'}
      title={'Unit(s)'}
      value={unit.toString()}
      changeText={(text) => setUnit(text)}
      containerStyle={{marginBottom: 16}}
    />

    <TouchableOpacity style={[styles.button, {backgroundColor: disabled ? '#d9d9d9' : AppColors.blueBackgroundColor}]}
                      onPress={() => {
                        if (isUpdate) {
                          updateData()
                        } else {
                          submitNewPO()
                        }

                      }}
                      disabled={disabled}
    >
      <Text
        style={[styles.textStyle, {color: disabled ? '#333333' : '#fff'}]}>{isUpdate ? 'Save Changes' : 'Add'}</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10
  },
  button: {
    backgroundColor: '#d9d9d9',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    height: 44
  },
})

export default connect(null, dispatch => ({
  getListPOProgramme: () => dispatch(getListPOProgramme()),
  getListSPByProgramme: programType => dispatch(getListSPByProgramme(programType))
}))(PurchaseOrderSetting)