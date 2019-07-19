/**
 * Created by Hong HP on 4/24/19.
 */

import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {FontNames, Theme} from '../../../theme/fonts';
import {AppColors} from '../../../theme/colors';

export function POItemView(props) {
  const {data} = props

  return <TouchableOpacity
    onPress={() => {
      props.goToUpdatePODetail()
    }}
  >
    <View style={styles.header}>
      <Text style={{fontSize: 18, color: '#1a1a1a', fontFamily: FontNames.RobotoMedium}}>{data.poNumber}</Text>
    </View>
    <View style={{flexDirection: 'row', marginTop: 10, paddingHorizontal: 20}}>
      <View style={{flex: 1}}>
        <Text style={styles.textStyle}>Start Date</Text>
        <Text style={styles.textStyle}>Expiry Date</Text>
        <Text style={styles.textStyle}>Unit(s)</Text>
      </View>
      <View style={{flex: 2}}>
        <Text style={[styles.textStyle, {color: '#1a1a1a'}]}>{data.startDate}</Text>
        <Text style={[styles.textStyle, {color: '#1a1a1a'}]}>{data.expiryDate}</Text>
        <Text style={[styles.textStyle, {color: '#1a1a1a'}]}>{data.unit}</Text>
      </View>
    </View>


  </TouchableOpacity>
}

const styles = StyleSheet.create({
  itemView: {},
  header: {
    height: 44,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20
  },
  textStyle: {
    color: AppColors.black60,
    fontSize: 13,
    fontFamily: FontNames.RobotoRegular,
    marginBottom: 10
  }
})