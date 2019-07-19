/**
 * Created by Hong HP on 3/6/19.
 */
import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Image} from 'react-native';

export default class ButtonWithIcon extends React.Component {

  constructor() {
    super()
  }

  render() {
    const {title, icon, onPress, tailIcon, containerStyle, iconStyle, textStyle} = this.props
    return <TouchableOpacity style={[styles.container, containerStyle]}
                             onPress={() => {
                               onPress()
                             }}
    >
      {icon && <Image source={icon} style={[styles.icon, iconStyle]}/>}
      <Text style={[styles.textStyle, textStyle]}>{title}</Text>
      {tailIcon && <Image source={tailIcon} style={[styles.icon, {tintColor: '#128ff9'}, iconStyle]}/>}
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb'
  },
  textStyle: {
    flex: 1,
    marginLeft: 12
  },
  icon: {
    width: 24,
    height: 24
  }

})