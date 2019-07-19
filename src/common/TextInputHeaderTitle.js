/**
 * Created by Hong HP on 2/22/19.
 */


import React from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';
import {FontNames} from '../theme/fonts';
import {AppColors} from '../theme/colors';

export class TextInputHeaderTitle extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {title, value, editable = false, style, inputStyle, titleStyle} = this.props
    return <View style={[styles.container, style]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={{flex: 2, justifyContent: 'center'}}>
      <Text
        style={[{}, inputStyle]}
      >{value == 'MONTHLY' ? 'CUSTOM' : value}</Text></View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 40,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed',
    justifyContent: 'center'
  },
  title: {
    fontFamily: FontNames.RobotoMedium,
    color: AppColors.black60,
    fontSize: 13,
  }
})