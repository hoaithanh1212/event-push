/**
 * Created by Hong HP on 3/18/19.
 */

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import RadioButton from './RadioButton';
import {FontNames} from '../theme/fonts';

const listDayInMonth = [{value: 0}, {value: 1}, {value: 2}, {value: 3}, {value: 4}, {value: 5}, {value: 6}]

export default class CalendarPicker extends React.Component {
  constructor() {
    super()
  }

  render() {
    const {onItemSelected, listValue} = this.props
    const week1 = listValue.find(item => item.week === 1)
    const week2 = listValue.find(item => item.week === 2)
    const week3 = listValue.find(item => item.week === 3)
    const week4 = listValue.find(item => item.week === 4)
    const lastWeek = listValue.find(item => item.week === 5)
    return <View style={{backgroundColor: '#f7f7f7', padding: 16}}>
      <View style={{flexDirection: 'row', marginBottom: 8}}>
        <View style={{width: 60}}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
          <Text style={styles.itemStyle}>Sun</Text>
          <Text style={styles.itemStyle}>Mon</Text>
          <Text style={styles.itemStyle}>Tue</Text>
          <Text style={styles.itemStyle}>Wed</Text>
          <Text style={styles.itemStyle}>Thu</Text>
          <Text style={styles.itemStyle}>Fri</Text>
          <Text style={styles.itemStyle}>Sat</Text>
        </View>
      </View>
      <RowItem label={'W.1'} backgroundColor={'#f0f0f0'}
               value={week1}
               onItemSelected={(value) => {
                 onItemSelected({
                   week: 1,
                   dayOfWeeks: value
                 })
               }}
      />
      <RowItem label={'W.2'}
               value={week2}
               onItemSelected={(value) => {
                 onItemSelected({
                   week: 2,
                   dayOfWeeks: value
                 })
               }}
      />
      <RowItem label={'W.3'} backgroundColor={'#f0f0f0'}
               value={week3}
               onItemSelected={(value) => {
                 onItemSelected({
                   week: 3,
                   dayOfWeeks: value
                 })
               }}
      />
      <RowItem label={'W.4'}
               value={week4}
               onItemSelected={(value) => {
                 onItemSelected({
                   week: 4,
                   dayOfWeeks: value
                 })
               }}
      />
      <RowItem label={'Last W.'} backgroundColor={'#f0f0f0'}
               value={lastWeek}
               onItemSelected={(value) => {
                 onItemSelected({
                   week: 5,
                   dayOfWeeks: value
                 })
               }}
      />
    </View>
  }
}

class RowItem extends React.Component {
  render() {
    const {label, backgroundColor, value, onItemSelected} = this.props
    return <View style={[styles.rowItemWrapper]}>
      <Text style={{width: 60, color: '#128ff9', fontFamily: FontNames.RobotoMedium}}>{label}</Text>
      <View style={{
        backgroundColor: backgroundColor,
        flexDirection: 'row',
        paddingVertical: 7,
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth, borderColor: '#e1e1e1'
      }}>
        {
          listDayInMonth.map((item, index) => {
            return <View style={{flex: 1, alignItems: 'center'}}
                         key={label + index.toString()}>
              <RadioButton
                onSelected={() => onItemSelected(item.value)}
                isChecked={!!value && value.dayOfWeeks === index}
              />
            </View>
          })
        }
      </View>

    </View>
  }
}

const styles = StyleSheet.create({
  rowItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemStyle: {
    flex: 1,
    color: '#128ff9',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FontNames.RobotoMedium
  }
})