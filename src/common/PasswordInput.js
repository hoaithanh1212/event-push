import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform, TouchableOpacity, Image
} from 'react-native';
import {AppColors} from '../theme/colors';
import {FontNames} from '../theme/fonts';
import {Images} from '../theme/images';

export default class PasswordInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTouched: false,
      isShowPassword: false,
    };
  }

  onChangeValue() {
  }

  onShowValue() {
  }


  handleInputFocus = () => this.setState({isTouched: true})

  handleInputBlur = () => this.setState({isTouched: false})

  onShowPassword = () => {
    this.setState({isShowPassword: !this.state.isShowPassword});
  }

  renderIcon = () => {
    return <TouchableOpacity
      style={{
        height: '100%',
        width: 60,
        justifyContent: 'center', alignItems: 'center',
      }}
      onPress={this.onShowPassword}
    >
      <Image
        style={{width: 30, height: 30}}
        source={
          this.state.isShowPassword
            ? Images.eyeShowIcon
            : Images.eyeIcon
        }
        resizeMode="contain"
      />
    </TouchableOpacity>

  }

  render() {

    let {
      placeholder, message,
      keyboardType, changeText, value, isShowTitle = true
    } = this.props

    return (
      <View style={styles.container}>
        <View style={[styles.border, {
          borderColor: message
            ? AppColors.errorTextInputBorderColor
            : (this.state.isTouched ? AppColors.touchedTextInputBorderColor : AppColors.normalTextInputBorderColor),
          flexDirection: 'row', alignItems: 'center'
        }]}>
          <TextInput
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            keyboardType="default"
            underlineColorAndroid="rgba(0,0,0,0)"
            // value={value || ""}
            autoCorrect={false}
            style={[styles.input, {flex: 1}]}
            placeholder={placeholder}
            secureTextEntry={this.state.isShowPassword ? false : true}
            onChangeText={value => {
              changeText && changeText(value)
            }}
            placeholderTextColor="#333333"
          />
          {this.renderIcon()}
          {isShowTitle && <Text style={[styles.title, {
            color: message
              ? AppColors.errorTextInputBorderColor
              : (this.state.isTouched ? AppColors.touchedTextInputBorderColor : '#333333')
          }]}>Password</Text>}
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
  text: {color: AppColors.errorTextColor, fontFamily: FontNames.RobotoRegular},
  title: {
    position: 'absolute',
    top: -14,
    left: 10,
    padding: 5,
    backgroundColor: 'white',
    fontFamily: FontNames.RobotoRegular,
    fontSize: 12
  }
});
