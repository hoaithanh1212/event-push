import React, {Component} from 'react';
import {
  StyleSheet, View, Text, TextInput,
  Platform, TouchableOpacity, Image,
  Modal, Dimensions, TouchableWithoutFeedback, FlatList,
  ScrollView
} from 'react-native';
import {AppColors} from '../theme/colors';
import {FontNames} from '../theme/fonts';
import {Images} from '../theme/images';

const width = Dimensions.get('window').width

export default class DropdownInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTouched: false,
      isShowPassword: false,
      show: false,
      selectedValue: []
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
    const {disabled} = this.props
    return <TouchableOpacity
      style={{
        height: '100%',
        width: 40,
        justifyContent: 'center', alignItems: 'center',
      }}
      onPress={() => {
        if (!disabled)
          this.setState({show: true})
      }}
    >
      <Image
        style={{width: 20, height: 20}}
        source={Images.downSmallIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>

  }

  render() {
    let {
      placeholder, message,
      keyboardType, changeText, title, pressAction, dataSource,
      onSelected, value, secureTextEntry, fieldShow, disabled = false,
    } = this.props
    const {selectedValue} = this.state
    return (
      <View style={styles.container}>
        <TouchableOpacity style={[styles.border, {
          borderColor: message
            ? AppColors.errorTextInputBorderColor
            : (this.state.isTouched ? AppColors.touchedTextInputBorderColor : AppColors.normalTextInputBorderColor),
          flexDirection: 'row', alignItems: 'center'
        }]} onPress={() => {
          if (!disabled)
            this.setState({show: true})
        }}>
          <TextInput
            editable={false}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            keyboardType="default"
            underlineColorAndroid="rgba(0,0,0,0)"
            value={value}
            autoCorrect={false}
            style={[styles.input, {flex: 1}]}
            placeholder={placeholder}
            onTouchStart={() => {
              if (!disabled)
                this.setState({show: true})
            }}
            placeholderTextColor="black"
          />
          {this.renderIcon()}
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
        <View>
          <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.show}
            onRequestClose={() => {
              this.setState({show: false})
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-around',
                backgroundColor: '#00000040'
              }}
              activeOpacity={1}
              onPress={() => {
                this.setState({show: false})
              }}>
              <TouchableWithoutFeedback>
                <View style={{
                  width: width - 50,
                  justifyContent: 'center', borderRadius: 20,
                  height: 250
                }}>
                  <View style={{
                    height: 50, width: width - 50,
                    backgroundColor: AppColors.statusBarColor, justifyContent: 'center'
                  }}>
                    <Text style={{color: AppColors.titleButtonColor, textAlign: 'center'}}>{title}</Text>
                  </View>
                  <ScrollView
                    style={{backgroundColor: 'white'}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    {
                      // format dataSource = [{key: 'xxx', value:'yyy'}]
                      !!dataSource && dataSource.map((item, index) => <TouchableOpacity key={index}
                                                                                        style={{
                                                                                          height: 40,
                                                                                          marginTop: 1, marginBottom: 1,
                                                                                          justifyContent: 'center',
                                                                                          backgroundColor: item.id === selectedValue.id ? AppColors.blueBackgroundColor : 'transparent'
                                                                                        }}
                                                                                        activeOpacity={1}
                                                                                        onPress={() => {
                                                                                          onSelected && onSelected(item)
                                                                                          this.setState({
                                                                                            selectedValue: item,
                                                                                            show: false
                                                                                          })
                                                                                        }}>
                        <Text style={{marginLeft: 15}}>{item[fieldShow]}</Text>
                      </TouchableOpacity>)
                    }
                  </ScrollView>


                </View>
              </TouchableWithoutFeedback>

            </TouchableOpacity>
          </Modal>
        </View>

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
      Platform.OS.toLocaleUpperCase() === 'ios'.toLocaleUpperCase() ? 30 : 40
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
