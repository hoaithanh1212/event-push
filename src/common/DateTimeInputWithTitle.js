import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform, TouchableOpacity, Image
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import {AppColors} from '../theme/colors';
import {FontNames} from '../theme/fonts';

export default class DateTimeInputWithTitle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTouched: false,
      isDateTimePickerVisible: false,
      date: '',
      time: ''
    };
  }

  onChangeValue() {
  }

  onShowValue() {
  }

  handleInputFocus = () => this.setState({isTouched: true})

  handleInputBlur = () => this.setState({isTouched: false})

  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = (date) => {
    const {mode, changeText} = this.props
    console.log('A date has been picked: ', date);
    if (mode === 'time') {
      let minutes = date.getMinutes()
      let time = date.getHours() + ':'
      if (minutes <= 9) {
        time += '0' + minutes.toString()
      } else {
        time += minutes
      }
      this.setState({time: time})
      if (!!changeText) {
        changeText(time)
      }
    } else {
      this.setState({date: date})
      if (!!changeText) {
        changeText(date)
      }
    }

    this._hideDateTimePicker();
  };


  render() {

    let {
      message, changeText, date, time, title,
      placeholder = 'dd/mm/yyyy', mode = 'date', tailIcon,
      minimumDate, disable, containerStyle
    } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          disabled={disable}
          onPress={this._showDateTimePicker}
          style={[styles.border, {
            borderColor: message
              ? AppColors.errorTextInputBorderColor
              : (this.state.isTouched ? AppColors.touchedTextInputBorderColor : AppColors.normalTextInputBorderColor)
          }]}>
          <TextInput
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            underlineColorAndroid="rgba(0,0,0,0)"
            value={date || time}
            autoCorrect={false}
            style={styles.input}
            placeholder={placeholder}
            onChangeText={value => {
              changeText && changeText(value)
            }}
            placeholderTextColor="black"
            editable={false}
          />
          {!!tailIcon && <Image source={tailIcon} style={styles.icon}/>}
          <DateTimePicker
            titleIOS={mode === 'time' ? 'Pick a time' : 'Pick a date'}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode={mode}
            is24Hour={true}
            minimumDate={mode === 'time' ? null : minimumDate}
            date={!!date ? moment(date, 'DD/MM/YYYY').toDate() : mode === 'time' ? moment(time ? time : '00:00', 'HH:mm').toDate() : minimumDate}
            datePickerModeAndroid={mode === 'time' ? 'spinner' : 'calendar'}
          />
          {!!title && <Text style={[styles.title, {
            color: message
              ? AppColors.errorTextInputBorderColor
              : (this.state.isTouched ? AppColors.touchedTextInputBorderColor : AppColors.normalTextInputBorderColor)
          }]}>{title}</Text>}
        </TouchableOpacity>
        {
          message ? <View style={styles.errorText}>
            <Text style={styles.text}>{message}</Text>
          </View> : <View/>
        }
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5, marginBottom: 5
  },
  input: {
    marginLeft: 5,
    marginTop: Platform.OS.toLocaleUpperCase() === 'ios'.toLocaleUpperCase() ? 0 : 5,
    color: '#333333',
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
    flex: 1,
  },
  border: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  errorText: {
    width: '100%',
    marginTop: 3,
  },
  text: {color: AppColors.errorTextColor, fontFamily: FontNames.RobotoRegular},
  title: {
    position: 'absolute',
    top: -11,
    left: 10,
    padding: 5,
    backgroundColor: 'white',
    fontFamily: FontNames.RobotoRegular,
    fontSize: 12
  },
  icon: {width: 24, height: 24, marginRight: 16}
});
