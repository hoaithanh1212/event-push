import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {AppColors} from '../theme/colors';
import {Images} from '../theme/images';
import {FontNames} from '../theme/fonts';

export const Status = (props) => {
  let {status, color} = props
  return <View style={[styles.statusTxtContainer, {
    backgroundColor: color,
  }]}>
    <Text style={styles.statusTxt}>{status}</Text>
  </View>
}

export const DuplicateStatus = () => {
  return <View style={{
    marginLeft: 15, flexDirection: 'row',
    alignItems: 'center'
  }}>
    <Image
      style={{width: 10, height: 10}}
      source={Images.duplicateIcon}
      resizeMode="contain"
    />
    <Text style={{color: AppColors.orangeTextColor}}>Duplicate</Text>
  </View>
}

const styles = StyleSheet.create({
  statusTxtContainer: {
    height: 18, borderRadius: 9,
    marginLeft: 15,
    textAlign: 'center', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 15,
  },
  statusTxt: {
    fontFamily: FontNames.RobotoBold, fontSize: 11,
    color: AppColors.whiteTitle,
  },
})