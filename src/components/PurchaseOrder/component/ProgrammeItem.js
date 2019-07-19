/**
 * Created by Hong HP on 4/22/19.
 */

import React from 'react';
import {TouchableOpacity, Dimensions, Text, StyleSheet} from 'react-native';
import {FontNames} from '../../../theme/fonts';

const {width} = Dimensions.get('window')

export function ProgrammeItem({data, onPress}) {
  return <TouchableOpacity style={styles.itemWrapper}
                           onPress={() => {
                             onPress()
                           }}>
    <Text style={styles.title}>{data.menuName}</Text>
    <Text style={styles.subTitle}>{data.totalUnit} POs</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: width / 2 - 25,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#979797',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 2.3,
    marginBottom: 8
  },
  titleStyle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: FontNames.RobotoBold
  },
  subTitle: {
    fontSize: 16,
    color: '#333333',
    fontFamily: FontNames.RobotoRegular
  }
})