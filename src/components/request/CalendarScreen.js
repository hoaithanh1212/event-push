/**
 * Created by Hong HP on 4/18/19.
 */

import {connect} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Agenda} from 'react-native-calendars';
import moment from 'moment';
import {getListCalendar} from '../../services/requestService';

const CalendarScreen = (props) => {

  const [daySelected, setDaySelected] = useState('')
  const [listActivity, setListActivity] = useState({})
  const [marks, setMarks] = useState({})

  useEffect(() => {
    let date = moment()
    let daySelect = {
      year: date.year(),
      month: date.month() + 1,
      dateString: date.format('YYYY-MM-DD')
    }
    setDaySelected(daySelect)
  }, [])

  function renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  function getActivityByMonth(month) {
    let key = (month.month) + '/' + month.year
    if (!listActivity[key]) {
      getListCalendar(moment(key, 'MM/YYYY').format('DD/MM/YYYY'),
        moment(key, 'MM/YYYY').endOf('month').format('DD/MM/YYYY'))
        .then(res => {
          console.log('getActivityByMonth', res)
          if (res.statusCode === 200) {
            let dataFormat = formatListActivity(res.data, key)
            formatListMarks(res.data)
            setListActivity({...listActivity, ...dataFormat})
          }
        })
    }
  }

  function formatListActivity(listActivity, key) {
    let objMonth = {}
    listActivity.map(item => {
      objMonth[moment(item.date, 'DD/MM/YYYY').format('YYYY-MM-DD')] = item.detailCalendars
    })
    return {
      [key]: objMonth
    }
  }

  function formatListMarks(listActivity) {
    let objMarks = marks
    listActivity.map(item => {
      objMarks[moment(item.date, 'DD/MM/YYYY').format('YYYY-MM-DD')] = {marked: true}
    })
    setMarks(objMarks)
  }

  function renderItem(item, day) {
    return (
      <View style={[styles.item]}>
        <Text>Activity Id: {item.serial}</Text>
        <Text>{item.programName}</Text>
        <Text>Start Time: {item.startTime}</Text>
      </View>
    );
  }

  function getActivityOfDay() {
    if (!daySelected) return {}
    let key = daySelected.month + '/' + daySelected.year
    if (!listActivity[key]) return {
      [daySelected.dateString]: []
    }
    return {
      [daySelected.dateString]: listActivity[key][daySelected.dateString]
    }

  }

  return <View style={{flex: 1}}>
    <Agenda
      items={getActivityOfDay()}
      loadItemsForMonth={(month) => {
        getActivityByMonth({...month, month: month.month - 1})
        getActivityByMonth(month)
        getActivityByMonth({...month, month: month.month + 1})
      }}
      onCalendarToggled={(calendarOpened) => {
        console.log(calendarOpened)
      }}
      onDayPress={(day) => {
        setDaySelected(day)
      }}
      onDayChange={(day) => {
        console.log('day pressed', day)
      }}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      renderDay={(day, item) => <View/>}
      rowHasChanged={(r1, r2) => {
        return r1.text !== r2.text
      }}
      pastScrollRange={50}
      futureScrollRange={50}
      refreshing={false}
      theme={{
        agendaDayTextColor: 'yellow',
        agendaDayNumColor: 'green',
        agendaTodayColor: 'red',
        agendaKnobColor: '#B7C3CF'
      }}
      markedDates={marks}
      // agenda container style
      style={{flex: 1}}
    />
  </View>

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
})

export default connect(state => ({

}), dispatch => ({

}))(CalendarScreen)