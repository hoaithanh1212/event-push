import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform
} from 'react-native';
import {AppColors} from '../theme/colors';
import {FontNames} from '../theme/fonts';

export default class TextInputWithoutTitle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTouched: false
    };
  }

  onChangeValue() {
  }

  onShowValue() {
  }

  handleInputFocus = () => this.setState({isTouched: true})

  handleInputBlur = () => this.setState({isTouched: false})

  render() {

    let {
      placeholder, message,
      keyboardType, changeText, value, secureTextEntry, editable = true, style, maxLength = 99999999,
      multiline = false, styleTextInput
    } = this.props

    return (
      <View style={styles.container}>
        <View style={[styles.border, {
          borderColor: message
            ? AppColors.errorTextInputBorderColor
            : editable ? (this.state.isTouched ? AppColors.touchedTextInputBorderColor : AppColors.normalTextInputBorderColor)
            : AppColors.grayTextColor
        }, style]}>
          <TextInput
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            keyboardType={keyboardType || 'default'}
            underlineColorAndroid="rgba(0,0,0,0)"
            autoCorrect={false}
            value={value}
            maxLength={maxLength}
            multiline={multiline}
            editable={editable}
            style={[styles.input, styleTextInput]}
            placeholder={placeholder}
            onChangeText={value => {
              changeText && changeText(value)
            }}
            placeholderTextColor="#333333"
            secureTextEntry={secureTextEntry || false}
          />
        </View>
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
    height:
      Platform.OS.toLocaleUpperCase() === 'ios'.toLocaleUpperCase() ? 30 : 45
  },
  border: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
  },
  errorText: {
    width: '100%',
    marginTop: 3,
  },
  text: {color: AppColors.errorTextColor, fontFamily: FontNames.RobotoRegular}
});
