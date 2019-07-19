import React from 'react';
import {
  StyleSheet, View, Modal, Dimensions,
  TouchableOpacity, Text,
} from 'react-native';
import {connect} from 'react-redux';

import {appearConfirmationModal} from '../actions/app';
import Checkbox from './Checkbox';
import {Images} from '../theme/images';
import TextInputWithoutTitle from './TextInputWithoutTitle';

const width = Dimensions.get('window').width

const CustomizeButton = props => {
  const {title, action, backgroundColor, titleColor} = props
  return <TouchableOpacity
    style={{
      flex: 1,
      height: 45,
      justifyContent: 'center', alignContent: 'center',
      backgroundColor: backgroundColor || 'blue',
      margin: 5, borderRadius: 5
    }}
    onPress={() => action && action()}>
    <Text style={{textAlign: 'center', color: titleColor || 'white'}}>{title}</Text>
  </TouchableOpacity>
}

const ConfirmationModal = props => {
  const {
    message,
    confirmAction,
    cancelAction,
    show,
    onCheckPress,
    checkTitle,
    isSelected,
    negativeTitle = 'Cancel',
    positiveTitle = 'Confirm',
    negativeColor = 'red',
    positiveColor = 'blue',
    enableInput = false,
    placeholder,
    value,
    errMessage,
    changeText,
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={show}
      onRequestClose={() => {
        console.log('close modal')
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {
            message == '' ? <View /> :
              <Text style={{marginBottom: 5}}>{message || ''}</Text>
          }
          {enableInput && <TextInputWithoutTitle
            style={{marginBottom: 10}}
            placeholder={placeholder}
            value={value}
            message={errMessage}
            changeText={(value) => {
              changeText && changeText(value)
            }}/>}
          {!!onCheckPress && <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                               onPress={() => {
                                                 onCheckPress()
                                               }}
          >
            <Checkbox normalIcon={Images.blankIcon}
                      highlightIcon={Images.checked2Icon}
                      active={isSelected}
                      onPress={() => {
                        onCheckPress()
                      }}
            />
            <Text style={{marginLeft: 5}}>{checkTitle}</Text>
          </TouchableOpacity>}
          <View style={{flexDirection: 'row', marginTop: 10}}>
            {confirmAction && <CustomizeButton
              title={positiveTitle} action={() => {
              confirmAction()
            }}
              backgroundColor={positiveColor}
            />}
            {cancelAction && <CustomizeButton
              title={negativeTitle} backgroundColor={negativeColor} action={() => {
              cancelAction()
            }}/>}
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default connect(state => ({}), dispatch => ({
  dispatch
}))(ConfirmationModal);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 'auto',
    width: width - 40,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'space-around',
    padding: 20
  }
});

